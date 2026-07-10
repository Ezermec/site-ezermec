const RATIO = 985 / 329; // proporção real do ícone (montanhas)

export function Logo({
  variant = 'color',
  height = 40,
  textColor,
}: {
  variant?: 'color' | 'white';
  height?: number;
  textColor?: string;
}) {
  const src = variant === 'white' ? '/assets/logo-ezermec-icon-white.png' : '/assets/logo-ezermec-icon.png';
  const color = textColor ?? (variant === 'white' ? '#fff' : 'var(--navy)');
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: height * 0.22 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        style={{ height, width: height * RATIO, display: 'block' }}
      />
      <span
        style={{
          fontWeight: 800,
          fontSize: height * 0.66,
          lineHeight: 1,
          letterSpacing: '-.01em',
          color,
        }}
      >
        Ezermec
      </span>
    </span>
  );
}
