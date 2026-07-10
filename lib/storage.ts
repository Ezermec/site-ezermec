import { supabaseConfig } from '@/lib/config';

export const PRODUCT_IMAGES_BUCKET = 'product-images';

/** Monta a URL pública de uma imagem armazenada no bucket de produtos. */
export function productImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${supabaseConfig.url}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${path}`;
}
