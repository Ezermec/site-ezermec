'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import css from './cad.module.css';

interface Passo {
  titulo: string;
  texto: string;
  /** Tempo do passo na tela, em segundos: o ciclo da animação dele. */
  duracao: number;
}

/**
 * "Como funciona": uma tela grande com a animação do passo e a lista dos
 * quatro passos ao lado. Enquanto a seção está na tela os passos avançam
 * sozinhos, cada um o tempo de a sua animação rodar uma vez. Clicar num passo
 * mostra ele e para o avanço. Quem prefere menos movimento escolhe o passo:
 * nada avança sozinho.
 */
export default function Passos({ passos, artes }: { passos: Passo[]; artes: ReactNode[] }) {
  const [ativo, setAtivo] = useState(0);
  const [auto, setAuto] = useState(true);
  const [visivel, setVisivel] = useState(false);
  // muda quando o passo precisa recomeçar do zero (a seção voltou à tela, ou o
  // visitante clicou nele)
  const [rodada, setRodada] = useState(0);
  const palco = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAuto(false);
  }, []);

  useEffect(() => {
    const el = palco.current;
    if (!el) return;
    let naTela = false;
    const io = new IntersectionObserver(
      ([e]) => {
        // só conta a entrada e a saída; outros avisos (como mudar o tamanho
        // da janela) não recomeçam o passo
        if (e.isIntersecting === naTela) return;
        naTela = e.isIntersecting;
        setVisivel(naTela);
        if (naTela) setRodada((r) => r + 1);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // A animação do passo ativo começa do zero; as outras ficam paradas.
  useEffect(() => {
    const svgs = palco.current?.querySelectorAll<SVGSVGElement>('[data-arte] > svg') ?? [];
    svgs.forEach((svg, i) => {
      if (i === ativo && visivel) {
        svg.setCurrentTime(0);
        svg.unpauseAnimations();
      } else {
        svg.pauseAnimations();
      }
    });
  }, [ativo, visivel, rodada]);

  // Quando a animação do passo termina, vai para o próximo.
  useEffect(() => {
    if (!auto || !visivel) return;
    const t = window.setTimeout(
      () => setAtivo((a) => (a + 1) % passos.length),
      passos[ativo].duracao * 1000,
    );
    return () => window.clearTimeout(t);
  }, [auto, visivel, ativo, rodada, passos]);

  function escolher(i: number) {
    setAuto(false);
    setAtivo(i);
    setRodada((r) => r + 1);
  }

  return (
    <div className={css.palco} ref={palco}>
      <div className={css.palcoTela}>
        {artes.map((arte, i) => (
          <div
            key={passos[i].titulo}
            data-arte=""
            data-ativo={i === ativo ? '' : undefined}
            className={css.palcoArte}
            aria-hidden={i !== ativo}
          >
            {arte}
          </div>
        ))}
      </div>

      <ol className={css.palcoPassos}>
        {passos.map((p, i) => (
          <li key={p.titulo}>
            <button
              type="button"
              className={css.palcoPasso}
              aria-current={i === ativo ? 'step' : undefined}
              onClick={() => escolher(i)}
            >
              <span className={css.palcoN}>{i + 1}</span>
              <span className={css.palcoTexto}>
                <strong>{p.titulo}</strong>
                <span>{p.texto}</span>
              </span>
              {auto && i === ativo && (
                <span
                  key={rodada}
                  className={css.palcoBarra}
                  style={{ animationDuration: `${p.duracao}s` }}
                  aria-hidden="true"
                />
              )}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
