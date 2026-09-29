import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import css from './cabecalho-pagina.module.css';

export interface Passo {
  nome: string;
  href?: string;
}

/** Trilha de navegação ("Início › Catálogo › …"). O último passo é a página atual. */
export function Trilha({ passos }: { passos: Passo[] }) {
  return (
    <nav className={css.trilha} aria-label="Você está em">
      {passos.map((p, i) => (
        <Fragment key={`${p.nome}-${i}`}>
          {i > 0 && <i className="ph ph-caret-right" aria-hidden="true" />}
          {p.href ? <Link href={p.href}>{p.nome}</Link> : <span aria-current="page">{p.nome}</span>}
        </Fragment>
      ))}
    </nav>
  );
}

/**
 * Topo das páginas internas: trilha, olho, título e uma frase. O que vier em
 * `children` (uma busca, botões) aparece logo abaixo do texto.
 */
export function CabecalhoPagina({
  passos,
  olho,
  titulo,
  texto,
  children,
}: {
  passos: Passo[];
  olho?: string;
  titulo: ReactNode;
  texto?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className={css.topo}>
      <div className="container">
        <Trilha passos={passos} />
        {olho && <span className={`eyebrow ${css.olho}`}>{olho}</span>}
        <h1 className={css.titulo}>{titulo}</h1>
        {texto && <p className={css.texto}>{texto}</p>}
        {children && <div className={css.extra}>{children}</div>}
      </div>
    </header>
  );
}
