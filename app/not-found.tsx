import Link from 'next/link';
import { site } from '@/lib/config';
import css from './not-found.module.css';

// Quem cai num endereço que não existe ganha três caminhos claros, em vez de
// um beco sem saída.
const CAMINHOS = [
  { href: '/catalogo', icon: 'ph-package', titulo: 'Catálogo de peças', texto: 'Encontre a peça pelo nome ou pelo código' },
  { href: '/ezermec-cad', icon: 'ph-desktop', titulo: 'Ezermec CAD', texto: 'O programa que desenha as costuras da Fischertec' },
];

export default function NotFound() {
  return (
    <main className={`ez-fade ${css.pagina}`}>
      <div className={`container ${css.caixa}`}>
        <span className={css.codigo}>Erro 404</span>
        <h1>Esta página não existe</h1>
        <p>O endereço pode ter mudado ou estar digitado errado. Veja por onde seguir:</p>

        <ul className={css.caminhos}>
          {CAMINHOS.map((c) => (
            <li key={c.href}>
              <Link href={c.href}>
                <span className={css.icone}><i className={`ph ${c.icon}`} aria-hidden="true" /></span>
                <span>
                  <strong>{c.titulo}</strong>
                  <small>{c.texto}</small>
                </span>
                <i className="ph ph-arrow-right" aria-hidden="true" />
              </Link>
            </li>
          ))}
          <li>
            <a href={site.waHref} target="_blank" rel="noopener">
              <span className={`${css.icone} ${css.iconeWhats}`}><i className="ph-fill ph-whatsapp-logo" aria-hidden="true" /></span>
              <span>
                <strong>Falar no WhatsApp</strong>
                <small>A gente ajuda a achar o que você procura</small>
              </span>
              <i className="ph ph-arrow-right" aria-hidden="true" />
            </a>
          </li>
        </ul>

        <Link href="/" className={`btn btn-navy ez-lift ${css.inicio}`}>
          <i className="ph ph-house" />Voltar ao início
        </Link>
      </div>
    </main>
  );
}
