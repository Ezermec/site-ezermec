import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/config';
import { cad } from '@/lib/cad';
import { FRENTES, MVV, SLOGAN } from '@/lib/content';
import { Trilha } from '@/components/CabecalhoPagina';
import { Logo } from '@/components/Logo';
import css from './sobre.module.css';

export const metadata: Metadata = {
  title: 'Sobre a empresa',
  description:
    'A Ezermec, de Blumenau (SC), vende peças para máquinas industriais, faz manutenção e assistência técnica, é revenda autorizada Fischertec e desenvolve software, como o Ezermec CAD.',
};

// Os dados da empresa, no cartão ao lado do texto de apresentação.
const FICHA = [
  { icon: 'ph-map-pin', rotulo: 'Onde estamos', texto: site.cidade },
  { icon: 'ph-seal-check', rotulo: 'Revenda autorizada', texto: 'Fischertec' },
  { icon: 'ph-desktop', rotulo: 'Software', texto: `Criadora do ${cad.name}` },
  { icon: 'ph-clock', rotulo: 'Atendimento', texto: site.horario.join(' · ') },
];

export default function SobrePage() {
  return (
    <main className="ez-fade">
      {/* TOPO — quem é a Ezermec, com a ficha da empresa ao lado. */}
      <section className={css.topo}>
        <div className={`container ${css.topoGrade}`}>
          <div>
            <Trilha passos={[{ nome: 'Início', href: '/' }, { nome: 'Sobre' }]} />
            <span className={`eyebrow ${css.olho}`}>Sobre a Ezermec</span>
            <h1 className={css.titulo}>{SLOGAN}</h1>
            <p className={css.texto}>
              A Ezermec vende peças para máquinas industriais e atua em manutenção industrial e
              assistência técnica. Como revenda autorizada Fischertec, une peças originais a um
              atendimento próximo, de quem conhece a máquina.
            </p>
            <p className={css.texto}>
              E agora também faz software: o {cad.name}, o programa que desenha as costuras das
              máquinas Fischertec e gera o arquivo pronto, sem conversor.
            </p>
            <div className={css.botoes}>
              <Link href="/catalogo" className="btn btn-navy ez-lift">
                Ver peças <i className="ph ph-arrow-right" />
              </Link>
              <Link href="/ezermec-cad" className="btn btn-white ez-lift">
                Conhecer o {cad.name}
              </Link>
            </div>
          </div>

          <aside className={css.ficha} aria-label="A Ezermec em resumo">
            <Logo variant="white" height={42} />
            <ul>
              {FICHA.map((f) => (
                <li key={f.rotulo}>
                  <span className={css.fichaIcone}><i className={`ph ${f.icon}`} aria-hidden="true" /></span>
                  <span>
                    <small>{f.rotulo}</small>
                    <strong>{f.texto}</strong>
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* O QUE FAZEMOS — as quatro frentes, com o software levando ao CAD. */}
      <section className={`container ${css.secao}`}>
        <header className={css.cabeca}>
          <span className="eyebrow">O que fazemos</span>
          <h2>Da peça ao software</h2>
          <p>Tudo o que a sua máquina precisa para produzir, com um parceiro só.</p>
        </header>
        <ul className={css.frentes}>
          {FRENTES.map((f) => {
            const software = f.titulo === 'Software';
            return (
              <li key={f.titulo} className={software ? css.frenteSoftware : undefined}>
                <span className={css.frenteIcone}><i className={`ph ${f.icon}`} aria-hidden="true" /></span>
                <strong>{f.titulo}</strong>
                <span>{f.texto}</span>
                {software && (
                  <Link href="/ezermec-cad" className={css.frenteLink}>
                    Conhecer o {cad.name} <i className="ph ph-arrow-right" />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* MISSÃO, VISÃO E VALORES */}
      <section className={css.principios}>
        <div className="container">
          <header className={`${css.cabeca} ${css.cabecaEscura}`}>
            <span className="eyebrow">Nossos princípios</span>
            <h2>Missão, visão e valores</h2>
          </header>
          <ul className={css.mvv}>
            {MVV.map((m) => (
              <li key={m.titulo}>
                <i className={`ph ${m.icon}`} aria-hidden="true" />
                <strong>{m.titulo}</strong>
                <span>{m.texto}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CONTATO */}
      <section className={`container ${css.contato}`}>
        <div className={css.chamada}>
          <div>
            <h2>Vamos manter a sua produção em movimento?</h2>
            <p>Fale com a nossa equipe e peça um orçamento sem compromisso.</p>
          </div>
          <div className={css.chamadaBotoes}>
            <a href={site.waHref} target="_blank" rel="noopener" className={`btn ez-lift ${css.btnBranco}`}>
              <i className="ph-fill ph-whatsapp-logo" />Chamar no WhatsApp
            </a>
            <a href={site.mailGeneral} className={`btn ez-lift ${css.btnMarinho}`}>
              <i className="ph ph-envelope-simple" />Enviar e-mail
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
