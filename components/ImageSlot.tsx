import Image from 'next/image';

// `fit` existe para os prints de tela: recortar um screenshot esconde parte da
// interface, então nesses casos usamos 'contain' em vez do 'cover' das fotos.
export function ImageSlot({
  placeholder,
  src,
  fit = 'cover',
}: {
  placeholder: string;
  src?: string;
  fit?: 'cover' | 'contain';
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={placeholder}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: fit }}
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
