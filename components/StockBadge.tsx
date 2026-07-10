import type { CSSProperties } from 'react';
import type { StockStatus } from '@/lib/types';

const MAP: Record<StockStatus, { cls: string; label: string }> = {
  em: { cls: 'badge-em', label: 'Em estoque' },
  baixo: { cls: 'badge-baixo', label: 'Estoque baixo' },
  sem: { cls: 'badge-sem', label: 'Sem estoque' },
};

export function StockBadge({ stock, big = false }: { stock: StockStatus; big?: boolean }) {
  const { cls, label } = MAP[stock];
  const style: CSSProperties = big
    ? { top: 14, right: 14, fontSize: 12, padding: '6px 12px' }
    : { top: 10, right: 10, fontSize: 11, padding: '4px 9px' };
  return (
    <span className={`badge ${cls}`} style={style}>
      {label}
    </span>
  );
}
