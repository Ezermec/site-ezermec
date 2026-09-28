'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import css from './cad.module.css';

interface Lado {
  rotulo: string;
  conta: string;
  arte: ReactNode;
}

/** Todas as ilustrações (svg) dentro do elemento. */
function artes(el: HTMLElement | null) {
  return el ? Array.from(el.querySelectorAll<SVGSVGElement>('figure > svg')) : [];
}

/** Roda as animações de novo, do começo. */
function recomecar(el: HTMLElement | null) {
  for (const svg of artes(el)) {
    svg.setCurrentTime(0);
    svg.unpauseAnimations();
  }
}

/**
 * O antes e depois do Interligar, rodando lado a lado como uma corrida.
 * As duas animações começam juntas do zero quando a seção aparece na tela e
 * ficam paradas enquanto ela está fora. O botão do meio é o do programa:
 * clicar nele roda a corrida de novo.
 */
export default function InterligarDemo({ antes, depois }: { antes: Lado; depois: Lado }) {
  const palco = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = palco.current;
    if (!el) return;
    let jaViu = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) {
          for (const svg of artes(el)) svg.pauseAnimations();
        } else if (!jaViu) {
          jaViu = true;
          recomecar(el);
        } else {
          for (const svg of artes(el)) svg.unpauseAnimations();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={css.antesDepois} ref={palco}>
      <figure className={`${css.quadro} ${css.quadroAntes}`}>
        {antes.arte}
        <figcaption>
          <strong>{antes.rotulo}</strong>
          <span>{antes.conta}</span>
        </figcaption>
      </figure>

      <div className={css.clique}>
        <button
          type="button"
          className={css.cliqueBotao}
          onClick={() => recomecar(palco.current)}
          title="Clique para ver de novo"
          aria-label="Interligar: ver a animação de novo"
        >
          Interligar
          <i className="ph-fill ph-cursor" aria-hidden="true" />
        </button>
        <span className={css.cliqueTexto} aria-hidden="true">1 clique</span>
      </div>

      <figure className={`${css.quadro} ${css.quadroDepois}`}>
        {depois.arte}
        <figcaption>
          <strong>{depois.rotulo}</strong>
          <span>{depois.conta}</span>
        </figcaption>
      </figure>
    </div>
  );
}
