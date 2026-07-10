import Link from 'next/link';
import { site } from '@/lib/config';
import { ImageSlot } from '@/components/ImageSlot';

const faz: Array<[string, string, string]> = [
  ['ph-package', 'Comercialização de peças', 'Peças para máquinas industriais com estoque amplo e procedência garantida.'],
  ['ph-wrench', 'Manutenção industrial', 'Suporte para manter máquinas e linhas de produção operando sem paradas.'],
  ['ph-headset', 'Assistência técnica', 'Time técnico especializado para diagnóstico e recomendação da peça certa.'],
  ['ph-fill ph-seal-check', 'Revenda autorizada Fischertec', 'Peças originais Fischertec com garantia de procedência e qualidade.'],
];
const stats: Array<[string, string]> = [['+50', 'itens em catálogo'], ['10', 'categorias atendidas'], ['100%', 'peças originais'], ['Fischertec', 'revenda autorizada']];
const mvv: Array<[string, string, string]> = [
  ['ph-target', 'Missão', 'Manter a indústria em movimento, oferecendo a peça certa, na hora certa, com atendimento especializado.'],
  ['ph-eye', 'Visão', 'Ser referência em peças para máquinas industriais e manutenção industrial na região.'],
  ['ph-handshake', 'Valores', 'Qualidade, confiança, agilidade e proximidade com o cliente em cada atendimento.'],
];
const estrutura = ['Foto: estoque / almoxarifado', 'Foto: equipe técnica', 'Foto: atendimento ao cliente'];

export default function SobrePage() {
  return (
    <main className="ez-fade">
      <div className="container" style={{ paddingTop: 26 }}>
        <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
          <Link href="/" style={{ color: 'var(--muted)' }}>Início</Link>
          <i className="ph ph-caret-right" style={{ fontSize: 12 }} /><span style={{ color: 'var(--navy)' }}>Sobre</span>
        </div>
      </div>

      {/* HERO SOBRE */}
      <section className="container" style={{ paddingTop: 6, paddingBottom: 56, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 48, alignItems: 'center' }}>
        <div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono), monospace', fontSize: 11.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--orange)', fontWeight: 600, background: '#fdede1', padding: '7px 13px', borderRadius: 100 }}>
            <i className="ph-fill ph-seal-check" />Revenda autorizada Fischertec
          </span>
          <h1 style={{ fontSize: 'clamp(30px,3.6vw,44px)', fontWeight: 800, letterSpacing: '-.02em', margin: '20px 0 0', lineHeight: 1.1 }}>Especialistas em peças para máquinas industriais</h1>
          <p style={{ fontSize: 16.5, lineHeight: 1.65, color: 'var(--text)', margin: '20px 0 0' }}>A Ezermec é especializada na comercialização de peças para máquinas industriais, atuando também em manutenção industrial e assistência técnica. Como revenda autorizada da Fischertec, unimos peças originais a um atendimento técnico próximo e especializado — ajudando empresas a manter suas linhas de produção sempre em funcionamento.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
            <Link href="/catalogo" className="btn btn-navy ez-lift" style={{ padding: '14px 24px', fontSize: 15 }}>Ver catálogo <i className="ph ph-arrow-right" /></Link>
            <a href={site.waHref} target="_blank" rel="noopener" className="btn btn-white ez-lift" style={{ padding: '14px 24px', fontSize: 15 }}>Falar com a equipe</a>
          </div>
        </div>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3.2', borderRadius: 22, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 30px 60px -34px rgba(5,40,87,.35)' }}>
          <ImageSlot placeholder="Foto: fachada / instalações Ezermec" />
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ paddingTop: 34, paddingBottom: 34, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 18, textAlign: 'center' }}>
          {stats.map(([n, l]) => (
            <div key={l}><div style={{ fontSize: 30, fontWeight: 800, color: 'var(--navy)' }}>{n}</div><div className="mono" style={{ fontSize: 11.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 4 }}>{l}</div></div>
          ))}
        </div>
      </section>

      {/* O QUE FAZEMOS */}
      <section className="container" style={{ paddingTop: 64, paddingBottom: 20 }}>
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 36px' }}>
          <span className="eyebrow">O que fazemos</span>
          <h2 style={{ fontSize: 'clamp(24px,2.8vw,32px)', fontWeight: 800, letterSpacing: '-.02em', margin: '12px 0 0' }}>Do estoque ao suporte técnico</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 18 }}>
          {faz.map(([ic, t, d]) => (
            <div key={t} className="ez-card-h" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
              <span style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 16 }}><i className={ic.startsWith('ph-fill') ? ic : `ph ${ic}`} /></span>
              <div style={{ fontWeight: 700, fontSize: 16.5, color: 'var(--navy)' }}>{t}</div>
              <div style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.5, marginTop: 6 }}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSÃO VISÃO VALORES */}
      <section style={{ background: 'var(--navy)', marginTop: 56 }}>
        <div className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 34px' }}>
            <span className="eyebrow" style={{ color: 'var(--orange2)' }}>Nossos princípios</span>
            <h2 style={{ color: '#fff', fontSize: 'clamp(24px,2.8vw,32px)', fontWeight: 800, letterSpacing: '-.02em', margin: '12px 0 0' }}>Missão, visão e valores</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
            {mvv.map(([ic, t, d]) => (
              <div key={t} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 16, padding: 26 }}>
                <i className={`ph ${ic}`} style={{ fontSize: 28, color: 'var(--orange2)' }} />
                <div style={{ fontWeight: 700, fontSize: 17, marginTop: 14, color: '#fff' }}>{t}</div>
                <div style={{ fontSize: 14, color: '#dce7f4', marginTop: 8, lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOSSA ESTRUTURA */}
      <section className="container" style={{ paddingTop: 64, paddingBottom: 20 }}>
        <div style={{ marginBottom: 26 }}>
          <span className="eyebrow">Bastidores</span>
          <h2 style={{ fontSize: 'clamp(24px,2.8vw,32px)', fontWeight: 800, letterSpacing: '-.02em', margin: '10px 0 0' }}>Nossa estrutura</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18 }}>
          {estrutura.map((ph) => (
            <div key={ph} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <ImageSlot placeholder={ph} />
            </div>
          ))}
        </div>
      </section>

      {/* CONTATO CTA */}
      <section className="container" style={{ paddingTop: 56, paddingBottom: 56 }}>
        <div style={{ background: 'linear-gradient(120deg,#f5660c,#ff7a1a)', borderRadius: 24, padding: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 28, flexWrap: 'wrap', boxShadow: '0 30px 60px -30px rgba(245,102,12,.5)' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(24px,2.6vw,32px)', fontWeight: 800, margin: 0, letterSpacing: '-.02em' }}>Vamos manter sua indústria em movimento?</h2>
            <p style={{ color: 'rgba(255,255,255,.92)', fontSize: 16, margin: '8px 0 0' }}>Fale com nossa equipe e solicite um orçamento sem compromisso.</p>
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
