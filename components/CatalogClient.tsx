'use client';

import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useEffect, useMemo, useState } from 'react';
import type { Product, StockStatus } from '@/lib/types';
import { ProductCard } from './ProductCard';

const PER_PAGE = 8;
type Sort = 'relevance' | 'name-asc' | 'name-desc' | 'recent';

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

export function CatalogClient({
  products,
  initialQuery = '',
  initialCat = 'all',
}: {
  products: Product[];
  initialQuery?: string;
  initialCat?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [activeBrand, setActiveBrand] = useState('all');
  const [activeStock, setActiveStock] = useState<'all' | StockStatus>('all');
  const [sort, setSort] = useState<Sort>('relevance');
  const [page, setPage] = useState(1);
  // Folha de filtros do celular. No desktop a barra e a folha ficam
  // escondidas por CSS e o painel lateral continua sendo o único controle.
  const [sheetOpen, setSheetOpen] = useState(false);
  // Grupo selecionado na coluna da esquerda da folha de filtros.
  const [sheetGroup, setSheetGroup] = useState<'cat' | 'brand' | 'stock'>('cat');

  // Sincroniza a busca/categoria com a URL. Sem isso, uma nova busca pela barra
  // do topo (navegação client-side) muda a URL mas não o estado, e os resultados
  // ficam presos no valor da primeira montagem da página.
  useEffect(() => {
    setQuery(initialQuery);
    setActiveCategory(initialCat);
    setPage(1);
  }, [initialQuery, initialCat]);

  const term = query.trim().toLowerCase();

  const view = useMemo(() => {
    const bySearch = products.filter((p) => {
      if (!term) return true;
      return [p.name, p.code, p.fab, p.brand, p.cat, p.short, p.tags.join(' ')]
        .join(' ').toLowerCase().includes(term);
    });

    const catCounts: Record<string, number> = {};
    const brandCounts: Record<string, number> = {};
    bySearch.forEach((p) => {
      catCounts[p.cat] = (catCounts[p.cat] || 0) + 1;
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    });

    let list = bySearch.filter((p) =>
      (activeCategory === 'all' || p.cat === activeCategory) &&
      (activeBrand === 'all' || p.brand === activeBrand) &&
      (activeStock === 'all' || p.stock === activeStock));

    if (sort === 'name-asc') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'name-desc') list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === 'recent') list = [...list].reverse();

    const total = list.length;
    const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));
    const current = Math.min(page, pageCount);
    const paged = list.slice((current - 1) * PER_PAGE, (current - 1) * PER_PAGE + PER_PAGE);

    return { bySearch, catCounts, brandCounts, total, pageCount, current, paged };
  }, [products, term, activeCategory, activeBrand, activeStock, sort, page]);

  const catKeys = ['all', ...uniq(products.map((p) => p.cat))];
  const brandKeys = ['all', ...uniq(products.map((p) => p.brand))];
  const stockKeys: Array<['all' | StockStatus, string]> = [['all', 'Todos'], ['em', 'Em estoque'], ['baixo', 'Estoque baixo'], ['sem', 'Sem estoque']];

  function clearFilters() {
    setQuery(''); setActiveCategory('all'); setActiveBrand('all'); setActiveStock('all'); setPage(1);
  }

  const activeCount =
    (activeCategory === 'all' ? 0 : 1) + (activeBrand === 'all' ? 0 : 1) + (activeStock === 'all' ? 0 : 1);

  // Com a folha aberta, trava a rolagem do fundo e permite fechar com Esc.
  useEffect(() => {
    if (!sheetOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.dataset.menuOpen = 'true';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSheetOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      delete document.body.dataset.menuOpen;
      window.removeEventListener('keydown', onKey);
    };
  }, [sheetOpen]);

  return (
    <main className="ez-fade container" style={{ paddingTop: 26, paddingBottom: 60 }}>
      <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
        <Link href="/" style={{ color: 'var(--muted)' }}>Início</Link>
        <i className="ph ph-caret-right" style={{ fontSize: 12 }} /><span style={{ color: 'var(--navy)' }}>Catálogo</span>
      </div>
      <h1 style={{ fontSize: 'clamp(26px,3vw,34px)', fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 22px' }}>Catálogo de produtos</h1>

      {/* BARRA DE FILTROS DO CELULAR — no desktop fica escondida por CSS. */}
      <div className="mfilter-bar">
        <button type="button" className="mfilter-btn" onClick={() => setSheetOpen(true)}>
          <i className="ph ph-sliders-horizontal" />Filtros
          {activeCount > 0 && <span className="mfilter-count">{activeCount}</span>}
        </button>
        <div className="mfilter-sort">
          <i className="ph ph-arrows-down-up" />
          <select value={sort} onChange={(e) => { setSort(e.target.value as Sort); setPage(1); }} aria-label="Ordenar produtos">
            <option value="relevance">Relevância</option>
            <option value="name-asc">Nome (A-Z)</option>
            <option value="name-desc">Nome (Z-A)</option>
            <option value="recent">Mais recentes</option>
          </select>
        </div>
      </div>

      <div className="catalog-grid">
        {/* FILTROS */}
        <aside style={{ position: 'sticky', top: 126, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Filtros</span>
              <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--orange)', fontWeight: 600, fontSize: 12.5, cursor: 'pointer' }}>Limpar</button>
            </div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '6px 0 8px' }}>Categorias</div>
            <div className="filter-list" style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 260, overflow: 'auto' }}>
              {catKeys.map((k) => (
                <button key={k} onClick={() => { setActiveCategory(k); setPage(1); }} className={`filter-btn${activeCategory === k ? ' active' : ''}`}>
                  <span>{k === 'all' ? 'Todas as categorias' : k}</span>
                  <span className="mono" style={{ fontSize: 12, opacity: .6 }}>{k === 'all' ? view.bySearch.length : (view.catCounts[k] || 0)}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 8px' }}>Marcas</div>
            <div className="filter-list" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {brandKeys.map((k) => (
                <button key={k} onClick={() => { setActiveBrand(k); setPage(1); }} className={`filter-btn${activeBrand === k ? ' active' : ''}`}>
                  <span>{k === 'all' ? 'Todas as marcas' : k}</span>
                  <span className="mono" style={{ fontSize: 12, opacity: .6 }}>{k === 'all' ? view.bySearch.length : (view.brandCounts[k] || 0)}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 8px' }}>Disponibilidade</div>
            <div className="filter-list" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {stockKeys.map(([k, label]) => (
                <button key={k} onClick={() => { setActiveStock(k); setPage(1); }} className={`filter-btn${activeStock === k ? ' active' : ''}`}>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RESULTADOS */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap', background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 16px', marginBottom: 18 }}>
            <span style={{ fontSize: 14, color: 'var(--text)' }}>
              <strong style={{ color: 'var(--navy)' }}>{view.total}</strong> resultado(s)
              {term && <> para &quot;<strong style={{ color: 'var(--navy)' }}>{query}</strong>&quot;</>}
            </span>
            <label className="sort-desktop" style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, color: 'var(--text)' }}>Ordenar por
              <select value={sort} onChange={(e) => { setSort(e.target.value as Sort); setPage(1); }} style={{ border: '1px solid var(--border)', background: 'var(--bg)', borderRadius: 9, padding: '9px 12px', fontFamily: 'var(--font-archivo), sans-serif', fontSize: 13.5, fontWeight: 600, color: 'var(--navy)', cursor: 'pointer' }}>
                <option value="relevance">Relevância</option>
                <option value="name-asc">Nome (A-Z)</option>
                <option value="name-desc">Nome (Z-A)</option>
                <option value="recent">Mais recentes</option>
              </select>
            </label>
          </div>

          {view.total > 0 ? (
            <>
              <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18 }}>
                {view.paged.map((p) => <ProductCard key={p.slug} product={p} variant="catalog" />)}
              </div>
              {view.pageCount > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 34, flexWrap: 'wrap' }}>
                  {Array.from({ length: view.pageCount }, (_, i) => i + 1).map((n) => (
                    <button key={n} onClick={() => setPage(n)} className={`page-btn ez-lift${n === view.current ? ' active' : ''}`}>{n}</button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '70px 20px', background: '#fff', border: '1px dashed var(--border2)', borderRadius: 18 }}>
              <i className="ph ph-magnifying-glass" style={{ fontSize: 44, color: 'var(--border2)' }} />
              <div style={{ fontWeight: 700, fontSize: 18, marginTop: 14 }}>Nenhum produto encontrado</div>
              <div style={{ fontSize: 14, color: 'var(--text)', marginTop: 6 }}>Tente outro termo ou limpe os filtros.</div>
              <button onClick={clearFilters} className="ez-lift" style={{ marginTop: 18, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 22px', fontWeight: 700, cursor: 'pointer' }}>Limpar filtros</button>
            </div>
          )}
        </section>
      </div>

      {/* FOLHA DE FILTROS — sobe de baixo, como nos aplicativos de compras.
          Vai num portal para o <body> porque o <main> tem a animação de
          entrada `ez-fade`: o transform que ela deixa cria um bloco de
          contenção e o `position: fixed` passaria a se ancorar no <main>,
          jogando a folha para fora da tela. */}
      {sheetOpen && createPortal(
        <div className="sheet-bg" onClick={() => setSheetOpen(false)}>
          <div className="sheet" role="dialog" aria-modal="true" aria-label="Filtros" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <span>Filtros</span>
              <button type="button" onClick={() => setSheetOpen(false)} aria-label="Fechar filtros"><i className="ph ph-x" /></button>
            </div>

            {/* Duas colunas: os grupos à esquerda, as opções do grupo
                selecionado à direita. */}
            <div className="sheet-panes">
              <div className="sheet-tabs">
                {([
                  ['cat', 'Categoria', activeCategory === 'all' ? null : activeCategory],
                  ['brand', 'Marca', activeBrand === 'all' ? null : activeBrand],
                  ['stock', 'Disponibilidade', activeStock === 'all' ? null : stockKeys.find(([k]) => k === activeStock)?.[1] ?? null],
                ] as Array<['cat' | 'brand' | 'stock', string, string | null]>).map(([key, label, selecionado]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSheetGroup(key)}
                    className={`sheet-tab${sheetGroup === key ? ' active' : ''}`}
                  >
                    <span>{label}</span>
                    {selecionado && <em>{selecionado}</em>}
                  </button>
                ))}
              </div>

              <div className="sheet-options">
                {sheetGroup === 'cat' && catKeys.map((k) => (
                  <button key={k} type="button" onClick={() => { setActiveCategory(k); setPage(1); }} className={`filter-btn${activeCategory === k ? ' active' : ''}`}>
                    <span>{k === 'all' ? 'Todas as categorias' : k}</span>
                    <span className="mono" style={{ fontSize: 12, opacity: .6 }}>{k === 'all' ? view.bySearch.length : (view.catCounts[k] || 0)}</span>
                  </button>
                ))}

                {sheetGroup === 'brand' && brandKeys.map((k) => (
                  <button key={k} type="button" onClick={() => { setActiveBrand(k); setPage(1); }} className={`filter-btn${activeBrand === k ? ' active' : ''}`}>
                    <span>{k === 'all' ? 'Todas as marcas' : k}</span>
                    <span className="mono" style={{ fontSize: 12, opacity: .6 }}>{k === 'all' ? view.bySearch.length : (view.brandCounts[k] || 0)}</span>
                  </button>
                ))}

                {sheetGroup === 'stock' && stockKeys.map(([k, label]) => (
                  <button key={k} type="button" onClick={() => { setActiveStock(k); setPage(1); }} className={`filter-btn${activeStock === k ? ' active' : ''}`}>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sheet-foot">
              <button type="button" className="sheet-clear" onClick={clearFilters}>Limpar</button>
              <button type="button" className="sheet-apply" onClick={() => setSheetOpen(false)}>
                Ver {view.total} {view.total === 1 ? 'produto' : 'produtos'}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </main>
  );
}
