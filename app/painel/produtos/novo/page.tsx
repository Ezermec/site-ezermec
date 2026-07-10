import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getBrands, getCategories } from '@/lib/data';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata = { title: 'Novo produto — Painel Ezermec' };
export const dynamic = 'force-dynamic';

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/painel/login');

  const sp = await searchParams;
  const [brands, categories] = await Promise.all([getBrands(), getCategories()]);

  return (
    <main className="container" style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 860 }}>
      <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
        <Link href="/painel" style={{ color: 'var(--muted)' }}>Painel</Link>
        <i className="ph ph-caret-right" style={{ fontSize: 12 }} /><span style={{ color: 'var(--navy)' }}>Novo produto</span>
      </div>
      <h1 style={{ fontSize: 'clamp(22px,2.6vw,28px)', fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 24px' }}>Novo produto</h1>

      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
        <ProductForm brands={brands} categories={categories} error={sp.error} />
      </div>
    </main>
  );
}
