// Conteúdo da página do Ezermec CAD.
//
// Tudo aqui é editável sem mexer no layout da página. Os campos marcados como
// PLACEHOLDER precisam ser preenchidos com as informações reais do aplicativo
// (link de download, versão, requisitos e prints de tela).

export const cad = {
  name: 'Ezermec CAD',
  tagline: 'O aplicativo CAD da Ezermec para desenho e conferência de peças industriais.',
  description:
    'O Ezermec CAD foi desenvolvido pela Ezermec para agilizar o dia a dia de quem trabalha com peças de máquinas industriais. Com ele é possível desenhar, medir e conferir peças diretamente no computador, transformando a medida da peça em um desenho técnico pronto para produção ou orçamento.',

  // PLACEHOLDER: trocar pelo link real (instalador, loja de aplicativos ou app web).
  // Deixe em null enquanto o app ainda não estiver disponível — a página passa a
  // exibir "em breve" e direciona o contato para o WhatsApp.
  downloadUrl: null as string | null,
  version: null as string | null,

  features: [
    {
      icon: 'ph-ruler',
      title: 'Desenho técnico rápido',
      desc: 'Crie o desenho da peça a partir das medidas, sem precisar de software pesado ou licença cara.',
    },
    {
      icon: 'ph-crosshair-simple',
      title: 'Medidas precisas',
      desc: 'Cotas, tolerâncias e conferência dimensional para garantir que a peça saia exatamente como especificada.',
    },
    {
      icon: 'ph-stack-simple',
      title: 'Biblioteca de peças',
      desc: 'Modelos das peças que a Ezermec trabalha, prontos para usar como ponto de partida.',
    },
    {
      icon: 'ph-file-arrow-down',
      title: 'Exportação',
      desc: 'Gere o arquivo do desenho para enviar à produção, ao cliente ou junto com o pedido de orçamento.',
    },
    {
      icon: 'ph-chat-circle-text',
      title: 'Orçamento direto',
      desc: 'Do desenho para o orçamento: envie a peça desenhada para a equipe Ezermec e receba a cotação.',
    },
    {
      icon: 'ph-lightning',
      title: 'Leve e simples',
      desc: 'Feito para quem está no chão de fábrica: interface direta, sem curva de aprendizado.',
    },
  ],

  steps: [
    ['Instale o aplicativo', 'Baixe o Ezermec CAD e instale no computador da oficina ou do escritório.'],
    ['Desenhe a peça', 'Informe as medidas ou parta de um modelo da biblioteca para montar o desenho.'],
    ['Confira as cotas', 'Revise dimensões e tolerâncias antes de fechar o desenho.'],
    ['Exporte e envie', 'Salve o arquivo e envie para a produção ou para a Ezermec orçar.'],
  ] as Array<[string, string]>,

  // PLACEHOLDER: substituir pelos prints reais do aplicativo em /public/assets.
  screenshots: [
    'Print: tela principal do Ezermec CAD',
    'Print: desenho de peça com cotas',
    'Print: exportação do desenho',
  ],

  // PLACEHOLDER: confirmar requisitos reais.
  requirements: [
    ['ph-desktop', 'Sistema', 'Windows 10 ou superior'],
    ['ph-hard-drives', 'Espaço em disco', 'A confirmar'],
    ['ph-memory', 'Memória', 'A confirmar'],
    ['ph-wifi-high', 'Internet', 'Necessária apenas para envio de orçamentos'],
  ] as Array<[string, string, string]>,
};
