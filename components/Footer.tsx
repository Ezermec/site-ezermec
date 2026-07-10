import Link from 'next/link';
import { site } from '@/lib/config';
import { Logo } from './Logo';

const colTitle = { fontFamily: 'var(--font-mono), monospace', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase' as const, color: 'var(--orange2)', marginBottom: 14 };
const colLink = { color: '#dce7f4', textAlign: 'left' as const, fontSize: 14, textDecoration: 'none' };
const social = { width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 19 };

export function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: '#fff', marginTop: 20 }}>
      <div className="container" style={{ paddingTop: 56, paddingBottom: 30, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 36 }}>
        <div style={{ maxWidth: 300 }}>
          <div style={{ marginBottom: 16 }}>
            <Logo variant="white" height={36} />
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#dce7f4' }}>Peças e soluções para manutenção industrial. Revenda autorizada Fischertec. Qualidade, estoque e atendimento especializado.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <a href={site.waHref} target="_blank" rel="noopener" className="ez-lift" style={social}><i className="ph-fill ph-whatsapp-logo" /></a>
            <a href="#" className="ez-lift" style={social}><i className="ph-fill ph-instagram-logo" /></a>
            <a href="#" className="ez-lift" style={social}><i className="ph-fill ph-linkedin-logo" /></a>
            <a href={site.mailGeneral} className="ez-lift" style={social}><i className="ph-fill ph-envelope-simple" /></a>
          </div>
        </div>

        <div>
          <div style={colTitle}>Menu</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/" className="ez-lift" style={colLink}>Início</Link>
            <Link href="/catalogo" className="ez-lift" style={colLink}>Produtos</Link>
            <Link href="/#categorias" className="ez-lift" style={colLink}>Categorias</Link>
            <Link href="/sobre" className="ez-lift" style={colLink}>Sobre</Link>
          </div>
        </div>

        <div>
          <div style={colTitle}>Categorias</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/catalogo?cat=Lan%C3%A7adeiras" className="ez-lift" style={colLink}>Lançadeiras</Link>
            <Link href="/catalogo?cat=Agulhas" className="ez-lift" style={colLink}>Agulhas</Link>
            <Link href="/catalogo?cat=Rolamentos" className="ez-lift" style={colLink}>Rolamentos</Link>
          </div>
        </div>

        <div>
          <div style={colTitle}>Contato</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: '#dce7f4' }}>
            <a href={site.waHref} target="_blank" rel="noopener" style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#dce7f4' }}><i className="ph-fill ph-whatsapp-logo" style={{ color: 'var(--green)', fontSize: 18 }} />{site.phoneDisplay}</a>
            <a href={site.telHref} style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#dce7f4' }}><i className="ph ph-phone" style={{ fontSize: 18 }} />{site.phoneDisplay}</a>
            <a href={site.mailGeneral} style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#dce7f4' }}><i className="ph ph-envelope-simple" style={{ fontSize: 18 }} />{site.email}</a>
            <span style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><i className="ph ph-map-pin" style={{ fontSize: 18, marginTop: 2 }} />Av. Industrial, 1000 — Distrito Industrial<br />São Paulo / SP</span>
            <span style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><i className="ph ph-clock" style={{ fontSize: 18, marginTop: 2 }} />Seg a Sex, 8h às 18h<br />Sáb, 8h às 12h</span>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}>
        <div className="container mono" style={{ paddingTop: 18, paddingBottom: 18, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: 12.5, color: '#8fa6c4' }}>
          <span>© 2026 Ezermec — Todos os direitos reservados.</span>
          <span>Revenda autorizada Fischertec</span>
        </div>
      </div>
    </footer>
  );
}
