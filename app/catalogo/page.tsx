import type { Metadata } from 'next';
import { getCategories, getProducts } from '@/lib/data';
import { CatalogClient } from '@/components/CatalogClient';

export const metadata: Metadata = {
  title: 'Catálogo de peças',
  description:
    'Peças originais Fischertec e de fabricantes homologados para máquinas industriais: lançadeiras, agulhas, rolamentos, correias e mais. Peça o orçamento pelo WhatsApp.',
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const [products, categories, sp] = await Promise.all([getProducts(), getCategories(), searchParams]);
  return (
    <CatalogClient
      products={products}
      categorias={categories.map((c) => ({ name: c.name, icon: c.icon }))}
      initialQuery={sp.q ?? ''}
      initialCat={sp.cat ?? 'all'}
    />
  );
}
