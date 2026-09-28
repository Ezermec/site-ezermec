import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/config';
import { cad, type CadVisual } from '@/lib/cad';
import {
  IlustracaoAcabamento,
  IlustracaoArquivo,
  IlustracaoDesenho,
  IlustracaoSimulacao,
  InterligarAntes,
  InterligarDepois,
} from './Ilustracoes';
import InterligarDemo from './InterligarDemo';
import Passos from './Passos';
import css from './cad.module.css';

export const metadata: Metadata = {
  title: `${cad.name} — desenhos de costura para máquinas Fischertec`,
  description: cad.description,
  // A foto do desenho ao lado do tecido vira a prévia quando o link é
  // compartilhado no WhatsApp — que é por onde o programa é vendido.
  openGraph: {
    title: `${cad.name} — ${cad.tagline}`,
    description: cad.description,
    images: [{ url: cad.capa.src, width: cad.capa.w, height: cad.capa.h, alt: cad.capa.alt }],
  },
};

// O instalador é enviado pela equipe — não existe download direto no site.
const waCad =
  'https://wa.me/' +
  site.whatsappNumber +
  '?text=' +
  encodeURIComponent('Olá! Gostaria de receber o Ezermec CAD.');

function waPlano(titulo: string) {
  return (
    'https://wa.me/' +
    site.whatsappNumber +
    '?text=' +
    encodeURIComponent(`Olá! Tenho interesse no Ezermec CAD, no plano ${titulo}.`)
  );
}

function icon(name: string) {
  return name.startsWith('ph-fill') ? name : `ph ${name}`;
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const VISUAIS: Record<CadVisual, () => React.JSX.Element> = {
  desenho: IlustracaoDesenho,
  acabamento: IlustracaoAcabamento,
  simulacao: IlustracaoSimulacao,
  arquivo: IlustracaoArquivo,
};

export default function EzermecCadPage() {
  const { antes, agora, etapaExtra } = cad.comparacao;
  const { origem, interligar, rapido } = cad;

  return (
    <main className={`ez-fade ${css.page}`}>
      {/* TOPO — o que é, em uma frase, e a foto que mostra o resultado. */}
      <section className={css.hero}>
        <div className={`${css.heroFundo} ${css.grade}`} aria-hidden="true" />
        <div className={`container ${css.heroConteudo}`}>
          <nav className={css.trilha} aria-label="Você está em">
            <Link href="/">Início</Link>
            <i className="ph ph-caret-right" aria-hidden="true" />
            <span>{cad.name}</span>
          </nav>

          <div className={css.heroTexto}>
            <img
              src="/assets/logo-ezermec-cad-escuro.png"
              alt={cad.name}
              width={760}
              height={207}
              className={css.heroLogo}
            />
            <h1 className={css.heroTitulo}>
              {cad.headline[0]} <span>{cad.headline[1]}</span>
            </h1>
            <p className={css.heroLead}>{cad.description}</p>
            <div className={css.heroBotoes}>
              <a href={waCad} target="_blank" rel="noopener" className={`btn btn-orange ez-lift ${css.btnGrande}`}>
                <i className="ph-fill ph-whatsapp-logo" />Solicitar pelo WhatsApp
              </a>
              <a href="#planos" className={`btn ez-lift ${css.btnGrande} ${css.btnVazado}`}>
                Ver planos <i className="ph ph-arrow-down" />
              </a>
            </div>
            <ul className={css.heroChecks}>
              {cad.heroChecks.map((c) => (
                <li key={c}><i className="ph-fill ph-check-circle" />{c}</li>
              ))}
            </ul>
          </div>

          <figure className={css.heroFoto}>
            <Image
              src={cad.capa.src}
              alt={cad.capa.alt}
              width={cad.capa.w}
              height={cad.capa.h}
              sizes="(max-width: 1180px) 100vw, 1120px"
              priority
            />
            <figcaption className={css.fotoEtiquetas}>
              <span className={`${css.etiqueta} ${css.etiquetaCad}`}>
                <b>1</b>
                <span className={css.longo}>Você desenha no {cad.name}</span>
                <span className={css.curto}>Você desenha</span>
              </span>
              <span className={css.divisa} aria-hidden="true"><i className="ph ph-arrow-right" /></span>
              <span className={`${css.etiqueta} ${css.etiquetaTecido}`}>
                <b>2</b>A máquina costura
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* INTERLIGAR — o mesmo desenho costurado sem e com o botão, lado a lado. */}
      <section className={css.section} id="interligar">
        <div className="container">
          <header className={css.head}>
            <span className="eyebrow">Interligar</span>
            <h2>{interligar.titulo}</h2>
          </header>

          <InterligarDemo
            antes={{ ...interligar.antes, arte: <InterligarAntes /> }}
            depois={{ ...interligar.depois, arte: <InterligarDepois /> }}
          />

          <ul className={css.ganhos}>
            {interligar.ganhos.map((g) => (
              <li key={g.texto}><i className={icon(g.icon)} aria-hidden="true" />{g.texto}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* COMO FUNCIONA — os quatro passos numa tela grande, um de cada vez. */}
      <section className={`${css.section} ${css.faixa}`} id="como-funciona">
        <div className="container">
          <header className={css.head}>
            <span className="eyebrow">Como funciona</span>
            <h2>Do desenho à máquina em 4 passos</h2>
          </header>

          <Passos
            passos={cad.steps.map(({ titulo, texto, duracao }) => ({ titulo, texto, duracao }))}
            artes={cad.steps.map((p) => {
              const Visual = VISUAIS[p.visual];
              return <Visual key={p.visual} />;
            })}
          />
        </div>
      </section>

      {/* POR QUE COMPENSA — a etapa do conversor, que o Ezermec CAD elimina. */}
      <section className={css.section} id="vantagens">
        <div className="container">
          <header className={css.head}>
            <span className="eyebrow">Por que compensa</span>
            <h2>Sem conversor NGC.</h2>
          </header>

          <div className={css.comparacao}>
            <div className={css.lado}>
              <div className={css.ladoTopo}>
                <span className={css.ladoNome}>Sem o {cad.name}</span>
                <span className={css.ladoConta}>{antes.length} etapas</span>
              </div>
              <ol className={css.fluxo}>
                {antes.map((etapa, i) => (
                  <li key={etapa} className={i === etapaExtra ? css.fluxoExtra : undefined}>
                    <span className={css.fluxoN}>{i + 1}</span>
                    <span className={css.fluxoTexto}>{etapa}</span>
                    {i === etapaExtra && <em>etapa a mais</em>}
                  </li>
                ))}
              </ol>
            </div>

            <div className={`${css.lado} ${css.ladoNovo}`}>
              <div className={css.ladoTopo}>
                <span className={css.ladoNome}>Com o {cad.name}</span>
                <span className={css.ladoConta}>{agora.length} etapas</span>
              </div>
              <ol className={css.fluxo}>
                {agora.map((etapa, i) => (
                  <li key={etapa}>
                    <span className={css.fluxoN}>{i + 1}</span>
                    <span className={css.fluxoTexto}>{etapa}</span>
                  </li>
                ))}
              </ol>
              <p className={css.ganho}>
                <i className="ph-fill ph-check-circle" />
                O NGC já sai com a configuração da sua máquina.
              </p>
            </div>
          </div>

          {/* Começar do desenho que a empresa já tem. */}
          <div className={css.origem}>
            <div>
              <span className="eyebrow">Do arquivo ou da foto para a máquina</span>
              <h3>{origem.titulo}</h3>
            </div>
            <ul className={css.origemItens}>
              {origem.itens.map((it) => (
                <li key={it.titulo}>
                  <span className={css.origemIcone}><i className={icon(it.icon)} /></span>
                  <div>
                    <strong>{it.titulo}</strong>
                    <span>{it.texto}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PLANOS — e, logo abaixo, as máquinas com que o programa funciona. */}
      <section className={`${css.section} ${css.faixa}`} id="planos">
        <div className="container">
          <header className={css.head}>
            <span className="eyebrow">Planos</span>
            <h2>Escolha o período</h2>
            <p>Todos incluem o aplicativo completo e o suporte da Ezermec.</p>
          </header>

          <div className={css.planos}>
            {cad.plans.map((p) => {
              // O vitalício é pagamento único: não tem "/mês", percentual nem
              // total de período.
              const valor = p.unico ?? p.mensal ?? 0;
              const desconto = p.de && p.mensal ? Math.round((1 - p.mensal / p.de) * 100) : 0;
              const rodape =
                p.unico !== null
                  ? 'Pagamento único, sem mensalidade'
                  : `${brl.format((p.mensal ?? 0) * (p.meses ?? 0))} pelos ${p.meses} meses`;

              return (
                <div key={p.titulo} className={`${css.plano} ${p.destaque ? css.planoDestaque : ''}`}>
                  {p.selo && <span className={css.planoSelo}>{p.selo}</span>}
                  <div className={css.planoPeriodo}>{p.titulo}</div>
                  <div className={css.planoDe}>
                    {p.de ? <>de <s>{brl.format(p.de)}</s>{p.unico === null && '/mês'} por</> : 'valor único'}
                  </div>
                  <div className={css.planoPreco}>
                    <small>R$</small>
                    <strong>{valor.toFixed(2).replace('.', ',')}</strong>
                    {p.unico === null && <span>/mês</span>}
                  </div>
                  <span className={css.planoTag}>{desconto > 0 ? `Economize ${desconto}%` : 'Acesso para sempre'}</span>
                  <div className={css.planoTotal}>{rodape}</div>
                  <a
                    href={waPlano(p.titulo)}
                    target="_blank"
                    rel="noopener"
                    className={`btn ez-lift ${p.destaque ? 'btn-orange' : 'btn-white'} ${css.planoBotao}`}
                  >
                    Contratar
                  </a>
                </div>
              );
            })}
          </div>

          <div className={css.compat}>
            <div>
              <span className="eyebrow">Chega configurado</span>
              <h3>Pronto para a sua Fischertec</h3>
              <p>{cad.compat.texto}</p>
              <p className={css.compatFrase}>
                <i className="ph-fill ph-check-circle" />
                {cad.compat.frase}
              </p>
            </div>
            <div>
              <div className={css.grupoChips}>
                <div className={css.chipsRotulo}>Máquinas</div>
                <ul className={css.chips}>
                  {cad.compat.maquinas.map((m) => (
                    <li key={m}><i className="ph-fill ph-check-circle" />{m}</li>
                  ))}
                </ul>
              </div>
              <div className={css.grupoChips}>
                <div className={css.chipsRotulo}>Para quem faz</div>
                <ul className={css.chips}>
                  {cad.compat.usos.map((u) => <li key={u}>{u}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESENHE MAIS RÁPIDO — cada cartão traz o botão do programa que faz aquilo. */}
      <section className={css.section} id="desenhe-mais-rapido">
        <div className="container">
          <header className={css.head}>
            <span className="eyebrow">{rapido.olho}</span>
            <h2>{rapido.titulo}</h2>
            <p>{rapido.texto}</p>
          </header>

          <ul className={css.rapido}>
            {rapido.itens.map((it) => (
              <li key={it.titulo}>
                <span className={css.ferramenta} style={{ '--gc': it.icone.cor } as CSSProperties}>
                  <svg viewBox="0 0 20 20" aria-hidden="true" dangerouslySetInnerHTML={{ __html: it.icone.svg }} />
                </span>
                <div>
                  <strong>{it.titulo}</strong>
                  <span>{it.texto}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CONHEÇA A TELA — o print real, com marcadores numerados. */}
      <section className={`${css.section} ${css.tela} ${css.grade}`} id="tela">
        <div className="container">
          <header className={`${css.head} ${css.headEscuro}`}>
            <span className="eyebrow">Por dentro do programa</span>
            <h2>Conheça a tela</h2>
            <p>Tudo numa tela só, com os botões organizados por cor.</p>
          </header>

          <div className={css.janela}>
            <div className={css.janelaTitulo}>
              <img src="/assets/cad-icone-escuro.png" alt="" width={131} height={40} />
              {cad.name}
              <span className={css.janelaBotoes} aria-hidden="true">
                <i className="ph ph-minus" />
                <i className="ph ph-square" />
                <i className="ph ph-x" />
              </span>
            </div>
            <div className={css.janelaTela}>
              <div className={css.janelaPrint}>
                <Image
                  src={cad.tela.src}
                  alt={cad.tela.alt}
                  width={cad.tela.w}
                  height={cad.tela.h}
                  sizes="(max-width: 1180px) 100vw, 1120px"
                />
              </div>
              <ol className={css.marcas} aria-hidden="true">
                {cad.tour.map((t, i) => (
                  <li key={t.titulo} style={{ left: `${t.x}%`, top: `${t.y}%` }}>{i + 1}</li>
                ))}
              </ol>
            </div>
          </div>

          <ol className={css.legenda}>
            {cad.tour.map((t, i) => (
              <li key={t.titulo}>
                <span className={css.legendaN}>{i + 1}</span>
                <div>
                  <strong>{t.titulo}</strong>
                  <p>{t.texto}</p>
                  {t.grupos && (
                    <ul className={css.grupos}>
                      {cad.toolGroups.map((g) => (
                        <li key={g.nome} style={{ '--gc': g.cor } as CSSProperties}>{g.nome}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PERGUNTAS — a primeira já vem aberta, porque é a dúvida mais comum. */}
      <section className={css.section} id="perguntas">
        <div className="container">
          <header className={css.head}>
            <span className="eyebrow">Dúvidas</span>
            <h2>Perguntas frequentes</h2>
          </header>
          <div className={css.perguntas}>
            {cad.faq.map((f, i) => (
              <details key={f.q} className={css.pergunta} open={i === 0}>
                <summary>
                  {f.q}
                  <i className="ph ph-plus" aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL */}
      <section className="container" style={{ paddingBottom: 56 }}>
        <div className={css.chamada}>
          <div>
            <h2>Quer usar o {cad.name}?</h2>
            <p>Escolha o plano e chame a gente — o instalador vai pelo WhatsApp.</p>
          </div>
          <div className={css.chamadaBotoes}>
            <a href={waCad} target="_blank" rel="noopener" className={`btn ez-lift ${css.btnBranco}`}>
              <i className="ph-fill ph-whatsapp-logo" />WhatsApp
            </a>
            <a href={site.mailGeneral} className={`btn ez-lift ${css.btnMarinho}`}>
              <i className="ph ph-envelope-simple" />E-mail
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
