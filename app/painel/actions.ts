'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Só aceita caminhos internos (`/algo`), nunca URLs externas ou protocol-relative (`//evil.com`). */
function safeNext(value: string): string {
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  return '/painel';
}

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const next = safeNext(String(formData.get('next') || '/painel'));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/painel/login?error=${encodeURIComponent('E-mail ou senha inválidos.')}&next=${encodeURIComponent(next)}`);
  }
  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/painel/login');
}

export async function upsertProduct(formData: FormData) {
  const supabase = await createClient();

  const originalSlug = String(formData.get('originalSlug') || '');
  const isNew = !originalSlug;

  const name = String(formData.get('name') || '').trim();
  let slug = String(formData.get('slug') || '').trim();
  if (!slug) slug = slugify(name);
  else slug = slugify(slug);

  const tagsRaw = String(formData.get('tags') || '');
  const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);

  const payload = {
    slug,
    name,
    code: String(formData.get('code') || '').trim(),
    fab: String(formData.get('fab') || '').trim() || null,
    brand: String(formData.get('brand') || '').trim(),
    cat: String(formData.get('cat') || '').trim(),
    supplier: String(formData.get('supplier') || '').trim() || null,
    icon: String(formData.get('icon') || '').trim() || 'ph-package',
    weight: String(formData.get('weight') || '').trim() || null,
    dims: String(formData.get('dims') || '').trim() || null,
    material: String(formData.get('material') || '').trim() || null,
    short: String(formData.get('short') || '').trim() || null,
    full_description: String(formData.get('full_description') || '').trim() || null,
    tags,
    stock_quantity: Number(formData.get('stock_quantity') || 0),
    low_stock_threshold: Number(formData.get('low_stock_threshold') || 5),
    featured: formData.get('featured') === 'on',
    position: formData.get('position') ? Number(formData.get('position')) : null,
  };

  if (isNew) {
    const { error } = await supabase.from('products').insert(payload);
    if (error) {
      redirect(`/painel/produtos/novo?error=${encodeURIComponent(error.message)}`);
    }
  } else {
    const { error } = await supabase.from('products').update(payload).eq('slug', originalSlug);
    if (error) {
      redirect(`/painel/produtos/${encodeURIComponent(originalSlug)}?error=${encodeURIComponent(error.message)}`);
    }
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
  if (error) {
    redirect(`/painel/produtos/${encodeURIComponent(slug)}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/painel');
  revalidatePath('/catalogo');
  revalidatePath('/');
  redirect('/painel?deleted=1');
}
