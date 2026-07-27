// Conteúdo da página do Ezermec CAD.
//
// O Ezermec CAD é um CAD de desenhos de costura para máquinas Fischertec,
// desenvolvido pela própria Ezermec. O desenho é feito na tela e sai em NGC
// (G-code) com o preâmbulo Fischertec, pronto para rodar na máquina.
//
// Tudo aqui é editável sem mexer no layout da página. Os campos marcados como
// PLACEHOLDER precisam ser preenchidos com as informações reais do aplicativo.

export const cad = {
  name: 'Ezermec CAD',
  tagline: 'O CAD que facilita e agiliza a produção de desenhos de costura para máquinas Fischertec.',
  description:
    'O Ezermec CAD é o aplicativo que a Ezermec desenvolveu para criar os desenhos de costura das máquinas Fischertec. Você desenha o traçado na tela com ferramentas de CAD, define a ordem da costura, simula o resultado e salva o arquivo NGC pronto para a máquina — um desenho que antes tomava tempo fica pronto em poucos minutos.',

  // PLACEHOLDER: trocar pelo link real do instalador (.exe para Windows).
  // Deixe em null enquanto o app ainda não estiver disponível — a página passa a
  // exibir "em breve" e direciona o contato para o WhatsApp.
  downloadUrl: null as string | null,
  // PLACEHOLDER: confirmar qual build é a atual (a cópia em Downloads é a v8.2).
  version: null as string | null,

  features: [
    {
      icon: 'ph-fill ph-seal-check',
      title: 'Feito para Fischertec',
      desc: 'O arquivo sai em NGC com o preâmbulo Fischertec e os presets da máquina — pronto para rodar, sem conversão.',
    },
    {
      icon: 'ph-pencil-simple-line',
      title: 'Ferramentas de desenho',
      desc: 'Linha, polilinha, retângulo, círculo, arco, 3 pontos e ponto — com cotas, textos e a ferramenta de medir.',
    },
    {
      icon: 'ph-selection-plus',
      title: 'Edição completa',
      desc: 'Mover, copiar, apagar, aparar, alongar, espelhar, canto e linha dupla, além de soltar, unir e explodir nós.',
    },
    {
      icon: 'ph-path',
      title: 'Ordem da costura',
      desc: 'Ordem automática pelo menor caminho ou definida por você, com os saltos da agulha visíveis na tela.',
    },
    {
      icon: 'ph-arrows-clockwise',
      title: 'Interligar e retrocesso',
      desc: 'Encadeia os percursos pelo vizinho mais próximo e aplica retrocesso, idas e voltas e trava no contorno.',
    },
    {
      icon: 'ph-play-circle',
      title: 'Simulação da costura',
      desc: 'Rode a costura na tela antes de mandar para a máquina, com controle de velocidade e velocidade real.',
    },
    {
      icon: 'ph-stack-simple',
      title: 'Camadas',
      desc: 'Organize o desenho em camadas para separar o que é costura, contorno e apoio.',
    },
    {
      icon: 'ph-file-arrow-down',
      title: 'Abre e exporta vários formatos',
      desc: 'Abre .ngc, .dxf e projetos .json reeditáveis; exporta NGC, DXF (R12) e SVG.',
    },
  ],

  steps: [
    ['Instale o aplicativo', 'Baixe o instalador e abra o Ezermec CAD no computador da produção.'],
    ['Desenhe a costura', 'Trace o caminho com as ferramentas de CAD, em escala real.'],
    ['Defina a ordem', 'Ajuste a sequência dos percursos, o retrocesso e as interligações.'],
    ['Simule e salve o NGC', 'Confira a costura na simulação e salve o G-code para a máquina.'],
  ] as Array<[string, string]>,

  // PLACEHOLDER: salvar os prints em /public/assets e preencher `src`.
  // Enquanto `src` for null, a página mostra o espaço reservado com o texto.
  screenshots: [
    { src: null as string | null, alt: 'Tela principal do Ezermec CAD com o desenho e a ordem da costura' },
    { src: null as string | null, alt: 'Painel de ordem da costura, interligação e retrocesso' },
    { src: null as string | null, alt: 'Simulação da costura antes de exportar o NGC' },
  ],

  // PLACEHOLDER: confirmar requisitos reais.
  requirements: [
    ['ph-desktop', 'Onde roda', 'No computador, como programa instalado'],
    ['ph-windows-logo', 'Sistema', 'Windows 10 ou superior'],
    ['ph-file-code', 'Saída', 'NGC (G-code) · DXF · SVG'],
    ['ph-wifi-slash', 'Internet', 'Não é necessária para desenhar'],
  ] as Array<[string, string, string]>,
};
