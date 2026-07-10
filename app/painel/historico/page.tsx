import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAuditLog } from '@/lib/data';
import type { AuditAction } from '@/lib/types';

export const metadata = { title: 'Histórico — Painel Ezermec' };
export const dynamic = 'force-dynamic';

const PER_PAGE = 50;

const ACTION_LABEL: Record<AuditAction, { label: string; bg: string; fg: string; icon: string }> = {
  insert: { label: 'Criado', bg: '#e6f4ec', fg: '#1f8a5b', icon: 'ph-plus-circle' },
  update: { label: 'Atualizado', bg: '#dce7f4', fg: 'var(--navy)', icon: 'ph-pencil-simple' },
  delete: { label: 'Removido', bg: '#fbe9e7', fg: '#c0392b', icon: 'ph-trash' },
};

const TABLE_LABEL: Record<string, string> = {
  products: 'Produto',
  brands: 'Marca',
  categories: 'Categoria',
};

// Campos técnicos que não interessam mostrar no histórico (ids, timestamps, status derivado).
const HIDDEN_FIELDS = new Set(['id', 'created_at', 'updated_at', 'stock_status', 'slug']);

const FIELD_LABEL: Record<string, string> = {
  name: 'Nome', code: 'Código', fab: 'Cód. fabricante', brand: 'Marca', cat: 'Categoria',
  icon: 'Ícone', weight: 'Peso', dims: 'Dimensões', material: 'Material', short: 'Descrição curta',
  full_description: 'Descrição completa', tags: 'Tags', images: 'Imagens',
  stock_quantity: 'Estoque', low_stock_threshold: 'Limite estoque baixo', featured: 'Destaque', position: 'Posição',
};

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'America/Sao_Paulo' }).format(new Date(iso));
}

function fmtValue(v: unknown): string {
  if (v === null || v === undefined || v === '') return '—';
  if (Array.isArray(v)) return v.length ? v.join(', ') : '—';
  if (typeof v === 'boolean') return v ? 'sim' : 'não';
  return String(v);
}

export default async function HistoricoPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/painel/login');

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const entries = await getAuditLog(PER_PAGE, (page - 1) * PER_PAGE);

  return (
    <main className="container" style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 900 }}>
      <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
        <Link href="/painel" style={{ color: 'var(--muted)' }}>Painel</Link>
        <i className="ph ph-caret-right" style={{ fontSize: 12 }} /><span style={{ color: 'var(--navy)' }}>Histórico</span>
      </div>
      <h1 style={{ fontSize: 'clamp(22px,2.6vw,28px)', fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 6px' }}>Histórico de alterações</h1>
      <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '0 0 24px' }}>Quem alterou, o quê e quando — produtos, marcas e categorias.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {entries.map((e) => {
          const a = ACTION_LABEL[e.action];
          const changes = e.changes && e.action === 'update' ? Object.entries(e.changes).filter(([k]) => !HIDDEN_FIELDS.has(k)) : [];
          return (
            <div key={e.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 100, background: a.bg, color: a.fg }}>
                  <i className={`ph ${a.icon}`} />{a.label}
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>{TABLE_LABEL[e.tableName] || e.tableName}</span>
                <strong style={{ fontSize: 14.5, color: 'var(--navy)' }}>{e.recordLabel || '—'}</strong>
                <span style={{ flex: 1 }} />
                <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{fmtDate(e.createdAt)}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text)', marginTop: 6 }}>
                <i className="ph ph-user" style={{ marginRight: 5 }} />
                {e.actorName || e.actorEmail || 'Sistema'}
              </div>
              {changes.length > 0 && (
                <div style={{ marginTop: 10, borderTop: '1px solid #f1f4f8', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {changes.map(([field, diff]) => {
                    const d = diff as { old: unknown; new: unknown };
                    return (
                      <div key={field} style={{ fontSize: 13, color: 'var(--text)' }}>
                        <strong style={{ color: 'var(--navy)' }}>{FIELD_LABEL[field] || field}:</strong>{' '}
                        <span style={{ textDecoration: 'line-through', color: 'var(--muted)' }}>{fmtValue(d.old)}</span>
                        {' → '}
                        <span>{fmtValue(d.new)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {entries.length === 0 && (
          <div style={{ textAlign: 'center', padding: 50, color: 'var(--muted)', background: '#fff', border: '1px dashed var(--border2)', borderRadius: 14 }}>
            {page === 1 ? 'Nenhuma alteração registrada ainda.' : 'Não há mais registros.'}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 26 }}>
        {page > 1 && (
          <Link href={`/painel/historico?page=${page - 1}`} className="ez-lift" style={{ background: '#fff', color: 'var(--navy)', border: '1.5px solid var(--border2)', borderRadius: 9, padding: '9px 18px', fontWeight: 700, fontSize: 13.5 }}>← Mais recentes</Link>
        )}
        {entries.length === PER_PAGE && (
          <Link href={`/painel/historico?page=${page + 1}`} className="ez-lift" style={{ background: '#fff', color: 'var(--navy)', border: '1.5px solid var(--border2)', borderRadius: 9, padding: '9px 18px', fontWeight: 700, fontSize: 13.5 }}>Mais antigas →</Link>
        )}
      </div>
    </main>
  );
}
