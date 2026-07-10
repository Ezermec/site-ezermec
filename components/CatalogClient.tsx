'use client';

import Link from 'next/link';
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

  return (
    <main className="ez-fade container" style={{ paddingTop: 26, paddingBottom: 60 }}>
      <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
        <Link href="/" style={{ color: 'var(--muted)' }}>Início</Link>
        <i className="ph ph-caret-right" style={{ fontSize: 12 }} /><span style={{ color: 'var(--navy)' }}>Catálogo</span>
      </div>
      <h1 style={{ fontSize: 'clamp(26px,3vw,34px)', fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 22px' }}>Catálogo de produtos</h1>

      <div className="catalog-grid">
        {/* FILTROS */}
        <aside style={{ position: 'sticky', top: 126, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Filtros</span>
              <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--orange)', fontWeight: 600, fontSize: 12.5, cursor: 'pointer' }}>Limpar</button>
            </div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '6px 0 8px' }}>Categorias</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 260, overflow: 'auto' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
            <label style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, color: 'var(--text)' }}>Ordenar por
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18 }}>
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
    </main>
  );
}
