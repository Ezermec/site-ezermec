'use client';

import { useState } from 'react';
import type { StockStatus } from '@/lib/types';
import { productImageUrl } from '@/lib/storage';
import { StockBadge } from './StockBadge';

export function ProductGallery({
  images,
  name,
  icon,
  stock,
}: {
  images: string[];
  name: string;
  icon: string;
  stock: StockStatus;
}) {
  const [selected, setSelected] = useState(0);
  const hasImages = images.length > 0;
  const current = hasImages ? images[Math.min(selected, images.length - 1)] : null;

  return (
    <div>
      {/* Sem foto, o fundo e o ícone num círculo são os mesmos dos cartões
          (.pcard-img / .pcard-icone), para a peça não parecer "sem imagem". */}
      <div
        className={hasImages ? undefined : 'pcard-img'}
        style={{
          position: 'relative', aspectRatio: '1/1', borderRadius: 22, overflow: 'hidden',
          border: '1px solid var(--border)', background: hasImages ? '#fff' : undefined,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={productImageUrl(current)} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <span className="pcard-icone" style={{ width: '38%' }}>
            <i className={`ph ${icon}`} style={{ fontSize: 88 }} />
          </span>
        )}
        <StockBadge stock={stock} big />
      </div>

      {images.length > 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(72px,1fr))', gap: 10, marginTop: 12 }}>
          {images.map((path, i) => (
            <button
              key={path}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Foto ${i + 1}`}
              aria-pressed={i === selected}
              style={{ aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden', border: `2px solid ${i === selected ? 'var(--orange)' : 'var(--border)'}`, padding: 0, cursor: 'pointer', background: '#fff' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={productImageUrl(path)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
