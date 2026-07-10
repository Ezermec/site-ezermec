'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/lib/config';
import { Logo } from './Logo';

export function Header() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const ref = useRef<HTMLElement>(null);

  // Ajusta o espaçamento do conteúdo conforme a altura real do header fixo
  // (o header cresce quando quebra em telas menores).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  function submit() {
    router.push(q.trim() ? `/catalogo?q=${encodeURIComponent(q.trim())}` : '/catalogo');
  }

  return (
    <header className="site-header" ref={ref}>
      <div className="container header-top">
        <Link href="/" className="logo-btn" aria-label="Ezermec — início">
          <Logo variant="color" height={44} />
        </Link>

        <div className="search-box">
          <span className="search-icon"><i className="ph ph-magnifying-glass" /></span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
            placeholder="Busque por nome, código, marca, categoria ou fornecedor…"
            aria-label="Buscar produtos"
          />
          <button onClick={submit} className="btn-search ez-lift">Buscar</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
          <a href={site.waHref} target="_blank" rel="noopener" className="wa-pill ez-lift">
            <i className="ph-fill ph-whatsapp-logo" style={{ fontSize: 19 }} />WhatsApp
          </a>
          <a href={site.telHref} style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, padding: '0 4px', color: 'var(--navy)' }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '.08em', color: 'var(--muted)', textTransform: 'uppercase' }}>Ligue agora</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{site.phoneDisplay}</span>
          </a>
        </div>
      </div>

      <nav className="header-nav">
        <div className="container header-nav-inner">
          <Link href="/" className="ez-navbtn">Início</Link>
          <Link href="/catalogo" className="ez-navbtn">Produtos</Link>
          <Link href="/#categorias" className="ez-navbtn">Categorias</Link>
          <Link href="/sobre" className="ez-navbtn">Sobre</Link>
          <Link href="/#contato" className="ez-navbtn">Contato</Link>
          <span style={{ flex: 1 }} />
          <Link
            href="/painel"
            title="Acesso restrito ao administrador"
            style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', padding: '13px 14px', fontSize: 13.5, fontWeight: 600, color: 'var(--muted)' }}
          >
            <i className="ph ph-lock-key" style={{ fontSize: 16 }} />Painel
          </Link>
        </div>
      </nav>
    </header>
  );
}
