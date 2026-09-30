import Image from 'next/image';
import Link from 'next/link';
import { getProducts, getFeatured } from '@/lib/data';
import { COMO_COMPRAR, DIFERENCIAIS } from '@/lib/content';
import { cad } from '@/lib/cad';
import { site } from '@/lib/config';
import { AnimaNaTela } from '@/components/AnimaNaTela';
import { ProductCard } from '@/components/ProductCard';
import { InterligarAntes, InterligarDepois } from './ezermec-cad/Ilustracoes';
import css from './home.module.css';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// A menor mensalidade do Ezermec CAD, para a chamada "planos a partir de".
const cadAPartir = Math.min(...cad.plans.flatMap((p) => (p.mensal ? [p.mensal] : [])));

export default async function HomePage() {
  const products = await getProducts();
  const featured = getFeatured(products);

  return (
    <main className={`ez-fade ${css.page}`}>
      {/* TOPO — as duas frentes da Ezermec: as peças (a foto) e o software
          (o cartão do Ezermec CAD por cima dela). A busca fica no cabeçalho. */}
      <section className={css.topo}>
        <div className={`container ${css.topoGrade}`}>
          <div className={css.topoTexto}>
            <Link href="/ezermec-cad" className={css.novidade}>
              <span className={css.novidadeTag}>Novo</span>
              <span className={css.novidadeLongo}>Ezermec CAD: desenhe as costuras da sua Fischertec</span>
              <span className={css.novidadeCurto}>Conheça o Ezermec CAD</span>
              <i className="ph ph-arrow-right" aria-hidden="true" />
            </Link>

            <h1 className={css.titulo}>
              Peças e software para a sua <span>produção não parar.</span>
            </h1>
            <p className={css.lead}>
              Revenda autorizada Fischertec, com peças originais e assistência técnica — e criadora
              do {cad.name}, o programa que desenha as costuras da sua máquina.
            </p>

            <div className={css.botoes}>
              <Link href="/catalogo" className="btn btn-navy ez-lift">
                Ver peças <i className="ph ph-arrow-right" />
              </Link>
              <Link href="/ezermec-cad" className={`btn btn-white ez-lift ${css.btnCad}`}>
                <i className="ph ph-desktop" />Conhecer o {cad.name}
              </Link>
            </div>
          </div>

          <div className={css.topoVisual}>
            <div className={css.foto}>
              <Image
                src="/assets/hero-industria-manutencao.png"
                alt="Peça de reposição para máquina industrial de costura, ao lado de uma agulha"
                width={1254}
                height={1254}
                sizes="(max-width: 880px) 100vw, 500px"
                priority
              />
              <span className={css.selo}>
                <i className="ph-fill ph-seal-check" aria-hidden="true" />Revenda autorizada Fischertec
              </span>
            </div>

            {/* O software, por cima da foto das peças. */}
            <Link href="/ezermec-cad" className={css.cadCartao}>
              <Image
                src={cad.capa.src}
                alt={cad.capa.alt}
                width={cad.capa.w}
                height={cad.capa.h}
                sizes="(max-width: 760px) 60vw, 300px"
              />
              <span className={css.cadCartaoTexto}>
                <span>
                  <strong>{cad.name}</strong>
                  <small>O desenho vira costura</small>
                </span>
                <i className="ph ph-arrow-up-right" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Os quatro motivos para comprar aqui, numa faixa logo abaixo do topo. */}
      <section className={css.confianca} aria-label="Por que comprar da Ezermec">
        <ul className="container">
          {DIFERENCIAIS.map((d) => (
            <li key={d.titulo}>
              <span className={css.confiancaIcone}><i className={`ph ${d.icon}`} /></span>
              <span>
                <strong>{d.titulo}</strong>
                <small>{d.texto}</small>
              </span>
            </li>
          ))}
        </ul>
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

      {/* PEÇAS — as mais procuradas; os tipos de peça ficam nos filtros do
          catálogo, para a página inicial não virar uma lista. */}
      <section id="pecas" className={`container ${css.secao}`}>
        <div className={css.secaoTopo}>
          <div>
            <span className="eyebrow">Peças</span>
            <h2>Peças mais procuradas</h2>
          </div>
          <Link href="/catalogo" className={css.verTudo}>
            Ver catálogo completo <i className="ph ph-arrow-right" />
          </Link>
        </div>
        <div className={`product-grid ${css.produtos}`}>
          {featured.map((p) => <ProductCard key={p.slug} product={p} variant="home" />)}
        </div>
      </section>

      {/* COMO COMPRAR — não há carrinho: o pedido é por orçamento. */}
      <section className={`container ${css.secao}`} aria-labelledby="como-comprar">
        <div className={css.passosTopo}>
          <span className="eyebrow">Como comprar</span>
          <h2 id="como-comprar">Pedir uma peça é simples</h2>
        </div>
        <ol className={css.passos}>
          {COMO_COMPRAR.map((p, i) => (
            <li key={p.titulo}>
              <span className={css.passoIcone}>
                <i className={`ph ${p.icon}`} aria-hidden="true" />
                <b>{i + 1}</b>
              </span>
              <strong>{p.titulo}</strong>
              <span>{p.texto}</span>
            </li>
          ))}
        </ol>
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
