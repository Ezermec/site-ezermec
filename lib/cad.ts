// Conteúdo da página do Ezermec CAD.
//
// O Ezermec CAD é um CAD 2D para os desenhos de costura das máquinas de
// matelação Fischertec, desenvolvido pela própria Ezermec. O desenho sai em
// NGC (G-code) já com o preâmbulo da máquina, pronto para rodar — sem conversor.
//
// Tudo o que a página afirma sobre o programa foi conferido no código do próprio
// aplicativo (ferramentas, atalhos, cores, formato do NGC, máquinas compatíveis,
// ausência de acesso à internet). Ao mudar o app, revise este arquivo.

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
export type CadVisual = 'desenho' | 'ordem' | 'simulacao' | 'arquivo';

// A chamada tem duas partes: a segunda aparece em destaque no topo da página.
const headline = ['Seu desenho vira costura', 'na máquina Fischertec.'] as const;

export const cad = {
  name: 'Ezermec CAD',
  headline,
  tagline: headline.join(' '),
  description:
    'O Ezermec CAD é o programa para Windows onde você desenha a costura, confere na simulação e salva o arquivo NGC pronto para a máquina — sem conversor.',

  // O aplicativo não é baixado direto do site: o cliente pede pelo WhatsApp e
  // a Ezermec envia o instalador. Por isso a página não tem link de download.
  //
  // PLACEHOLDER: confirmar a versão atual (o print mostra v8.1 · 14 jul).
  version: null as string | null,

  // Windows 10 e 11: o .exe é Electron 31, que não roda no Windows 7/8.
  // Sem internet: o aplicativo não faz nenhuma chamada de rede.
  heroChecks: ['Windows 10 e 11', 'Funciona sem internet', 'Suporte da Ezermec'],

  capa: {
    src: '/assets/cad-desenho-e-costura.jpg',
    w: 1600,
    h: 900,
    alt: 'À esquerda, o desenho matelassê no Ezermec CAD; à direita, o tecido já costurado pela máquina com o mesmo padrão',
  } satisfies CadImagem,

  tela: {
    src: '/assets/cad-tela-principal.png',
    w: 1917,
    h: 978,
    alt: 'Tela principal do Ezermec CAD: barra de ferramentas, área de desenho, camadas e ordem da costura',
  } satisfies CadImagem,

  // A grande vantagem, contada como comparação: o conversor é a etapa que some.
  comparacao: {
    antes: ['Desenha em outro programa', 'Exporta o DXF', 'Passa no conversor NGC', 'Leva para a máquina'],
    etapaExtra: 2,
    agora: ['Desenha no Ezermec CAD', 'Leva o NGC para a máquina'],
  },

  // As outras vantagens, mostradas embaixo da comparação.
  advantages: [
    {
      icon: 'ph-file-arrow-up',
      title: 'Aproveita seus DXF',
      desc: 'Abre os desenhos que você já tem e transforma em costura.',
    },
    {
      icon: 'ph-eye',
      title: 'Erro aparece na tela',
      desc: 'A simulação mostra a costura e o tempo estimado antes de gastar tecido.',
    },
    {
      icon: 'ph-fill ph-seal-check',
      title: 'Feito por quem conhece a máquina',
      desc: 'Desenvolvido pela Ezermec, revenda autorizada Fischertec.',
    },
  ],

  // Máquinas: são as opções da tela "Configuração da máquina (NGC)" do app.
  // Usos: as aplicações das próprias máquinas de matelação Fischertec.
  compat: {
    maquinas: ['FIS 20', 'FIS 35', '2 cabeçotes com Gira-e-Corta', 'Máquinas antigas'],
    usos: ['Colchões', 'Edredons', 'Estofados', 'Jaquetas'],
  },

  plans: [
    { titulo: '6 meses', meses: 6, de: 89.7, mensal: 49.7, unico: null, selo: null, destaque: false },
    { titulo: '12 meses', meses: 12, de: 78.8, mensal: 38.8, unico: null, selo: 'Mais popular', destaque: false },
    { titulo: '24 meses', meses: 24, de: 69.9, mensal: 29.9, unico: null, selo: 'Melhor mensalidade', destaque: false },
    { titulo: 'Vitalício', meses: null, de: 958, mensal: null, unico: 897, selo: 'Pague uma vez', destaque: true },
  ] satisfies CadPlan[],

  steps: [
    { titulo: 'Desenhe', texto: 'Linha, arco, círculo, cota e espelho, tudo em escala real.', visual: 'desenho' },
    { titulo: 'Ordene', texto: 'A ordem automática encontra o menor caminho da agulha.', visual: 'ordem' },
    { titulo: 'Simule', texto: 'Veja a agulha percorrer o desenho e o tempo estimado.', visual: 'simulacao' },
    { titulo: 'Envie', texto: 'Salve o desenho.ngc e leve para a máquina. Sem conversor.', visual: 'arquivo' },
  ] satisfies Array<{ titulo: string; texto: string; visual: CadVisual }>,

  // Os cinco grupos da barra de ferramentas, com as cores usadas no próprio app.
  toolGroups: [
    { nome: 'Esboço', cor: '#4CC2FF' },
    { nome: 'Anotação', cor: '#FFC857' },
    { nome: 'Modificar', cor: '#F26A21' },
    { nome: 'Nós', cor: '#B98CFF' },
    { nome: 'Costura', cor: '#46C46B' },
  ],

  // Tour pela tela principal. `x` e `y` são a posição do marcador em % do print
  // (tela.png, 1917x978); `grupos` mostra os grupos de ferramentas na legenda.
  tour: [
    { x: 12, y: 7.2, titulo: 'Ferramentas', texto: 'Desenho, cota e edição. Cada ferramenta tem atalho no teclado.', grupos: true },
    { x: 34, y: 41, titulo: 'Área de desenho', texto: 'Em escala real, a partir da origem marcada pelos eixos.', grupos: false },
    { x: 88.7, y: 78, titulo: 'Ordem da costura', texto: 'Automática pelo menor caminho ou na sequência que você clicar.', grupos: false },
    { x: 88.7, y: 19, titulo: 'Camadas e precisão', texto: 'Camadas, snap, modo orto e ímã de esquadro para acertar cada ponto.', grupos: false },
    { x: 26.2, y: 2.1, titulo: 'Máquina e simulação', texto: 'Ajuste a sua máquina e veja a costura rodar antes de salvar.', grupos: false },
    { x: 26, y: 98.4, titulo: 'Linha de comando', texto: 'Digite comandos e medidas exatas, como nos CADs tradicionais.', grupos: false },
  ],

  faq: [
    {
      q: 'Funciona com a minha máquina?',
      a: 'O Ezermec CAD já traz a configuração das Fischertec FIS 20 e FIS 35, inclusive as de 2 cabeçotes com Gira-e-Corta e os modelos mais antigos. Na dúvida, chame no WhatsApp que a gente confirma o seu modelo.',
    },
    {
      q: 'O que é o arquivo NGC?',
      a: 'É o arquivo com o caminho da agulha que a máquina Fischertec executa. O Ezermec CAD gera esse arquivo direto do desenho, já com a configuração da máquina — por isso não precisa de conversor.',
    },
    {
      q: 'Consigo usar desenhos que eu já tenho?',
      a: 'Sim. Ele abre arquivos DXF, o formato que a maioria dos programas de desenho exporta, e também os NGC que você já usa na máquina.',
    },
    {
      q: 'Precisa de internet?',
      a: 'Não. O programa funciona instalado no computador, sem internet.',
    },
    {
      q: 'Qual computador eu preciso?',
      a: 'Um computador com Windows 10 ou 11.',
    },
    {
      q: 'Como recebo o programa?',
      a: 'Escolha o plano e chame a gente no WhatsApp. A equipe da Ezermec envia o instalador para Windows.',
    },
    {
      q: 'Qual a diferença entre os planos?',
      a: 'Só o período de uso. Todos incluem o aplicativo completo e o suporte da Ezermec. Quanto maior o período, menor a mensalidade — e o vitalício é pagamento único.',
    },
  ],
};
