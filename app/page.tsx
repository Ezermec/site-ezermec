import Image from 'next/image';
import Link from 'next/link';
import { getProducts, getFeatured, getCategories } from '@/lib/data';
import { DIFERENCIAIS } from '@/lib/content';
import { cad } from '@/lib/cad';
import { site } from '@/lib/config';
import { AnimaNaTela } from '@/components/AnimaNaTela';
import { ProductCard } from '@/components/ProductCard';
import { InterligarAntes, InterligarDepois } from './ezermec-cad/Ilustracoes';
import css from './home.module.css';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// A menor mensalidade do Ezermec CAD, para a chamada "planos a partir de".
const cadAPartir = Math.min(...cad.plans.flatMap((p) => (p.mensal ? [p.mensal] : [])));

const linkCategoria = (nome: string) => `/catalogo?cat=${encodeURIComponent(nome)}`;

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const featured = getFeatured(products);

  return (
    <main className={`ez-fade ${css.page}`}>
      {/* TOPO — o que a Ezermec vende, os dois caminhos (catálogo ou
          orçamento) e por que comprar aqui. A busca fica no cabeçalho. */}
      <section className={css.topo}>
        <div className={`container ${css.topoGrade}`}>
          <div className={css.topoTexto}>
            <Link href="/ezermec-cad" className={css.novidade}>
              <span className={css.novidadeTag}>Novo</span>
              <span className={css.novidadeLongo}>Ezermec CAD: desenhe as costuras da sua Fischertec</span>
              <span className={css.novidadeCurto}>Conheça o Ezermec CAD</span>
              <i className="ph ph-arrow-right" aria-hidden="true" />
            </Link>

            <h1 className={css.titulo}>Peças e soluções para manutenção industrial.</h1>
            <p className={css.lead}>
              Peças para máquinas industriais, com o atendimento de quem entende de manutenção.
            </p>

            <div className={css.botoes}>
              <Link href="/catalogo" className="btn btn-navy ez-lift">
                Ver catálogo <i className="ph ph-arrow-right" />
              </Link>
              <a href={site.waHref} target="_blank" rel="noopener" className={`btn btn-white ez-lift ${css.btnWhats}`}>
                <i className="ph-fill ph-whatsapp-logo" />Pedir orçamento
              </a>
            </div>

            <ul className={css.motivos}>
              {DIFERENCIAIS.map((d) => (
                <li key={d.texto}>
                  <span className={css.motivoIcone}><i className={`ph ${d.icon}`} /></span>
                  {d.texto}
                </li>
              ))}
            </ul>
          </div>

          <div className={css.topoFoto}>
            <div className={css.fotoCaixa}>
              <div className={css.foto}>
                <Image
                  src="/assets/hero-industria-manutencao.png"
                  alt="Peça de reposição para máquina industrial de costura, ao lado de uma agulha"
                  width={1254}
                  height={1254}
                  sizes="(max-width: 880px) 100vw, 500px"
                  priority
                />
              </div>
              <div className={css.selo}>
                <span className={css.seloIcone}><i className="ph-fill ph-seal-check" /></span>
                <div>
                  <strong>Revenda autorizada</strong>
                  <span>Fischertec</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EZERMEC CAD — a vitrine do programa, com a corrida do Interligar
          rodando. Os textos vêm de lib/cad.ts, os mesmos da página dele. */}
      <section className={`container ${css.cadSecao}`} aria-labelledby="home-cad">
        <div className={css.cad}>
          <div className={css.cadTopo}>
            <span className={css.cadOlho}><b>Novo</b>Programa da Ezermec</span>
            <img
              src="/assets/logo-ezermec-cad-escuro.png"
              alt={cad.name}
              width={760}
              height={207}
              className={css.cadLogo}
            />
            <h2 id="home-cad" className={css.cadTitulo}>
              {cad.headline[0]} <span>{cad.headline[1]}</span>
            </h2>
            <p>{cad.description}</p>
          </div>

          <AnimaNaTela className={css.cadVisual}>
            <div className={css.janela}>
              <div className={css.janelaBarra}>
                <img src="/assets/cad-icone-escuro.png" alt="" width={131} height={40} />
                {cad.name} — Interligar
                <span className={css.janelaBotoes} aria-hidden="true">
                  <i className="ph ph-minus" />
                  <i className="ph ph-square" />
                  <i className="ph ph-x" />
                </span>
              </div>
              <div className={css.corrida}>
                <figure>
                  <InterligarAntes />
                  <figcaption>
                    <strong>{cad.interligar.antes.rotulo}</strong>
                    <span>{cad.interligar.antes.conta}</span>
                  </figcaption>
                </figure>
                <figure className={css.corridaBoa}>
                  <InterligarDepois />
                  <figcaption>
                    <strong>{cad.interligar.depois.rotulo}</strong>
                    <span>{cad.interligar.depois.conta}</span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </AnimaNaTela>

          <div className={css.cadResto}>
            <ul className={css.cadLista}>
              {cad.chamada.map((t) => (
                <li key={t}><i className="ph-fill ph-check-circle" />{t}</li>
              ))}
            </ul>
            <p className={css.cadPreco}>
              Planos a partir de <strong>{brl.format(cadAPartir)}</strong>/mês
            </p>
            <div className={css.cadBotoes}>
              <Link href="/ezermec-cad" className="btn btn-orange ez-lift">
                Conhecer o {cad.name} <i className="ph ph-arrow-right" />
              </Link>
              <Link href="/ezermec-cad#planos" className={`btn ez-lift ${css.btnVazado}`}>
                Ver planos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS — a lista toda, para achar a peça pelo tipo. */}
      <section id="categorias" className={`container ${css.secao}`}>
        <div className={css.secaoTopo}>
          <div>
            <span className="eyebrow">Categorias</span>
            <h2>Encontre a peça pelo tipo</h2>
          </div>
          <Link href="/catalogo" className={css.verTudo}>
            Ver todos os produtos <i className="ph ph-arrow-right" />
          </Link>
        </div>
        <ul className={css.categorias}>
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={linkCategoria(c.name)} className={css.categoria}>
                <span className={css.categoriaIcone}><i className={`ph ${c.icon}`} /></span>
                <span className={css.categoriaNome}>{c.name}</span>
                <i className={`ph ph-caret-right ${css.categoriaSeta}`} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* DESTAQUES */}
      <section className={`container ${css.secao}`}>
        <div className={css.secaoTopo}>
          <div>
            <span className="eyebrow">Em destaque</span>
            <h2>Produtos mais procurados</h2>
          </div>
          <Link href="/catalogo" className={css.verTudo}>
            Ver catálogo completo <i className="ph ph-arrow-right" />
          </Link>
        </div>
        <div className={`product-grid ${css.produtos}`}>
          {featured.map((p) => <ProductCard key={p.slug} product={p} variant="home" />)}
        </div>
      </section>

      {/* CONTATO — como pedir, e onde e quando a Ezermec atende. */}
      <section id="contato" className={`container ${css.contato}`}>
        <div className={css.chamada}>
          <div>
            <h2>Precisa de uma peça?</h2>
            <p>Mande o nome, o código ou uma foto da peça pelo WhatsApp e receba a cotação sem compromisso.</p>
            <ul className={css.chamadaInfo}>
              <li><i className="ph ph-map-pin" aria-hidden="true" />{site.cidade}</li>
              <li><i className="ph ph-clock" aria-hidden="true" />{site.horario.join(' · ')}</li>
            </ul>
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
