// Ilustrações da página do Ezermec CAD.
//
// São desenhadas em SVG com o visual do próprio aplicativo: as cores vêm do
// tema do app (--graphite, --cyan, verde da costura, vermelho dos saltos,
// agulha laranja da simulação, reforço laranja e pausa roxa) e o arquivo mostra
// o G-code que ele realmente gera. Não são prints — são esquemas, para explicar
// cada coisa num relance.

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
 * Etiqueta no canto de cima, como os títulos de painel do app. A largura sai
 * do texto: na fonte mono cada letra ocupa 5,1 mais 0,6 de espaçamento.
 */
function Etiqueta({ texto, cor }: { texto: string; cor: string }) {
  const largura = Math.round(texto.length * 5.7 + 19);
  return (
    <>
      <rect x="10" y="10" width={largura} height="20" rx="5" fill={APP.painel} stroke={APP.borda} />
      <text x="20" y="23.5" fill={cor} fontSize="8.5" fontWeight="600" letterSpacing=".6">{texto}</text>
    </>
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
 * Costura animada: o desenho apagado por baixo, o trecho já costurado em verde,
 * os furos da agulha e a agulha andando. A animação anda de 0 a 85% do tempo e
 * segura o desenho pronto até o fim. `id` precisa ser único na página.
 */
function CosturaAnimada({ id, d, dur }: { id: string; d: string; dur: string }) {
  const tempos = '0;0.85;1';
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
            <animate attributeName="stroke-dashoffset" values="1;0;0" keyTimes={tempos} dur={dur} repeatCount="indefinite" />
          </path>
        </mask>
      </defs>

      {/* desenho ainda não costurado, apagado como no app */}
      <use href={`#${id}`} fill="none" stroke="rgba(220,227,234,.2)" strokeWidth="2" />

      {/* trecho já costurado */}
      <path
        d={d} pathLength="1" fill="none" stroke={APP.verde} strokeWidth="2.4" strokeLinejoin="round"
        strokeDasharray="1" strokeDashoffset="1" className={css.simTrilha}
      >
        <animate attributeName="stroke-dashoffset" values="1;0;0" keyTimes={tempos} dur={dur} repeatCount="indefinite" />
      </path>

      {/* furos da agulha a cada ponto */}
      <path
        d={d} fill="none" stroke={APP.verdeClaro} strokeWidth="2.6" strokeLinecap="round"
        strokeDasharray="0 7" mask={`url(#${id}-costurado)`}
      />

      {/* a agulha */}
      <circle r="5" fill={APP.laranja} stroke="#fff" strokeWidth="1.6" className={css.simAgulha}>
        <animateMotion dur={dur} repeatCount="indefinite" keyPoints="0;1;1" keyTimes={tempos} calcMode="linear">
          <mpath href={`#${id}`} />
        </animateMotion>
      </circle>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Desenhe — treliça sendo desenhada, com a ferramenta Linha ativa     */
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
    <Tela rotulo="Desenho de uma treliça de costura com a ferramenta Linha, com a medida da linha na tela">
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

      {/* a linha que está sendo desenhada agora, com a medida ao lado */}
      <path d={`M${atual} ${y1}L${fim.x} ${fim.y}`} stroke={APP.ciano} strokeWidth="1.8" />
      <circle cx={atual} cy={y1} r="2.4" fill={APP.ciano} />
      <path d={`M${fim.x - 9} ${fim.y}h18M${fim.x} ${fim.y - 9}v18`} stroke={APP.ciano} strokeWidth="1.2" />
      <rect x={fim.x + 8} y={fim.y - 30} width="62" height="18" rx="4" fill="#0B0F13" stroke={APP.borda} />
      <text x={fim.x + 39} y={fim.y - 18} textAnchor="middle" fill={APP.ciano} fontSize="9.5">1000 mm</text>

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
/* Dê acabamento — trava nas pontas, reforço e pausa na costura        */
/* ------------------------------------------------------------------ */

export function IlustracaoAcabamento() {
  const y = 106;
  const ini = 34, fim = 286;
  const reforco = 128;
  const pausa = 204;

  // Trava (retrocesso): a agulha vai e volta sobre a ponta da costura.
  const trava = (x0: number, x1: number) => (
    <path
      d={`M${x0} ${y - 2.5}H${x1}M${x1} ${y}H${x0}M${x0} ${y + 2.5}H${x1}`}
      stroke={APP.eixoX} strokeWidth="1.6" strokeLinecap="round"
    />
  );

  return (
    <Tela rotulo="Acabamento no arquivo: trava nas duas pontas da costura, reforço no meio e uma pausa marcada">
      <Etiqueta texto="ACABAMENTO NO ARQUIVO" cor={APP.verde} />

      {/* a costura */}
      <path d={`M${ini} ${y}H${fim}`} stroke={APP.linha} strokeWidth="1.8" />
      {trava(ini, ini + 24)}
      {trava(fim - 24, fim)}

      {/* reforço no meio da linha: duas setas encontrando-se no ponto, como no app */}
      <g stroke={APP.laranja} fill={APP.laranja} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path
          d={`M${reforco - 12} ${y}H${reforco - 3}M${reforco - 7} ${y - 4}L${reforco - 3} ${y}L${reforco - 7} ${y + 4}` +
             `M${reforco + 12} ${y}H${reforco + 3}M${reforco + 7} ${y - 4}L${reforco + 3} ${y}L${reforco + 7} ${y + 4}`}
          fill="none"
        />
        <circle cx={reforco} cy={y} r="2.8" stroke="none" />
      </g>

      {/* pausa: a máquina para neste ponto por alguns segundos */}
      <circle cx={pausa} cy={y} r="10" fill={APP.fundo} stroke={APP.roxo} strokeWidth="1.9" />
      <path d={`M${pausa - 3} ${y - 4.5}v9M${pausa + 3} ${y - 4.5}v9`} stroke={APP.roxo} strokeWidth="1.9" strokeLinecap="round" />
      <text x={pausa + 14} y={y - 10} fill={APP.roxo} fontSize="9.5" fontWeight="600">5s</text>

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

/* ------------------------------------------------------------------ */
/* Interligar — o mesmo desenho antes (cheio de saltos) e depois       */
/* ------------------------------------------------------------------ */

// Seis quadros de colchão, em duas fileiras, cada um com um losango.
const LOSANGO = { a: 28, b: 26 };
const QUADROS = [
  [88, 78], [160, 78], [232, 78],
  [88, 144], [160, 144], [232, 144],
] as const;

const esq = ([cx, cy]: readonly [number, number]) => `${cx - LOSANGO.a} ${cy}`;
const topo = ([cx, cy]: readonly [number, number]) => `${cx} ${cy - LOSANGO.b}`;
const dir = ([cx, cy]: readonly [number, number]) => `${cx + LOSANGO.a} ${cy}`;
const base = ([cx, cy]: readonly [number, number]) => `${cx} ${cy + LOSANGO.b}`;

/**
 * O caminho único que o Interligar monta: em cada fileira a agulha vai pelas
 * metades de cima dos losangos e volta pelas de baixo, e desce para a fileira
 * seguinte pela lateral — sem levantar a agulha nenhuma vez.
 */
const CORRENTE = (() => {
  const fileira = (q: ReadonlyArray<readonly [number, number]>) =>
    q.map((p) => `L${esq(p)}L${topo(p)}L${dir(p)}`).join('') +
    [...q].reverse().map((p) => `L${dir(p)}L${base(p)}L${esq(p)}`).join('');
  return `M${esq(QUADROS[0])}` + fileira(QUADROS.slice(0, 3)) + fileira(QUADROS.slice(3));
})();

/** Número da costura, no ponto em que ela começa. */
function Inicio({ q, n }: { q: readonly [number, number]; n: number }) {
  const [cx, cy] = q;
  return (
    <>
      <circle cx={cx - LOSANGO.a} cy={cy} r="8.5" fill="#0B0F13" stroke={APP.verde} strokeWidth="1.4" />
      <text x={cx - LOSANGO.a} y={cy + 3.3} textAnchor="middle" fill={APP.verde} fontSize="9.5" fontWeight="600">{n}</text>
    </>
  );
}

export function InterligarAntes() {
  return (
    <Tela rotulo="Sem interligar: seis costuras separadas, com saltos e cortes de linha entre elas">
      <Etiqueta texto="6 COSTURAS SEPARADAS" cor={APP.vermelho} />

      {/* saltos entre as costuras: a agulha levanta e a linha é cortada */}
      {QUADROS.slice(0, -1).map((q, i) => (
        <path
          key={`salto${i}`}
          d={`M${esq(q)}L${esq(QUADROS[i + 1])}`}
          stroke={APP.vermelho} strokeOpacity=".85" strokeWidth="1.3" strokeDasharray="2 4"
        />
      ))}
      {QUADROS.map((q) => (
        <path
          key={`q${q[0]}-${q[1]}`}
          d={`M${esq(q)}L${topo(q)}L${dir(q)}L${base(q)}Z`}
          fill="none" stroke={APP.linha} strokeWidth="1.8" strokeLinejoin="round"
        />
      ))}
      {QUADROS.map((q, i) => <Inicio key={`n${i}`} q={q} n={i + 1} />)}
    </Tela>
  );
}

export function InterligarDepois() {
  return (
    <Tela rotulo="Com Interligar: o mesmo desenho vira uma costura só, e a agulha percorre tudo sem parar">
      <Etiqueta texto="1 COSTURA SÓ" cor={APP.verde} />
      <CosturaAnimada id="cadil-corrente" d={CORRENTE} dur="8s" />
      <Inicio q={QUADROS[0]} n={1} />
    </Tela>
  );
}
