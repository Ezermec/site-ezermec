// Conteúdo da página do Ezermec CAD.
//
// O Ezermec CAD é um CAD de desenhos de costura para máquinas Fischertec,
// desenvolvido pela própria Ezermec. O desenho sai em NGC (G-code) com o
// preâmbulo Fischertec, pronto para rodar na máquina.
//
// Os textos são curtos de propósito: a página é para bater o olho e entender.
// Os campos marcados como PLACEHOLDER precisam dos dados reais do aplicativo.

export const cad = {
  name: 'Ezermec CAD',
  tagline: 'Desenhos de costura para máquinas Fischertec, prontos em minutos.',
  description:
    'Desenhe o traçado na tela, defina a ordem da costura e salve o arquivo pronto para a máquina.',

  // O aplicativo não é baixado direto do site: o cliente pede pelo WhatsApp e
  // a Ezermec envia o instalador. Por isso a página não tem link de download.
  //
  // PLACEHOLDER: confirmar a versão atual (o print mostra v8.1 · 14 jul).
  version: null as string | null,

  // Três garantias de bater o olho, logo abaixo do hero.
  highlights: [
    ['ph-fill ph-seal-check', 'Feito para Fischertec'],
    ['ph-file-code', 'Arquivo NGC pronto'],
    ['ph-headset', 'Suporte da Ezermec'],
  ] as Array<[string, string]>,

  features: [
    { icon: 'ph-pencil-simple-line', title: 'Desenho da costura', desc: 'Retas, curvas e contornos na tela.' },
    { icon: 'ph-ruler', title: 'Escala real', desc: 'O que você vê é o que a máquina costura.' },
    { icon: 'ph-path', title: 'Ordem da costura', desc: 'Automática pelo menor caminho.' },
    { icon: 'ph-play-circle', title: 'Simulação', desc: 'Veja a costura antes de mandar.' },
    { icon: 'ph-stack-simple', title: 'Camadas', desc: 'Separe costura, contorno e apoio.' },
    { icon: 'ph-file-arrow-down', title: 'Exportação', desc: 'NGC, DXF e SVG.' },
  ],

  // Planos de assinatura. `de` é o preço cheio (riscado na página) e `mensal`
  // é o promocional; o percentual de desconto sai da comparação entre os dois.
  plans: [
    { meses: 6, de: 89.9, mensal: 49.9, selo: null as string | null, destaque: false },
    { meses: 12, de: 69.9, mensal: 39.9, selo: 'Mais popular' as string | null, destaque: false },
    { meses: 24, de: 49.9, mensal: 29.9, selo: 'Melhor preço' as string | null, destaque: true },
  ],

  steps: [
    ['Peça', 'Fale no WhatsApp e receba o instalador.'],
    ['Desenhe', 'Trace a costura em escala real.'],
    ['Simule', 'Confira antes de enviar.'],
    ['Envie', 'Salve o NGC e leve para a máquina.'],
  ] as Array<[string, string]>,

  // PLACEHOLDER: salvar os prints em /public/assets e preencher `src`.
  // Enquanto `src` for null, a página mostra o espaço reservado com o texto.
  //
  // `w` e `h` são as dimensões reais do arquivo: a moldura da página adota
  // essa proporção, então o print aparece inteiro e sem faixas nas bordas.
  screenshots: [
    {
      src: '/assets/cad-tela-principal.png' as string | null,
      w: 1917,
      h: 978,
      alt: 'Tela principal do Ezermec CAD com as ferramentas, camadas e a ordem da costura',
    },
    { src: null as string | null, w: 16, h: 10, alt: 'Painel de ordem da costura, interligação e retrocesso' },
    { src: null as string | null, w: 16, h: 10, alt: 'Simulação da costura antes de exportar o NGC' },
  ],

  // PLACEHOLDER: confirmar requisitos reais.
  requirements: [
    ['ph-windows-logo', 'Sistema', 'Windows 10 ou superior'],
    ['ph-desktop', 'Instalação', 'Programa no computador'],
    ['ph-file-code', 'Saída', 'NGC · DXF · SVG'],
    ['ph-wifi-slash', 'Internet', 'Não precisa para desenhar'],
  ] as Array<[string, string, string]>,
};
