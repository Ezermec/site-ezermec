import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAdminUsers } from '@/lib/data';
import { createAdminUser, updateUserName } from '../actions';
import { ConfirmDeleteUserButton } from '@/components/admin/ConfirmDeleteUserButton';

export const metadata = { title: 'Usuários — Painel Ezermec' };
export const dynamic = 'force-dynamic';

const input = { border: '1px solid var(--border)', borderRadius: 9, padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', color: 'var(--navy)', background: '#fff' };

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date(iso));
}

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/painel/login');

  const sp = await searchParams;
  const { users, error: listError } = await getAdminUsers();

  if (listError) {
    return (
      <main className="container" style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 720 }}>
        <div style={{ background: '#fbe9e7', color: '#c0392b', border: '1px solid #f5c6c0', borderRadius: 12, padding: 20, fontSize: 14.5 }}>
          <i className="ph ph-lock-key" style={{ marginRight: 8 }} />
          {listError.includes('administrador principal') ? 'Esta área é restrita ao administrador principal.' : listError}
        </div>
        <Link href="/painel" className="ez-lift" style={{ display: 'inline-flex', marginTop: 18, color: 'var(--navy)', fontWeight: 700, fontSize: 14 }}>← Voltar ao painel</Link>
      </main>
    );
  }

  return (
    <main className="container" style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 820 }}>
      <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
        <Link href="/painel" style={{ color: 'var(--muted)' }}>Painel</Link>
        <i className="ph ph-caret-right" style={{ fontSize: 12 }} /><span style={{ color: 'var(--navy)' }}>Usuários</span>
      </div>
      <h1 style={{ fontSize: 'clamp(22px,2.6vw,28px)', fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 6px' }}>Usuários do painel</h1>
      <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '0 0 20px' }}>Somente o administrador principal pode gerenciar outros usuários.</p>

      {sp.saved && <Flash ok>Alteração salva.</Flash>}
      {sp.deleted && <Flash ok>Usuário removido.</Flash>}
      {sp.error && <Flash>{sp.error}</Flash>}

      {/* NOVO USUÁRIO */}
      <section style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 22, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 14px' }}>Adicionar usuário</h2>
        <form action={createAdminUser} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--navy)', marginBottom: 5 }}>Nome</label>
            <input name="name" required style={{ ...input, width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--navy)', marginBottom: 5 }}>E-mail</label>
            <input name="email" type="email" required style={{ ...input, width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--navy)', marginBottom: 5 }}>Senha (mín. 6 caracteres)</label>
            <input name="password" type="password" required minLength={6} style={{ ...input, width: '100%' }} />
          </div>
          <button type="submit" className="ez-lift" style={{ background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 9, padding: '11px 16px', fontWeight: 700, fontSize: 14, cursor: 'pointer', height: 42 }}>
            Criar usuário
          </button>
        </form>
      </section>

      {/* LISTA */}
      <section style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 640 }}>
            <thead>
              <tr style={{ background: 'var(--bg)', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontSize: 11.5, textTransform: 'uppercase', color: 'var(--muted)' }}>Nome</th>
                <th style={{ padding: '12px 16px', fontSize: 11.5, textTransform: 'uppercase', color: 'var(--muted)' }}>E-mail</th>
                <th style={{ padding: '12px 16px', fontSize: 11.5, textTransform: 'uppercase', color: 'var(--muted)' }}>Papel</th>
                <th style={{ padding: '12px 16px', fontSize: 11.5, textTransform: 'uppercase', color: 'var(--muted)' }}>Último acesso</th>
                <th style={{ padding: '12px 16px' }} />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderTop: '1px solid #f1f4f8' }}>
                  <td style={{ padding: '10px 16px' }}>
                    <form action={updateUserName} style={{ display: 'flex', gap: 6 }}>
                      <input type="hidden" name="id" value={u.id} />
                      <input name="name" defaultValue={u.name ?? ''} placeholder="Sem nome" style={{ ...input, padding: '7px 10px', fontSize: 13.5, width: 150 }} />
                      <button type="submit" title="Salvar nome" style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--navy)', cursor: 'pointer', padding: '0 10px' }}><i className="ph ph-check" /></button>
                    </form>
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--text)' }}>{u.email}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 100, background: u.role === 'owner' ? '#fdede1' : '#e6f4ec', color: u.role === 'owner' ? 'var(--orange)' : '#1f8a5b' }}>
                      {u.role === 'owner' ? 'Principal' : 'Admin'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--muted)', fontSize: 13 }}>{fmtDate(u.lastSignInAt)}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                    {u.role !== 'owner' && <ConfirmDeleteUserButton id={u.id} label={u.name || u.email} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Flash({ children, ok }: { children: React.ReactNode; ok?: boolean }) {
  return (
    <div style={{
      background: ok ? '#e6f4ec' : '#fbe9e7',
      color: ok ? '#1f8a5b' : '#c0392b',
      border: `1px solid ${ok ? '#cdeadc' : '#f5c6c0'}`,
      borderRadius: 10, padding: '11px 16px', marginBottom: 18, fontSize: 14, fontWeight: 600,
    }}>
      <i className={`ph ${ok ? 'ph-check-circle' : 'ph-warning-circle'}`} style={{ marginRight: 6 }} />{children}
    </div>
  );
}
