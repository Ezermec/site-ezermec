'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState('');

  function submit() {
    router.push(q.trim() ? `/catalogo?q=${encodeURIComponent(q.trim())}` : '/catalogo');
  }

  return (
    <div className="hero-search" style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 14, padding: 5, margin: '28px 0 0', maxWidth: 520, boxShadow: '0 10px 30px -18px rgba(5,40,87,.3)' }}>
      <span style={{ padding: '0 6px 0 14px', color: 'var(--muted)', fontSize: 20, display: 'flex' }}><i className="ph ph-magnifying-glass" /></span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        placeholder="Busque por peça ou código…"
        aria-label="Buscar produtos"
        style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '12px 4px', fontSize: 15.5, color: 'var(--navy)', fontFamily: 'var(--font-archivo), sans-serif' }}
      />
      <button onClick={submit} className="ez-lift" style={{ border: 'none', background: 'var(--orange)', color: '#fff', borderRadius: 10, padding: '11px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Buscar</button>
    </div>
  );
}
