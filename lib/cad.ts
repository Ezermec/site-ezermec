// Conteúdo da página do Ezermec CAD.
//
// O Ezermec CAD é um CAD de desenhos de costura para máquinas Fischertec,
// desenvolvido pela própria Ezermec.
//
// Tudo aqui é editável sem mexer no layout da página. Os campos marcados como
// PLACEHOLDER precisam ser preenchidos com as informações reais do aplicativo
// (link de download, versão, requisitos e prints de tela).

export const cad = {
  name: 'Ezermec CAD',
  tagline: 'O CAD que facilita e agiliza a produção de desenhos de costura para máquinas Fischertec.',
  description:
    'O Ezermec CAD é o aplicativo que a Ezermec desenvolveu para criar os desenhos de costura das máquinas Fischertec. Você desenha o traçado na tela, ajusta o que precisa e leva o arquivo direto para a máquina — um desenho que antes tomava tempo fica pronto em poucos minutos, sem software genérico e sem retrabalho na hora de costurar.',

  // PLACEHOLDER: trocar pelo link real (instalador, loja de aplicativos ou app web).
  // Deixe em null enquanto o app ainda não estiver disponível — a página passa a
  // exibir "em breve" e direciona o contato para o WhatsApp.
  downloadUrl: null as string | null,
  version: null as string | null,

  features: [
    {
      icon: 'ph-fill ph-seal-check',
      title: 'Feito para Fischertec',
      desc: 'Desenvolvido pela Ezermec especificamente para as máquinas Fischertec — não é um CAD genérico adaptado.',
    },
    {
      icon: 'ph-scribble-loop',
      title: 'Desenho da costura',
      desc: 'Trace o caminho da costura na tela: retas, curvas e contornos, do jeito que a peça pede.',
    },
    {
      icon: 'ph-lightning',
      title: 'Produção mais rápida',
      desc: 'Menos etapas manuais do desenho até a máquina: o que tomava tempo fica pronto em poucos minutos.',
    },
    {
      icon: 'ph-ruler',
      title: 'Medidas na escala certa',
      desc: 'O desenho é feito em escala real, então o que aparece na tela é o que a máquina vai costurar.',
    },
    {
      icon: 'ph-sliders-horizontal',
      title: 'Ajuste dos pontos',
      desc: 'Configure o desenho ponto a ponto e corrija detalhes antes de mandar para a produção.',
    },
    {
      icon: 'ph-stack-simple',
      title: 'Biblioteca de desenhos',
      desc: 'Salve os desenhos usados no dia a dia e reaproveite em novos trabalhos.',
    },
    {
      icon: 'ph-file-arrow-down',
      title: 'Arquivo pronto para a máquina',
      desc: 'Exporte o desenho no formato da Fischertec e transfira direto para a máquina.',
    },
  ],

  steps: [
    ['Instale o aplicativo', 'Baixe o Ezermec CAD e instale no computador da produção.'],
    ['Desenhe a costura', 'Trace o caminho da costura em escala real, na tela.'],
    ['Ajuste e confira', 'Revise os pontos e as medidas antes de fechar o desenho.'],
    ['Envie para a máquina', 'Exporte o arquivo e transfira para a máquina Fischertec.'],
  ] as Array<[string, string]>,

  // PLACEHOLDER: substituir pelos prints reais do aplicativo em /public/assets.
  screenshots: [
    'Print: tela principal do Ezermec CAD',
    'Print: desenho de costura em edição',
    'Print: exportação para a máquina',
  ],

  // PLACEHOLDER: confirmar requisitos reais.
  requirements: [
    ['ph-desktop', 'Sistema', 'Windows 10 ou superior'],
    ['ph-hard-drives', 'Espaço em disco', 'A confirmar'],
    ['ph-memory', 'Memória', 'A confirmar'],
    ['ph-usb', 'Transferência', 'A confirmar (USB / rede)'],
  ] as Array<[string, string, string]>,
};
