import { createClient } from '@/lib/supabase/server';
import { mapProductRow, type Brand, type Category, type Product, type ProductRow } from '@/lib/types';

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
