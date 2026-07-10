export function ImageSlot({ placeholder }: { placeholder: string }) {
  return (
    <div className="hslot">
      <i className="ph ph-image" style={{ fontSize: 38 }} />
      <span className="mono" style={{ fontSize: 12, lineHeight: 1.4, maxWidth: '80%' }}>
        {placeholder}
      </span>
    </div>
  );
}
