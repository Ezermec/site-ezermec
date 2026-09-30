'use client';

import { useState, type FormEvent } from 'react';
import { site } from '@/lib/config';
import css from './contato.module.css';

const ASSUNTOS = [
  'Orçamento de peça',
  'Ezermec CAD',
  'Manutenção ou assistência técnica',
  'Outro assunto',
];

/**
 * Formulário de contato sem servidor: ele só monta a mensagem. "Enviar pelo
 * WhatsApp" abre a conversa com o texto pronto, e o visitante confirma o envio
 * no próprio WhatsApp; "por e-mail" abre o programa de e-mail do mesmo jeito.
 */
export function Formulario() {
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [assunto, setAssunto] = useState(ASSUNTOS[0]);
  const [mensagem, setMensagem] = useState('');

  function texto() {
    // "da empresa X" serve para qualquer nome, masculino ou feminino
    const quem = empresa.trim() ? `${nome.trim()}, da empresa ${empresa.trim()}` : nome.trim();
    return `Olá! Meu nome é ${quem}.\nAssunto: ${assunto}\n\n${mensagem.trim()}`;
  }

  function enviarWhatsApp(e: FormEvent) {
    e.preventDefault();
    const url = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(texto())}`;
    window.open(url, '_blank', 'noopener');
  }

  function enviarEmail() {
    const form = document.getElementById('form-contato') as HTMLFormElement | null;
    if (form && !form.reportValidity()) return;
    const url =
      `mailto:${site.email}?subject=${encodeURIComponent(`${assunto} — site Ezermec`)}` +
      `&body=${encodeURIComponent(texto())}`;
    window.location.href = url;
  }

  return (
    <form id="form-contato" className={css.form} onSubmit={enviarWhatsApp}>
      <div className={css.formTopo}>
        <strong>Mande sua mensagem</strong>
        <span>Preencha e a mensagem abre pronta no WhatsApp. É só confirmar o envio.</span>
      </div>

      <div className={css.linha}>
        <label className={css.campo}>
          <span>Seu nome</span>
          <input value={nome} onChange={(e) => setNome(e.target.value)} required autoComplete="name" placeholder="Como podemos te chamar?" />
        </label>
        <label className={css.campo}>
          <span>Empresa <em>(opcional)</em></span>
          <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} autoComplete="organization" placeholder="Nome da empresa" />
        </label>
      </div>

      <label className={css.campo}>
        <span>Assunto</span>
        <select value={assunto} onChange={(e) => setAssunto(e.target.value)}>
          {ASSUNTOS.map((a) => <option key={a}>{a}</option>)}
        </select>
      </label>

      <label className={css.campo}>
        <span>Mensagem</span>
        <textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          required
          rows={5}
          placeholder="Ex.: preciso de 2 lançadeiras para a FIS 35. Se tiver, mande o código ou descreva a peça."
        />
      </label>

      <p className={css.dica}>
        <i className="ph ph-lightbulb" aria-hidden="true" />
        Com o código ou uma foto da peça o orçamento sai mais rápido. A foto você manda na conversa.
      </p>

      <div className={css.formBotoes}>
        <button type="submit" className={`btn ez-lift ${css.enviar}`}>
          <i className="ph-fill ph-whatsapp-logo" />Enviar pelo WhatsApp
        </button>
        <button type="button" className={css.porEmail} onClick={enviarEmail}>
          ou enviar por e-mail
        </button>
      </div>
    </form>
  );
}
