import Image from 'next/image';

export function ImageSlot({ placeholder, src }: { placeholder: string; src?: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={placeholder}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: 'cover' }}
        priority
      />
    );
  }

  return (
    <div className="hslot">
      <i className="ph ph-image" style={{ fontSize: 38 }} />
      <span className="mono" style={{ fontSize: 12, lineHeight: 1.4, maxWidth: '80%' }}>
        {placeholder}
      </span>
    </div>
  );
}
