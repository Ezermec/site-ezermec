// Conteúdo da página do Ezermec CAD.
//
// Tudo aqui é editável sem mexer no layout da página. Os campos marcados como
// PLACEHOLDER precisam ser preenchidos com as informações reais do aplicativo
// (link de download, versão, requisitos e prints de tela).

export const cad = {
  name: 'Ezermec CAD',
  tagline: 'O aplicativo CAD da Ezermec, desenvolvido especificamente para máquinas Fischertec.',
  description:
    'O Ezermec CAD foi desenvolvido pela Ezermec para quem trabalha com máquinas Fischertec. Como revenda autorizada, conhecemos essas máquinas por dentro — e transformamos esse conhecimento em um aplicativo que já nasce ajustado a elas, sem a configuração e a complexidade de um CAD genérico.',

  // PLACEHOLDER: trocar pelo link real (instalador, loja de aplicativos ou app web).
  // Deixe em null enquanto o app ainda não estiver disponível — a página passa a
  // exibir "em breve" e direciona o contato para o WhatsApp.
  downloadUrl: null as string | null,
  version: null as string | null,

  features: [
    {
      icon: 'ph-fill ph-seal-check',
      title: 'Feito para Fischertec',
      desc: 'Não é um CAD genérico adaptado: foi desenvolvido do zero pensando nas máquinas Fischertec.',
    },
    {
      icon: 'ph-ruler',
      title: 'Desenho técnico rápido',
      desc: 'Monte o desenho a partir das medidas, sem software pesado nem licença cara.',
    },
    {
      icon: 'ph-crosshair-simple',
      title: 'Medidas precisas',
      desc: 'Cotas e conferência dimensional para garantir que a peça saia exatamente como especificada.',
    },
    {
      icon: 'ph-stack-simple',
      title: 'Biblioteca Fischertec',
      desc: 'Modelos e medidas das máquinas Fischertec já prontos, para usar como ponto de partida.',
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
  ],

  steps: [
    ['Instale o aplicativo', 'Baixe o Ezermec CAD e instale no computador da oficina ou do escritório.'],
    ['Escolha a máquina', 'Selecione o modelo Fischertec com o qual você vai trabalhar.'],
    ['Monte o desenho', 'Informe as medidas ou parta de um modelo da biblioteca e confira as cotas.'],
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
