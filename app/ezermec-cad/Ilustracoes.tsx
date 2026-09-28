// Ilustrações dos quatro passos do Ezermec CAD.
//
// São desenhadas em SVG com o visual do próprio aplicativo: as cores vêm do
// tema do app (--graphite, --cyan, verde da ordem, vermelho dos saltos, agulha
// laranja da simulação) e o arquivo mostra o G-code que ele realmente gera.
// Não são prints — são esquemas, para explicar cada passo num relance.

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
  eixoX: '#E5484D',
  eixoY: '#57A94B',
};

const W = 320;
const H = 200;

// Grade de fundo, como uma folha de CAD.
const GRADE = (() => {
  let d = '';
  for (let x = 20; x < W; x += 20) d += `M${x} 0V${H}`;
  for (let y = 20; y < H; y += 20) d += `M0 ${y}H${W}`;
  return d;
})();

function Tela({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={rotulo} className={css.art}>
      <rect width={W} height={H} fill={APP.fundo} />
      <path d={GRADE} stroke={APP.grade} strokeWidth="1" />
      {children}
    </svg>
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

/* ------------------------------------------------------------------ */
/* 1. Desenhe — treliça sendo desenhada, com a ferramenta Linha ativa  */
/* ------------------------------------------------------------------ */

// Ícones das ferramentas, iguais aos do app (caixa de 20x20).
const ICONE = {
  linha: '<path d="M3 17L17 3"/><circle cx="3" cy="17" r="1.6"/><circle cx="17" cy="3" r="1.6"/>',
  arco: '<path d="M3 15a7 7 0 0 1 14 0"/>',
  circulo: '<circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="1"/>',
};

export function IlustracaoDesenho() {
  // moldura do desenho; a origem da máquina fica no canto inferior esquerdo
  const x0 = 116, y0 = 50, x1 = 292, y1 = 170;
  const alt = y1 - y0;
  const passos: number[] = [];
  for (let c = x0 - alt; c <= x1; c += 30) passos.push(c);
  // "/" já desenhadas até esta, a próxima está sendo traçada
  const atual = x0 + 30;
  const fim = { x: atual + 72, y: y1 - 72 };

  return (
    <Tela rotulo="Desenho de uma treliça de costura com a ferramenta Linha">
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

      {/* a linha que está sendo desenhada agora */}
      <path d={`M${atual} ${y1}L${fim.x} ${fim.y}`} stroke={APP.ciano} strokeWidth="1.8" />
      <circle cx={atual} cy={y1} r="2.4" fill={APP.ciano} />
      <path d={`M${fim.x - 9} ${fim.y}h18M${fim.x} ${fim.y - 9}v18`} stroke={APP.ciano} strokeWidth="1.2" />
      <rect x={fim.x + 8} y={fim.y - 30} width="68" height="18" rx="4" fill="#0B0F13" stroke={APP.borda} />
      <text x={fim.x + 42} y={fim.y - 18} textAnchor="middle" fill={APP.ciano} fontSize="9.5">101,8 &lt; 45°</text>

      {/* pedaço da barra de ferramentas, grupo Esboço */}
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
/* 2. Ordene — percursos numerados e saltos no menor caminho           */
/* ------------------------------------------------------------------ */

export function IlustracaoOrdem() {
  const xa = 62, xb = 262;
  const linhas = [52, 88, 124, 160];

  return (
    <Tela rotulo="Ordem da costura: quatro percursos numerados, com saltos curtos entre eles">
      {linhas.map((y, i) => {
        const vai = i % 2 === 0;
        const ini = vai ? xa : xb;
        const fimX = vai ? xb : xa;
        const proximo = linhas[i + 1];
        const rot = vai ? xa - 22 : xb + 22;
        return (
          <g key={y}>
            <path d={onda(ini, fimX, y, 20, 5)} fill="none" stroke={APP.linha} strokeWidth="1.8" />
            {/* salto até o próximo percurso: curto, porque a ordem alterna o sentido */}
            {proximo !== undefined && (
              <path
                d={`M${fimX} ${y}V${proximo}`}
                stroke={APP.vermelho} strokeOpacity=".75" strokeWidth="1.3" strokeDasharray="2 4"
              />
            )}
            <circle cx={ini} cy={y} r="3" fill="none" stroke={APP.verde} strokeWidth="1.5" />
            <circle cx={rot} cy={y} r="10" fill="#0B0F13" stroke={APP.verde} strokeWidth="1.5" />
            <text x={rot} y={y + 3.8} textAnchor="middle" fill={APP.verde} fontSize="11" fontWeight="600">{i + 1}</text>
          </g>
        );
      })}

      <rect x="10" y="10" width="170" height="20" rx="5" fill={APP.painel} stroke={APP.borda} />
      <text x="20" y="23.5" fill={APP.verde} fontSize="8.5" fontWeight="600" letterSpacing=".6">ORDEM AUTOMÁTICA · MENOR CAMINHO</text>
    </Tela>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Simule — a agulha percorre a costura e marca os pontos           */
/* ------------------------------------------------------------------ */

// Percurso contínuo em serpentina: três ondas ligadas por curvas de retorno.
const SERPENTINA =
  onda(56, 264, 54, 13, 4.5) +
  'A24 24 0 0 1 264 102' +
  onda(264, 56, 102, 13, 4.5, true) +
  'A24 24 0 0 0 56 150' +
  onda(56, 264, 150, 13, 4.5, true);

// A animação anda de 0 a 82% do tempo e segura o desenho pronto até o fim.
const DUR = '7s';
const TEMPOS = '0;0.82;1';

export function IlustracaoSimulacao() {
  return (
    <Tela rotulo="Simulação: a agulha percorre o desenho e marca cada ponto da costura">
      <defs>
        <path id="cadil-serpentina" d={SERPENTINA} />
        {/* máscara que revela os furos só por onde a agulha já passou */}
        <mask id="cadil-costurado">
          <path
            d={SERPENTINA} pathLength="1" fill="none" stroke="#fff" strokeWidth="10"
            strokeDasharray="1" strokeDashoffset="1" className={css.simTrilha}
          >
            <animate attributeName="stroke-dashoffset" values="1;0;0" keyTimes={TEMPOS} dur={DUR} repeatCount="indefinite" />
          </path>
        </mask>
      </defs>

      {/* desenho ainda não costurado, apagado como no app */}
      <use href="#cadil-serpentina" fill="none" stroke="rgba(220,227,234,.2)" strokeWidth="2" />

      {/* trecho já costurado */}
      <path
        d={SERPENTINA} pathLength="1" fill="none" stroke={APP.verde} strokeWidth="2.4"
        strokeDasharray="1" strokeDashoffset="1" className={css.simTrilha}
      >
        <animate attributeName="stroke-dashoffset" values="1;0;0" keyTimes={TEMPOS} dur={DUR} repeatCount="indefinite" />
      </path>

      {/* furos da agulha a cada ponto */}
      <path
        d={SERPENTINA} fill="none" stroke={APP.verdeClaro} strokeWidth="2.6" strokeLinecap="round"
        strokeDasharray="0 7" mask="url(#cadil-costurado)"
      />

      {/* a agulha */}
      <circle r="5" fill={APP.laranja} stroke="#fff" strokeWidth="1.6" className={css.simAgulha}>
        <animateMotion dur={DUR} repeatCount="indefinite" keyPoints="0;1;1" keyTimes={TEMPOS} calcMode="linear">
          <mpath href="#cadil-serpentina" />
        </animateMotion>
      </circle>

      {/* painel da simulação, com a barra de progresso */}
      <rect x="10" y="172" width="134" height="20" rx="5" fill="#0B0F13" stroke={APP.borda} />
      <path d="M18 177l7 5-7 5z" fill={APP.verde} />
      <text x="30" y="185.5" fill={APP.linha} fontSize="8.5" fontWeight="600">Simulação</text>
      <rect x="84" y="180.5" width="52" height="3" rx="1.5" fill={APP.borda} />
      <rect x="84" y="180.5" width="52" height="3" rx="1.5" fill={APP.verde} className={css.simBarra}>
        <animate attributeName="width" values="0;52;52" keyTimes={TEMPOS} dur={DUR} repeatCount="indefinite" />
      </rect>
    </Tela>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Envie — o desenho.ngc sai pronto e vai direto para a máquina     */
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
  return (
    <Tela rotulo="O arquivo desenho.ngc sai pronto do Ezermec CAD e vai direto para a máquina Fischertec">
      {/* o arquivo */}
      <path d="M20 32a8 8 0 0 1 8-8h112l20 20v122a8 8 0 0 1-8 8H28a8 8 0 0 1-8-8z" fill={APP.painel} stroke={APP.borda} />
      <path d="M140 24v12a8 8 0 0 0 8 8h12" fill="none" stroke={APP.borda} />
      <path d="M32 36h8l3 3v10H32z" fill="none" stroke={APP.apagado} strokeWidth="1.1" strokeLinejoin="round" />
      <text x="50" y="47" fill={APP.linha} fontSize="10" fontWeight="600">desenho.ngc</text>
      <path d="M28 58H152" stroke={APP.borda} />
      {NGC.map((l, i) => (
        <text key={l.t} x="30" y={74 + i * 14} fill={l.c} fontSize="8">{l.t}</text>
      ))}

      {/* direto para a máquina — o rótulo cabe entre o arquivo e o círculo */}
      <text x="195" y="86" textAnchor="middle" fill={APP.verde} fontSize="7.2" fontWeight="600" letterSpacing=".3">SEM CONVERSOR</text>
      <path d="M172 99H212" stroke={APP.laranja} strokeWidth="2" strokeLinecap="round" />
      <path d="M208 93l8 6-8 6" fill="none" stroke={APP.laranja} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* a máquina: agulha com linha, e a costura saindo embaixo */}
      <circle cx="264" cy="96" r="38" fill={APP.painel} stroke={APP.verde} strokeWidth="1.5" />
      <path d="M264 68V112" stroke={APP.linha} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M262.2 112h3.6L264 121z" fill={APP.linha} />
      <ellipse cx="264" cy="75" rx="1.1" ry="3.6" fill={APP.painel} />
      <path d="M265 75c18-6 23 20 9 30" fill="none" stroke={APP.laranja} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M230 150H298" stroke={APP.verde} strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />
      <text x="264" y="172" textAnchor="middle" fill={APP.apagado} fontSize="8.5" fontWeight="600">Máquina Fischertec</text>
    </Tela>
  );
}
