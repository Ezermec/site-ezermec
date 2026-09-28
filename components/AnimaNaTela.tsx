'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Embrulha ilustrações animadas (SVG com SMIL) para que elas comecem do zero
 * quando aparecem na tela — e não no meio, por terem rodado desde que a página
 * abriu — e fiquem paradas enquanto estão fora dela. Todas as ilustrações de
 * dentro recomeçam juntas, então as que têm o mesmo ciclo rodam em sincronia.
 */
export function AnimaNaTela({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const svgs = () => Array.from(el.querySelectorAll<SVGSVGElement>('svg'));
    let jaViu = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) {
          for (const svg of svgs()) svg.pauseAnimations();
          return;
        }
        for (const svg of svgs()) {
          if (!jaViu) svg.setCurrentTime(0);
          svg.unpauseAnimations();
        }
        jaViu = true;
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
