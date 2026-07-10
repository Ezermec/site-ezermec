import type { Metadata } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';

const archivo = Archivo({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-archivo' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Ezermec — Peças e soluções para manutenção industrial',
  description:
    'Ezermec — peças e soluções para manutenção industrial. Revenda autorizada Fischertec. Catálogo profissional de peças para máquinas industriais.',
  icons: { icon: '/assets/logo-ezermec-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${mono.variable}`}>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" />
        <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css" />
      </head>
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
