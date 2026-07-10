import { createClient } from '@/lib/supabase/server';
import {
  mapProductRow,
  type AdminUser,
  type AuditLogEntry,
  type Brand,
  type Category,
  type Product,
  type ProductRow,
  type UserRole,
} from '@/lib/types';

/** Busca todos os produtos, ordenados pela posição definida no catálogo. */
export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('position', { ascending: true });

  if (error) {
    console.error('[Ezermec] Erro ao buscar produtos:', error.message);
    return [];
  }
  return (data as ProductRow[]).map(mapProductRow);
}

/** Busca um produto pelo slug. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();

  if (error) {
    console.error('[Ezermec] Erro ao buscar produto:', error.message);
    return null;
  }
  return data ? mapProductRow(data as ProductRow) : null;
}

/** Lista as marcas cadastradas (ordem alfabética). */
export async function getBrands(): Promise<Brand[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('brands').select('id, name').order('name');
  if (error) {
    console.error('[Ezermec] Erro ao buscar marcas:', error.message);
    return [];
  }
  return data as Brand[];
}

/** Lista as categorias cadastradas (por posição, depois nome). */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, icon, position')
    .order('position', { ascending: true, nullsFirst: false })
    .order('name');
  if (error) {
    console.error('[Ezermec] Erro ao buscar categorias:', error.message);
    return [];
  }
  return data as Category[];
}

/** Papel (role) do usuário logado, ou null se não houver perfil (não deveria acontecer). */
export async function getCurrentRole(): Promise<UserRole | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  return (data?.role as UserRole) ?? null;
}

/** Lista os usuários do painel (e-mail, nome, papel). Só funciona para o admin principal (owner) — a RPC recusa os demais. */
export async function getAdminUsers(): Promise<{ users: AdminUser[]; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_list_users');
  if (error) return { users: [], error: error.message };
  const users = (data ?? []).map((u: {
    id: string; email: string; name: string | null; role: string;
    created_at: string; last_sign_in_at: string | null;
  }) => ({
    id: u.id, email: u.email, name: u.name, role: u.role as UserRole,
    createdAt: u.created_at, lastSignInAt: u.last_sign_in_at,
  }));
  return { users, error: null };
}

/** Histórico de alterações (produtos, marcas, categorias), mais recentes primeiro. */
export async function getAuditLog(limit = 50, offset = 0): Promise<AuditLogEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) {
    console.error('[Ezermec] Erro ao buscar histórico:', error.message);
    return [];
  }
  return (data ?? []).map((r) => ({
    id: r.id,
    actorId: r.actor_id,
    actorEmail: r.actor_email,
    actorName: r.actor_name,
    action: r.action,
    tableName: r.table_name,
    recordLabel: r.record_label,
    changes: r.changes,
    createdAt: r.created_at,
  }));
}

/** Produtos em destaque para a home (marcados como featured; fallback: 4 primeiros). */
export function getFeatured(products: Product[]): Product[] {
  const feat = products.filter((p) => p.featured);
  return (feat.length >= 4 ? feat : products).slice(0, 4);
}

/** Produtos relacionados: mesma categoria primeiro, completa com outros. */
export function getRelated(products: Product[], product: Product, limit = 4): Product[] {
  const sameCat = products.filter((p) => p.cat === product.cat && p.slug !== product.slug);
  let rel = sameCat;
  if (rel.length < limit) {
    rel = rel.concat(products.filter((p) => p.cat !== product.cat && p.slug !== product.slug));
  }
  return rel.slice(0, limit);
}
