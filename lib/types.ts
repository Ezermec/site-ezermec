export type StockStatus = 'em' | 'baixo' | 'sem';

/** Linha crua da tabela `products` no Supabase. */
export interface ProductRow {
  id: number;
  slug: string;
  name: string;
  code: string;
  fab: string | null;
  brand: string;
  cat: string;
  icon: string;
  weight: string | null;
  dims: string | null;
  material: string | null;
  short: string | null;
  full_description: string | null;
  tags: string[] | null;
  images: string[] | null;
  stock_quantity: number;
  low_stock_threshold: number;
  stock_status: StockStatus;
  featured: boolean;
  position: number | null;
}

/** Produto normalizado usado na aplicação. */
export interface Product {
  slug: string;
  name: string;
  code: string;
  fab: string;
  brand: string;
  cat: string;
  icon: string;
  weight: string;
  dims: string;
  material: string;
  short: string;
  full: string;
  tags: string[];
  images: string[];
  stock: StockStatus;
  stockQty: number;
  lowStockThreshold: number;
  featured: boolean;
  position: number | null;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  position: number | null;
}

export function mapProductRow(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    code: row.code,
    fab: row.fab ?? '',
    brand: row.brand,
    cat: row.cat,
    icon: row.icon || 'ph-package',
    weight: row.weight ?? '',
    dims: row.dims ?? '',
    material: row.material ?? '',
    short: row.short ?? '',
    full: row.full_description ?? '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    images: Array.isArray(row.images) ? row.images : [],
    stock: row.stock_status,
    stockQty: row.stock_quantity,
    lowStockThreshold: row.low_stock_threshold,
    featured: Boolean(row.featured),
    position: row.position,
  };
}
