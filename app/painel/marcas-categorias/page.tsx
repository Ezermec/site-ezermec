import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getBrands, getCategories } from '@/lib/data';
import { createBrand, deleteBrand, createCategory, deleteCategory } from '../actions';

export const metadata = { title: 'Marcas e categorias — Painel Ezermec' };
export const dynamic = 'force-dynamic';

const input = { border: '1px solid var(--border)', borderRadius: 9, padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', color: 'var(--navy)', background: '#fff' };

export default async function TaxonomiasPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/painel/login');

  const sp = await searchParams;
  const [brands, categories] = await Promise.all([getBrands(), getCategories()]);

  return (
    <main className="container" style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 980 }}>
      <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
        <Link href="/painel" style={{ color: 'var(--muted)' }}>Painel</Link>
        <i className="ph ph-caret-right" style={{ fontSize: 12 }} /><span style={{ color: 'var(--navy)' }}>Marcas e categorias</span>
      </div>
      <h1 style={{ fontSize: 'clamp(22px,2.6vw,28px)', fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 6px' }}>Marcas e categorias</h1>
      <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '0 0 20px' }}>Estas listas alimentam a seleção no cadastro de produtos.</p>

      {sp.saved && <Flash ok>Item adicionado.</Flash>}
      {sp.deleted && <Flash ok>Item removido.</Flash>}
      {sp.error && <Flash>{sp.error}</Flash>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 24 }}>
        {/* MARCAS */}
        <section style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 14px' }}>Marcas <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 14 }}>({brands.length})</span></h2>
          <form action={createBrand} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input name="name" required placeholder="Nova marca" style={{ ...input, flex: 1 }} />
            <button type="submit" className="ez-lift" style={{ background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 16px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Adicionar</button>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {brands.map((b) => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{b.name}</span>
                <form action={deleteBrand}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="name" value={b.name} />
                  <button type="submit" title="Remover" style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: 17, padding: 4, display: 'flex' }}><i className="ph ph-trash" /></button>
                </form>
              </div>
            ))}
            {brands.length === 0 && <span style={{ color: 'var(--muted)', fontSize: 14 }}>Nenhuma marca cadastrada.</span>}
          </div>
        </section>

        {/* CATEGORIAS */}
        <section style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 14px' }}>Categorias <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 14 }}>({categories.length})</span></h2>
          <form action={createCategory} style={{ display: 'grid', gridTemplateColumns: '1fr 130px auto', gap: 8, marginBottom: 16 }}>
            <input name="name" required placeholder="Nova categoria" style={input} />
            <input name="icon" placeholder="ícone (ph-…)" defaultValue="ph-package" style={input} />
            <button type="submit" className="ez-lift" style={{ background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 16px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Adicionar</button>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {categories.map((c) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, fontSize: 14 }}>
                  <i className={`ph ${c.icon}`} style={{ fontSize: 18, color: 'var(--orange)' }} />{c.name}
                </span>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="name" value={c.name} />
                  <button type="submit" title="Remover" style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: 17, padding: 4, display: 'flex' }}><i className="ph ph-trash" /></button>
                </form>
              </div>
            ))}
            {categories.length === 0 && <span style={{ color: 'var(--muted)', fontSize: 14 }}>Nenhuma categoria cadastrada.</span>}
          </div>
        </section>
      </div>

      <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 18 }}>
        <i className="ph ph-info" style={{ marginRight: 5 }} />Uma marca ou categoria em uso por algum produto não pode ser removida.
      </p>
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
