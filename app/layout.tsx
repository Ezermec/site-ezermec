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

const descricao =
  'Peças, manutenção e software para máquinas industriais. Revenda autorizada Fischertec e criadora do Ezermec CAD, o programa que desenha as costuras da sua Fischertec.';

export const metadata: Metadata = {
  // Base para as URLs absolutas dos metadados (compartilhamento, canônicas).
  metadataBase: new URL(siteUrl),
  // Cada página define só o próprio nome; o " · Ezermec" vem do modelo.
  title: {
    default: 'Ezermec — Peças, manutenção e software para máquinas industriais',
    template: '%s · Ezermec',
  },
  description: descricao,
  icons: { icon: '/assets/logo-ezermec-icon.png' },
  // A prévia do link quando ele é compartilhado no WhatsApp e nas redes.
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ezermec',
    title: 'Ezermec — Peças, manutenção e software para máquinas industriais',
    description: descricao,
    images: [{ url: '/assets/og-ezermec.jpg', width: 1200, height: 630, alt: 'Ezermec: peças, manutenção e software para máquinas industriais' }],
  },
  twitter: { card: 'summary_large_image' },
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
