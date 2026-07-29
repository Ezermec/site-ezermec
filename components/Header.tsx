'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/lib/config';
import { Logo } from './Logo';

// Itens do menu. `match` decide quando o item fica marcado como página atual —
// "Produtos" também cobre a página de detalhe do produto, e os links de âncora
// (#categorias / #contato) só marcam quando já estamos na home.
const NAV: Array<{ href: string; label: string; match: (path: string) => boolean }> = [
  { href: '/', label: 'Início', match: (p) => p === '/' },
  { href: '/catalogo', label: 'Produtos', match: (p) => p.startsWith('/catalogo') || p.startsWith('/produto') },
  { href: '/#categorias', label: 'Categorias', match: () => false },
  { href: '/ezermec-cad', label: 'Ezermec CAD', match: (p) => p.startsWith('/ezermec-cad') },
  { href: '/sobre', label: 'Sobre', match: (p) => p.startsWith('/sobre') },
  { href: '/#contato', label: 'Contato', match: () => false },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname() ?? '/';
  const [q, setQ] = useState('');
  // Menu suspenso do celular. No desktop o botão e o painel ficam escondidos
  // por CSS, então este estado não tem efeito nenhum lá.
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Fecha o menu ao trocar de página.
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Com o menu aberto, trava a rolagem do fundo e permite fechar com Esc.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Sinaliza para o CSS esconder o botão flutuante, que ficaria por cima
    // dos itens do rodapé do menu.
    document.body.dataset.menuOpen = 'true';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      delete document.body.dataset.menuOpen;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  function submit() {
    setMenuOpen(false);
    router.push(q.trim() ? `/catalogo?q=${encodeURIComponent(q.trim())}` : '/catalogo');
  }

  return (
    <header className="site-header" ref={ref}>
      <div className="container header-top">
        <button
          type="button"
          className="nav-toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-drawer"
        >
          <i className={menuOpen ? 'ph ph-x' : 'ph ph-list'} />
        </button>

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

        <div className="header-contact" style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
          <a href={site.waHref} target="_blank" rel="noopener" className="wa-pill ez-lift">
            <i className="ph-fill ph-whatsapp-logo" style={{ fontSize: 19 }} />WhatsApp
          </a>
          <a href={site.telHref} className="header-phone" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, padding: '0 4px', color: 'var(--navy)' }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '.08em', color: 'var(--muted)', textTransform: 'uppercase' }}>Ligue agora</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{site.phoneDisplay}</span>
          </a>
        </div>
      </div>

      <nav className="header-nav">
        <div className="container header-nav-inner">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`ez-navbtn${active ? ' active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <span style={{ flex: 1 }} />
          <Link
            href="/painel"
            title="Acesso restrito ao administrador"
            aria-current={pathname.startsWith('/painel') ? 'page' : undefined}
            style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', padding: '13px 14px', fontSize: 13.5, fontWeight: 600, color: pathname.startsWith('/painel') ? 'var(--orange)' : 'var(--muted)' }}
          >
            <i className="ph ph-lock-key" style={{ fontSize: 16 }} />Painel
          </Link>
        </div>
      </nav>

      {/* Menu suspenso — só existe no celular (ver .mobile-drawer no CSS). */}
      {menuOpen && (
        <div id="mobile-drawer" className="mobile-drawer">
          <nav className="drawer-links">
            {NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`drawer-link${active ? ' active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  <i className="ph ph-caret-right" />
                </Link>
              );
            })}
          </nav>

          <div className="drawer-foot">
            <a href={site.telHref} className="drawer-call">
              <i className="ph ph-phone" />
              <span>
                <small className="mono">Ligue agora</small>
                {site.phoneDisplay}
              </span>
            </a>
            <Link href="/painel" className="drawer-painel" onClick={() => setMenuOpen(false)}>
              <i className="ph ph-lock-key" />Painel
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
