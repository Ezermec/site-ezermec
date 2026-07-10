import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="ez-fade container" style={{ paddingTop: 100, paddingBottom: 100, textAlign: 'center', maxWidth: 640 }}>
      <i className="ph ph-compass" style={{ fontSize: 48, color: 'var(--border2)' }} />
      <h1 style={{ fontWeight: 800, fontSize: 26, marginTop: 16 }}>Página não encontrada</h1>
      <p style={{ fontSize: 15, color: 'var(--text)', marginTop: 8 }}>O conteúdo que você procura pode ter sido movido ou não existe.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 22 }}>
        <Link href="/" className="btn btn-navy ez-lift" style={{ padding: '13px 24px', fontSize: 15 }}>Voltar ao início</Link>
        <Link href="/catalogo" className="btn btn-white ez-lift" style={{ padding: '13px 24px', fontSize: 15 }}>Ver catálogo</Link>
      </div>
    </main>
  );
}
