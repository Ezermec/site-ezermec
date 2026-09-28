// Ilustrações da página do Ezermec CAD.
//
// São desenhadas em SVG com o visual do próprio aplicativo: as cores vêm do
// tema do app (--graphite, --cyan, verde da costura, vermelho dos saltos,
// agulha laranja da simulação, reforço laranja e pausa roxa) e o arquivo mostra
// o G-code que ele realmente gera. Não são prints — são esquemas animados, para
// explicar cada coisa num relance.
//
// As animações são SMIL e se repetem num ciclo (`dur`). Os tempos de cada etapa
// são frações desse ciclo. Quem prefere menos movimento vê o estado final: as
// classes sim* de cad.module.css travam cada peça no fim da animação.

import css from './cad.module.css';

// Cores do tema do aplicativo.
const APP = {
  fundo: '#101418',
  grade: '#1A2027',
  painel: '#161B21',
  borda: '#2A343E',
  linha: '#DCE3EA',
  apagado: '#8B98A5',
  ciano: '#4CC2FF',
  ambar: '#FFC857',
  verde: '#46C46B',
  verdeClaro: '#8BE3A6',
  vermelho: '#FF5A5F',
  laranja: '#F26A21',
  roxo: '#B98CFF',
  eixoX: '#E5484D',
  eixoY: '#57A94B',
};

const W = 320;
const H = 200;

// Desenho ainda não costurado, apagado como no app.
const APAGADO = 'rgba(220,227,234,.2)';

// Grade de fundo, como uma folha de CAD. O traço não engrossa quando a
// ilustração aparece grande.
const GRADE = (() => {
  let d = '';
  for (let x = 20; x < W; x += 20) d += `M${x} 0V${H}`;
  for (let y = 20; y < H; y += 20) d += `M0 ${y}H${W}`;
  return d;
})();

/** Frações do ciclo no formato do SMIL ("0;0.25;1"). */
const tempos = (...v: number[]) => v.map((n) => +n.toFixed(4)).join(';');

function Tela({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={rotulo} className={css.art}>
      <rect width={W} height={H} fill={APP.fundo} />
      <path d={GRADE} stroke={APP.grade} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {children}
    </svg>
  );
}

/** Aparece na fração `em` do ciclo e fica até o fim dele. */
function Aparece({ em, dur }: { em: number; dur: string }) {
  return (
    <animate attributeName="opacity" values="0;1" keyTimes={tempos(0, em)} calcMode="discrete" dur={dur} repeatCount="indefinite" />
  );
}

/** Traço que se desenha entre as frações `de` e `ate` do ciclo e fica até o fim. */
function Desenha({ de, ate, dur }: { de: number; ate: number; dur: string }) {
  return (
    <animate attributeName="stroke-dashoffset" values="1;1;0;0" keyTimes={tempos(0, de, ate, 1)} dur={dur} repeatCount="indefinite" />
  );
}

/**
 * A agulha da simulação: laranja, com borda branca. Com `some`, ela sai da
 * tela nessa fração do ciclo, quando a costura termina.
 */
function Agulha({ caminho, pontos, momentos, dur, some }: { caminho: string; pontos: string; momentos: string; dur: string; some?: number }) {
  return (
    <circle r="5" fill={APP.laranja} stroke="#fff" strokeWidth="1.6" className={css.simAgulha}>
      <animateMotion path={caminho} keyPoints={pontos} keyTimes={momentos} calcMode="linear" dur={dur} repeatCount="indefinite" />
      {some && (
        <animate attributeName="opacity" values="1;0" keyTimes={tempos(0, some)} calcMode="discrete" dur={dur} repeatCount="indefinite" />
      )}
    </circle>
  );
}

/** Selo de pronto no canto: aparece quando a costura termina. */
function Pronto({ em, dur }: { em: number; dur: string }) {
  return (
    <g className={css.simMarca}>
      <Aparece em={em} dur={dur} />
      <circle cx="298" cy="22" r="10" fill={APP.verde} />
      <path d="M293.2 22.2l3.2 3.2 6.4-6.6" fill="none" stroke="#0B0F13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/**
 * Onda de matelassê entre dois x, na altura y, feita de meias-ondas de
 * Bézier quadrática. `de` > `ate` desenha da direita para a esquerda.
 */
function onda(de: number, ate: number, y: number, meia: number, amp: number, continuar = false) {
  const passo = de < ate ? meia : -meia;
  const n = Math.round(Math.abs(ate - de) / meia);
  let d = `${continuar ? '' : `M${de} ${y}`}Q${de + passo / 2} ${y - amp * 2} ${de + passo} ${y}`;
  for (let i = 2; i <= n; i++) d += `T${de + passo * i} ${y}`;
  return d;
}

/**
 * Costura contínua animada: o desenho apagado por baixo, o trecho já costurado
 * em verde, os furos da agulha e a agulha andando. A agulha anda de 0 até a
 * fração `fim` do ciclo e o desenho pronto fica na tela até o ciclo acabar.
 * `id` precisa ser único na página.
 */
function CosturaAnimada({ id, d, dur, fim = 0.85 }: { id: string; d: string; dur: string; fim?: number }) {
  const momentos = tempos(0, fim, 1);
  return (
    <>
      <defs>
        <path id={id} d={d} />
        {/* máscara que revela os furos só por onde a agulha já passou */}
        <mask id={`${id}-costurado`}>
          <path
            d={d} pathLength="1" fill="none" stroke="#fff" strokeWidth="10"
            strokeDasharray="1" strokeDashoffset="1" className={css.simTrilha}
          >
            <animate attributeName="stroke-dashoffset" values="1;0;0" keyTimes={momentos} dur={dur} repeatCount="indefinite" />
          </path>
        </mask>
      </defs>

      <use href={`#${id}`} fill="none" stroke={APAGADO} strokeWidth="2" />

      {/* trecho já costurado */}
      <path
        d={d} pathLength="1" fill="none" stroke={APP.verde} strokeWidth="2.4" strokeLinejoin="round"
        strokeDasharray="1" strokeDashoffset="1" className={css.simTrilha}
      >
        <animate attributeName="stroke-dashoffset" values="1;0;0" keyTimes={momentos} dur={dur} repeatCount="indefinite" />
      </path>

      {/* furos da agulha a cada ponto */}
      <path
        d={d} fill="none" stroke={APP.verdeClaro} strokeWidth="2.6" strokeLinecap="round"
        strokeDasharray="0 7" mask={`url(#${id}-costurado)`}
      />

      <circle r="5" fill={APP.laranja} stroke="#fff" strokeWidth="1.6" className={css.simAgulha}>
        <animateMotion dur={dur} repeatCount="indefinite" keyPoints="0;1;1" keyTimes={momentos} calcMode="linear">
          <mpath href={`#${id}`} />
        </animateMotion>
      </circle>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Desenhe — a linha nova se estica até a medida digitada              */
/* ------------------------------------------------------------------ */

// Ícones das ferramentas, iguais aos do app (caixa de 20x20).
const ICONE = {
  linha: '<path d="M3 17L17 3"/><circle cx="3" cy="17" r="1.6"/><circle cx="17" cy="3" r="1.6"/>',
  arco: '<path d="M3 15a7 7 0 0 1 14 0"/>',
  circulo: '<circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="1"/>',
};

export function IlustracaoDesenho() {
  const dur = '5s';
  // a linha nova fica pronta em 45% do ciclo; em 90% tudo some para recomeçar
  const pronta = 0.45;

  // moldura do desenho; a origem da máquina fica no canto inferior esquerdo
  const x0 = 116, y0 = 50, x1 = 292, y1 = 170;
  const alt = y1 - y0;
  const passos: number[] = [];
  for (let c = x0 - alt; c <= x1; c += 30) passos.push(c);
  // "/" já desenhadas até esta, a próxima está sendo traçada
  const atual = x0 + 30;
  const fim = { x: atual + 72, y: y1 - 72 };
  const linha = `M${atual} ${y1}L${fim.x} ${fim.y}`;

  return (
    <Tela rotulo="Desenho de uma treliça de costura: a linha nova se estica até a medida digitada, 1000 mm">
      {/* eixos da origem, como no app */}
      <path d={`M0 ${y1}H${W}`} stroke={APP.eixoX} strokeOpacity=".45" />
      <path d={`M${x0} 0V${H}`} stroke={APP.eixoY} strokeOpacity=".45" />

      <clipPath id="cadil-moldura">
        <rect x={x0} y={y0} width={x1 - x0} height={alt} />
      </clipPath>
      <g clipPath="url(#cadil-moldura)" stroke={APP.linha} strokeOpacity=".55" strokeWidth="1.2">
        {passos.map((c) => <path key={`a${c}`} d={`M${c} ${y0}L${c + alt} ${y1}`} />)}
        {passos.filter((c) => c < atual).map((c) => <path key={`b${c}`} d={`M${c} ${y1}L${c + alt} ${y0}`} />)}
      </g>
      <rect x={x0} y={y0} width={x1 - x0} height={alt} fill="none" stroke={APP.linha} strokeWidth="1.5" />

      {/* a linha que está sendo desenhada, com a mira do cursor na ponta e a medida */}
      <g className={css.simMarca}>
        <animate attributeName="opacity" values="1;1;0" keyTimes={tempos(0, 0.9, 1)} dur={dur} repeatCount="indefinite" />
        <circle cx={atual} cy={y1} r="2.4" fill={APP.ciano} />
        <path
          d={linha} stroke={APP.ciano} strokeWidth="1.8" pathLength="1"
          strokeDasharray="1" strokeDashoffset="1" className={css.simTrilha}
        >
          <animate attributeName="stroke-dashoffset" values="1;0;0" keyTimes={tempos(0, pronta, 1)} dur={dur} repeatCount="indefinite" />
        </path>
        <path d="M-9 0h18M0 -9v18" stroke={APP.ciano} strokeWidth="1.2" className={css.simAgulha}>
          <animateMotion path={linha} keyPoints="0;1;1" keyTimes={tempos(0, pronta, 1)} calcMode="linear" dur={dur} repeatCount="indefinite" />
        </path>
        <g className={css.simMarca}>
          <Aparece em={pronta} dur={dur} />
          <rect x={fim.x + 8} y={fim.y - 30} width="62" height="18" rx="4" fill="#0B0F13" stroke={APP.borda} />
          <text x={fim.x + 39} y={fim.y - 18} textAnchor="middle" fill={APP.ciano} fontSize="9.5">1000 mm</text>
        </g>
      </g>

      {/* pedaço da barra de ferramentas, grupo Desenho */}
      <rect x="10" y="10" width="92" height="34" rx="6" fill={APP.painel} stroke={APP.borda} />
      {(['linha', 'arco', 'circulo'] as const).map((nome, i) => {
        const bx = 15 + i * 28;
        const ativo = nome === 'linha';
        return (
          <g key={nome}>
            <rect
              x={bx} y="14" width="26" height="24" rx="4"
              fill={ativo ? 'rgba(76,194,255,.16)' : 'none'}
              stroke={ativo ? APP.ciano : 'none'}
            />
            <g
              transform={`translate(${bx + 5} 18) scale(.8)`}
              fill="none" stroke={ativo ? APP.ciano : APP.apagado}
              strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: ICONE[nome] }}
            />
          </g>
        );
      })}
      <rect x="10" y="44" width="92" height="2" rx="1" fill={APP.ciano} fillOpacity=".85" />
    </Tela>
  );
}

/* ------------------------------------------------------------------ */
/* Dê acabamento — a agulha trava, reforça, pausa e trava de novo      */
/* ------------------------------------------------------------------ */

export function IlustracaoAcabamento() {
  const dur = '7s';
  const y = 106;
  const ini = 34, fim = 286;
  const reforco = 128;
  const pausa = 204;
  const trava = 24;
  const f = (x: number) => (x - ini) / (fim - ini);
  // cada passada da trava leva 1/30 do ciclo; a do fim começa em 76%
  const passo = 0.1 / 3;
  const travaFim = 0.76;

  // Percurso da agulha: [posição na costura, momento do ciclo]. Na trava ela
  // vai, volta e vai; no reforço passa e volta; na pausa fica parada.
  const agulha: Array<[number, number]> = [
    [f(ini), 0],
    [f(ini + trava), passo], [f(ini), 2 * passo], [f(ini + trava), 3 * passo],
    [f(reforco), 0.28], [f(reforco + 8), 0.3], [f(reforco - 8), 0.32], [f(reforco), 0.34],
    [f(pausa), 0.5], [f(pausa), 0.62],
    [f(fim - trava), travaFim], [f(fim), travaFim + passo], [f(fim - trava), travaFim + 2 * passo], [f(fim), travaFim + 3 * passo],
    [f(fim), 1],
  ];
  // A linha costurada vai até o ponto mais longe que a agulha já chegou.
  let longe = 0;
  const costurado = agulha.map(([p]) => 1 - (longe = Math.max(longe, p)));
  const momentos = tempos(...agulha.map(([, m]) => m));

  // Cada passada da trava vira uma linha vermelha, na ordem em que acontece.
  const passadas = (x0: number, x1: number, t0: number) => [
    { d: `M${x0} ${y - 2.5}H${x1}`, de: t0, ate: t0 + passo },
    { d: `M${x1} ${y}H${x0}`, de: t0 + passo, ate: t0 + 2 * passo },
    { d: `M${x0} ${y + 2.5}H${x1}`, de: t0 + 2 * passo, ate: t0 + 3 * passo },
  ];
  const travas = [...passadas(ini, ini + trava, 0), ...passadas(fim - trava, fim, travaFim)];

  return (
    <Tela rotulo="Acabamento no arquivo: a agulha faz a trava no começo, reforça no meio, para na pausa e trava no fim">
      {/* a costura, apagada até a agulha passar */}
      <path d={`M${ini} ${y}H${fim}`} stroke={APAGADO} strokeWidth="1.8" />

      {/* o que a agulha já costurou */}
      <path
        d={`M${ini} ${y}H${fim}`} stroke={APP.verde} strokeWidth="2.4" pathLength="1"
        strokeDasharray="1" strokeDashoffset="1" className={css.simTrilha}
      >
        <animate attributeName="stroke-dashoffset" values={tempos(...costurado)} keyTimes={momentos} dur={dur} repeatCount="indefinite" />
      </path>
      <g stroke={APP.eixoX} strokeWidth="1.6" strokeLinecap="round">
        {travas.map((p) => (
          <path key={p.d} d={p.d} pathLength="1" strokeDasharray="1" strokeDashoffset="1" className={css.simTrilha}>
            <Desenha de={p.de} ate={p.ate} dur={dur} />
          </path>
        ))}
      </g>

      {/* marcas do desenho, por cima da costura: ficam apagadas até a agulha chegar nelas */}
      <g className={css.simMarca} opacity=".4">
        <animate attributeName="opacity" values=".4;1" keyTimes={tempos(0, 0.32)} calcMode="discrete" dur={dur} repeatCount="indefinite" />
        <g stroke={APP.laranja} fill={APP.laranja} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path
            d={`M${reforco - 12} ${y}H${reforco - 3}M${reforco - 7} ${y - 4}L${reforco - 3} ${y}L${reforco - 7} ${y + 4}` +
               `M${reforco + 12} ${y}H${reforco + 3}M${reforco + 7} ${y - 4}L${reforco + 3} ${y}L${reforco + 7} ${y + 4}`}
            fill="none"
          />
          <circle cx={reforco} cy={y} r="2.8" stroke="none" />
        </g>
      </g>
      <g className={css.simMarca} opacity=".4">
        <animate attributeName="opacity" values=".4;1" keyTimes={tempos(0, 0.5)} calcMode="discrete" dur={dur} repeatCount="indefinite" />
        <circle cx={pausa} cy={y} r="10" fill={APP.fundo} stroke={APP.roxo} strokeWidth="1.9" />
        <path d={`M${pausa - 3} ${y - 4.5}v9M${pausa + 3} ${y - 4.5}v9`} stroke={APP.roxo} strokeWidth="1.9" strokeLinecap="round" />
        <text x={pausa + 16} y={y - 12} fill={APP.roxo} fontSize="9.5" fontWeight="600">5s</text>
      </g>
      {/* o tempo da pausa correndo em volta do botão */}
      <circle
        cx={pausa} cy={y} r="15" fill="none" stroke={APP.roxo} strokeWidth="2" pathLength="1"
        strokeDasharray="1" transform={`rotate(-90 ${pausa} ${y})`} className={css.simAgulha} opacity="0"
      >
        <animate attributeName="stroke-dashoffset" values="0;0;1;1" keyTimes={tempos(0, 0.5, 0.62, 1)} dur={dur} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;0" keyTimes={tempos(0, 0.5, 0.62)} calcMode="discrete" dur={dur} repeatCount="indefinite" />
      </circle>

      <Agulha caminho={`M${ini} ${y}H${fim}`} pontos={tempos(...agulha.map(([p]) => p))} momentos={momentos} dur={dur} />

      {/* nomes */}
      <text x={ini + 12} y={y + 30} textAnchor="middle" fill={APP.eixoX} fontSize="9.5" fontWeight="600">trava</text>
      <text x={reforco} y={y + 30} textAnchor="middle" fill={APP.laranja} fontSize="9.5" fontWeight="600">reforço</text>
      <text x={pausa} y={y + 30} textAnchor="middle" fill={APP.roxo} fontSize="9.5" fontWeight="600">pausa</text>
      <text x={fim - 12} y={y + 30} textAnchor="middle" fill={APP.eixoX} fontSize="9.5" fontWeight="600">trava</text>
    </Tela>
  );
}

/* ------------------------------------------------------------------ */
/* Confira — a agulha percorre a costura dentro do quadro da máquina   */
/* ------------------------------------------------------------------ */

// Percurso contínuo em serpentina: três ondas ligadas por curvas de retorno.
const SERPENTINA =
  onda(56, 264, 56, 13, 4.5) +
  'A23 23 0 0 1 264 102' +
  onda(264, 56, 102, 13, 4.5, true) +
  'A23 23 0 0 0 56 148' +
  onda(56, 264, 148, 13, 4.5, true);

export function IlustracaoSimulacao() {
  return (
    <Tela rotulo="Simulação dentro do quadro da máquina: a agulha percorre o desenho e a tela confirma que a peça cabe">
      {/* o quadro da máquina, tracejado como no app */}
      <rect x="18" y="24" width="284" height="140" rx="2" fill="none" stroke={APP.ambar} strokeOpacity=".6" strokeDasharray="6 4" />
      <text x="24" y="17" fill={APP.ambar} fillOpacity=".85" fontSize="7.5" fontWeight="600" letterSpacing=".6">QUADRO DA MÁQUINA</text>

      <CosturaAnimada id="cadil-serpentina" d={SERPENTINA} dur="7s" />

      {/* painel da simulação: progresso e conferência do quadro */}
      <rect x="10" y="172" width="300" height="20" rx="5" fill="#0B0F13" stroke={APP.borda} />
      <path d="M18 177l7 5-7 5z" fill={APP.verde} />
      <text x="30" y="185.5" fill={APP.linha} fontSize="8.5" fontWeight="600">Simulação</text>
      <rect x="84" y="180.5" width="56" height="3" rx="1.5" fill={APP.borda} />
      <rect x="84" y="180.5" width="56" height="3" rx="1.5" fill={APP.verde} className={css.simBarra}>
        <animate attributeName="width" values="0;56;56" keyTimes="0;0.85;1" dur="7s" repeatCount="indefinite" />
      </rect>
      <path d="M220 182l3 3 6-6" fill="none" stroke={APP.verde} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <text x="302" y="185.5" textAnchor="end" fill={APP.verde} fontSize="8.5" fontWeight="600">Cabe no quadro</text>
    </Tela>
  );
}

/* ------------------------------------------------------------------ */
/* Envie — o desenho.ngc sai pronto e vai direto para a máquina        */
/* ------------------------------------------------------------------ */

// Trecho real do NGC que o app gera (formato de coordenadas e comentários).
const NGC = [
  { t: '(* SHAPE Nr: 1 *)', c: APP.apagado },
  { t: 'M3 (liga cabeçote)', c: APP.ambar },
  { t: 'G1 X[0012.5000*#1+#39]', c: APP.ciano },
  { t: 'G1 X[0025.0000*#1+#39]', c: APP.ciano },
  { t: 'G1 X[0037.5000*#1+#39]', c: APP.ciano },
  { t: '(post shape)', c: APP.apagado },
  { t: 'M2 (Fim do programa)', c: APP.ambar },
];

export function IlustracaoArquivo() {
  const dur = '6s';
  // o código sai linha a linha, o arquivo vai para a máquina e ela costura
  const linhaEm = (i: number) => 0.05 + i * 0.05;
  const voo = { de: 0.4, ate: 0.52 };
  const costura = { de: 0.55, ate: 0.85 };

  // a agulha sobe e desce enquanto a máquina costura
  const sobeDesce: Array<[number, number]> = [[0, 0], [costura.de, 0]];
  for (let k = 1; k <= 12; k++) sobeDesce.push([costura.de + k * 0.025, k % 2 ? 3.5 : 0]);
  sobeDesce.push([1, 0]);

  return (
    <Tela rotulo="O arquivo desenho.ngc sai pronto do Ezermec CAD e vai direto para a máquina Fischertec, que começa a costurar">
      <defs>
        <mask id="cadil-pontos" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <path
            d="M226 150H302" stroke="#fff" strokeWidth="8" pathLength="1"
            strokeDasharray="1" strokeDashoffset="1" className={css.simTrilha}
          >
            <Desenha de={costura.de} ate={costura.ate} dur={dur} />
          </path>
        </mask>
      </defs>

      {/* o arquivo */}
      <path d="M20 32a8 8 0 0 1 8-8h112l20 20v122a8 8 0 0 1-8 8H28a8 8 0 0 1-8-8z" fill={APP.painel} stroke={APP.borda} />
      <path d="M140 24v12a8 8 0 0 0 8 8h12" fill="none" stroke={APP.borda} />
      <path d="M32 36h8l3 3v10H32z" fill="none" stroke={APP.apagado} strokeWidth="1.1" strokeLinejoin="round" />
      <text x="50" y="47" fill={APP.linha} fontSize="10" fontWeight="600">desenho.ngc</text>
      <path d="M28 58H152" stroke={APP.borda} />
      <g className={css.simMarca}>
        <animate attributeName="opacity" values="1;1;0" keyTimes={tempos(0, 0.94, 1)} dur={dur} repeatCount="indefinite" />
        {NGC.map((l, i) => (
          <text key={l.t} x="30" y={74 + i * 14} fill={l.c} fontSize="8" className={css.simMarca}>
            <Aparece em={linhaEm(i)} dur={dur} />
            {l.t}
          </text>
        ))}
      </g>

      {/* direto para a máquina — o rótulo cabe entre o arquivo e o círculo */}
      <text x="195" y="86" textAnchor="middle" fill={APP.verde} fontSize="7.2" fontWeight="600" letterSpacing=".3">SEM CONVERSOR</text>
      <path d="M172 99H212" stroke={APP.laranja} strokeWidth="2" strokeLinecap="round" />
      <path d="M208 93l8 6-8 6" fill="none" stroke={APP.laranja} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* o arquivo indo pela seta */}
      <circle r="4" fill="#fff" stroke={APP.laranja} strokeWidth="2" opacity="0" className={css.simAgulha}>
        <animateMotion path="M172 99H212" keyPoints="0;0;1;1" keyTimes={tempos(0, voo.de, voo.ate, 1)} calcMode="linear" dur={dur} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;0" keyTimes={tempos(0, voo.de, voo.ate)} calcMode="discrete" dur={dur} repeatCount="indefinite" />
      </circle>

      {/* a máquina: agulha com linha, e a costura saindo embaixo */}
      <circle cx="264" cy="96" r="38" fill={APP.painel} stroke={APP.verde} strokeWidth="1.5" />
      <g className={css.simParado}>
        <animateTransform
          attributeName="transform" type="translate"
          values={sobeDesce.map(([, dy]) => `0 ${dy}`).join(';')}
          keyTimes={tempos(...sobeDesce.map(([m]) => m))}
          dur={dur} repeatCount="indefinite"
        />
        <path d="M264 68V112" stroke={APP.linha} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M262.2 112h3.6L264 121z" fill={APP.linha} />
        <ellipse cx="264" cy="75" rx="1.1" ry="3.6" fill={APP.painel} />
        <path d="M265 75c18-6 23 20 9 30" fill="none" stroke={APP.laranja} strokeWidth="1.3" strokeLinecap="round" />
      </g>
      <path d="M230 150H298" stroke={APAGADO} strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />
      <path d="M230 150H298" stroke={APP.verde} strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" mask="url(#cadil-pontos)" />
      <text x="264" y="172" textAnchor="middle" fill={APP.apagado} fontSize="8.5" fontWeight="600">Máquina Fischertec</text>
    </Tela>
  );
}

/* ------------------------------------------------------------------ */
/* Interligar — o mesmo desenho costurado antes e depois do botão      */
/* ------------------------------------------------------------------ */

// Os dois lados usam a mesma velocidade de costura e o mesmo ciclo, então
// rodam juntos como uma corrida: com o Interligar a peça fica pronta antes,
// mesmo com o caminho mais comprido, porque a máquina não para.
const CICLO = '10s';

// Seis quadros de colchão, em duas fileiras, cada um com um losango.
const LOSANGO = { a: 28, b: 26 };
type Ponto = readonly [number, number];
const QUADROS: readonly Ponto[] = [
  [88, 78], [160, 78], [232, 78],
  [88, 144], [160, 144], [232, 144],
];

const esq = ([cx, cy]: Ponto) => `${cx - LOSANGO.a} ${cy}`;
const topo = ([cx, cy]: Ponto) => `${cx} ${cy - LOSANGO.b}`;
const dir = ([cx, cy]: Ponto) => `${cx + LOSANGO.a} ${cy}`;
const base = ([cx, cy]: Ponto) => `${cx} ${cy + LOSANGO.b}`;
const losango = (q: Ponto) => `M${esq(q)}L${topo(q)}L${dir(q)}L${base(q)}Z`;

/**
 * O caminho único que o Interligar monta: em cada fileira a agulha vai pelas
 * metades de cima dos losangos e volta pelas de baixo, e desce para a fileira
 * seguinte pela lateral — sem levantar a agulha nenhuma vez.
 */
const CORRENTE = (() => {
  const fileira = (q: readonly Ponto[]) =>
    q.map((p) => `L${esq(p)}L${topo(p)}L${dir(p)}`).join('') +
    [...q].reverse().map((p) => `L${dir(p)}L${base(p)}L${esq(p)}`).join('');
  return `M${esq(QUADROS[0])}` + fileira(QUADROS.slice(0, 3)) + fileira(QUADROS.slice(3));
})();

// Com o Interligar a costura toda leva 68% do ciclo.
const FIM_CORRENTE = 0.68;

/**
 * Sem interligar: cada losango é uma costura. A agulha costura na mesma
 * velocidade, mas entre um e outro para, corta a linha e pula.
 */
const SEPARADAS = (() => {
  const perimetro = 4 * Math.hypot(LOSANGO.a, LOSANGO.b);
  const costura = 0.094;
  const salto = 0.06;
  const trechos = QUADROS.map((q, i) => ({ q, de: i * (costura + salto), ate: i * (costura + salto) + costura }));

  const saltos = QUADROS.slice(1).map((q, i) => {
    const antes = QUADROS[i];
    const mesmaFileira = antes[1] === q[1];
    return {
      d: `M${esq(antes)}L${esq(q)}`,
      comprimento: Math.hypot(q[0] - antes[0], q[1] - antes[1]),
      em: trechos[i].ate,
      // A tesoura fica no vão entre os losangos, longe dos números: acima do
      // salto na primeira fileira, abaixo na segunda, e no meio do salto que
      // desce de uma fileira para a outra.
      tesoura: mesmaFileira
        ? [(antes[0] + q[0]) / 2, q[1] + (q[1] === QUADROS[0][1] ? -20 : 20)]
        : [(antes[0] + q[0]) / 2 - LOSANGO.a, (antes[1] + q[1]) / 2],
    };
  });

  // caminho da agulha: losango, salto, losango, salto...
  const caminho =
    `M${esq(QUADROS[0])}` +
    QUADROS.map((q, i) => `${i ? `L${esq(q)}` : ''}L${topo(q)}L${dir(q)}L${base(q)}L${esq(q)}`).join('');
  const total = QUADROS.length * perimetro + saltos.reduce((s, x) => s + x.comprimento, 0);

  const pontos = [0];
  const momentos = [0];
  let andado = 0;
  trechos.forEach((t, i) => {
    if (i) {
      andado += saltos[i - 1].comprimento;
      pontos.push(andado / total);
      momentos.push(t.de);
    }
    andado += perimetro;
    pontos.push(Math.min(andado / total, 1));
    momentos.push(t.ate);
  });
  pontos.push(1);
  momentos.push(1);

  return { trechos, saltos, caminho, pontos: tempos(...pontos), momentos: tempos(...momentos), fim: trechos[trechos.length - 1].ate };
})();

/** Número da costura, no ponto em que ela começa. */
function Inicio({ q, n }: { q: Ponto; n: number }) {
  const [cx, cy] = q;
  return (
    <>
      <circle cx={cx - LOSANGO.a} cy={cy} r="8.5" fill="#0B0F13" stroke={APP.verde} strokeWidth="1.4" />
      <text x={cx - LOSANGO.a} y={cy + 3.3} textAnchor="middle" fill={APP.verde} fontSize="9.5" fontWeight="600">{n}</text>
    </>
  );
}

/** Tesoura pequena: a linha é cortada neste salto. */
function Tesoura({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="7.5" fill="#0B0F13" stroke={APP.vermelho} strokeWidth="1" />
      <g fill="none" stroke={APP.vermelho} strokeWidth="1.2" strokeLinecap="round">
        <circle cx="-2.4" cy="2.6" r="1.5" />
        <circle cx="2.4" cy="2.6" r="1.5" />
        <path d="M-1.4 1.4L2.8-4M1.4 1.4L-2.8-4" />
      </g>
    </g>
  );
}

export function InterligarAntes() {
  const { trechos, saltos, caminho, pontos, momentos, fim } = SEPARADAS;
  return (
    <Tela rotulo="Sem interligar: seis costuras separadas; entre uma e outra a máquina para, corta a linha e pula">
      <defs>
        {/* revela os furos de cada losango conforme ele é costurado */}
        <mask id="cadil-separadas-costurado">
          {trechos.map((t) => (
            <path
              key={`m${t.q}`} d={losango(t.q)} pathLength="1" fill="none" stroke="#fff" strokeWidth="10"
              strokeDasharray="1" strokeDashoffset="1" className={css.simTrilha}
            >
              <Desenha de={t.de} ate={t.ate} dur={CICLO} />
            </path>
          ))}
        </mask>
      </defs>

      {QUADROS.map((q) => (
        <path key={`b${q}`} d={losango(q)} fill="none" stroke={APAGADO} strokeWidth="2" strokeLinejoin="round" />
      ))}

      {/* saltos entre as costuras: a agulha levanta e a linha é cortada */}
      {saltos.map((s) => (
        <path
          key={s.d} d={s.d} stroke={APP.vermelho} strokeOpacity=".85" strokeWidth="1.3" strokeDasharray="2 4"
          className={css.simMarca}
        >
          <Aparece em={s.em} dur={CICLO} />
        </path>
      ))}

      {trechos.map((t) => (
        <path
          key={`c${t.q}`} d={losango(t.q)} pathLength="1" fill="none" stroke={APP.verde} strokeWidth="2.4"
          strokeLinejoin="round" strokeDasharray="1" strokeDashoffset="1" className={css.simTrilha}
        >
          <Desenha de={t.de} ate={t.ate} dur={CICLO} />
        </path>
      ))}
      <path
        d={QUADROS.map(losango).join('')} fill="none" stroke={APP.verdeClaro} strokeWidth="2.6"
        strokeLinecap="round" strokeDasharray="0 7" mask="url(#cadil-separadas-costurado)"
      />

      {QUADROS.map((q, i) => <Inicio key={`n${q}`} q={q} n={i + 1} />)}

      {saltos.map((s) => (
        <g key={`t${s.d}`} className={css.simMarca}>
          <Aparece em={s.em} dur={CICLO} />
          <Tesoura x={s.tesoura[0]} y={s.tesoura[1]} />
        </g>
      ))}

      <Agulha caminho={caminho} pontos={pontos} momentos={momentos} dur={CICLO} some={fim} />
      <Pronto em={fim} dur={CICLO} />
    </Tela>
  );
}

export function InterligarDepois() {
  return (
    <Tela rotulo="Com Interligar: o mesmo desenho vira uma costura só, e a agulha percorre tudo sem parar">
      <CosturaAnimada id="cadil-corrente" d={CORRENTE} dur={CICLO} fim={FIM_CORRENTE} />
      <Inicio q={QUADROS[0]} n={1} />
      <Pronto em={FIM_CORRENTE} dur={CICLO} />
    </Tela>
  );
}
