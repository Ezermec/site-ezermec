import { getProducts } from '@/lib/data';
import { CatalogClient } from '@/components/CatalogClient';

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const products = await getProducts();
  const sp = await searchParams;
  return <CatalogClient products={products} initialQuery={sp.q ?? ''} initialCat={sp.cat ?? 'all'} />;
}
