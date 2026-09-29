import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProducts, getProductBySlug, getRelated } from '@/lib/data';
import { productWaHref, productMailHref, site } from '@/lib/config';
import { productImageUrl } from '@/lib/storage';
import type { StockStatus } from '@/lib/types';
import { Trilha } from '@/components/CabecalhoPagina';
import { ProductCard } from '@/components/ProductCard';
import { ProductGallery } from '@/components/ProductGallery';
import { ShareButton } from '@/components/ShareButton';
import css from './produto.module.css';

// O que dizer sobre o estoque de cada peça, em linguagem de quem compra.
const ESTOQUE: Record<StockStatus, { rotulo: string; detalhe: string }> = {
  em: { rotulo: 'Em estoque', detalhe: 'Pronta para envio' },
  baixo: { rotulo: 'Estoque baixo', detalhe: 'Últimas unidades — confirme no orçamento' },
  sem: { rotulo: 'Sem estoque no momento', detalhe: 'Consulte o prazo no orçamento' },
};

const GARANTIAS = [
  { icon: 'ph-seal-check', texto: 'Revenda autorizada Fischertec' },
  { icon: 'ph-truck', texto: 'Entrega para todo o Brasil' },
  { icon: 'ph-headset', texto: 'Ajuda técnica para confirmar a peça' },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: 'Peça não encontrada' };
  const descricao = p.short || `${p.name} (${p.brand}). Peça o orçamento pelo WhatsApp.`;
  return {
    title: p.name,
    description: descricao,
    openGraph: {
      title: `${p.name} · Ezermec`,
      description: descricao,
      ...(p.images[0] ? { images: [{ url: productImageUrl(p.images[0]), alt: p.name }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = getRelated(all, product);

  const waHref = productWaHref(product.name, product.code);
  const mailHref = productMailHref(product.name, product.code, product.fab, product.brand);
  const estoque = ESTOQUE[product.stock];

  const specs: Array<[string, string]> = [
    ['Marca', product.brand], ['Categoria', product.cat],
    ['Código interno', product.code], ['Código do fabricante', product.fab],
    ['Material', product.material], ['Peso', product.weight],
    ['Dimensões', product.dims], ['Garantia', '12 meses'],
  ].filter(([, v]) => v) as Array<[string, string]>;

  return (
    <main className="ez-fade">
      <div className={`container ${css.topo}`}>
        <Trilha
          passos={[
            { nome: 'Início', href: '/' },
            { nome: 'Peças', href: '/catalogo' },
            { nome: product.cat, href: `/catalogo?cat=${encodeURIComponent(product.cat)}` },
            { nome: product.name },
          ]}
        />

        <div className={css.principal}>
          {/* GALERIA */}
          <ProductGallery images={product.images} name={product.name} icon={product.icon} stock={product.stock} />

          {/* INFORMAÇÕES E ORÇAMENTO */}
          <div className={css.info}>
            <div className={css.marca}>
              <span>{product.brand}</span>
              <Link href={`/catalogo?cat=${encodeURIComponent(product.cat)}`}>{product.cat}</Link>
            </div>
            <h1 className={css.nome}>{product.name}</h1>

            <p className={`${css.estoque} ${css[`estoque_${product.stock}`]}`}>
              <span className={css.estoquePonto} aria-hidden="true" />
              <strong>{estoque.rotulo}</strong>
              <span>{estoque.detalhe}</span>
            </p>

            {product.short && <p className={css.resumo}>{product.short}</p>}

            <dl className={css.codigos}>
              <div>
                <dt>Cód. interno</dt>
                <dd>{product.code}</dd>
              </div>
              {product.fab && (
                <div>
                  <dt>Cód. fabricante</dt>
                  <dd>{product.fab}</dd>
                </div>
              )}
            </dl>

            <div className={css.orcamento}>
              <strong>Peça o orçamento</strong>
              <span>Respondemos no horário comercial: {site.horario.join(' · ')}.</span>
              <a href={waHref} target="_blank" rel="noopener" className={`btn ez-lift ${css.botaoWhats}`}>
                <i className="ph-fill ph-whatsapp-logo" />Pedir orçamento pelo WhatsApp
              </a>
              <div className={css.orcamentoMais}>
                <a href={mailHref} className="btn btn-white ez-lift">
                  <i className="ph ph-envelope-simple" />Enviar e-mail
                </a>
                <ShareButton />
              </div>
            </div>

            <ul className={css.garantias}>
              {GARANTIAS.map((g) => (
                <li key={g.texto}><i className={`ph ${g.icon}`} aria-hidden="true" />{g.texto}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* DETALHES */}
      <section className={css.detalhes}>
        <div className={`container ${css.detalhesGrade}`}>
          <div>
            <h2>Sobre a peça</h2>
            <p className={css.descricao}>{product.full || product.short}</p>
            <div className={css.duvida}>
              <i className="ph ph-file-text" aria-hidden="true" />
              <div>
                <strong>Precisa da ficha técnica ou de outra medida?</strong>
                <span>Peça pelo WhatsApp que a gente envia ou confirma o modelo certo para a sua máquina.</span>
              </div>
            </div>
          </div>
          <div>
            <h2>Especificações técnicas</h2>
            <dl className={css.specs}>
              {specs.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* RELACIONADOS */}
      {related.length > 0 && (
        <section className={`container ${css.relacionados}`}>
          <div className={css.relacionadosTopo}>
            <h2>Veja também</h2>
            <Link href="/catalogo">Ver catálogo completo <i className="ph ph-arrow-right" /></Link>
          </div>
          <div className={`product-grid ${css.grade}`}>
            {related.map((p) => <ProductCard key={p.slug} product={p} variant="related" />)}
          </div>
        </section>
      )}
    </main>
  );
}
