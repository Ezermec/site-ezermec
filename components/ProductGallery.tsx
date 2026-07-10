'use client';

import { useState } from 'react';
import type { StockStatus } from '@/lib/types';
import { productImageUrl } from '@/lib/storage';
import { StockBadge } from './StockBadge';

const HATCH = 'repeating-linear-gradient(135deg,#f1f5fa,#f1f5fa 11px,#e8edf3 11px,#e8edf3 22px)';

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
      <div style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', background: hasImages ? '#fff' : HATCH, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={productImageUrl(current)} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <i className={`ph ${icon}`} style={{ fontSize: 96, color: 'rgba(5,40,87,.13)' }} />
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
