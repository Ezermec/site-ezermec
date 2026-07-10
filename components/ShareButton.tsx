'use client';

import { useState } from 'react';

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Ezermec', url });
        return;
      }
      if (navigator.clipboard) await navigator.clipboard.writeText(url);
    } catch {
      /* usuário cancelou ou API indisponível */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2600);
  }

  return (
    <>
      <button onClick={share} className="ez-lift" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', color: 'var(--navy)', border: '1.5px solid var(--border2)', borderRadius: 12, padding: '12px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        <i className="ph ph-share-network" style={{ fontSize: 18 }} />Compartilhar
      </button>
      {copied && (
        <div style={{ position: 'fixed', left: '50%', bottom: 34, transform: 'translateX(-50%)', zIndex: 80, background: 'var(--navy)', color: '#fff', padding: '13px 22px', borderRadius: 100, fontWeight: 600, fontSize: 14, boxShadow: '0 16px 40px -12px rgba(5,40,87,.5)', display: 'flex', alignItems: 'center', gap: 9 }}>
          <i className="ph ph-check-circle" style={{ color: 'var(--green)', fontSize: 18 }} />Link copiado para a área de transferência
        </div>
      )}
    </>
  );
}
