'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { supabaseConfig } from '@/lib/config';

function deaccent(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function slugify(text: string): string {
  return deaccent(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const STOPWORDS = new Set([
  'de', 'da', 'do', 'das', 'dos', 'para', 'com', 'sem', 'por', 'em', 'no', 'na',
  'nos', 'nas', 'e', 'ou', 'a', 'o', 'as', 'os', 'um', 'uma',
]);

/** Gera tags automaticamente a partir dos campos do produto (com e sem acento, para busca robusta). */
function generateTags(parts: Array<string | null | undefined>): string[] {
  const raw = parts.filter(Boolean).join(' ').toLowerCase();
  const words = raw.split(/[^a-z0-9à-ÿ]+/i).filter((w) => w.length >= 2 && !STOPWORDS.has(w));
  const set = new Set<string>();
  for (const w of words) {
    set.add(w);
    const noAccent = deaccent(w);
    if (noAccent !== w) set.add(noAccent);
  }
  return Array.from(set);
}

/** Só aceita caminhos internos (`/algo`), nunca URLs externas ou protocol-relative (`//evil.com`). */
function safeNext(value: string): string {
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  return '/painel';
}

// ---------- Autenticação ----------

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const next = safeNext(String(formData.get('next') || '/painel'));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/painel/login?error=${encodeURIComponent('E-mail ou senha inválidos.')}&next=${encodeURIComponent(next)}`);
  }

  // Garante que exista um perfil (nome/papel), mesmo para contas criadas
  // direto pelo Dashboard do Supabase em vez de /painel/usuarios.
  await supabase.rpc('ensure_own_profile');

  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/painel/login');
}

// ---------- Produtos ----------

export async function upsertProduct(formData: FormData) {
  const supabase = await createClient();

  const originalSlug = String(formData.get('originalSlug') || '');
  const isNew = !originalSlug;

  const name = String(formData.get('name') || '').trim();
  let slug = String(formData.get('slug') || '').trim();
  slug = slug ? slugify(slug) : slugify(name);

  const brand = String(formData.get('brand') || '').trim();
  const cat = String(formData.get('cat') || '').trim();
  const code = String(formData.get('code') || '').trim();
  const fab = String(formData.get('fab') || '').trim();
  const material = String(formData.get('material') || '').trim();
  const images = formData.getAll('images').map(String).filter(Boolean);

  const payload = {
    slug,
    name,
    code,
    fab: fab || null,
    brand,
    cat,
    icon: String(formData.get('icon') || '').trim() || 'ph-package',
    weight: String(formData.get('weight') || '').trim() || null,
    dims: String(formData.get('dims') || '').trim() || null,
    material: material || null,
    short: String(formData.get('short') || '').trim() || null,
    full_description: String(formData.get('full_description') || '').trim() || null,
    // Tags geradas automaticamente a partir do produto.
    tags: generateTags([name, brand, cat, code, fab, material]),
    images,
    stock_quantity: Number(formData.get('stock_quantity') || 0),
    low_stock_threshold: Number(formData.get('low_stock_threshold') || 5),
    featured: formData.get('featured') === 'on',
    position: formData.get('position') ? Number(formData.get('position')) : null,
  };

  if (isNew) {
    const { error } = await supabase.from('products').insert(payload);
    if (error) redirect(`/painel/produtos/novo?error=${encodeURIComponent(error.message)}`);
  } else {
    const { error } = await supabase.from('products').update(payload).eq('slug', originalSlug);
    if (error) redirect(`/painel/produtos/${encodeURIComponent(originalSlug)}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/painel');
  revalidatePath('/catalogo');
  revalidatePath('/');
  revalidatePath(`/produto/${slug}`);
  redirect('/painel?saved=1');
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClient();
  const slug = String(formData.get('slug') || '');
  if (!slug) return;

  const { error } = await supabase.from('products').delete().eq('slug', slug);
  if (error) redirect(`/painel/produtos/${encodeURIComponent(slug)}?error=${encodeURIComponent(error.message)}`);

  revalidatePath('/painel');
  revalidatePath('/catalogo');
  revalidatePath('/');
  redirect('/painel?deleted=1');
}

// ---------- Marcas e categorias ----------

const TAX_PATH = '/painel/marcas-categorias';

function taxRedirect(kind: 'saved' | 'deleted' | 'error', msg?: string): never {
  if (kind === 'error') redirect(`${TAX_PATH}?error=${encodeURIComponent(msg || 'Erro')}`);
  redirect(`${TAX_PATH}?${kind}=1`);
}

export async function createBrand(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  if (!name) taxRedirect('error', 'Informe o nome da marca.');
  const supabase = await createClient();
  const { error } = await supabase.from('brands').insert({ name });
  if (error) taxRedirect('error', error.code === '23505' ? 'Essa marca já existe.' : error.message);
  revalidatePath(TAX_PATH);
  taxRedirect('saved');
}

export async function deleteBrand(formData: FormData) {
  const id = Number(formData.get('id'));
  const name = String(formData.get('name') || '');
  const supabase = await createClient();

  const { count } = await supabase.from('products').select('slug', { count: 'exact', head: true }).eq('brand', name);
  if (count && count > 0) taxRedirect('error', `Não é possível remover "${name}": ${count} produto(s) usam essa marca.`);

  const { error } = await supabase.from('brands').delete().eq('id', id);
  if (error) taxRedirect('error', error.message);
  revalidatePath(TAX_PATH);
  taxRedirect('deleted');
}

export async function createCategory(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const icon = String(formData.get('icon') || '').trim() || 'ph-package';
  const position = formData.get('position') ? Number(formData.get('position')) : null;
  if (!name) taxRedirect('error', 'Informe o nome da categoria.');
  const supabase = await createClient();
  const { error } = await supabase.from('categories').insert({ name, icon, position });
  if (error) taxRedirect('error', error.code === '23505' ? 'Essa categoria já existe.' : error.message);
  revalidatePath(TAX_PATH);
  taxRedirect('saved');
}

export async function deleteCategory(formData: FormData) {
  const id = Number(formData.get('id'));
  const name = String(formData.get('name') || '');
  const supabase = await createClient();

  const { count } = await supabase.from('products').select('slug', { count: 'exact', head: true }).eq('cat', name);
  if (count && count > 0) taxRedirect('error', `Não é possível remover "${name}": ${count} produto(s) usam essa categoria.`);

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) taxRedirect('error', error.message);
  revalidatePath(TAX_PATH);
  taxRedirect('deleted');
}

// ---------- Usuários (somente o admin principal / owner) ----------

const USERS_PATH = '/painel/usuarios';

function usersRedirect(kind: 'saved' | 'deleted' | 'error', msg?: string): never {
  if (kind === 'error') redirect(`${USERS_PATH}?error=${encodeURIComponent(msg || 'Erro')}`);
  redirect(`${USERS_PATH}?${kind}=1`);
}

/**
 * Cria um novo usuário do painel. Usa o endpoint público de signup (não o
 * client com sessão, para não substituir a sessão do owner) e, em seguida,
 * confirma o e-mail e cria o perfil via RPC (só o owner consegue chamá-la —
 * ver função admin_finish_new_user no banco). Não depende de service_role key.
 */
export async function createAdminUser(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!name || !email || password.length < 6) {
    usersRedirect('error', 'Preencha nome, e-mail e uma senha com pelo menos 6 caracteres.');
  }

  const signupRes = await fetch(`${supabaseConfig.url}/auth/v1/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: supabaseConfig.publishableKey },
    body: JSON.stringify({ email, password }),
  });
  const signupBody = await signupRes.json();

  if (!signupRes.ok) {
    const msg = signupRes.status === 429
      ? 'Muitas tentativas de criação de conta em pouco tempo. Aguarde alguns minutos e tente novamente.'
      : (signupBody.msg || signupBody.error_description || 'Não foi possível criar o usuário.');
    usersRedirect('error', msg);
  }
  if (!signupBody.id) usersRedirect('error', 'Este e-mail já está cadastrado.');

  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_finish_new_user', { target_id: signupBody.id, target_name: name });
  if (error) usersRedirect('error', error.message);

  revalidatePath(USERS_PATH);
  usersRedirect('saved');
}

export async function updateUserName(formData: FormData) {
  const id = String(formData.get('id') || '');
  const name = String(formData.get('name') || '').trim();
  if (!id || !name) usersRedirect('error', 'Informe um nome válido.');

  const supabase = await createClient();
  const { error } = await supabase.from('profiles').update({ name }).eq('id', id);
  if (error) usersRedirect('error', error.message);

  revalidatePath(USERS_PATH);
  usersRedirect('saved');
}

export async function deleteAdminUser(formData: FormData) {
  const id = String(formData.get('id') || '');
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_delete_user', { target_id: id });
  if (error) usersRedirect('error', error.message);

  revalidatePath(USERS_PATH);
  usersRedirect('deleted');
}
