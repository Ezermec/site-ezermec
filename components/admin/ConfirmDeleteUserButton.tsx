'use client';

import { deleteAdminUser } from '@/app/painel/actions';

export function ConfirmDeleteUserButton({ id, label }: { id: string; label: string }) {
  return (
    <form action={deleteAdminUser} onSubmit={(e) => { if (!confirm(`Remover o acesso de "${label}"?`)) e.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" title="Remover" style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: 17, padding: 4, display: 'inline-flex' }}>
        <i className="ph ph-trash" />
      </button>
    </form>
  );
}
