import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProducts, getProductBySlug, getRelated } from '@/lib/data';
import { productWaHref, productMailHref } from '@/lib/config';
import { ProductCard } from '@/components/ProductCard';
import { ProductGallery } from '@/components/ProductGallery';
import { ShareButton } from '@/components/ShareButton';

const crumbBtn = { background: 'none', border: 'none', color: 'var(--muted)', fontFamily: 'inherit', fontSize: 13, padding: 0 } as const;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = getRelated(all, product);

  const waHref = productWaHref(product.name, product.code);
  const mailHref = productMailHref(product.name, product.code, product.fab, product.brand);

  const specs: Array<[string, string]> = [
    ['Marca', product.brand], ['Categoria', product.cat],
    ['Código do fabricante', product.fab], ['Material', product.material], ['Peso', product.weight],
    ['Dimensões', product.dims], ['Garantia', '12 meses'],
  ].filter(([, v]) => v) as Array<[string, string]>;

  return (
    <main className="ez-fade container" style={{ paddingTop: 26, paddingBottom: 60 }}>
      <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', marginBottom: 18, flexWrap: 'wrap' }}>
        <Link href="/" style={crumbBtn}>Início</Link>
        <i className="ph ph-caret-right" style={{ fontSize: 12 }} />
        <Link href="/catalogo" style={crumbBtn}>Catálogo</Link>
        <i className="ph ph-caret-right" style={{ fontSize: 12 }} /><span style={{ color: 'var(--orange)' }}>{product.cat}</span>
        <i className="ph ph-caret-right" style={{ fontSize: 12 }} /><span style={{ color: 'var(--navy)' }}>{product.name}</span>
      </div>

      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))', gap: 38, alignItems: 'start' }}>
          {/* GALERIA */}
          <ProductGallery images={product.images} name={product.name} icon={product.icon} stock={product.stock} />

          {/* INFO */}
          <div>
            <span className="mono" style={{ fontSize: 12, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>{product.brand}</span>
            <h1 style={{ fontSize: 'clamp(24px,2.8vw,34px)', fontWeight: 800, letterSpacing: '-.02em', margin: '8px 0 0', lineHeight: 1.15 }}>{product.name}</h1>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '16px 0 0' }}>
              <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 12px', fontSize: 12.5, color: 'var(--text)' }}><span style={{ color: 'var(--muted)' }}>Cód. interno</span><strong style={{ color: 'var(--navy)' }}>{product.code}</strong></span>
              <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 12px', fontSize: 12.5, color: 'var(--text)' }}><span style={{ color: 'var(--muted)' }}>Cód. fabricante</span><strong style={{ color: 'var(--navy)' }}>{product.fab}</strong></span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '18px 0 0' }}>
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px' }}><div className="mono" style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Categoria</div><div style={{ fontWeight: 700, fontSize: 14.5, marginTop: 3 }}>{product.cat}</div></div>
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px' }}><div className="mono" style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Marca</div><div style={{ fontWeight: 700, fontSize: 14.5, marginTop: 3 }}>{product.brand}</div></div>
            </div>

            <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--text)', margin: '20px 0 0' }}>{product.full}</p>

            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, marginTop: 22 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Gostou deste produto?</div>
              <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 14 }}>Solicite um orçamento sem compromisso — respondemos rápido.</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href={waHref} target="_blank" rel="noopener" className="ez-lift" style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--orange)', color: '#fff', borderRadius: 12, padding: '14px 22px', fontWeight: 700, fontSize: 15, flex: 1, justifyContent: 'center', minWidth: 180 }}><i className="ph ph-file-text" style={{ fontSize: 19 }} />Solicitar orçamento</a>
                <a href={waHref} target="_blank" rel="noopener" className="ez-lift" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--green)', color: '#fff', borderRadius: 12, padding: '14px 18px', fontWeight: 700, fontSize: 15 }}><i className="ph-fill ph-whatsapp-logo" style={{ fontSize: 19 }} />WhatsApp</a>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                <a href={mailHref} className="ez-lift" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', color: 'var(--navy)', border: '1.5px solid var(--border2)', borderRadius: 12, padding: '12px 18px', fontWeight: 700, fontSize: 14, flex: 1, justifyContent: 'center' }}><i className="ph ph-envelope-simple" style={{ fontSize: 18 }} />Enviar e-mail</a>
                <ShareButton />
              </div>
            </div>
          </div>
        </div>

        {/* SPECS + ARQUIVOS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 24, marginTop: 44 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 14px' }}>Especificações técnicas</h2>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
              {specs.map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '13px 18px', borderBottom: '1px solid #f1f4f8' }}>
                  <span style={{ color: 'var(--text)', fontSize: 14 }}>{k}</span>
                  <span style={{ fontWeight: 700, fontSize: 14, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 14px' }}>Downloads &amp; mídia</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href={waHref} target="_blank" rel="noopener" className="ez-lift" style={{ display: 'flex', alignItems: 'center', gap: 13, background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '15px 18px' }}>
                <span style={{ width: 42, height: 42, borderRadius: 10, background: '#fbe9e7', color: '#c0392b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}><i className="ph-fill ph-file-pdf" /></span>
                <span style={{ flex: 1 }}><span style={{ display: 'block', fontWeight: 700, fontSize: 14.5, color: 'var(--navy)' }}>Ficha técnica (PDF)</span><span className="mono" style={{ fontSize: 12.5, color: 'var(--muted)' }}>Solicite via WhatsApp</span></span>
                <i className="ph ph-download-simple" style={{ fontSize: 20, color: 'var(--muted)' }} />
              </a>
              <a href={waHref} target="_blank" rel="noopener" className="ez-lift" style={{ display: 'flex', alignItems: 'center', gap: 13, background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '15px 18px' }}>
                <span style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--border2)', color: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}><i className="ph-fill ph-file-doc" /></span>
                <span style={{ flex: 1 }}><span style={{ display: 'block', fontWeight: 700, fontSize: 14.5, color: 'var(--navy)' }}>Catálogo de aplicação</span><span className="mono" style={{ fontSize: 12.5, color: 'var(--muted)' }}>Solicite via WhatsApp</span></span>
                <i className="ph ph-download-simple" style={{ fontSize: 20, color: 'var(--muted)' }} />
              </a>
              <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', background: 'repeating-linear-gradient(135deg,#f1f5fa,#f1f5fa 11px,#e8edf3 11px,#e8edf3 22px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, color: 'var(--text)' }}>
                <span style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}><i className="ph-fill ph-play" /></span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>Vídeo do produto em breve</span>
              </div>
            </div>
          </div>
        </div>

        {/* RELACIONADOS */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 18px' }}>Produtos relacionados</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18 }}>
            {related.map((p) => <ProductCard key={p.slug} product={p} variant="related" />)}
          </div>
        </div>
      </div>
    </main>
  );
}
