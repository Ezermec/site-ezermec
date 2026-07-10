import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProducts, getCurrentRole } from '@/lib/data';
import { signOut } from './actions';

export const metadata = { title: 'Painel — Ezermec' };
export const dynamic = 'force-dynamic';

const badge: Record<string, { bg: string; fg: string; label: string }> = {
  em: { bg: '#e6f4ec', fg: '#1f8a5b', label: 'Em estoque' },
  baixo: { bg: '#fcf0dc', fg: '#b26b00', label: 'Estoque baixo' },
  sem: { bg: '#fbe9e7', fg: '#c0392b', label: 'Sem estoque' },
};

export default async function PainelPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/painel/login');

  const sp = await searchParams;
  const [products, role] = await Promise.all([getProducts(), getCurrentRole()]);
  const isOwner = role === 'owner';

  return (
    <main className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
        <div>
          <span className="eyebrow">Painel administrativo</span>
          <h1 style={{ fontSize: 'clamp(24px,2.8vw,32px)', fontWeight: 800, letterSpacing: '-.02em', margin: '8px 0 0' }}>Produtos e estoque</h1>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 6 }}>Conectado como <strong style={{ color: 'var(--text)' }}>{user.email}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/painel/produtos/novo" className="ez-lift" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--orange)', color: '#fff', borderRadius: 10, padding: '11px 20px', fontWeight: 700, fontSize: 14 }}>
            <i className="ph ph-plus" />Novo produto
          </Link>
          <Link href="/painel/marcas-categorias" className="ez-lift" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', color: 'var(--navy)', border: '1.5px solid var(--border2)', borderRadius: 10, padding: '11px 18px', fontWeight: 700, fontSize: 14 }}>
            <i className="ph ph-tag" />Marcas e categorias
          </Link>
          <Link href="/painel/historico" className="ez-lift" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', color: 'var(--navy)', border: '1.5px solid var(--border2)', borderRadius: 10, padding: '11px 18px', fontWeight: 700, fontSize: 14 }}>
            <i className="ph ph-clock-counter-clockwise" />Histórico
          </Link>
          {isOwner && (
            <Link href="/painel/usuarios" className="ez-lift" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', color: 'var(--navy)', border: '1.5px solid var(--border2)', borderRadius: 10, padding: '11px 18px', fontWeight: 700, fontSize: 14 }}>
              <i className="ph ph-users" />Usuários
            </Link>
          )}
          <form action={signOut}>
            <button type="submit" className="ez-lift" style={{ background: '#fff', color: 'var(--navy)', border: '1.5px solid var(--border2)', borderRadius: 10, padding: '11px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Sair
            </button>
          </form>
        </div>
      </div>

      {sp.saved && (
        <div style={{ background: '#e6f4ec', color: '#1f8a5b', border: '1px solid #cdeadc', borderRadius: 10, padding: '11px 16px', margin: '18px 0', fontSize: 14, fontWeight: 600 }}>
          <i className="ph ph-check-circle" style={{ marginRight: 6 }} />Produto salvo com sucesso.
        </div>
      )}
      {sp.deleted && (
        <div style={{ background: '#e6f4ec', color: '#1f8a5b', border: '1px solid #cdeadc', borderRadius: 10, padding: '11px 16px', margin: '18px 0', fontSize: 14, fontWeight: 600 }}>
          <i className="ph ph-check-circle" style={{ marginRight: 6 }} />Produto removido.
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginTop: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 720 }}>
            <thead>
              <tr style={{ background: 'var(--bg)', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)' }}>Produto</th>
                <th style={{ padding: '12px 16px', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)' }}>Categoria</th>
                <th style={{ padding: '12px 16px', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)' }}>Marca</th>
                <th style={{ padding: '12px 16px', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)', textAlign: 'right' }}>Estoque</th>
                <th style={{ padding: '12px 16px', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)' }}>Status</th>
                <th style={{ padding: '12px 16px' }} />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const b = badge[p.stock];
                return (
                  <tr key={p.slug} style={{ borderTop: '1px solid #f1f4f8' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{p.name}</div>
                      <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>{p.code}</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text)' }}>{p.cat}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text)' }}>{p.brand}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--navy)' }}>{p.stockQty}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: b.bg, color: b.fg, fontSize: 11.5, fontWeight: 600, padding: '4px 10px', borderRadius: 100 }}>{b.label}</span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <Link href={`/painel/produtos/${p.slug}`} className="ez-lift" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--navy)', fontWeight: 700, fontSize: 13.5, border: '1.5px solid var(--border)', borderRadius: 8, padding: '7px 14px' }}>
                        Editar <i className="ph ph-pencil-simple" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>Nenhum produto cadastrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
