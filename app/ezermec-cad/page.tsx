import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/config';
import { cad } from '@/lib/cad';
import { ImageSlot } from '@/components/ImageSlot';

export const metadata: Metadata = {
  title: `${cad.name} — aplicativo CAD da Ezermec`,
  description: cad.tagline,
};

const waCad =
  'https://wa.me/' +
  site.whatsappNumber +
  '?text=' +
  encodeURIComponent('Olá! Gostaria de saber mais sobre o Ezermec CAD.');

function icon(name: string) {
  return name.startsWith('ph-fill') ? name : `ph ${name}`;
}

export default function EzermecCadPage() {
  return (
    <main className="ez-fade">
      <div className="container" style={{ paddingTop: 26 }}>
        <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
          <Link href="/" style={{ color: 'var(--muted)' }}>Início</Link>
          <i className="ph ph-caret-right" style={{ fontSize: 12 }} /><span style={{ color: 'var(--navy)' }}>{cad.name}</span>
        </div>
      </div>

      {/* HERO — logo, uma chamada, uma linha e os botões. */}
      <section className="container" style={{ paddingTop: 6, paddingBottom: 44, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 44, alignItems: 'center' }}>
        <div>
          {/* O logo do app só existe em branco (é o do topo escuro do aplicativo),
              por isso vai sobre uma placa navy. O nome fica no <h1> como texto. */}
          <div style={{ display: 'inline-flex', background: 'var(--navy)', borderRadius: 16, padding: '16px 22px', boxShadow: '0 20px 40px -24px rgba(5,40,87,.5)' }}>
            <img src="/assets/logo-ezermec-cad-white.png" alt="Ezermec CAD" width={280} height={76} style={{ display: 'block', height: 52, width: 'auto' }} />
          </div>
          <h1 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 800, letterSpacing: '-.02em', margin: '20px 0 0', lineHeight: 1.15, color: 'var(--navy)', maxWidth: 520 }}>{cad.tagline}</h1>
          <p style={{ fontSize: 16.5, lineHeight: 1.6, color: 'var(--text)', margin: '14px 0 0', maxWidth: 500 }}>{cad.description}</p>

          {/* `hero-cta` já traz a regra de celular: botões em coluna, largura cheia. */}
          <div className="hero-cta" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
            {cad.downloadUrl ? (
              <a href={cad.downloadUrl} target="_blank" rel="noopener" className="btn btn-navy ez-lift" style={{ padding: '15px 26px', fontSize: 16 }}>
                <i className="ph ph-download-simple" style={{ fontSize: 20 }} />Baixar
              </a>
            ) : (
              <span className="btn btn-navy" style={{ padding: '15px 26px', fontSize: 16, opacity: .55, cursor: 'default' }}>
                <i className="ph ph-clock-countdown" style={{ fontSize: 20 }} />Disponível em breve
              </span>
            )}
            <a href={waCad} target="_blank" rel="noopener" className="btn btn-white ez-lift" style={{ padding: '15px 26px', fontSize: 16 }}>
              <i className="ph-fill ph-whatsapp-logo" style={{ fontSize: 20, color: 'var(--green)' }} />Falar com a equipe
            </a>
          </div>

          <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)', marginTop: 14 }}>
            <i className="ph ph-windows-logo" style={{ fontSize: 15 }} />
            Windows (.exe){cad.version && ` · versão ${cad.version}`}
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', borderRadius: 22, overflow: 'hidden', border: '1px solid var(--border)', background: '#0d1117', boxShadow: '0 30px 60px -34px rgba(5,40,87,.35)' }}>
          <ImageSlot placeholder={cad.screenshots[0].alt} src={cad.screenshots[0].src ?? undefined} fit="contain" />
        </div>
      </section>

      {/* GARANTIAS — três itens de bater o olho, sem parágrafo. */}
      <section className="container" style={{ paddingBottom: 8 }}>
        <div className="cad-highlights">
          {cad.highlights.map(([ic, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '15px 18px' }}>
              <i className={icon(ic)} style={{ fontSize: 22, color: 'var(--orange)' }} />
              <span style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--navy)' }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* RECURSOS */}
      <section style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginTop: 40 }}>
        <div className="container" style={{ paddingTop: 52, paddingBottom: 52 }}>
          <h2 style={{ fontSize: 'clamp(23px,2.6vw,30px)', fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 28px', textAlign: 'center' }}>O que ele faz</h2>
          <div className="cad-features">
            {cad.features.map((f) => (
              <div key={f.title} className="ez-card-h" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
                <span style={{ width: 46, height: 46, borderRadius: 13, background: '#fff', border: '1px solid var(--border)', color: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 13 }}><i className={icon(f.icon)} /></span>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--navy)' }}>{f.title}</div>
                <div style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.45, marginTop: 5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PASSO A PASSO — quatro etapas curtas, numeradas. */}
      <section className="container" style={{ paddingTop: 52, paddingBottom: 8 }}>
        <h2 style={{ fontSize: 'clamp(23px,2.6vw,30px)', fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 26px', textAlign: 'center' }}>Como funciona</h2>
        <div className="cad-steps">
          {cad.steps.map(([title, desc], i) => (
            <div key={title} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
              <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 9, background: 'var(--navy)', color: '#fff', fontWeight: 600, fontSize: 13 }}>{i + 1}</span>
              <div style={{ fontWeight: 700, fontSize: 16.5, color: 'var(--navy)', marginTop: 12 }}>{title}</div>
              <div style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.45, marginTop: 4 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TELAS */}
      <section className="container" style={{ paddingTop: 52, paddingBottom: 8 }}>
        <h2 style={{ fontSize: 'clamp(23px,2.6vw,30px)', fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 22px', textAlign: 'center' }}>Telas do aplicativo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {cad.screenshots.map((shot) => (
            <div key={shot.alt} style={{ position: 'relative', aspectRatio: '16/10', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <ImageSlot placeholder={shot.alt} src={shot.src ?? undefined} fit="contain" />
            </div>
          ))}
        </div>
      </section>

      {/* REQUISITOS */}
      <section style={{ background: 'var(--navy)', marginTop: 52 }}>
        <div className="container" style={{ paddingTop: 46, paddingBottom: 46 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16 }}>
            {cad.requirements.map(([ic, label, value]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <i className={icon(ic)} style={{ fontSize: 24, color: 'var(--orange2)', flex: 'none' }} />
                <div>
                  <div className="mono" style={{ fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#8fa6c4' }}>{label}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginTop: 2 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div style={{ background: 'linear-gradient(120deg,#f5660c,#ff7a1a)', borderRadius: 24, padding: 38, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap', boxShadow: '0 30px 60px -30px rgba(245,102,12,.5)' }}>
          <h2 style={{ color: '#fff', fontSize: 'clamp(22px,2.4vw,29px)', fontWeight: 800, margin: 0, letterSpacing: '-.02em' }}>Quer ver funcionando?</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={waCad} target="_blank" rel="noopener" className="btn ez-lift" style={{ background: '#fff', color: 'var(--navy)', padding: '15px 26px', fontSize: 16 }}><i className="ph-fill ph-whatsapp-logo" style={{ fontSize: 20, color: 'var(--green)' }} />WhatsApp</a>
            <a href={site.mailGeneral} className="btn ez-lift" style={{ background: 'rgba(5,40,87,.9)', color: '#fff', padding: '15px 26px', fontSize: 16 }}><i className="ph ph-envelope-simple" style={{ fontSize: 20 }} />E-mail</a>
          </div>
        </div>
      </section>
    </main>
  );
}
