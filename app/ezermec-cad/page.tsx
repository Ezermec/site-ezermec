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

export default function EzermecCadPage() {
  return (
    <main className="ez-fade">
      <div className="container" style={{ paddingTop: 26 }}>
        <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
          <Link href="/" style={{ color: 'var(--muted)' }}>Início</Link>
          <i className="ph ph-caret-right" style={{ fontSize: 12 }} /><span style={{ color: 'var(--navy)' }}>{cad.name}</span>
        </div>
      </div>

      {/* HERO */}
      <section className="container" style={{ paddingTop: 6, paddingBottom: 56, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 48, alignItems: 'center' }}>
        <div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono), monospace', fontSize: 11.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--orange)', fontWeight: 600, background: '#fdede1', padding: '7px 13px', borderRadius: 100 }}>
            <i className="ph-fill ph-seal-check" />Desenvolvido para máquinas Fischertec
          </span>
          <h1 style={{ fontSize: 'clamp(32px,4vw,48px)', fontWeight: 800, letterSpacing: '-.02em', margin: '20px 0 0', lineHeight: 1.08, color: 'var(--navy)' }}>{cad.name}</h1>
          <p style={{ fontSize: 17.5, lineHeight: 1.6, color: 'var(--text)', margin: '16px 0 0', maxWidth: 560 }}>{cad.tagline}</p>
          <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--text)', margin: '14px 0 0', maxWidth: 560 }}>{cad.description}</p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
            {cad.downloadUrl ? (
              <a href={cad.downloadUrl} target="_blank" rel="noopener" className="btn btn-navy ez-lift" style={{ padding: '15px 26px', fontSize: 16 }}>
                <i className="ph ph-download-simple" style={{ fontSize: 20 }} />Baixar {cad.name}
              </a>
            ) : (
              <span className="btn btn-navy" style={{ padding: '15px 26px', fontSize: 16, opacity: .55, cursor: 'default' }}>
                <i className="ph ph-clock-countdown" style={{ fontSize: 20 }} />Disponível em breve
              </span>
            )}
            <a href={waCad} target="_blank" rel="noopener" className="btn btn-white ez-lift" style={{ padding: '15px 26px', fontSize: 16 }}>
              <i className="ph-fill ph-whatsapp-logo" style={{ fontSize: 20, color: 'var(--green)' }} />Falar sobre o {cad.name}
            </a>
          </div>

          {cad.version && (
            <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 14 }}>Versão atual: {cad.version}</div>
          )}
        </div>

        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', borderRadius: 22, overflow: 'hidden', border: '1px solid var(--border)', background: '#0d1117', boxShadow: '0 30px 60px -34px rgba(5,40,87,.35)' }}>
          <ImageSlot placeholder={cad.screenshots[0].alt} src={cad.screenshots[0].src ?? undefined} fit="contain" />
        </div>
      </section>

      {/* FISCHERTEC */}
      <section className="container" style={{ paddingBottom: 8 }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: 30, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 26, alignItems: 'center' }}>
          <div>
            <span className="eyebrow">Compatibilidade</span>
            <h2 style={{ fontSize: 'clamp(21px,2.3vw,27px)', fontWeight: 800, letterSpacing: '-.02em', margin: '10px 0 0', color: 'var(--navy)' }}>Desenvolvido para máquinas Fischertec</h2>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text)', margin: '10px 0 0' }}>
              A Ezermec é revenda autorizada Fischertec, e foi dessa convivência diária com as máquinas que nasceu o {cad.name}. O desenho sai do aplicativo em NGC, já com o preâmbulo e os presets da máquina — sem adaptar um CAD genérico e sem retrabalho na hora de costurar.
            </p>
            <Link href="/catalogo" className="btn btn-white ez-lift" style={{ padding: '13px 22px', fontSize: 15, marginTop: 20 }}>
              Ver peças Fischertec <i className="ph ph-arrow-right" />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            {[
              ['ph-fill ph-seal-check', 'Revenda autorizada Fischertec'],
              ['ph-file-code', 'Saída em NGC com o preâmbulo Fischertec'],
              ['ph-headset', 'Suporte técnico da própria Ezermec'],
            ].map(([ic, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 13, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: '15px 18px' }}>
                <i className={ic.startsWith('ph-fill') ? ic : `ph ${ic}`} style={{ fontSize: 22, color: 'var(--orange)' }} />
                <span style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--navy)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECURSOS */}
      <section style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 36px' }}>
            <span className="eyebrow">Recursos</span>
            <h2 style={{ fontSize: 'clamp(24px,2.8vw,32px)', fontWeight: 800, letterSpacing: '-.02em', margin: '12px 0 0' }}>O que o {cad.name} faz</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 18 }}>
            {cad.features.map((f) => (
              <div key={f.title} className="ez-card-h" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
                <span style={{ width: 52, height: 52, borderRadius: 14, background: '#fff', border: '1px solid var(--border)', color: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 16 }}><i className={f.icon.startsWith('ph-fill') ? f.icon : `ph ${f.icon}`} /></span>
                <div style={{ fontWeight: 700, fontSize: 16.5, color: 'var(--navy)' }}>{f.title}</div>
                <div style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.5, marginTop: 6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO USAR */}
      <section className="container" style={{ paddingTop: 64, paddingBottom: 20 }}>
        <div style={{ marginBottom: 30 }}>
          <span className="eyebrow">Passo a passo</span>
          <h2 style={{ fontSize: 'clamp(24px,2.8vw,32px)', fontWeight: 800, letterSpacing: '-.02em', margin: '10px 0 0' }}>Como funciona</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
          {cad.steps.map(([title, desc], i) => (
            <div key={title} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
              <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 10, background: 'var(--navy)', color: '#fff', fontWeight: 600, fontSize: 14 }}>{String(i + 1).padStart(2, '0')}</span>
              <div style={{ fontWeight: 700, fontSize: 16.5, color: 'var(--navy)', marginTop: 14 }}>{title}</div>
              <div style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.5, marginTop: 6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TELAS */}
      <section className="container" style={{ paddingTop: 56, paddingBottom: 20 }}>
        <div style={{ marginBottom: 26 }}>
          <span className="eyebrow">Por dentro do app</span>
          <h2 style={{ fontSize: 'clamp(24px,2.8vw,32px)', fontWeight: 800, letterSpacing: '-.02em', margin: '10px 0 0' }}>Telas do {cad.name}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18 }}>
          {cad.screenshots.map((shot) => (
            <div key={shot.alt} style={{ position: 'relative', aspectRatio: '16/10', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <ImageSlot placeholder={shot.alt} src={shot.src ?? undefined} fit="contain" />
            </div>
          ))}
        </div>
      </section>

      {/* REQUISITOS */}
      <section style={{ background: 'var(--navy)', marginTop: 64 }}>
        <div className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 34px' }}>
            <span className="eyebrow" style={{ color: 'var(--orange2)' }}>Antes de instalar</span>
            <h2 style={{ color: '#fff', fontSize: 'clamp(24px,2.8vw,32px)', fontWeight: 800, letterSpacing: '-.02em', margin: '12px 0 0' }}>Requisitos</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
            {cad.requirements.map(([ic, label, value]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 16, padding: 24 }}>
                <i className={`ph ${ic}`} style={{ fontSize: 26, color: 'var(--orange2)' }} />
                <div className="mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#8fa6c4', marginTop: 12 }}>{label}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginTop: 5 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container" style={{ paddingTop: 56, paddingBottom: 56 }}>
        <div style={{ background: 'linear-gradient(120deg,#f5660c,#ff7a1a)', borderRadius: 24, padding: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 28, flexWrap: 'wrap', boxShadow: '0 30px 60px -30px rgba(245,102,12,.5)' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(24px,2.6vw,32px)', fontWeight: 800, margin: 0, letterSpacing: '-.02em' }}>Quer conhecer o {cad.name}?</h2>
            <p style={{ color: 'rgba(255,255,255,.92)', fontSize: 16, margin: '8px 0 0' }}>Fale com a nossa equipe e receba a demonstração e o acesso ao aplicativo.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={waCad} target="_blank" rel="noopener" className="btn ez-lift" style={{ background: '#fff', color: 'var(--navy)', padding: '15px 26px', fontSize: 16 }}><i className="ph-fill ph-whatsapp-logo" style={{ fontSize: 20, color: 'var(--green)' }} />Chamar no WhatsApp</a>
            <a href={site.mailGeneral} className="btn ez-lift" style={{ background: 'rgba(5,40,87,.9)', color: '#fff', padding: '15px 26px', fontSize: 16 }}><i className="ph ph-envelope-simple" style={{ fontSize: 20 }} />Enviar e-mail</a>
          </div>
        </div>
      </section>
    </main>
  );
}
