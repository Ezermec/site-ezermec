import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/config';

/**
 * Gera o /robots.txt. O painel fica fora dos buscadores — ele já é protegido
 * pelo proxy, mas não há motivo para aparecer em resultado de busca.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/painel',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
