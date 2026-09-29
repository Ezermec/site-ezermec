import Link from 'next/link';
import { site } from '@/lib/config';
import { SLOGAN } from '@/lib/content';
import { Logo } from './Logo';
import css from './footer.module.css';

// O rodapé segue as frentes da Ezermec: peças, software e a empresa. Não lista
// categorias pelo nome porque elas vêm do banco e mudam pelo painel.
export function Footer() {
  return (
    <footer className={css.rodape}>
      <div className={`container ${css.grade}`}>
        <div className={css.marca}>
          <Logo variant="white" height={40} />
          <p>{SLOGAN}</p>
          <span className={css.selo}>
            <i className="ph-fill ph-seal-check" aria-hidden="true" />Revenda autorizada Fischertec
          </span>
        </div>

        <nav className={css.coluna} aria-label="Peças">
          <span className={css.titulo}>Peças</span>
          <Link href="/catalogo">Catálogo de peças</Link>
          <Link href="/#categorias">Categorias</Link>
          <a href={site.waHref} target="_blank" rel="noopener">Pedir orçamento</a>
        </nav>

        <nav className={css.coluna} aria-label="Software">
          <span className={css.titulo}>Software</span>
          <Link href="/ezermec-cad">Ezermec CAD</Link>
          <Link href="/ezermec-cad#planos">Planos e preços</Link>
          <Link href="/ezermec-cad#perguntas">Perguntas frequentes</Link>
        </nav>

        <nav className={css.coluna} aria-label="Empresa">
          <span className={css.titulo}>Empresa</span>
          <Link href="/sobre">Sobre a Ezermec</Link>
          <Link href="/#contato">Contato</Link>
        </nav>

        <div className={`${css.coluna} ${css.atendimento}`}>
          <span className={css.titulo}>Atendimento</span>
          <a href={site.waHref} target="_blank" rel="noopener">
            <i className={`ph-fill ph-whatsapp-logo ${css.whats}`} aria-hidden="true" />Chamar no WhatsApp
          </a>
          <a href={site.telHref}>
            <i className="ph ph-phone" aria-hidden="true" />{site.phoneDisplay}
          </a>
          <a href={site.mailGeneral}>
            <i className="ph ph-envelope-simple" aria-hidden="true" />{site.email}
          </a>
          <span>
            <i className="ph ph-map-pin" aria-hidden="true" />{site.cidade}
          </span>
          <span>
            <i className="ph ph-clock" aria-hidden="true" />
            <span>
              {site.horario.map((h) => <span key={h} className={css.linha}>{h}</span>)}
            </span>
          </span>
        </div>
      </div>

      <div className={css.base}>
        <div className={`container ${css.baseLinha}`}>
          <span>© 2026 Ezermec. Todos os direitos reservados.</span>
          <Link href="/painel" className={css.restrita}>
            <i className="ph ph-lock-key" aria-hidden="true" />Área restrita
          </Link>
        </div>
      </div>
    </footer>
  );
}
