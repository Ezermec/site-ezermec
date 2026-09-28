// Conteúdo da página do Ezermec CAD.
//
// O Ezermec CAD é o programa da Ezermec para desenhar as costuras das máquinas
// de matelação Fischertec. O arquivo sai em NGC (G-code) já com a configuração
// da máquina, pronto para rodar — sem conversor.
//
// Quem compra são fábricas de colchões, edredons, estofados e jaquetas, e quem
// desenha quase nunca é desenhista técnico. Por isso os textos falam do que o
// programa poupa (tempo de desenho, tempo de máquina, linha, tecido) e evitam
// termos de CAD. Base: o briefing da Ezermec e o código do próprio aplicativo.

/**
 * Um plano da tabela de preços. Assinaturas usam `meses` + `mensal` (com `de`
 * como preço cheio riscado); o vitalício usa `unico` e não tem mensalidade.
 */
export interface CadPlan {
  titulo: string;
  meses: number | null;
  de: number | null;
  mensal: number | null;
  unico: number | null;
  selo: string | null;
  destaque: boolean;
}

/** Imagem com as dimensões reais do arquivo — a moldura adota essa proporção. */
export interface CadImagem {
  src: string;
  w: number;
  h: number;
  alt: string;
}

/** Ilustrações desenhadas em código para cada passo (ver Ilustracoes.tsx). */
export type CadVisual = 'desenho' | 'acabamento' | 'simulacao' | 'arquivo';

/**
 * Ícone de uma ferramenta, no mesmo desenho do app (caixa de 20x20, traço).
 * `cor` é a cor do grupo da ferramenta na barra do programa.
 */
export interface CadIcone {
  svg: string;
  cor: string;
}

// Cores dos grupos da barra de ferramentas, iguais às do aplicativo.
const COR = {
  selecao: '#DCE3EA',
  desenho: '#4CC2FF',
  apoio: '#FFC857',
  costura: '#46C46B',
  modificar: '#F26A21',
  nos: '#B98CFF',
};

// A chamada tem duas partes: a segunda aparece em destaque no topo da página.
const headline = ['Seu desenho vira costura', 'na máquina Fischertec.'] as const;

export const cad = {
  name: 'Ezermec CAD',
  headline,
  tagline: headline.join(' '),
  description:
    'O programa que desenha as costuras e gera o arquivo pronto para a máquina, sem conversor. Poupa tempo, linha e tecido.',

  // O aplicativo não é baixado direto do site: o cliente pede pelo WhatsApp e
  // a Ezermec envia o instalador. Por isso a página não tem link de download.
  //
  // PLACEHOLDER: confirmar a versão atual (o print mais recente mostra v1.0 · 26 ago).
  version: null as string | null,

  // Sem internet: o aplicativo não faz nenhuma chamada de rede.
  heroChecks: ['Configurado para a sua máquina', 'Funciona sem internet', 'Suporte da Ezermec'],

  capa: {
    src: '/assets/cad-desenho-e-costura.jpg',
    w: 1600,
    h: 900,
    alt: 'À esquerda, o desenho matelassê no Ezermec CAD; à direita, o tecido já costurado pela máquina com o mesmo padrão',
  } satisfies CadImagem,

  // Print do programa na versão 1.0, com a barra de ferramentas em duas fileiras
  // e o painel Interligar e retrocesso à direita.
  tela: {
    src: '/assets/cad-tela-v1.png',
    w: 1544,
    h: 868,
    alt: 'Tela do Ezermec CAD: barra de ferramentas em duas fileiras, área de desenho com o quadro da máquina tracejado e o painel Interligar e retrocesso',
  } satisfies CadImagem,

  // A grande vantagem, contada como comparação: o conversor é a etapa que some.
  comparacao: {
    antes: ['Desenha em outro programa', 'Exporta o desenho', 'Passa no conversor NGC', 'Leva para a máquina'],
    etapaExtra: 2,
    agora: ['Desenha no Ezermec CAD', 'Leva o arquivo para a máquina'],
  },

  // Começar do desenho que a empresa já tem.
  origem: {
    titulo: 'Tem o desenho num arquivo ou só numa foto?',
    itens: [
      { icon: 'ph-file-pdf', titulo: 'Arquivo DXF ou PDF', texto: 'Abre na medida certa.' },
      { icon: 'ph-image', titulo: 'Foto ou imagem', texto: 'Vira um molde no tamanho real.' },
      { icon: 'ph-magic-wand', titulo: 'Traçar sozinho', texto: 'A imagem vira linhas de costura.' },
    ],
  },

  // O botão Interligar: o desenho inteiro vira um caminho só.
  interligar: {
    titulo: 'Um clique e o desenho vira uma costura só.',
    antes: { rotulo: 'Sem interligar', conta: '6 costuras · 5 cortes de linha' },
    depois: { rotulo: 'Com Interligar', conta: '1 costura só · nenhum corte' },
    ganhos: [
      { icon: 'ph-pause', texto: 'Menos paradas' },
      { icon: 'ph-scissors', texto: 'Menos cortes de linha' },
      { icon: 'ph-timer', texto: 'Menos tempo de máquina' },
    ],
  },

  // Máquinas: são as opções da tela "Configuração da máquina (NGC)" do app.
  // Usos: as aplicações das próprias máquinas de matelação Fischertec.
  compat: {
    texto: 'A Ezermec, revenda autorizada Fischertec, manda o programa já configurado para a sua máquina e o seu quadro.',
    frase: 'Instalou, já está costurando.',
    maquinas: ['FIS 20', 'FIS 35', '2 cabeçotes com Gira-e-Corta', 'Máquinas antigas'],
    usos: ['Colchões', 'Edredons', 'Estofados', 'Jaquetas'],
  },

  // "Desenhe mais rápido": faça uma vez e repita. Cada cartão mostra o botão do
  // programa que faz aquilo (Padrão, Espelhar, Paralelas, Encostar, Medir e
  // Letras), com o ícone e a cor do grupo dele na barra.
  rapido: {
    olho: 'Faça uma vez e repita',
    titulo: 'Desenhe mais rápido',
    texto: 'Um desenho que levaria horas sai em minutos — e sai simétrico.',
    itens: [
      {
        titulo: 'Repetir em série',
        texto: 'Um quadro vira a fileira inteira, na distância certa.',
        icone: { cor: COR.modificar, svg: '<rect x="2" y="6" width="4" height="8"/><rect x="8" y="6" width="4" height="8"/><rect x="14" y="6" width="4" height="8"/>' },
      },
      {
        titulo: 'Espelhar',
        texto: 'Desenhe metade, o programa faz o resto.',
        icone: { cor: COR.modificar, svg: '<path d="M10 2v16" stroke-dasharray="2 2"/><path d="M8 5L3 10l5 5zM12 5l5 5-5 5"/>' },
      },
      {
        titulo: 'Costura dupla e tripla',
        texto: 'Uma linha vira duas, três ou mais.',
        icone: { cor: COR.modificar, svg: '<path d="M2 5.5h16M2 14.5h16"/><path d="M2 10h16" stroke-dasharray="2 2" opacity=".5"/><path d="M10 3.5v13" opacity=".5"/>' },
      },
      {
        titulo: 'Encostar',
        texto: 'Um bloco encosta no outro, rente.',
        icone: { cor: COR.modificar, svg: '<rect x="2.5" y="4.5" width="6" height="11"/><rect x="11.5" y="4.5" width="6" height="11"/><path d="M8.5 10h3"/>' },
      },
      {
        titulo: 'Medida certa',
        texto: 'Digite 1000 e a linha sai com 1 metro.',
        icone: { cor: COR.apoio, svg: '<path d="M2 12l10-10 6 6-10 10z"/><path d="M6 8l2 2M9 5l2 2M9 11l2 2"/>' },
      },
      {
        titulo: 'Nome e marca',
        texto: 'Digite o nome: cada letra sai pronta para a agulha.',
        icone: { cor: COR.desenho, svg: '<path d="M2.5 16L6.5 4l4 12M4 12h5"/><path d="M12.5 4v12M12.5 10.2c.6-1.5 1.8-2.3 3-2.3 1.7 0 2.7 1.3 2.7 4s-1 4-2.7 4c-1.2 0-2.4-.8-3-2.3"/>' },
      },
    ] satisfies Array<{ titulo: string; texto: string; icone: CadIcone }>,
  },

  plans: [
    { titulo: '6 meses', meses: 6, de: 89.7, mensal: 49.7, unico: null, selo: null, destaque: false },
    { titulo: '12 meses', meses: 12, de: 78.8, mensal: 38.8, unico: null, selo: 'Mais popular', destaque: false },
    { titulo: '24 meses', meses: 24, de: 69.9, mensal: 29.9, unico: null, selo: 'Melhor mensalidade', destaque: false },
    { titulo: 'Vitalício', meses: null, de: 958, mensal: null, unico: 897, selo: 'Pague uma vez', destaque: true },
  ] satisfies CadPlan[],

  // `duracao` é o ciclo da animação do passo, em segundos (ver Ilustracoes.tsx):
  // o passo fica na tela o tempo de a animação rodar uma vez inteira.
  steps: [
    { titulo: 'Desenhe', texto: 'Na medida real da peça.', visual: 'desenho', duracao: 5 },
    { titulo: 'Dê acabamento', texto: 'Trava, reforço e pausa já saem no arquivo.', visual: 'acabamento', duracao: 7 },
    { titulo: 'Confira', texto: 'Veja o erro na tela, não no tecido.', visual: 'simulacao', duracao: 7 },
    { titulo: 'Envie', texto: 'Direto para a máquina, sem conversor.', visual: 'arquivo', duracao: 6 },
  ] satisfies Array<{ titulo: string; texto: string; visual: CadVisual; duracao: number }>,

  // Os seis grupos da barra de ferramentas da versão 1.0, com as cores do app.
  toolGroups: [
    { nome: 'Seleção', cor: COR.selecao },
    { nome: 'Desenho', cor: COR.desenho },
    { nome: 'Apoio', cor: COR.apoio },
    { nome: 'Costura', cor: COR.costura },
    { nome: 'Modificar', cor: COR.modificar },
    { nome: 'Nós', cor: COR.nos },
  ],

  // Tour pela tela. `x` e `y` são a posição do marcador em % do print
  // (tela, 1544x868); `grupos` mostra os grupos de ferramentas na legenda.
  tour: [
    { x: 17.4, y: 7, titulo: 'Ferramentas', texto: 'Separadas por cor, com atalho no teclado.', grupos: true },
    { x: 40, y: 62, titulo: 'Quadro da máquina', texto: 'A tela avisa se a peça não cabe.', grupos: false },
    { x: 88.7, y: 90, titulo: 'Interligar', texto: 'Uma costura só, com trava nas pontas.', grupos: false },
    { x: 88.7, y: 26.5, titulo: 'Camadas e precisão', texto: 'Ajudas que acertam cada ponto sozinhas.', grupos: false },
    { x: 34, y: 2, titulo: 'Máquina e simulação', texto: 'Veja a costura rodando antes de salvar.', grupos: false },
    { x: 58.4, y: 7, titulo: 'Acabamento', texto: 'Reforço, pausa e retrocesso saem no arquivo.', grupos: false },
  ],

  faq: [
    {
      q: 'Funciona com a minha máquina?',
      a: 'Funciona com as Fischertec FIS 20 e FIS 35, inclusive as de 2 cabeçotes com Gira-e-Corta e os modelos antigos. Na dúvida, chame no WhatsApp que a gente confirma.',
    },
    {
      q: 'O que é o arquivo NGC?',
      a: 'É o arquivo que a máquina Fischertec lê para costurar. O Ezermec CAD gera esse arquivo direto do desenho — sem conversor.',
    },
    {
      q: 'Consigo usar desenhos que eu já tenho?',
      a: 'Sim. Abre DXF e PDF na medida certa, e uma foto vira molde no tamanho real — ou o programa traça sozinho.',
    },
    {
      q: 'Precisa de internet?',
      a: 'Não. Funciona instalado no computador, sem internet.',
    },
    {
      q: 'Qual computador eu preciso?',
      a: 'Um computador com Windows 10 ou 11.',
    },
    {
      q: 'Como recebo o programa?',
      a: 'Chame a gente no WhatsApp. A Ezermec envia o instalador já configurado para a sua máquina e o seu quadro.',
    },
    {
      q: 'Qual a diferença entre os planos?',
      a: 'Só o período de uso. Todos têm o programa completo e o suporte da Ezermec; o vitalício é pagamento único.',
    },
  ],
};
