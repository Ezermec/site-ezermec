// Textos institucionais do site, num lugar só. As categorias e os produtos
// vêm do banco (ver lib/data.ts); o Ezermec CAD tem os seus em lib/cad.ts.

/** O que a Ezermec faz, em uma frase: título do site e do rodapé. */
export const SLOGAN = 'Peças, manutenção e software para máquinas industriais.';

// Os quatro motivos para comprar da Ezermec, na faixa logo abaixo do topo.
// Curtos de propósito: cada um se lê num relance.
export const DIFERENCIAIS = [
  { icon: 'ph-seal-check', titulo: 'Revenda autorizada', texto: 'Fischertec, com procedência' },
  { icon: 'ph-medal', titulo: 'Peças originais', texto: 'E de fabricantes homologados' },
  { icon: 'ph-truck', titulo: 'Entrega rápida', texto: 'Para todo o Brasil' },
  { icon: 'ph-headset', titulo: 'Atendimento técnico', texto: 'Ajuda para achar a peça certa' },
];

// Como comprar: a loja não tem carrinho, o pedido é por orçamento.
export const COMO_COMPRAR = [
  { icon: 'ph-magnifying-glass', titulo: 'Encontre a peça', texto: 'No catálogo, na busca ou pelo código do fabricante.' },
  { icon: 'ph-chat-circle-text', titulo: 'Peça o orçamento', texto: 'Pelo WhatsApp ou e-mail, com o nome, o código ou uma foto da peça.' },
  { icon: 'ph-truck', titulo: 'Receba na empresa', texto: 'Enviamos para todo o Brasil.' },
];

// As frentes de trabalho da Ezermec (página Sobre).
export const FRENTES = [
  { icon: 'ph-package', titulo: 'Peças para máquinas industriais', texto: 'Peças originais Fischertec e de fabricantes homologados, com procedência garantida.' },
  { icon: 'ph-wrench', titulo: 'Manutenção industrial', texto: 'Suporte para manter máquinas e linhas de produção funcionando, sem paradas.' },
  { icon: 'ph-headset', titulo: 'Assistência técnica', texto: 'Diagnóstico e indicação da peça certa, com quem conhece a máquina.' },
  { icon: 'ph-code', titulo: 'Software', texto: 'Programas para a produção, como o Ezermec CAD, que desenha as costuras da Fischertec.' },
];

export const MVV = [
  { icon: 'ph-target', titulo: 'Missão', texto: 'Manter a indústria em movimento, com a peça certa, na hora certa, e com atendimento especializado.' },
  { icon: 'ph-eye', titulo: 'Visão', texto: 'Ser referência em peças, manutenção e software para máquinas industriais na região.' },
  { icon: 'ph-handshake', titulo: 'Valores', texto: 'Qualidade, confiança, agilidade e proximidade com o cliente em cada atendimento.' },
];
