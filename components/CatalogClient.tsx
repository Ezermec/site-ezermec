'use client';

import { createPortal } from 'react-dom';
import { useEffect, useMemo, useState } from 'react';
import { site } from '@/lib/config';
import type { Product, StockStatus } from '@/lib/types';
import { CabecalhoPagina } from './CabecalhoPagina';
import { ProductCard } from './ProductCard';
import css from './catalogo.module.css';

const PER_PAGE = 12;
type Sort = 'relevance' | 'name-asc' | 'name-desc' | 'recent';
type Estoque = 'all' | StockStatus;

const ORDENS: Array<[Sort, string]> = [
  ['relevance', 'Relevância'],
  ['name-asc', 'Nome (A-Z)'],
  ['name-desc', 'Nome (Z-A)'],
  ['recent', 'Mais recentes'],
];
const ESTOQUES: Array<[Estoque, string]> = [
  ['all', 'Todas'],
  ['em', 'Em estoque'],
  ['baixo', 'Estoque baixo'],
  ['sem', 'Sem estoque'],
];

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

/** WhatsApp para pedir uma peça que não está no catálogo, já com o que foi buscado. */
function waProcura(termo: string) {
  const texto = termo
    ? `Olá! Procuro esta peça: "${termo}". Vocês têm?`
    : 'Olá! Procuro uma peça que não encontrei no catálogo do site.';
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(texto)}`;
}

export function CatalogClient({
  products,
  categorias,
  initialQuery = '',
  initialCat = 'all',
}: {
  products: Product[];
  /** Categorias do painel, na ordem e com o ícone de lá. */
  categorias: Array<{ name: string; icon: string }>;
  initialQuery?: string;
  initialCat?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [activeBrand, setActiveBrand] = useState('all');
  const [activeStock, setActiveStock] = useState<Estoque>('all');
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

  // A ordem e os ícones das categorias vêm do painel; alguma que só exista
  // nos produtos entra no fim, com um ícone genérico.
  const catLista = useMemo(() => {
    const nomes = new Set(categorias.map((c) => c.name));
    const extras = uniq(products.map((p) => p.cat))
      .filter((n) => !nomes.has(n))
      .map((name) => ({ name, icon: 'ph-package' }));
    return [...categorias, ...extras];
  }, [categorias, products]);
  const marcas = useMemo(() => uniq(products.map((p) => p.brand)).sort((a, b) => a.localeCompare(b)), [products]);

  const escolherCategoria = (k: string) => { setActiveCategory(k); setPage(1); };
  const escolherMarca = (k: string) => { setActiveBrand(k); setPage(1); };
  const escolherEstoque = (k: Estoque) => { setActiveStock(k); setPage(1); };
  const ordenar = (k: Sort) => { setSort(k); setPage(1); };

  function clearFilters() {
    setQuery(''); setActiveCategory('all'); setActiveBrand('all'); setActiveStock('all'); setPage(1);
  }

  const rotuloEstoque = ESTOQUES.find(([k]) => k === activeStock)?.[1] ?? '';
  // Os filtros em uso, como etiquetas que se desfazem com um clique.
  const ativos = [
    activeCategory !== 'all' && { rotulo: activeCategory, limpar: () => escolherCategoria('all') },
    activeBrand !== 'all' && { rotulo: activeBrand, limpar: () => escolherMarca('all') },
    activeStock !== 'all' && { rotulo: rotuloEstoque, limpar: () => escolherEstoque('all') },
  ].filter(Boolean) as Array<{ rotulo: string; limpar: () => void }>;
  const activeCount = ativos.length;

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

  const contagem = (n: number) => <em className={css.conta}>{n}</em>;

  return (
    <main className="ez-fade">
      <CabecalhoPagina
        passos={[{ nome: 'Início', href: '/' }, { nome: 'Peças' }]}
        olho="Catálogo"
        titulo="Catálogo de peças"
        texto="Peças originais Fischertec e de fabricantes homologados. Não achou a sua? A gente procura para você."
      >
        <div className={css.busca}>
          <i className="ph ph-magnifying-glass" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Nome, código ou marca da peça"
            aria-label="Buscar no catálogo"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(''); setPage(1); }} aria-label="Limpar a busca">
              <i className="ph ph-x" />
            </button>
          )}
        </div>
      </CabecalhoPagina>

      <div className={`container ${css.corpo}`}>
        {/* BARRA DE FILTROS DO CELULAR — no desktop fica escondida por CSS. */}
        <div className="mfilter-bar">
          <button type="button" className="mfilter-btn" onClick={() => setSheetOpen(true)}>
            <i className="ph ph-sliders-horizontal" />Filtros
            {activeCount > 0 && <span className="mfilter-count">{activeCount}</span>}
          </button>
          <div className="mfilter-sort">
            <i className="ph ph-arrows-down-up" />
            <select value={sort} onChange={(e) => ordenar(e.target.value as Sort)} aria-label="Ordenar peças">
              {ORDENS.map(([k, rotulo]) => <option key={k} value={k}>{rotulo}</option>)}
            </select>
          </div>
        </div>

        <div className={css.grade}>
          {/* FILTROS */}
          <aside className={css.filtros} aria-label="Filtros">
            <div className={css.filtrosTopo}>
              <strong><i className="ph ph-sliders-horizontal" aria-hidden="true" />Filtrar</strong>
              {activeCount > 0 && <button type="button" onClick={clearFilters}>Limpar</button>}
            </div>

            <div className={css.grupo}>
              <span className={css.grupoNome}>Categoria</span>
              <ul>
                <li>
                  <button type="button" onClick={() => escolherCategoria('all')} aria-pressed={activeCategory === 'all'} className={css.opcao}>
                    <i className="ph ph-squares-four" aria-hidden="true" />
                    <span>Todas as categorias</span>
                    {contagem(view.bySearch.length)}
                  </button>
                </li>
                {catLista.map((c) => (
                  <li key={c.name}>
                    <button type="button" onClick={() => escolherCategoria(c.name)} aria-pressed={activeCategory === c.name} className={css.opcao}>
                      <i className={`ph ${c.icon}`} aria-hidden="true" />
                      <span>{c.name}</span>
                      {contagem(view.catCounts[c.name] || 0)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className={css.grupo}>
              <span className={css.grupoNome}>Marca</span>
              <ul>
                <li>
                  <button type="button" onClick={() => escolherMarca('all')} aria-pressed={activeBrand === 'all'} className={css.opcao}>
                    <span>Todas as marcas</span>
                    {contagem(view.bySearch.length)}
                  </button>
                </li>
                {marcas.map((m) => (
                  <li key={m}>
                    <button type="button" onClick={() => escolherMarca(m)} aria-pressed={activeBrand === m} className={css.opcao}>
                      <span>{m}</span>
                      {contagem(view.brandCounts[m] || 0)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className={css.grupo}>
              <span className={css.grupoNome}>Disponibilidade</span>
              <ul>
                {ESTOQUES.map(([k, rotulo]) => (
                  <li key={k}>
                    <button type="button" onClick={() => escolherEstoque(k)} aria-pressed={activeStock === k} className={css.opcao}>
                      {k !== 'all' && <span className={`${css.bolinha} ${css[`bolinha_${k}`]}`} aria-hidden="true" />}
                      <span>{rotulo}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* RESULTADOS */}
          <section className={css.resultados} aria-label="Peças encontradas">
            <div className={css.barra}>
              <span className={css.total} aria-live="polite">
                <strong>{view.total}</strong> {view.total === 1 ? 'peça' : 'peças'}
                {term && <> para “<strong>{query.trim()}</strong>”</>}
              </span>
              {ativos.map((a) => (
                <button key={a.rotulo} type="button" className={css.chip} onClick={a.limpar} aria-label={`Tirar o filtro ${a.rotulo}`}>
                  {a.rotulo}<i className="ph ph-x" aria-hidden="true" />
                </button>
              ))}
              <label className={`sort-desktop ${css.ordem}`}>
                Ordenar por
                <select value={sort} onChange={(e) => ordenar(e.target.value as Sort)}>
                  {ORDENS.map(([k, rotulo]) => <option key={k} value={k}>{rotulo}</option>)}
                </select>
              </label>
            </div>

            {view.total > 0 ? (
              <>
                <div className={`product-grid ${css.produtos}`}>
                  {view.paged.map((p) => <ProductCard key={p.slug} product={p} variant="catalog" />)}
                </div>

                {view.pageCount > 1 && (
                  <nav className={css.paginas} aria-label="Páginas">
                    <button type="button" className="page-btn ez-lift" onClick={() => setPage(view.current - 1)} disabled={view.current === 1} aria-label="Página anterior">
                      <i className="ph ph-caret-left" />
                    </button>
                    {Array.from({ length: view.pageCount }, (_, i) => i + 1).map((n) => (
                      <button key={n} type="button" onClick={() => setPage(n)} className={`page-btn ez-lift${n === view.current ? ' active' : ''}`} aria-current={n === view.current ? 'page' : undefined}>
                        {n}
                      </button>
                    ))}
                    <button type="button" className="page-btn ez-lift" onClick={() => setPage(view.current + 1)} disabled={view.current === view.pageCount} aria-label="Próxima página">
                      <i className="ph ph-caret-right" />
                    </button>
                  </nav>
                )}

                <div className={css.ajuda}>
                  <span className={css.ajudaIcone}><i className="ph ph-chat-circle-text" aria-hidden="true" /></span>
                  <div>
                    <strong>Não achou a peça que procura?</strong>
                    <span>Mande o nome, o código ou uma foto pelo WhatsApp que a gente procura para você.</span>
                  </div>
                  <a href={waProcura(query.trim())} target="_blank" rel="noopener" className={`btn ez-lift ${css.ajudaBotao}`}>
                    <i className="ph-fill ph-whatsapp-logo" />Pedir pelo WhatsApp
                  </a>
                </div>
              </>
            ) : (
              <div className={css.vazio}>
                <span className={css.vazioIcone}><i className="ph ph-magnifying-glass" aria-hidden="true" /></span>
                <strong>Essa peça não está no catálogo do site</strong>
                <p>Mande o nome, o código ou uma foto pelo WhatsApp que a gente procura para você.</p>
                <div className={css.vazioBotoes}>
                  <a href={waProcura(query.trim())} target="_blank" rel="noopener" className={`btn ez-lift ${css.ajudaBotao}`}>
                    <i className="ph-fill ph-whatsapp-logo" />Pedir pelo WhatsApp
                  </a>
                  <button type="button" onClick={clearFilters} className="btn btn-white ez-lift">
                    Limpar a busca e os filtros
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
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
                  ['stock', 'Disponibilidade', activeStock === 'all' ? null : rotuloEstoque],
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
                {sheetGroup === 'cat' && [{ name: 'all', icon: '' }, ...catLista].map((c) => (
                  <button key={c.name} type="button" onClick={() => escolherCategoria(c.name)} className={`filter-btn${activeCategory === c.name ? ' active' : ''}`}>
                    <span>{c.name === 'all' ? 'Todas as categorias' : c.name}</span>
                    <span className="mono" style={{ fontSize: 12, opacity: .6 }}>{c.name === 'all' ? view.bySearch.length : (view.catCounts[c.name] || 0)}</span>
                  </button>
                ))}

                {sheetGroup === 'brand' && ['all', ...marcas].map((k) => (
                  <button key={k} type="button" onClick={() => escolherMarca(k)} className={`filter-btn${activeBrand === k ? ' active' : ''}`}>
                    <span>{k === 'all' ? 'Todas as marcas' : k}</span>
                    <span className="mono" style={{ fontSize: 12, opacity: .6 }}>{k === 'all' ? view.bySearch.length : (view.brandCounts[k] || 0)}</span>
                  </button>
                ))}

                {sheetGroup === 'stock' && ESTOQUES.map(([k, label]) => (
                  <button key={k} type="button" onClick={() => escolherEstoque(k)} className={`filter-btn${activeStock === k ? ' active' : ''}`}>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sheet-foot">
              <button type="button" className="sheet-clear" onClick={clearFilters}>Limpar</button>
              <button type="button" className="sheet-apply" onClick={() => setSheetOpen(false)}>
                Ver {view.total} {view.total === 1 ? 'peça' : 'peças'}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </main>
  );
}
