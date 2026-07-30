import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/config';
import { getProducts } from '@/lib/data';

// O sitemap lê os produtos do banco, então é regerado de hora em hora em vez
// de a cada requisição — produto novo entra sozinho, sem precisar publicar.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agora = new Date();

  const paginas: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: agora, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/catalogo`, lastModified: agora, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/ezermec-cad`, lastModified: agora, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/sobre`, lastModified: agora, changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Se o banco estiver fora do ar na hora da geração, o sitemap sai com as
  // páginas fixas em vez de quebrar a rota inteira.
  let produtos: MetadataRoute.Sitemap = [];
  try {
    const lista = await getProducts();
    produtos = lista.map((p) => ({
      url: `${siteUrl}/produto/${p.slug}`,
      lastModified: agora,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    produtos = [];
  }

  return [...paginas, ...produtos];
}
