import type { Metadata } from 'next';
import { site } from '@/lib/config';
import { CabecalhoPagina } from '@/components/CabecalhoPagina';
import { Formulario } from './Formulario';
import css from './contato.module.css';

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Fale com a Ezermec pelo WhatsApp, telefone ou e-mail: orçamento de peças, Ezermec CAD, manutenção e assistência técnica. Blumenau (SC).',
};

// Os canais de atendimento, do mais rápido ao mais formal.
const CANAIS = [
  {
    icon: 'ph-fill ph-whatsapp-logo',
    nome: 'WhatsApp',
    texto: 'O jeito mais rápido de pedir um orçamento.',
    valor: site.phoneDisplay,
    href: site.waHref,
    acao: 'Chamar no WhatsApp',
    externo: true,
    destaque: true,
  },
  {
    icon: 'ph ph-phone',
    nome: 'Telefone',
    texto: 'Para falar direto com a equipe.',
    valor: site.phoneDisplay,
    href: site.telHref,
    acao: 'Ligar',
    externo: false,
    destaque: false,
  },
  {
    icon: 'ph ph-envelope-simple',
    nome: 'E-mail',
    texto: 'Para cotações com anexos e pedidos formais.',
    valor: site.email,
    href: site.mailGeneral,
    acao: 'Enviar e-mail',
    externo: false,
    destaque: false,
  },
];

export default function ContatoPage() {
  return (
    <main className="ez-fade">
      <CabecalhoPagina
        passos={[{ nome: 'Início', href: '/' }, { nome: 'Contato' }]}
        olho="Contato"
        titulo="Fale com a Ezermec"
        texto="Orçamento de peças, dúvidas sobre o Ezermec CAD ou suporte técnico: escolha o canal que preferir."
      />

      <div className={`container ${css.corpo}`}>
        <div className={css.canais}>
          {CANAIS.map((c) => (
            <a
              key={c.nome}
              href={c.href}
              {...(c.externo ? { target: '_blank', rel: 'noopener' } : {})}
              className={`${css.canal} ${c.destaque ? css.canalDestaque : ''}`}
            >
              <span className={css.canalIcone}><i className={c.icon} aria-hidden="true" /></span>
              <span className={css.canalTexto}>
                <strong>{c.nome}</strong>
                <small>{c.texto}</small>
                <span className={css.canalValor}>{c.valor}</span>
              </span>
              <span className={css.canalAcao}>
                {c.acao} <i className="ph ph-arrow-right" aria-hidden="true" />
              </span>
            </a>
          ))}

          <div className={css.info}>
            <div>
              <i className="ph ph-map-pin" aria-hidden="true" />
              <span>
                <small>Onde estamos</small>
                <strong>{site.cidade}</strong>
              </span>
            </div>
            <div>
              <i className="ph ph-clock" aria-hidden="true" />
              <span>
                <small>Horário de atendimento</small>
                {site.horario.map((h) => <strong key={h}>{h}</strong>)}
              </span>
            </div>
          </div>
        </div>

        <Formulario />
      </div>
    </main>
  );
}
