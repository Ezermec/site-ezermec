import Link from 'next/link';
import type { Product } from '@/lib/types';
import { productImageUrl } from '@/lib/storage';
import { StockBadge } from './StockBadge';

type Variant = 'home' | 'catalog' | 'related';

export function ProductCard({ product: p, variant = 'home' }: { product: Product; variant?: Variant }) {
  const iconSize = variant === 'related' ? 56 : 64;
  const cover = p.images[0];
  return (
    <Link href={`/produto/${p.slug}`} className="pcard ez-card-h">
      <div className="pcard-img" style={cover ? { background: '#fff' } : undefined}>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={productImageUrl(cover)} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <i className={`ph ${p.icon}`} style={{ fontSize: iconSize, color: 'rgba(5,40,87,.13)' }} />
        )}
        <span className="pcard-code">{p.code}</span>
        {variant !== 'related' && <StockBadge stock={p.stock} />}
      </div>
      <div style={{ padding: variant === 'related' ? 15 : 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
        {variant === 'catalog' ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{p.brand}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{p.cat}</span>
          </div>
        ) : (
          <span className="mono" style={{ fontSize: 11, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{p.brand}</span>
        )}
        <span style={{ fontWeight: 700, fontSize: variant === 'related' ? 15 : 15.5, lineHeight: 1.3, color: 'var(--navy)', margin: '5px 0 0', flex: variant === 'related' ? 1 : undefined }}>
          {p.name}
        </span>
        {variant !== 'related' && (
          <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.45, margin: '7px 0 0', flex: 1 }}>{p.short}</span>
        )}
        {variant === 'catalog' ? (
          <span className="ez-lift" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, color: 'var(--navy)', fontWeight: 700, fontSize: 14, marginTop: 14, border: '1.5px solid var(--border)', borderRadius: 10, padding: 10 }}>
            Ver detalhes <i className="ph ph-arrow-right" />
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--navy)', fontWeight: 700, fontSize: variant === 'related' ? 13.5 : 14, marginTop: variant === 'related' ? 12 : 14 }}>
            Ver detalhes <i className="ph ph-arrow-right" />
          </span>
        )}
      </div>
    </Link>
  );
}
