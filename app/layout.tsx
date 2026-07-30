import type { Metadata } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
// Ícones servidos pelo próprio site. Antes vinham do unpkg.com a cada visita —
// se aquele CDN caísse, todos os ícones do site sumiam.
import '@phosphor-icons/web/regular';
import '@phosphor-icons/web/fill';
import './globals.css';
import { siteUrl } from '@/lib/config';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';

const archivo = Archivo({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-archivo' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mono' });

export const metadata: Metadata = {
  // Base para as URLs absolutas dos metadados (compartilhamento, canônicas).
  metadataBase: new URL(siteUrl),
  title: 'Ezermec — Peças e soluções para manutenção industrial',
  description:
    'Ezermec — peças e soluções para manutenção industrial. Revenda autorizada Fischertec. Catálogo profissional de peças para máquinas industriais.',
  icons: { icon: '/assets/logo-ezermec-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${mono.variable}`}>
      <body>
        <Header />
        <div style={{ minHeight: '100vh', paddingTop: 'var(--header-h, 112px)' }}>
          {children}
          <Footer />
        </div>
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
