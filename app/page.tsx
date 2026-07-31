import Link from 'next/link';
import { getProducts, getFeatured, getCategories } from '@/lib/data';
import { DIFERENCIAIS } from '@/lib/content';
import { cad } from '@/lib/cad';
import { site } from '@/lib/config';
import { roundedItemCountLabel } from '@/lib/format';
import { HeroSearch } from '@/components/HeroSearch';
import { ProductCard } from '@/components/ProductCard';
import { ImageSlot } from '@/components/ImageSlot';

// Foto de capa do Ezermec CAD, a mesma usada no topo da página do aplicativo.
const cadCapa = cad.screenshots[0];

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const featured = getFeatured(products);

  const catCounts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.cat] = (acc[p.cat] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="ez-fade">
      {/* HERO */}
      <section style={{ background: 'linear-gradient(180deg,#fff 0%,#f7f8fa 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="hero-grid container" style={{ paddingTop: 56, paddingBottom: 64, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 48, alignItems: 'center' }}>
          <div className="hero-text">
            <span className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono), monospace', fontSize: 11.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--orange)', fontWeight: 600, background: '#fdede1', padding: '7px 13px', borderRadius: 100 }}>
              <i className="ph-fill ph-seal-check" />Revenda autorizada Fischertec
            </span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(34px,4.4vw,54px)', lineHeight: 1.05, fontWeight: 800, letterSpacing: '-.02em', margin: '20px 0 0', color: 'var(--navy)' }}>
              Peças e soluções para{' '}<br className="hero-br" />manutenção industrial.
            </h1>
            {/* Duas versões do texto: a curta aparece só no celular, para o
                hero não virar um bloco de leitura antes da foto. */}
            <p className="hero-lead" style={{ fontSize: 17.5, lineHeight: 1.6, color: 'var(--text)', maxWidth: 540, margin: '20px 0 0' }}>
              <span className="lead-full">A Ezermec é especializada na comercialização de peças para máquinas industriais, oferecendo qualidade, atendimento especializado e sendo revenda autorizada da Fischertec.</span>
              <span className="lead-short">Peças para máquinas industriais, com atendimento especializado.</span>
            </p>
            <HeroSearch />
            <div className="hero-cta" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', margin: '26px 0 0' }}>
              <Link href="/catalogo" className="btn btn-navy ez-lift" style={{ padding: '15px 26px', fontSize: 16 }}>Ver catálogo <i className="ph ph-arrow-right" /></Link>
              <a href={site.waHref} target="_blank" rel="noopener" className="btn btn-white ez-lift" style={{ padding: '15px 26px', fontSize: 16 }}>Solicitar orçamento</a>
            </div>
            <div className="hero-stats" style={{ display: 'flex', gap: 26, flexWrap: 'wrap', margin: '30px 0 0' }}>
              {[[roundedItemCountLabel(products.length), 'itens em catálogo'], [String(categories.length), 'categorias'], ['100%', 'peças originais']].map(([n, l], i) => (
                <div key={i} style={{ display: 'flex', gap: 26 }}>
                  {i > 0 && <div className="stat-sep" style={{ width: 1, background: 'var(--border)', marginLeft: -26 }} />}
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--navy)' }}>{n}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-photo" style={{ position: 'relative' }}>
            <div className="hero-photo-box" style={{ position: 'relative', width: '100%', aspectRatio: '4/3.4', borderRadius: 22, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 40px 80px -40px rgba(5,40,87,.4)' }}>
              <ImageSlot placeholder="Foto: indústria / manutenção de máquinas" src="/assets/hero-industria-manutencao.png" />
            </div>
            <div className="hero-selo" style={{ position: 'absolute', left: -14, bottom: 26, background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 20px 40px -20px rgba(5,40,87,.35)' }}>
              <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}><i className="ph-fill ph-seal-check" /></span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>Revenda autorizada</div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--orange)' }}>Fischertec</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="container" style={{ paddingTop: 64, paddingBottom: 20 }}>
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
          <span className="eyebrow">Por que a Ezermec</span>
          <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight: 800, letterSpacing: '-.02em', margin: '12px 0 0' }}>Confiança, estoque e suporte técnico</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 18 }}>
          {DIFERENCIAIS.map((d) => (
            <div key={d.title} className="ez-card-h" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
              <span style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 16 }}><i className={`ph ${d.icon}`} /></span>
              <div style={{ fontWeight: 700, fontSize: 16.5, color: 'var(--navy)' }}>{d.title}</div>
              <div style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.5, marginTop: 6 }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section id="categorias" className="container" style={{ paddingTop: 56, paddingBottom: 20, scrollMarginTop: 120 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 14, marginBottom: 30 }}>
          <div>
            <span className="eyebrow">Navegue por segmento</span>
            <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight: 800, letterSpacing: '-.02em', margin: '10px 0 0' }}>Categorias de produtos</h2>
          </div>
          <Link href="/catalogo" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--navy)', fontWeight: 700, fontSize: 15 }}>Ver todos os produtos <i className="ph ph-arrow-right" /></Link>
        </div>
        <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 16 }}>
          {categories.map((c) => {
            const count = catCounts[c.name] || 0;
            return (
              <Link key={c.id} href={`/catalogo?cat=${encodeURIComponent(c.name)}`} className="ez-card-h" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column' }}>
                <span style={{ width: 54, height: 54, borderRadius: 14, background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 27, marginBottom: 16 }}><i className={`ph ${c.icon}`} /></span>
                <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--navy)' }}>{c.name}</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 5 }}>{count} {count === 1 ? 'item' : 'itens'}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="container" style={{ paddingTop: 56, paddingBottom: 20 }}>
        <div style={{ marginBottom: 26 }}>
          <span className="eyebrow">Em destaque</span>
          <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight: 800, letterSpacing: '-.02em', margin: '10px 0 0' }}>Produtos mais procurados</h2>
        </div>
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 18 }}>
          {featured.map((p) => <ProductCard key={p.slug} product={p} variant="home" />)}
        </div>
      </section>

      {/* EZERMEC CAD — chamada para o aplicativo próprio. Os textos e a foto
          vêm de lib/cad.ts, os mesmos da página do app, para não divergirem. */}
      <section className="container" style={{ paddingTop: 56, paddingBottom: 8 }}>
        <div className="home-cad">
          <div className="home-cad-foto" style={{ aspectRatio: `${cadCapa.w}/${cadCapa.h}` }}>
            <ImageSlot placeholder={cadCapa.alt} src={cadCapa.src ?? undefined} fit="contain" />
          </div>

          <div className="home-cad-texto">
            <span className="eyebrow">Aplicativo da Ezermec</span>
            <img
              src="/assets/logo-ezermec-cad.png"
              alt="Ezermec CAD"
              width={760}
              height={207}
              style={{ display: 'block', height: 42, width: 'auto', margin: '14px 0 0' }}
            />
            <h2 style={{ fontSize: 'clamp(22px,2.4vw,29px)', fontWeight: 800, letterSpacing: '-.02em', margin: '16px 0 0', lineHeight: 1.2 }}>
              {cad.tagline}
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--text)', margin: '12px 0 0' }}>
              {cad.description}
            </p>
            <Link href="/ezermec-cad" className="btn btn-navy ez-lift" style={{ padding: '14px 24px', fontSize: 15.5, marginTop: 22 }}>
              Conhecer o {cad.name} <i className="ph ph-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" style={{ scrollMarginTop: 120, marginTop: 64, background: 'var(--navy)', color: '#fff' }}>
        <div className="container" style={{ paddingTop: 64, paddingBottom: 64, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--orange2)' }}>Sobre a Ezermec</span>
            <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, letterSpacing: '-.02em', margin: '14px 0 0', lineHeight: 1.1 }}>Especialistas em peças para máquinas industriais</h2>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: '#dce7f4', margin: '18px 0 0' }}>Atuamos na comercialização de peças, manutenção industrial e assistência técnica. Como revenda autorizada da Fischertec, entregamos peças originais com o suporte técnico que a sua operação precisa para não parar.</p>
            <div className="mvv-grid" style={{ marginTop: 28 }}>
              {[['ph-target', 'Missão', 'Manter a indústria em movimento com a peça certa, na hora certa.'], ['ph-eye', 'Visão', 'Ser referência em peças e manutenção industrial na região.'], ['ph-handshake', 'Valores', 'Qualidade, confiança e atendimento especializado.']].map(([ic, t, d]) => (
                <div key={t} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, padding: 18 }}>
                  <i className={`ph ${ic}`} style={{ fontSize: 24, color: 'var(--orange2)' }} />
                  <div style={{ fontWeight: 700, marginTop: 10 }}>{t}</div>
                  <div style={{ fontSize: 12.5, color: '#dce7f4', marginTop: 4, lineHeight: 1.5 }}>{d}</div>
                </div>
              ))}
            </div>
            <Link href="/sobre" className="btn ez-lift" style={{ background: '#fff', color: 'var(--navy)', padding: '14px 24px', fontSize: 15, marginTop: 26 }}>Conhecer nossa história <i className="ph ph-arrow-right" /></Link>
          </div>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3.2', borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(255,255,255,.14)' }}>
            <ImageSlot placeholder="Foto: equipe / instalações Ezermec" />
          </div>
        </div>
      </section>

      {/* CONTATO CTA */}
      <section id="contato" className="container" style={{ paddingTop: 56, paddingBottom: 56, scrollMarginTop: 120 }}>
        <div style={{ background: 'linear-gradient(120deg,#f5660c,#ff7a1a)', borderRadius: 24, padding: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 28, flexWrap: 'wrap', boxShadow: '0 30px 60px -30px rgba(245,102,12,.5)' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(24px,2.6vw,32px)', fontWeight: 800, margin: 0, letterSpacing: '-.02em' }}>Precisa de um orçamento?</h2>
            <p style={{ color: 'rgba(255,255,255,.92)', fontSize: 16, margin: '8px 0 0' }}>Fale com um especialista e receba sua cotação sem compromisso.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={site.waHref} target="_blank" rel="noopener" className="btn ez-lift" style={{ background: '#fff', color: 'var(--navy)', padding: '15px 26px', fontSize: 16 }}><i className="ph-fill ph-whatsapp-logo" style={{ fontSize: 20, color: 'var(--green)' }} />Chamar no WhatsApp</a>
            <a href={site.mailGeneral} className="btn ez-lift" style={{ background: 'rgba(5,40,87,.9)', color: '#fff', padding: '15px 26px', fontSize: 16 }}><i className="ph ph-envelope-simple" style={{ fontSize: 20 }} />Enviar e-mail</a>
          </div>
        </div>
      </section>
    </main>
  );
}
