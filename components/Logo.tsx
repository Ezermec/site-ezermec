const RATIO = 1083 / 508; // proporção real do logo (ícone + wordmark)

export function Logo({
  variant = 'color',
  height = 40,
}: {
  variant?: 'color' | 'white';
  height?: number;
}) {
  const src = variant === 'white' ? '/assets/logo-ezermec-full-white.png' : '/assets/logo-ezermec-full.png';
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="Ezermec" style={{ height, width: height * RATIO, display: 'block' }} />
  );
}
