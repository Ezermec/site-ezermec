import { signIn } from '@/app/painel/actions';

export const metadata = { title: 'Painel — Ezermec' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next || '/painel';

  return (
    <main style={{ minHeight: 'calc(100vh - var(--header-h, 112px) - 260px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
      <div style={{ width: '100%', maxWidth: 380, background: '#fff', border: '1px solid var(--border)', borderRadius: 18, padding: 34, boxShadow: '0 20px 50px -30px rgba(5,40,87,.3)' }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 18 }}>
          <i className="ph ph-lock-key" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--navy)' }}>Painel administrativo</h1>
        <p style={{ fontSize: 14, color: 'var(--text)', margin: '6px 0 24px' }}>Acesso restrito à equipe Ezermec.</p>

        {sp.error && (
          <div style={{ background: '#fbe9e7', color: '#c0392b', border: '1px solid #f5c6c0', borderRadius: 10, padding: '11px 14px', marginBottom: 18, fontSize: 13.5 }}>
            {sp.error}
          </div>
        )}

        <form action={signIn}>
          <input type="hidden" name="next" value={next} />
          <label htmlFor="email" style={{ display: 'block', fontWeight: 700, fontSize: 13, color: 'var(--navy)', marginBottom: 6 }}>E-mail</label>
          <input
            id="email" name="email" type="email" required autoFocus
            style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 9, padding: '11px 13px', fontSize: 14.5, marginBottom: 16 }}
          />
          <label htmlFor="password" style={{ display: 'block', fontWeight: 700, fontSize: 13, color: 'var(--navy)', marginBottom: 6 }}>Senha</label>
          <input
            id="password" name="password" type="password" required
            style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 9, padding: '11px 13px', fontSize: 14.5, marginBottom: 24 }}
          />
          <button type="submit" className="ez-lift" style={{ width: '100%', background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
