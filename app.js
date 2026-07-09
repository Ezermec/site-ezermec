/* Ezermec — site institucional
   Implementação do design Ezermec.dc.html em JavaScript puro. */
(function () {
  'use strict';

  // ---------- Configuração (props do design) ----------
  var CFG = {
    whatsappNumber: '5511940001234',
    phoneDisplay: '(11) 4000-1234',
    email: 'vendas@ezermec.com.br',
    perPage: 8
  };
  var WA = CFG.whatsappNumber.replace(/\D/g, '');
  var waHref = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Olá! Gostaria de mais informações sobre os produtos da Ezermec.');
  var mailGeneral = 'mailto:' + CFG.email + '?subject=' + encodeURIComponent('Contato - Ezermec');
  var telHref = 'tel:+55' + CFG.phoneDisplay.replace(/\D/g, '');
  var PROD_IMG = 'assets/produto-exemplo.webp';

  // ---------- Dados ----------
  var DATA = [
    { slug:'kit-regulagem-lancadeira', name:'Kit de Regulagem da Lançadeira', code:'EZ-LZ-1001', fab:'FZ-4420', brand:'Fischertec', cat:'Lançadeiras', supplier:'Fischertec Ind.', stock:'em', icon:'ph-gear', weight:'0,85 kg', dims:'180 × 120 × 60 mm', material:'Aço temperado', short:'Kit completo para ajuste fino e regulagem da lançadeira em máquinas de costura industrial.', full:'O Kit de Regulagem da Lançadeira reúne todas as peças e ferramentas necessárias para o ajuste preciso do tempo e da folga da lançadeira, garantindo pontos uniformes e reduzindo quebras de linha. Compatível com as principais máquinas de costura industrial e desenvolvido com o padrão de qualidade Fischertec.', tags:['lançadeira','regulagem','costura','kit','ajuste'] },
    { slug:'agulhas-costura-personalizadas', name:'Agulhas de Costura Personalizadas', code:'EZ-AG-2050', fab:'FZ-2050', brand:'Fischertec', cat:'Agulhas', supplier:'Fischertec Ind.', stock:'em', icon:'ph-needle', weight:'0,02 kg', dims:'Sob medida', material:'Aço-liga niquelado', short:'Agulhas fabricadas sob medida por tipo de tecido, ponto e máquina.', full:'Agulhas de costura personalizadas conforme a aplicação: espessura de tecido, tipo de ponto e modelo da máquina. Acabamento niquelado que reduz atrito e aquecimento, prolongando a vida útil e evitando falhas de costura. Produção sob especificação técnica do cliente.', tags:['agulha','costura','personalizada','sob medida'] },
    { slug:'quadros-tecidos-costura', name:'Quadros para Tecidos de Costura', code:'EZ-QD-3300', fab:'EZ-QD-3300', brand:'Ezermec', cat:'Quadros e Bastidores', supplier:'Ezermec', stock:'baixo', icon:'ph-frame-corners', weight:'1,20 kg', dims:'Sob medida', material:'Alumínio anodizado', short:'Quadros e bastidores para prender tecidos com medidas específicas.', full:'Quadros para fixação e tensionamento de tecidos, fabricados com medidas específicas conforme a necessidade do processo de costura ou bordado. Estrutura em alumínio anodizado, leve e resistente, com fixação uniforme que evita franzimento do tecido.', tags:['quadro','bastidor','tecido','medida','bordado'] },
    { slug:'rolamento-6205-2z', name:'Rolamento Rígido de Esferas 6205-2Z', code:'EZ-RL-6205', fab:'6205-2Z', brand:'SKF', cat:'Rolamentos', supplier:'Distribuidora Rolamentos SA', stock:'em', icon:'ph-circle', weight:'0,13 kg', dims:'Ø25 × Ø52 × 15 mm', material:'Aço cromo', short:'Rolamento blindado 6205-2Z para eixos de máquinas industriais.', full:'Rolamento rígido de uma carreira de esferas com blindagem dupla (2Z), vedado e pré-lubrificado. Alta capacidade de carga radial e baixo ruído, ideal para motores, ventiladores e eixos de transmissão industrial.', tags:['rolamento','6205','esferas','eixo'] },
    { slug:'correia-htd-5m', name:'Correia Dentada HTD 5M', code:'EZ-CR-5M', fab:'HTD-5M-450', brand:'Gates', cat:'Correias', supplier:'PowerTrans', stock:'em', icon:'ph-arrows-clockwise', weight:'0,08 kg', dims:'Passo 5 mm — 450 mm', material:'Neoprene / fibra de vidro', short:'Correia dentada de sincronismo perfil HTD 5M.', full:'Correia dentada de sincronismo perfil HTD 5M, com cordonéis de fibra de vidro para mínima elongação. Transmissão de potência sem escorregamento, ideal para sistemas que exigem sincronismo preciso.', tags:['correia','dentada','htd','sincronismo','transmissão'] },
    { slug:'motor-trifasico-1cv', name:'Motor Elétrico Trifásico 1cv', code:'EZ-MT-1CV', fab:'W22-1CV-4P', brand:'WEG', cat:'Motores', supplier:'WEG Motores', stock:'baixo', icon:'ph-engine', weight:'11,5 kg', dims:'Carcaça 80 — 4 polos', material:'Ferro fundido', short:'Motor trifásico 1cv 4 polos 220/380V para uso industrial.', full:'Motor elétrico de indução trifásico 1cv, 4 polos, 220/380V, carcaça 80 em ferro fundido. Alto rendimento, baixa manutenção e ampla compatibilidade com acionamentos industriais.', tags:['motor','trifásico','elétrico','1cv','weg'] },
    { slug:'polia-aluminio-2a', name:'Polia de Alumínio 2 Canais A', code:'EZ-PL-2A', fab:'PA-2A-100', brand:'Ezermec', cat:'Polias', supplier:'Ezermec', stock:'em', icon:'ph-disc', weight:'0,45 kg', dims:'Ø100 mm — furo 24 mm', material:'Alumínio fundido', short:'Polia em alumínio de 2 canais perfil A para correias em V.', full:'Polia de alumínio fundido com 2 canais perfil A, balanceada para operação em alta rotação. Leve e resistente à corrosão, ideal para sistemas de transmissão por correia em V.', tags:['polia','alumínio','canal','correia'] },
    { slug:'mancal-ucp-205', name:'Mancal de Rolamento UCP 205', code:'EZ-MC-205', fab:'UCP-205', brand:'NSK', cat:'Rolamentos', supplier:'Distribuidora Rolamentos SA', stock:'sem', icon:'ph-circle', weight:'0,7 kg', dims:'Furo Ø25 mm', material:'Ferro fundido + aço', short:'Mancal de pé com rolamento autocompensador UCP 205.', full:'Mancal de pé (pillow block) UCP 205 com rolamento autocompensador e fixação por parafuso prisioneiro. Fácil montagem e substituição, indicado para transportadores e eixos apoiados.', tags:['mancal','ucp','205','pillow block','rolamento'] },
    { slug:'valvula-pneumatica-52', name:'Válvula Pneumática 5/2 1/4"', code:'EZ-VP-52', fab:'FZ-VP52-14', brand:'Fischertec', cat:'Pneumática', supplier:'Fischertec Ind.', stock:'em', icon:'ph-wind', weight:'0,3 kg', dims:'Conexão 1/4"', material:'Alumínio / latão', short:'Válvula direcional 5/2 vias, acionamento por solenoide.', full:'Válvula direcional pneumática 5/2 vias com acionamento por solenoide e retorno por mola. Corpo em alumínio, conexão 1/4", ideal para comando de cilindros de dupla ação.', tags:['válvula','pneumática','5/2','solenoide','ar'] },
    { slug:'cilindro-hidraulico-40x200', name:'Cilindro Hidráulico 40x200', code:'EZ-CH-40200', fab:'FZ-CH-40200', brand:'Fischertec', cat:'Hidráulica', supplier:'Fischertec Ind.', stock:'em', icon:'ph-drop', weight:'4,2 kg', dims:'Ø40 mm — curso 200 mm', material:'Aço cromado', short:'Cilindro hidráulico dupla ação Ø40 curso 200 mm.', full:'Cilindro hidráulico de dupla ação, haste cromada Ø40 mm e curso de 200 mm. Vedações de alta durabilidade para pressões de trabalho elevadas em prensas e equipamentos industriais.', tags:['cilindro','hidráulico','dupla ação','prensa'] },
    { slug:'contator-tripolar-25a', name:'Contator Tripolar 25A', code:'EZ-CT-25A', fab:'CWB25-11', brand:'WEG', cat:'Componentes Elétricos', supplier:'WEG Automação', stock:'em', icon:'ph-lightning', weight:'0,4 kg', dims:'25A — bobina 220V', material:'Termoplástico', short:'Contator tripolar 25A com bobina 220V para comando de motores.', full:'Contator tripolar 25A, bobina 220V, com contato auxiliar NA+NF. Robusto e compacto, indicado para acionamento e proteção de motores em painéis de comando.', tags:['contator','tripolar','25a','elétrico','painel'] },
    { slug:'corrente-rolos-asa-40', name:'Corrente de Rolos ASA 40', code:'EZ-CN-40', fab:'ASA-40', brand:'Ezermec', cat:'Correntes', supplier:'PowerTrans', stock:'baixo', icon:'ph-link-simple', weight:'1,0 kg/m', dims:'Passo 12,7 mm', material:'Aço', short:'Corrente de rolos simples ASA 40, passo 12,7 mm.', full:'Corrente de rolos de fileira simples padrão ASA 40, passo 12,7 mm. Tratamento térmico para maior resistência ao desgaste em transmissões de potência.', tags:['corrente','rolos','asa40','transmissão'] },
    { slug:'engrenagem-conica-z20', name:'Engrenagem Cônica Z20', code:'EZ-EG-Z20', fab:'EC-Z20', brand:'Ezermec', cat:'Engrenagens', supplier:'Ezermec', stock:'em', icon:'ph-gear-six', weight:'0,6 kg', dims:'20 dentes — módulo 2', material:'Aço 1045', short:'Engrenagem cônica de 20 dentes módulo 2.', full:'Engrenagem cônica reta de 20 dentes, módulo 2, em aço 1045 usinado. Para transmissão de movimento entre eixos a 90°, com dentes retificados para operação suave.', tags:['engrenagem','cônica','z20','transmissão'] },
    { slug:'bobina-carretilha-lancadeira', name:'Bobina / Carretilha para Lançadeira', code:'EZ-LZ-1102', fab:'FZ-BB-11', brand:'Fischertec', cat:'Lançadeiras', supplier:'Fischertec Ind.', stock:'em', icon:'ph-gear', weight:'0,05 kg', dims:'Ø20 mm', material:'Aço inox', short:'Bobina/carretilha de reposição para conjunto de lançadeira.', full:'Bobina (carretilha) de reposição para o conjunto de lançadeira, em aço inox retificado. Garante enrolamento uniforme da linha e costura sem falhas. Compatível com o Kit de Regulagem da Lançadeira.', tags:['bobina','carretilha','lançadeira','reposição','costura'] }
  ];

  var HOME_CATS = [
    { name:'Lançadeiras', cat:'Lançadeiras', icon:'ph-gear', count:42 },
    { name:'Agulhas', cat:'Agulhas', icon:'ph-needle', count:68 },
    { name:'Quadros e Bastidores', cat:'Quadros e Bastidores', icon:'ph-frame-corners', count:25 },
    { name:'Rolamentos', cat:'Rolamentos', icon:'ph-circle', count:156 },
    { name:'Correias', cat:'Correias', icon:'ph-arrows-clockwise', count:89 },
    { name:'Motores', cat:'Motores', icon:'ph-engine', count:34 },
    { name:'Polias', cat:'Polias', icon:'ph-disc', count:47 },
    { name:'Pneumática', cat:'Pneumática', icon:'ph-wind', count:51 },
    { name:'Componentes Elétricos', cat:'Componentes Elétricos', icon:'ph-lightning', count:73 },
    { name:'Correntes', cat:'Correntes', icon:'ph-link-simple', count:29 }
  ];

  var DIFERENCIAIS = [
    { icon:'ph-seal-check', title:'Revenda autorizada', desc:'Distribuidor oficial Fischertec com garantia de procedência.' },
    { icon:'ph-stack', title:'Grande estoque', desc:'Ampla disponibilidade para pronta entrega.' },
    { icon:'ph-medal', title:'Peças originais', desc:'Somente peças originais e de fabricantes homologados.' },
    { icon:'ph-truck', title:'Entrega rápida', desc:'Logística ágil para todo o Brasil.' },
    { icon:'ph-headset', title:'Atendimento especializado', desc:'Time técnico para ajudar na peça certa.' },
    { icon:'ph-wrench', title:'Suporte técnico', desc:'Apoio em aplicação, manutenção e assistência.' },
    { icon:'ph-shield-check', title:'Qualidade garantida', desc:'Produtos testados e com garantia.' },
    { icon:'ph-chat-circle-text', title:'Orçamento rápido', desc:'Cotação sem compromisso via WhatsApp.' }
  ];

  // ---------- Estado ----------
  var state = {
    screen: 'home', query: '', activeCategory: 'all', activeBrand: 'all', activeStock: 'all',
    sort: 'relevance', page: 1, productSlug: null, gridLoading: false, productLoading: false
  };
  var flashTimers = {};

  // ---------- Utils ----------
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function top() {
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
  }
  function flash(key) {
    state[key] = true;
    renderView();
    clearTimeout(flashTimers[key]);
    flashTimers[key] = setTimeout(function () { state[key] = false; renderView(); }, 480);
  }
  function fBtn(active) {
    return 'display:flex;justify-content:space-between;align-items:center;gap:8px;width:100%;text-align:left;padding:10px 12px;border-radius:10px;font:500 13.5px Archivo,system-ui,sans-serif;cursor:pointer;transition:all .15s;' +
      (active ? 'background:#052857;color:#fff;border:1px solid #052857;box-shadow:0 6px 14px -6px rgba(5,40,87,.5);'
              : 'background:#fff;color:#3A4653;border:1px solid #E8EDF3;');
  }
  function pBtn(active) {
    return 'min-width:42px;height:42px;padding:0 12px;border-radius:11px;font:700 14px Archivo,system-ui,sans-serif;cursor:pointer;transition:.15s;' +
      (active ? 'background:#F5660C;color:#fff;border:1px solid #F5660C;box-shadow:0 8px 18px -8px rgba(245,102,12,.6);'
              : 'background:#fff;color:#052857;border:1px solid #E8EDF3;');
  }
  function stockBadge(p, big) {
    var pad = big ? '6px 12px' : '4px 9px', fs = big ? '12px' : '11px';
    var pos = 'position:absolute;top:' + (big ? '14px' : '10px') + ';right:' + (big ? '14px' : '10px') + ';';
    var base = pos + 'font-size:' + fs + ';font-weight:600;padding:' + pad + ';border-radius:100px;';
    if (p.stock === 'em') return '<span style="' + base + 'background:#E6F4EC;color:#1F8A5B">Em estoque</span>';
    if (p.stock === 'baixo') return '<span style="' + base + 'background:#FCF0DC;color:#B26B00">Estoque baixo</span>';
    if (p.stock === 'sem') return '<span style="' + base + 'background:#FBE9E7;color:#C0392B">Sem estoque</span>';
    return '';
  }
  var HATCH = 'repeating-linear-gradient(135deg,#F1F5FA,#F1F5FA 11px,#E8EDF3 11px,#E8EDF3 22px)';
  function imgSlot(placeholder, radius) {
    return '<div class="ez-hslot" style="width:100%;height:100%;' + (radius ? 'border-radius:' + radius + ';' : '') + '">' +
      '<i class="ph ph-image" style="font-size:38px"></i>' +
      '<span style="font-family:\'JetBrains Mono\';font-size:12px;line-height:1.4;max-width:80%">' + esc(placeholder) + '</span></div>';
  }

  // ---------- Cards ----------
  function productCardHome(p) {
    return '<article data-slug="' + esc(p.slug) + '" data-action="open-product" class="ez-card-h" style="background:#fff;border:1px solid #E8EDF3;border-radius:16px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column">' +
      '<div style="position:relative;aspect-ratio:1/1;background:' + HATCH + ';display:flex;align-items:center;justify-content:center">' +
        '<i class="ph ' + esc(p.icon) + '" style="font-size:64px;color:rgba(5,40,87,.13)"></i>' +
        '<span style="position:absolute;top:10px;left:10px;font-family:\'JetBrains Mono\';font-size:11px;background:#fff;border:1px solid #E8EDF3;color:#3A4653;padding:4px 8px;border-radius:6px">' + esc(p.code) + '</span>' +
        stockBadge(p, false) +
      '</div>' +
      '<div style="padding:16px;display:flex;flex-direction:column;flex:1">' +
        '<span style="font-family:\'JetBrains Mono\';font-size:11px;color:#F5660C;text-transform:uppercase;letter-spacing:.05em">' + esc(p.brand) + '</span>' +
        '<span style="font-weight:700;font-size:15.5px;line-height:1.3;color:#052857;margin:5px 0 0">' + esc(p.name) + '</span>' +
        '<span style="font-size:13px;color:#3A4653;line-height:1.45;margin:7px 0 0;flex:1">' + esc(p.short) + '</span>' +
        '<span style="display:flex;align-items:center;gap:6px;color:#052857;font-weight:700;font-size:14px;margin-top:14px">Ver detalhes <i class="ph ph-arrow-right"></i></span>' +
      '</div></article>';
  }
  function productCardCatalog(p) {
    return '<article data-slug="' + esc(p.slug) + '" data-action="open-product" class="ez-card-h" style="background:#fff;border:1px solid #E8EDF3;border-radius:16px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column">' +
      '<div style="position:relative;aspect-ratio:1/1;background:' + HATCH + ';display:flex;align-items:center;justify-content:center">' +
        '<i class="ph ' + esc(p.icon) + '" style="font-size:64px;color:rgba(5,40,87,.13)"></i>' +
        '<span style="position:absolute;top:10px;left:10px;font-family:\'JetBrains Mono\';font-size:11px;background:#fff;border:1px solid #E8EDF3;color:#3A4653;padding:4px 8px;border-radius:6px">' + esc(p.code) + '</span>' +
        stockBadge(p, false) +
      '</div>' +
      '<div style="padding:16px;display:flex;flex-direction:column;flex:1">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span style="font-family:\'JetBrains Mono\';font-size:11px;color:#F5660C;text-transform:uppercase;letter-spacing:.05em">' + esc(p.brand) + '</span><span style="font-size:11px;color:#9AA7B5">' + esc(p.cat) + '</span></div>' +
        '<span style="font-weight:700;font-size:15.5px;line-height:1.3;color:#052857;margin:6px 0 0">' + esc(p.name) + '</span>' +
        '<span style="font-size:13px;color:#3A4653;line-height:1.45;margin:7px 0 0;flex:1">' + esc(p.short) + '</span>' +
        '<span style="display:flex;align-items:center;justify-content:center;gap:7px;color:#052857;font-weight:700;font-size:14px;margin-top:14px;border:1.5px solid #E8EDF3;border-radius:10px;padding:10px" class="ez-lift">Ver detalhes <i class="ph ph-arrow-right"></i></span>' +
      '</div></article>';
  }
  function relatedCard(p) {
    return '<article data-slug="' + esc(p.slug) + '" data-action="open-product" class="ez-card-h" style="background:#fff;border:1px solid #E8EDF3;border-radius:16px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column">' +
      '<div style="position:relative;aspect-ratio:1/1;background:' + HATCH + ';display:flex;align-items:center;justify-content:center">' +
        '<i class="ph ' + esc(p.icon) + '" style="font-size:56px;color:rgba(5,40,87,.13)"></i>' +
        '<span style="position:absolute;top:10px;left:10px;font-family:\'JetBrains Mono\';font-size:11px;background:#fff;border:1px solid #E8EDF3;color:#3A4653;padding:4px 8px;border-radius:6px">' + esc(p.code) + '</span>' +
      '</div>' +
      '<div style="padding:15px;display:flex;flex-direction:column;flex:1">' +
        '<span style="font-family:\'JetBrains Mono\';font-size:11px;color:#F5660C;text-transform:uppercase">' + esc(p.brand) + '</span>' +
        '<span style="font-weight:700;font-size:15px;line-height:1.3;color:#052857;margin:5px 0 0;flex:1">' + esc(p.name) + '</span>' +
        '<span style="display:flex;align-items:center;gap:6px;color:#052857;font-weight:700;font-size:13.5px;margin-top:12px">Ver detalhes <i class="ph ph-arrow-right"></i></span>' +
      '</div></article>';
  }

  // ---------- Telas ----------
  function viewHome() {
    var difs = DIFERENCIAIS.map(function (d) {
      return '<div class="ez-card-h" style="background:#fff;border:1px solid #E8EDF3;border-radius:16px;padding:24px">' +
        '<span style="width:52px;height:52px;border-radius:14px;background:#F7F8FA;border:1px solid #E8EDF3;color:#F5660C;display:flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:16px"><i class="ph ' + d.icon + '"></i></span>' +
        '<div style="font-weight:700;font-size:16.5px;color:#052857">' + esc(d.title) + '</div>' +
        '<div style="font-size:13.5px;color:#3A4653;line-height:1.5;margin-top:6px">' + esc(d.desc) + '</div></div>';
    }).join('');

    var cats = HOME_CATS.map(function (c) {
      return '<button data-cat="' + esc(c.cat) + '" data-action="open-category" class="ez-card-h" style="text-align:left;background:#fff;border:1px solid #E8EDF3;border-radius:16px;padding:22px;cursor:pointer;display:flex;flex-direction:column;gap:0">' +
        '<span style="width:54px;height:54px;border-radius:14px;background:#052857;color:#fff;display:flex;align-items:center;justify-content:center;font-size:27px;margin-bottom:16px"><i class="ph ' + c.icon + '"></i></span>' +
        '<span style="font-weight:700;font-size:16px;color:#052857">' + esc(c.name) + '</span>' +
        '<span style="font-family:\'JetBrains Mono\';font-size:12px;color:#9AA7B5;margin-top:5px">' + c.count + ' itens</span></button>';
    }).join('');

    var destaques = [DATA[0], DATA[1], DATA[2], DATA[3]].map(productCardHome).join('');

    return '<main class="ez-fade">' +
    // HERO
    '<section style="background:linear-gradient(180deg,#fff 0%,#F7F8FA 100%);border-bottom:1px solid #E8EDF3">' +
      '<div style="max-width:1280px;margin:0 auto;padding:56px 24px 64px;display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:48px;align-items:center">' +
        '<div>' +
          '<span style="display:inline-flex;align-items:center;gap:8px;font-family:\'JetBrains Mono\';font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:#F5660C;font-weight:600;background:#FDEDE1;padding:7px 13px;border-radius:100px"><i class="ph-fill ph-seal-check"></i>Revenda autorizada Fischertec</span>' +
          '<h1 style="font-size:clamp(34px,4.4vw,54px);line-height:1.05;font-weight:800;letter-spacing:-.02em;margin:20px 0 0;color:#052857">Peças e soluções para<br>manutenção industrial.</h1>' +
          '<p style="font-size:17.5px;line-height:1.6;color:#3A4653;max-width:540px;margin:20px 0 0">A Ezermec é especializada na comercialização de peças para máquinas industriais, oferecendo qualidade, atendimento especializado e sendo revenda autorizada da Fischertec.</p>' +
          '<div style="display:flex;align-items:center;background:#fff;border:1.5px solid #E8EDF3;border-radius:14px;padding:5px;margin:28px 0 0;max-width:520px;box-shadow:0 10px 30px -18px rgba(5,40,87,.3)">' +
            '<span style="padding:0 6px 0 14px;color:#9AA7B5;font-size:20px;display:flex"><i class="ph ph-magnifying-glass"></i></span>' +
            '<input id="hero-search" value="' + esc(state.query) + '" placeholder="Busque por peça ou código…" style="flex:1;border:none;outline:none;background:transparent;padding:12px 4px;font-size:15.5px;color:#052857;font-family:\'Archivo\',sans-serif">' +
            '<button data-action="search-go" class="ez-lift" style="border:none;background:#F5660C;color:#fff;border-radius:10px;padding:11px 22px;font-weight:700;font-size:15px;cursor:pointer">Buscar</button>' +
          '</div>' +
          '<div style="display:flex;gap:14px;flex-wrap:wrap;margin:26px 0 0">' +
            '<button data-action="go-catalog" class="ez-lift" style="display:flex;align-items:center;gap:9px;background:#052857;color:#fff;border:none;border-radius:12px;padding:15px 26px;font-weight:700;font-size:16px;cursor:pointer">Ver catálogo <i class="ph ph-arrow-right"></i></button>' +
            '<a href="' + waHref + '" target="_blank" style="display:flex;align-items:center;gap:9px;background:#fff;color:#052857;border:1.5px solid #DCE7F4;border-radius:12px;padding:15px 26px;font-weight:700;font-size:16px" class="ez-lift">Solicitar orçamento</a>' +
          '</div>' +
          '<div style="display:flex;gap:26px;flex-wrap:wrap;margin:30px 0 0">' +
            '<div><div style="font-size:26px;font-weight:800;color:#052857">+800</div><div style="font-family:\'JetBrains Mono\';font-size:11px;color:#9AA7B5;text-transform:uppercase;letter-spacing:.08em">itens em catálogo</div></div>' +
            '<div style="width:1px;background:#E8EDF3"></div>' +
            '<div><div style="font-size:26px;font-weight:800;color:#052857">12</div><div style="font-family:\'JetBrains Mono\';font-size:11px;color:#9AA7B5;text-transform:uppercase;letter-spacing:.08em">categorias</div></div>' +
            '<div style="width:1px;background:#E8EDF3"></div>' +
            '<div><div style="font-size:26px;font-weight:800;color:#052857">100%</div><div style="font-family:\'JetBrains Mono\';font-size:11px;color:#9AA7B5;text-transform:uppercase;letter-spacing:.08em">peças originais</div></div>' +
          '</div>' +
        '</div>' +
        '<div style="position:relative">' +
          '<div style="position:relative;width:100%;aspect-ratio:4/3.4;border-radius:22px;overflow:hidden;border:1px solid #E8EDF3;box-shadow:0 40px 80px -40px rgba(5,40,87,.4)">' + imgSlot('Foto: indústria / manutenção de máquinas') + '</div>' +
          '<div style="position:absolute;left:-14px;bottom:26px;background:#fff;border:1px solid #E8EDF3;border-radius:16px;padding:14px 18px;display:flex;align-items:center;gap:12px;box-shadow:0 20px 40px -20px rgba(5,40,87,.35)">' +
            '<span style="width:44px;height:44px;border-radius:12px;background:#052857;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px"><i class="ph-fill ph-seal-check"></i></span>' +
            '<div><div style="font-weight:700;font-size:14px;color:#052857">Revenda autorizada</div><div style="font-family:\'JetBrains Mono\';font-size:12px;color:#F5660C">Fischertec</div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +
    // DIFERENCIAIS
    '<section style="max-width:1280px;margin:0 auto;padding:64px 24px 20px">' +
      '<div style="text-align:center;max-width:640px;margin:0 auto 40px">' +
        '<span style="font-family:\'JetBrains Mono\';font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#F5660C;font-weight:600">Por que a Ezermec</span>' +
        '<h2 style="font-size:clamp(26px,3vw,36px);font-weight:800;letter-spacing:-.02em;margin:12px 0 0">Confiança, estoque e suporte técnico</h2>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px">' + difs + '</div>' +
    '</section>' +
    // CATEGORIAS
    '<section id="categorias" style="max-width:1280px;margin:0 auto;padding:56px 24px 20px;scroll-margin-top:120px">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:14px;margin-bottom:30px">' +
        '<div>' +
          '<span style="font-family:\'JetBrains Mono\';font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#F5660C;font-weight:600">Navegue por segmento</span>' +
          '<h2 style="font-size:clamp(26px,3vw,36px);font-weight:800;letter-spacing:-.02em;margin:10px 0 0">Categorias de produtos</h2>' +
        '</div>' +
        '<button data-action="go-catalog" style="display:flex;align-items:center;gap:8px;background:none;border:none;color:#052857;font-weight:700;font-size:15px;cursor:pointer">Ver todos os produtos <i class="ph ph-arrow-right"></i></button>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:16px">' + cats + '</div>' +
    '</section>' +
    // DESTAQUES
    '<section style="max-width:1280px;margin:0 auto;padding:56px 24px 20px">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:14px;margin-bottom:26px">' +
        '<div>' +
          '<span style="font-family:\'JetBrains Mono\';font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#F5660C;font-weight:600">Em destaque</span>' +
          '<h2 style="font-size:clamp(26px,3vw,36px);font-weight:800;letter-spacing:-.02em;margin:10px 0 0">Produtos mais procurados</h2>' +
        '</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px">' + destaques + '</div>' +
    '</section>' +
    // SOBRE
    '<section id="sobre" style="scroll-margin-top:120px;margin-top:64px;background:#052857;color:#fff">' +
      '<div style="max-width:1280px;margin:0 auto;padding:64px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:48px;align-items:center">' +
        '<div>' +
          '<span style="font-family:\'JetBrains Mono\';font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#FF7A1A;font-weight:600">Sobre a Ezermec</span>' +
          '<h2 style="font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:14px 0 0;line-height:1.1">Especialistas em peças para máquinas industriais</h2>' +
          '<p style="font-size:16px;line-height:1.65;color:#DCE7F4;margin:18px 0 0">Atuamos na comercialização de peças, manutenção industrial e assistência técnica. Como revenda autorizada da Fischertec, entregamos peças originais com o suporte técnico que a sua operação precisa para não parar.</p>' +
          '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:28px">' +
            '<div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px"><i class="ph ph-target" style="font-size:24px;color:#FF7A1A"></i><div style="font-weight:700;margin-top:10px">Missão</div><div style="font-size:12.5px;color:#DCE7F4;margin-top:4px;line-height:1.5">Manter a indústria em movimento com a peça certa, na hora certa.</div></div>' +
            '<div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px"><i class="ph ph-eye" style="font-size:24px;color:#FF7A1A"></i><div style="font-weight:700;margin-top:10px">Visão</div><div style="font-size:12.5px;color:#DCE7F4;margin-top:4px;line-height:1.5">Ser referência em peças e manutenção industrial na região.</div></div>' +
            '<div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px"><i class="ph ph-handshake" style="font-size:24px;color:#FF7A1A"></i><div style="font-weight:700;margin-top:10px">Valores</div><div style="font-size:12.5px;color:#DCE7F4;margin-top:4px;line-height:1.5">Qualidade, confiança e atendimento especializado.</div></div>' +
          '</div>' +
          '<button data-action="go-sobre" class="ez-lift" style="display:flex;align-items:center;gap:9px;background:#fff;color:#052857;border:none;border-radius:12px;padding:14px 24px;font-weight:700;font-size:15px;cursor:pointer;margin-top:26px">Conhecer nossa história <i class="ph ph-arrow-right"></i></button>' +
        '</div>' +
        '<div style="position:relative;width:100%;aspect-ratio:4/3.2;border-radius:22px;overflow:hidden;border:1px solid rgba(255,255,255,.14)">' + imgSlot('Foto: equipe / instalações Ezermec') + '</div>' +
      '</div>' +
    '</section>' +
    // CONTATO CTA
    '<section id="contato" style="max-width:1280px;margin:0 auto;padding:56px 24px;scroll-margin-top:120px">' +
      '<div style="background:linear-gradient(120deg,#F5660C,#FF7A1A);border-radius:24px;padding:44px;display:flex;justify-content:space-between;align-items:center;gap:28px;flex-wrap:wrap;box-shadow:0 30px 60px -30px rgba(245,102,12,.5)">' +
        '<div>' +
          '<h2 style="color:#fff;font-size:clamp(24px,2.6vw,32px);font-weight:800;margin:0;letter-spacing:-.02em">Precisa de um orçamento?</h2>' +
          '<p style="color:rgba(255,255,255,.92);font-size:16px;margin:8px 0 0">Fale com um especialista e receba sua cotação sem compromisso.</p>' +
        '</div>' +
        '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
          '<a href="' + waHref + '" target="_blank" class="ez-lift" style="display:flex;align-items:center;gap:9px;background:#fff;color:#052857;border-radius:12px;padding:15px 26px;font-weight:700;font-size:16px"><i class="ph-fill ph-whatsapp-logo" style="font-size:20px;color:#25D366"></i>Chamar no WhatsApp</a>' +
          '<a href="' + mailGeneral + '" class="ez-lift" style="display:flex;align-items:center;gap:9px;background:rgba(5,40,87,.9);color:#fff;border-radius:12px;padding:15px 26px;font-weight:700;font-size:16px"><i class="ph ph-envelope-simple" style="font-size:20px"></i>Enviar e-mail</a>' +
        '</div>' +
      '</div>' +
    '</section>' +
    '</main>';
  }

  function computeCatalog() {
    var term = (state.query || '').trim().toLowerCase();
    function match(p) {
      if (!term) return true;
      return [p.name, p.code, p.fab, p.brand, p.cat, p.supplier, p.short, (p.tags || []).join(' ')].join(' ').toLowerCase().indexOf(term) !== -1;
    }
    var bySearch = DATA.filter(match);
    var catCounts = {}, brandCounts = {};
    bySearch.forEach(function (p) { catCounts[p.cat] = (catCounts[p.cat] || 0) + 1; brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1; });

    var list = bySearch.filter(function (p) {
      return (state.activeCategory === 'all' || p.cat === state.activeCategory) &&
        (state.activeBrand === 'all' || p.brand === state.activeBrand) &&
        (state.activeStock === 'all' || p.stock === state.activeStock);
    });
    if (state.sort === 'name-asc') list = list.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    else if (state.sort === 'name-desc') list = list.slice().sort(function (a, b) { return b.name.localeCompare(a.name); });
    else if (state.sort === 'recent') list = list.slice().reverse();

    var total = list.length;
    var pageCount = Math.max(1, Math.ceil(total / CFG.perPage));
    var page = Math.min(state.page, pageCount);
    var paged = list.slice((page - 1) * CFG.perPage, (page - 1) * CFG.perPage + CFG.perPage);

    return { term: term, bySearch: bySearch, catCounts: catCounts, brandCounts: brandCounts,
      total: total, pageCount: pageCount, page: page, paged: paged };
  }

  function viewCatalog() {
    var c = computeCatalog();

    var catKeys = ['all'].concat(uniq(DATA.map(function (p) { return p.cat; })));
    var catFilters = catKeys.map(function (k) {
      var label = k === 'all' ? 'Todas as categorias' : k;
      var count = k === 'all' ? c.bySearch.length : (c.catCounts[k] || 0);
      return '<button data-cat="' + esc(k) + '" data-action="set-cat" style="' + fBtn(state.activeCategory === k) + '"><span>' + esc(label) + '</span><span style="font-family:\'JetBrains Mono\';font-size:12px;opacity:.6">' + count + '</span></button>';
    }).join('');

    var brandKeys = ['all'].concat(uniq(DATA.map(function (p) { return p.brand; })));
    var brandFilters = brandKeys.map(function (k) {
      var label = k === 'all' ? 'Todas as marcas' : k;
      var count = k === 'all' ? c.bySearch.length : (c.brandCounts[k] || 0);
      return '<button data-brand="' + esc(k) + '" data-action="set-brand" style="' + fBtn(state.activeBrand === k) + '"><span>' + esc(label) + '</span><span style="font-family:\'JetBrains Mono\';font-size:12px;opacity:.6">' + count + '</span></button>';
    }).join('');

    var stockFilters = [['all', 'Todos'], ['em', 'Em estoque'], ['baixo', 'Estoque baixo'], ['sem', 'Sem estoque']].map(function (s) {
      return '<button data-stock="' + s[0] + '" data-action="set-stock" style="' + fBtn(state.activeStock === s[0]) + '"><span>' + s[1] + '</span></button>';
    }).join('');

    var sortOptions = [['relevance', 'Relevância'], ['name-asc', 'Nome (A-Z)'], ['name-desc', 'Nome (Z-A)'], ['recent', 'Mais recentes']].map(function (o) {
      return '<option value="' + o[0] + '"' + (state.sort === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
    }).join('');

    var resultsBlock;
    if (state.gridLoading) {
      var skel = '';
      for (var i = 0; i < CFG.perPage; i++) {
        skel += '<div style="background:#fff;border:1px solid #E8EDF3;border-radius:16px;overflow:hidden">' +
          '<div class="ez-skel" style="aspect-ratio:1/1"></div>' +
          '<div style="padding:16px"><div class="ez-skel" style="height:11px;width:40%;border-radius:5px"></div><div class="ez-skel" style="height:15px;width:85%;border-radius:5px;margin-top:10px"></div><div class="ez-skel" style="height:12px;width:60%;border-radius:5px;margin-top:10px"></div></div></div>';
      }
      resultsBlock = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px">' + skel + '</div>';
    } else if (c.total > 0) {
      var grid = c.paged.map(productCardCatalog).join('');
      var pager = '';
      for (var n = 1; n <= c.pageCount; n++) {
        pager += '<button data-page="' + n + '" data-action="goto-page" style="' + pBtn(n === c.page) + '" class="ez-lift">' + n + '</button>';
      }
      resultsBlock = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px">' + grid + '</div>' +
        (c.pageCount > 1 ? '<div style="display:flex;justify-content:center;align-items:center;gap:8px;margin-top:34px;flex-wrap:wrap">' + pager + '</div>' : '');
    } else {
      resultsBlock = '<div style="text-align:center;padding:70px 20px;background:#fff;border:1px dashed #DCE7F4;border-radius:18px">' +
        '<i class="ph ph-magnifying-glass" style="font-size:44px;color:#DCE7F4"></i>' +
        '<div style="font-weight:700;font-size:18px;margin-top:14px">Nenhum produto encontrado</div>' +
        '<div style="font-size:14px;color:#3A4653;margin-top:6px">Tente outro termo ou limpe os filtros.</div>' +
        '<button data-action="clear-filters" class="ez-lift" style="margin-top:18px;background:#052857;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-weight:700;cursor:pointer">Limpar filtros</button></div>';
    }

    var resultLabel = '<strong style="color:#052857">' + c.total + '</strong> resultado(s)' +
      (c.term ? ' para "<strong style="color:#052857">' + esc(state.query) + '</strong>"' : '');

    return '<main class="ez-fade" style="max-width:1280px;margin:0 auto;padding:26px 24px 60px">' +
      '<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#9AA7B5;font-family:\'JetBrains Mono\';margin-bottom:14px">' +
        '<button data-nav="home" style="background:none;border:none;color:#9AA7B5;cursor:pointer;font-family:inherit;font-size:13px;padding:0">Início</button>' +
        '<i class="ph ph-caret-right" style="font-size:12px"></i><span style="color:#052857">Catálogo</span>' +
      '</div>' +
      '<h1 style="font-size:clamp(26px,3vw,34px);font-weight:800;letter-spacing:-.02em;margin:0 0 22px">Catálogo de produtos</h1>' +
      '<div style="display:grid;grid-template-columns:270px 1fr;gap:26px;align-items:start" class="ez-catalog-grid">' +
        '<aside style="position:sticky;top:126px;display:flex;flex-direction:column;gap:16px">' +
          '<div style="background:#fff;border:1px solid #E8EDF3;border-radius:16px;padding:18px">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-weight:700;font-size:14px">Filtros</span><button data-action="clear-filters" style="background:none;border:none;color:#F5660C;font-weight:600;font-size:12.5px;cursor:pointer">Limpar</button></div>' +
            '<div style="font-family:\'JetBrains Mono\';font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9AA7B5;margin:6px 0 8px">Categorias</div>' +
            '<div style="display:flex;flex-direction:column;gap:6px;max-height:260px;overflow:auto">' + catFilters + '</div>' +
          '</div>' +
          '<div style="background:#fff;border:1px solid #E8EDF3;border-radius:16px;padding:18px">' +
            '<div style="font-family:\'JetBrains Mono\';font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9AA7B5;margin:0 0 8px">Marcas</div>' +
            '<div style="display:flex;flex-direction:column;gap:6px">' + brandFilters + '</div>' +
          '</div>' +
          '<div style="background:#fff;border:1px solid #E8EDF3;border-radius:16px;padding:18px">' +
            '<div style="font-family:\'JetBrains Mono\';font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9AA7B5;margin:0 0 8px">Disponibilidade</div>' +
            '<div style="display:flex;flex-direction:column;gap:6px">' + stockFilters + '</div>' +
          '</div>' +
        '</aside>' +
        '<section>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;background:#fff;border:1px solid #E8EDF3;border-radius:14px;padding:12px 16px;margin-bottom:18px">' +
            '<span style="font-size:14px;color:#3A4653">' + resultLabel + '</span>' +
            '<label style="display:flex;align-items:center;gap:9px;font-size:13.5px;color:#3A4653">Ordenar por' +
              '<select data-action="set-sort" style="border:1px solid #E8EDF3;background:#F7F8FA;border-radius:9px;padding:9px 12px;font-family:\'Archivo\',sans-serif;font-size:13.5px;font-weight:600;color:#052857;cursor:pointer">' + sortOptions + '</select>' +
            '</label>' +
          '</div>' + resultsBlock +
        '</section>' +
      '</div>' +
    '</main>';
  }

  function viewProduct() {
    var raw = DATA.filter(function (p) { return p.slug === state.productSlug; })[0];
    var crumbCat = raw ? raw.cat : '';
    var crumbName = raw ? raw.name : '';

    var head = '<main class="ez-fade" style="max-width:1280px;margin:0 auto;padding:26px 24px 60px">' +
      '<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#9AA7B5;font-family:\'JetBrains Mono\';margin-bottom:18px;flex-wrap:wrap">' +
        '<button data-nav="home" style="background:none;border:none;color:#9AA7B5;cursor:pointer;font-family:inherit;font-size:13px;padding:0">Início</button>' +
        '<i class="ph ph-caret-right" style="font-size:12px"></i>' +
        '<button data-action="go-catalog" style="background:none;border:none;color:#9AA7B5;cursor:pointer;font-family:inherit;font-size:13px;padding:0">Catálogo</button>' +
        '<i class="ph ph-caret-right" style="font-size:12px"></i><span style="color:#F5660C">' + esc(crumbCat) + '</span>' +
        '<i class="ph ph-caret-right" style="font-size:12px"></i><span style="color:#052857">' + esc(crumbName) + '</span>' +
      '</div>';

    if (state.productLoading || !raw) {
      return head +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:32px">' +
          '<div class="ez-skel" style="aspect-ratio:1/1;border-radius:20px"></div>' +
          '<div><div class="ez-skel" style="height:14px;width:30%;border-radius:6px"></div><div class="ez-skel" style="height:30px;width:80%;border-radius:8px;margin-top:14px"></div><div class="ez-skel" style="height:14px;width:100%;border-radius:6px;margin-top:20px"></div><div class="ez-skel" style="height:14px;width:90%;border-radius:6px;margin-top:10px"></div><div class="ez-skel" style="height:48px;width:60%;border-radius:12px;margin-top:26px"></div></div>' +
        '</div></main>';
    }

    var waText = encodeURIComponent('Olá! Gostaria de solicitar um orçamento do produto: ' + raw.name + ' (Cód. ' + raw.code + '). Poderiam me ajudar?');
    var pWa = 'https://wa.me/' + WA + '?text=' + waText;
    var mailBody = encodeURIComponent('Olá,\n\nGostaria de solicitar um orçamento para o produto:\n\nProduto: ' + raw.name + '\nCódigo interno: ' + raw.code + '\nCódigo do fabricante: ' + raw.fab + '\nMarca: ' + raw.brand + '\n\nObrigado!');
    var pMail = 'mailto:' + CFG.email + '?subject=' + encodeURIComponent('Orçamento - ' + raw.name) + '&body=' + mailBody;

    var specs = [
      ['Marca', raw.brand], ['Categoria', raw.cat], ['Fornecedor', raw.supplier],
      ['Código do fabricante', raw.fab], ['Material', raw.material], ['Peso', raw.weight],
      ['Dimensões', raw.dims], ['Garantia', '12 meses']
    ].map(function (s) {
      return '<div style="display:flex;justify-content:space-between;gap:16px;padding:13px 18px;border-bottom:1px solid #F1F4F8"><span style="color:#3A4653;font-size:14px">' + esc(s[0]) + '</span><span style="font-weight:700;font-size:14px;text-align:right">' + esc(s[1]) + '</span></div>';
    }).join('');

    var rel = DATA.filter(function (x) { return x.cat === raw.cat && x.slug !== raw.slug; });
    if (rel.length < 4) rel = rel.concat(DATA.filter(function (x) { return x.cat !== raw.cat && x.slug !== raw.slug; }));
    rel = rel.slice(0, 4);
    var related = rel.map(relatedCard).join('');

    var galleryIcons = [raw.icon, 'ph-image', 'ph-image', 'ph-magnifying-glass-plus'];
    var gallery = galleryIcons.map(function (ic) {
      return '<div style="aspect-ratio:1/1;border-radius:12px;border:1px solid #E8EDF3;background:repeating-linear-gradient(135deg,#F1F5FA,#F1F5FA 8px,#E8EDF3 8px,#E8EDF3 16px);display:flex;align-items:center;justify-content:center;color:rgba(5,40,87,.16);font-size:26px"><i class="ph ' + ic + '"></i></div>';
    }).join('');

    return head +
    '<div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:38px;align-items:start">' +
        // GALERIA
        '<div>' +
          '<div style="position:relative;aspect-ratio:1/1;border-radius:20px;overflow:hidden;border:1px solid #E8EDF3;background:#fff">' +
            '<img src="' + PROD_IMG + '" alt="' + esc(raw.name) + '" style="width:100%;height:100%;object-fit:cover;display:block">' +
            stockBadge(raw, true) +
          '</div>' +
          '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:12px">' + gallery + '</div>' +
        '</div>' +
        // INFO
        '<div>' +
          '<span style="font-family:\'JetBrains Mono\';font-size:12px;color:#F5660C;text-transform:uppercase;letter-spacing:.08em;font-weight:600">' + esc(raw.brand) + '</span>' +
          '<h1 style="font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em;margin:8px 0 0;line-height:1.15">' + esc(raw.name) + '</h1>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:16px 0 0">' +
            '<span style="display:flex;align-items:center;gap:7px;background:#F7F8FA;border:1px solid #E8EDF3;border-radius:9px;padding:8px 12px;font-family:\'JetBrains Mono\';font-size:12.5px;color:#3A4653"><span style="color:#9AA7B5">Cód. interno</span><strong style="color:#052857">' + esc(raw.code) + '</strong></span>' +
            '<span style="display:flex;align-items:center;gap:7px;background:#F7F8FA;border:1px solid #E8EDF3;border-radius:9px;padding:8px 12px;font-family:\'JetBrains Mono\';font-size:12.5px;color:#3A4653"><span style="color:#9AA7B5">Cód. fabricante</span><strong style="color:#052857">' + esc(raw.fab) + '</strong></span>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0 0">' +
            '<div style="background:#fff;border:1px solid #E8EDF3;border-radius:12px;padding:12px 14px"><div style="font-size:11px;color:#9AA7B5;text-transform:uppercase;letter-spacing:.06em;font-family:\'JetBrains Mono\'">Categoria</div><div style="font-weight:700;font-size:14.5px;margin-top:3px">' + esc(raw.cat) + '</div></div>' +
            '<div style="background:#fff;border:1px solid #E8EDF3;border-radius:12px;padding:12px 14px"><div style="font-size:11px;color:#9AA7B5;text-transform:uppercase;letter-spacing:.06em;font-family:\'JetBrains Mono\'">Fornecedor</div><div style="font-weight:700;font-size:14.5px;margin-top:3px">' + esc(raw.supplier) + '</div></div>' +
          '</div>' +
          '<p style="font-size:15.5px;line-height:1.65;color:#3A4653;margin:20px 0 0">' + esc(raw.full) + '</p>' +
          '<div style="background:#F7F8FA;border:1px solid #E8EDF3;border-radius:16px;padding:18px;margin-top:22px">' +
            '<div style="font-weight:700;font-size:14px;margin-bottom:4px">Gostou deste produto?</div>' +
            '<div style="font-size:13px;color:#3A4653;margin-bottom:14px">Solicite um orçamento sem compromisso — respondemos rápido.</div>' +
            '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
              '<a href="' + pWa + '" target="_blank" class="ez-lift" style="display:flex;align-items:center;gap:9px;background:#F5660C;color:#fff;border-radius:12px;padding:14px 22px;font-weight:700;font-size:15px;flex:1;justify-content:center;min-width:180px"><i class="ph ph-file-text" style="font-size:19px"></i>Solicitar orçamento</a>' +
              '<a href="' + pWa + '" target="_blank" class="ez-lift" style="display:flex;align-items:center;gap:8px;background:#25D366;color:#fff;border-radius:12px;padding:14px 18px;font-weight:700;font-size:15px"><i class="ph-fill ph-whatsapp-logo" style="font-size:19px"></i>WhatsApp</a>' +
            '</div>' +
            '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">' +
              '<a href="' + pMail + '" class="ez-lift" style="display:flex;align-items:center;gap:8px;background:#fff;color:#052857;border:1.5px solid #DCE7F4;border-radius:12px;padding:12px 18px;font-weight:700;font-size:14px;flex:1;justify-content:center"><i class="ph ph-envelope-simple" style="font-size:18px"></i>Enviar e-mail</a>' +
              '<button data-action="share" class="ez-lift" style="display:flex;align-items:center;gap:8px;background:#fff;color:#052857;border:1.5px solid #DCE7F4;border-radius:12px;padding:12px 18px;font-weight:700;font-size:14px;cursor:pointer"><i class="ph ph-share-network" style="font-size:18px"></i>Compartilhar</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      // SPECS + ARQUIVOS
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px;margin-top:44px">' +
        '<div>' +
          '<h2 style="font-size:20px;font-weight:800;margin:0 0 14px">Especificações técnicas</h2>' +
          '<div style="background:#fff;border:1px solid #E8EDF3;border-radius:16px;overflow:hidden">' + specs + '</div>' +
        '</div>' +
        '<div>' +
          '<h2 style="font-size:20px;font-weight:800;margin:0 0 14px">Downloads &amp; mídia</h2>' +
          '<div style="display:flex;flex-direction:column;gap:10px">' +
            '<a href="' + pWa + '" target="_blank" style="display:flex;align-items:center;gap:13px;background:#fff;border:1px solid #E8EDF3;border-radius:14px;padding:15px 18px" class="ez-lift"><span style="width:42px;height:42px;border-radius:10px;background:#FBE9E7;color:#C0392B;display:flex;align-items:center;justify-content:center;font-size:22px"><i class="ph-fill ph-file-pdf"></i></span><span style="flex:1"><span style="display:block;font-weight:700;font-size:14.5px;color:#052857">Ficha técnica (PDF)</span><span style="font-size:12.5px;color:#9AA7B5;font-family:\'JetBrains Mono\'">Solicite via WhatsApp</span></span><i class="ph ph-download-simple" style="font-size:20px;color:#9AA7B5"></i></a>' +
            '<a href="' + pWa + '" target="_blank" style="display:flex;align-items:center;gap:13px;background:#fff;border:1px solid #E8EDF3;border-radius:14px;padding:15px 18px" class="ez-lift"><span style="width:42px;height:42px;border-radius:10px;background:#DCE7F4;color:#052857;display:flex;align-items:center;justify-content:center;font-size:22px"><i class="ph-fill ph-file-doc"></i></span><span style="flex:1"><span style="display:block;font-weight:700;font-size:14.5px;color:#052857">Catálogo de aplicação</span><span style="font-size:12.5px;color:#9AA7B5;font-family:\'JetBrains Mono\'">Solicite via WhatsApp</span></span><i class="ph ph-download-simple" style="font-size:20px;color:#9AA7B5"></i></a>' +
            '<div style="position:relative;aspect-ratio:16/9;border-radius:14px;overflow:hidden;border:1px solid #E8EDF3;background:repeating-linear-gradient(135deg,#F1F5FA,#F1F5FA 11px,#E8EDF3 11px,#E8EDF3 22px);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:#3A4653"><span style="width:54px;height:54px;border-radius:50%;background:#052857;color:#fff;display:flex;align-items:center;justify-content:center;font-size:26px"><i class="ph-fill ph-play"></i></span><span style="font-family:\'JetBrains Mono\';font-size:12px;color:#9AA7B5">Vídeo do produto em breve</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      // RELACIONADOS
      '<div style="margin-top:48px">' +
        '<h2 style="font-size:22px;font-weight:800;margin:0 0 18px">Produtos relacionados</h2>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px">' + related + '</div>' +
      '</div>' +
    '</div></main>';
  }

  function viewSobre() {
    var faz = [
      ['ph-package', 'Comercialização de peças', 'Peças para máquinas industriais com estoque amplo e procedência garantida.'],
      ['ph-wrench', 'Manutenção industrial', 'Suporte para manter máquinas e linhas de produção operando sem paradas.'],
      ['ph-headset', 'Assistência técnica', 'Time técnico especializado para diagnóstico e recomendação da peça certa.'],
      ['ph-fill ph-seal-check', 'Revenda autorizada Fischertec', 'Peças originais Fischertec com garantia de procedência e qualidade.']
    ].map(function (f) {
      var cls = f[0].indexOf('ph-fill') === 0 ? f[0] : 'ph ' + f[0];
      return '<div class="ez-card-h" style="background:#fff;border:1px solid #E8EDF3;border-radius:16px;padding:24px">' +
        '<span style="width:52px;height:52px;border-radius:14px;background:#F7F8FA;border:1px solid #E8EDF3;color:#F5660C;display:flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:16px"><i class="' + cls + '"></i></span>' +
        '<div style="font-weight:700;font-size:16.5px;color:#052857">' + esc(f[1]) + '</div>' +
        '<div style="font-size:13.5px;color:#3A4653;line-height:1.5;margin-top:6px">' + esc(f[2]) + '</div></div>';
    }).join('');

    var stats = [['+50', 'itens em catálogo'], ['10', 'categorias atendidas'], ['100%', 'peças originais'], ['Fischertec', 'revenda autorizada']].map(function (s) {
      return '<div><div style="font-size:30px;font-weight:800;color:#052857">' + s[0] + '</div><div style="font-family:\'JetBrains Mono\';font-size:11.5px;color:#9AA7B5;text-transform:uppercase;letter-spacing:.06em;margin-top:4px">' + s[1] + '</div></div>';
    }).join('');

    var mvv = [
      ['ph-target', 'Missão', 'Manter a indústria em movimento, oferecendo a peça certa, na hora certa, com atendimento especializado.'],
      ['ph-eye', 'Visão', 'Ser referência em peças para máquinas industriais e manutenção industrial na região.'],
      ['ph-handshake', 'Valores', 'Qualidade, confiança, agilidade e proximidade com o cliente em cada atendimento.']
    ].map(function (m) {
      return '<div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:16px;padding:26px">' +
        '<i class="ph ' + m[0] + '" style="font-size:28px;color:#FF7A1A"></i>' +
        '<div style="font-weight:700;font-size:17px;margin-top:14px;color:#fff">' + m[1] + '</div>' +
        '<div style="font-size:14px;color:#DCE7F4;margin-top:8px;line-height:1.6">' + esc(m[2]) + '</div></div>';
    }).join('');

    var estrutura = [
      'Foto: estoque / almoxarifado', 'Foto: equipe técnica', 'Foto: atendimento ao cliente'
    ].map(function (ph) {
      return '<div style="position:relative;aspect-ratio:4/3;border-radius:18px;overflow:hidden;border:1px solid #E8EDF3">' + imgSlot(ph) + '</div>';
    }).join('');

    return '<main class="ez-fade">' +
      '<div style="max-width:1280px;margin:0 auto;padding:26px 24px 0">' +
        '<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#9AA7B5;font-family:\'JetBrains Mono\';margin-bottom:14px">' +
          '<button data-nav="home" style="background:none;border:none;color:#9AA7B5;cursor:pointer;font-family:inherit;font-size:13px;padding:0">Início</button>' +
          '<i class="ph ph-caret-right" style="font-size:12px"></i><span style="color:#052857">Sobre</span>' +
        '</div>' +
      '</div>' +
      '<section style="max-width:1280px;margin:0 auto;padding:6px 24px 56px;display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:48px;align-items:center">' +
        '<div>' +
          '<span style="display:inline-flex;align-items:center;gap:8px;font-family:\'JetBrains Mono\';font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:#F5660C;font-weight:600;background:#FDEDE1;padding:7px 13px;border-radius:100px"><i class="ph-fill ph-seal-check"></i>Revenda autorizada Fischertec</span>' +
          '<h1 style="font-size:clamp(30px,3.6vw,44px);font-weight:800;letter-spacing:-.02em;margin:20px 0 0;line-height:1.1">Especialistas em peças para máquinas industriais</h1>' +
          '<p style="font-size:16.5px;line-height:1.65;color:#3A4653;margin:20px 0 0">A Ezermec é especializada na comercialização de peças para máquinas industriais, atuando também em manutenção industrial e assistência técnica. Como revenda autorizada da Fischertec, unimos peças originais a um atendimento técnico próximo e especializado — ajudando empresas a manter suas linhas de produção sempre em funcionamento.</p>' +
          '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:26px">' +
            '<button data-action="go-catalog" class="ez-lift" style="display:flex;align-items:center;gap:9px;background:#052857;color:#fff;border:none;border-radius:12px;padding:14px 24px;font-weight:700;font-size:15px;cursor:pointer">Ver catálogo <i class="ph ph-arrow-right"></i></button>' +
            '<a href="' + waHref + '" target="_blank" class="ez-lift" style="display:flex;align-items:center;gap:9px;background:#fff;color:#052857;border:1.5px solid #DCE7F4;border-radius:12px;padding:14px 24px;font-weight:700;font-size:15px">Falar com a equipe</a>' +
          '</div>' +
        '</div>' +
        '<div style="position:relative;width:100%;aspect-ratio:4/3.2;border-radius:22px;overflow:hidden;border:1px solid #E8EDF3;box-shadow:0 30px 60px -34px rgba(5,40,87,.35)">' + imgSlot('Foto: fachada / instalações Ezermec') + '</div>' +
      '</section>' +
      '<section style="background:#fff;border-top:1px solid #E8EDF3;border-bottom:1px solid #E8EDF3">' +
        '<div style="max-width:1280px;margin:0 auto;padding:34px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:18px;text-align:center">' + stats + '</div>' +
      '</section>' +
      '<section style="max-width:1280px;margin:0 auto;padding:64px 24px 20px">' +
        '<div style="text-align:center;max-width:640px;margin:0 auto 36px">' +
          '<span style="font-family:\'JetBrains Mono\';font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#F5660C;font-weight:600">O que fazemos</span>' +
          '<h2 style="font-size:clamp(24px,2.8vw,32px);font-weight:800;letter-spacing:-.02em;margin:12px 0 0">Do estoque ao suporte técnico</h2>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px">' + faz + '</div>' +
      '</section>' +
      '<section style="background:#052857;margin-top:56px">' +
        '<div style="max-width:1280px;margin:0 auto;padding:60px 24px">' +
          '<div style="text-align:center;max-width:640px;margin:0 auto 34px">' +
            '<span style="font-family:\'JetBrains Mono\';font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#FF7A1A;font-weight:600">Nossos princípios</span>' +
            '<h2 style="color:#fff;font-size:clamp(24px,2.8vw,32px);font-weight:800;letter-spacing:-.02em;margin:12px 0 0">Missão, visão e valores</h2>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px">' + mvv + '</div>' +
        '</div>' +
      '</section>' +
      '<section style="max-width:1280px;margin:0 auto;padding:64px 24px 20px">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:14px;margin-bottom:26px">' +
          '<div><span style="font-family:\'JetBrains Mono\';font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#F5660C;font-weight:600">Bastidores</span><h2 style="font-size:clamp(24px,2.8vw,32px);font-weight:800;letter-spacing:-.02em;margin:10px 0 0">Nossa estrutura</h2></div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px">' + estrutura + '</div>' +
      '</section>' +
      '<section style="max-width:1280px;margin:0 auto;padding:56px 24px">' +
        '<div style="background:linear-gradient(120deg,#F5660C,#FF7A1A);border-radius:24px;padding:44px;display:flex;justify-content:space-between;align-items:center;gap:28px;flex-wrap:wrap;box-shadow:0 30px 60px -30px rgba(245,102,12,.5)">' +
          '<div><h2 style="color:#fff;font-size:clamp(24px,2.6vw,32px);font-weight:800;margin:0;letter-spacing:-.02em">Vamos manter sua indústria em movimento?</h2><p style="color:rgba(255,255,255,.92);font-size:16px;margin:8px 0 0">Fale com nossa equipe e solicite um orçamento sem compromisso.</p></div>' +
          '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
            '<a href="' + waHref + '" target="_blank" class="ez-lift" style="display:flex;align-items:center;gap:9px;background:#fff;color:#052857;border-radius:12px;padding:15px 26px;font-weight:700;font-size:16px"><i class="ph-fill ph-whatsapp-logo" style="font-size:20px;color:#25D366"></i>Chamar no WhatsApp</a>' +
            '<a href="' + mailGeneral + '" class="ez-lift" style="display:flex;align-items:center;gap:9px;background:rgba(5,40,87,.9);color:#fff;border-radius:12px;padding:15px 26px;font-weight:700;font-size:16px"><i class="ph ph-envelope-simple" style="font-size:20px"></i>Enviar e-mail</a>' +
          '</div>' +
        '</div>' +
      '</section>' +
    '</main>';
  }

  // ---------- Render ----------
  function uniq(arr) { var out = [], seen = {}; arr.forEach(function (v) { if (!seen[v]) { seen[v] = 1; out.push(v); } }); return out; }

  function renderView() {
    var el = document.getElementById('view');
    var html;
    if (state.screen === 'catalog') html = viewCatalog();
    else if (state.screen === 'product') html = viewProduct();
    else if (state.screen === 'sobre') html = viewSobre();
    else html = viewHome();
    el.innerHTML = html;
  }

  function toast(msg) {
    var t = document.getElementById('toast');
    t.innerHTML = '<div style="position:fixed;left:50%;bottom:34px;transform:translateX(-50%);z-index:80;background:#052857;color:#fff;padding:13px 22px;border-radius:100px;font-weight:600;font-size:14px;box-shadow:0 16px 40px -12px rgba(5,40,87,.5);display:flex;align-items:center;gap:9px"><i class="ph ph-check-circle" style="color:#25D366;font-size:18px"></i>' + esc(msg) + '</div>';
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.innerHTML = ''; }, 2600);
  }

  // ---------- Ações ----------
  function goHome() { state.screen = 'home'; renderView(); top(); }
  function goCatalog() { state.screen = 'catalog'; renderView(); top(); }
  function goSobre() { state.screen = 'sobre'; renderView(); top(); }

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
  }
  function onNav(n) {
    if (n === 'home') return goHome();
    if (n === 'catalog') return goCatalog();
    if (n === 'sobre') return goSobre();
    if (n === 'painel') return; // acesso restrito
    // categorias / contato → seções da home
    if (state.screen !== 'home') { state.screen = 'home'; renderView(); setTimeout(function () { scrollToId(n); }, 90); }
    else scrollToId(n);
  }
  function openProduct(slug) { state.screen = 'product'; state.productSlug = slug; renderView(); flash('productLoading'); top(); }
  function openCategory(cat) {
    state.screen = 'catalog'; state.activeCategory = cat || 'all'; state.activeBrand = 'all';
    state.activeStock = 'all'; state.query = ''; state.page = 1;
    syncSearchInputs();
    renderView(); flash('gridLoading'); top();
  }
  function clearFilters() {
    state.query = ''; state.activeCategory = 'all'; state.activeBrand = 'all'; state.activeStock = 'all'; state.page = 1;
    syncSearchInputs(); renderView(); flash('gridLoading');
  }
  function searchGo() { state.screen = 'catalog'; renderView(); top(); }

  function syncSearchInputs() {
    var h = document.getElementById('hdr-search');
    if (h) h.value = state.query;
    var he = document.getElementById('hero-search');
    if (he) he.value = state.query;
  }
  function shareProduct() {
    var url = window.location.href;
    try {
      if (navigator.share) { navigator.share({ title: 'Ezermec', url: url }); return; }
      if (navigator.clipboard) { navigator.clipboard.writeText(url); }
    } catch (e) {}
    toast('Link copiado para a área de transferência');
  }

  // ---------- Ligações estáticas (header/footer) ----------
  function bindStatic() {
    var i, list;
    list = document.querySelectorAll('[data-wa]'); for (i = 0; i < list.length; i++) list[i].href = waHref;
    list = document.querySelectorAll('[data-mail]'); for (i = 0; i < list.length; i++) list[i].href = mailGeneral;
    list = document.querySelectorAll('[data-tel]'); for (i = 0; i < list.length; i++) list[i].href = telHref;
    list = document.querySelectorAll('[data-phone]'); for (i = 0; i < list.length; i++) list[i].textContent = CFG.phoneDisplay;
    list = document.querySelectorAll('[data-email]'); for (i = 0; i < list.length; i++) list[i].textContent = CFG.email;

    var box = document.getElementById('hdr-search-box');
    var inp = document.getElementById('hdr-search');
    inp.addEventListener('focus', function () { box.style.borderColor = '#F5660C'; });
    inp.addEventListener('blur', function () { box.style.borderColor = '#E8EDF3'; });
    inp.addEventListener('input', function (e) {
      state.query = e.target.value; state.page = 1;
      if (state.screen === 'catalog') flash('gridLoading');
    });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') searchGo(); });
  }

  // ---------- Delegação de eventos ----------
  function handleClick(e) {
    var navBtn = e.target.closest('[data-nav]');
    if (navBtn) { onNav(navBtn.getAttribute('data-nav')); return; }

    var actEl = e.target.closest('[data-action]');
    if (actEl) {
      var a = actEl.getAttribute('data-action');
      if (a === 'search-go') { searchGo(); return; }
      if (a === 'go-catalog') { goCatalog(); return; }
      if (a === 'go-sobre') { goSobre(); return; }
      if (a === 'open-product') { openProduct(actEl.getAttribute('data-slug')); return; }
      if (a === 'open-category') { openCategory(actEl.getAttribute('data-cat')); return; }
      if (a === 'set-cat') { state.activeCategory = actEl.getAttribute('data-cat') || 'all'; state.page = 1; flash('gridLoading'); return; }
      if (a === 'set-brand') { state.activeBrand = actEl.getAttribute('data-brand') || 'all'; state.page = 1; flash('gridLoading'); return; }
      if (a === 'set-stock') { state.activeStock = actEl.getAttribute('data-stock') || 'all'; state.page = 1; flash('gridLoading'); return; }
      if (a === 'goto-page') { state.page = Number(actEl.getAttribute('data-page')); flash('gridLoading'); top(); return; }
      if (a === 'clear-filters') { clearFilters(); return; }
      if (a === 'share') { shareProduct(); return; }
    }

    // clique em [data-cat] sem data-action (rodapé)
    var catBtn = e.target.closest('[data-cat]');
    if (catBtn && !catBtn.getAttribute('data-action')) { openCategory(catBtn.getAttribute('data-cat')); return; }
  }

  function handleInput(e) {
    if (e.target && e.target.id === 'hero-search') {
      state.query = e.target.value; state.page = 1;
      syncSearchInputs();
    }
  }
  function handleKeydown(e) {
    if (e.target && e.target.id === 'hero-search' && e.key === 'Enter') searchGo();
  }
  function handleChange(e) {
    if (e.target && e.target.closest('[data-action="set-sort"]')) {
      state.sort = e.target.value; state.page = 1; flash('gridLoading');
    }
  }

  // ---------- Ajuste do offset do header fixo ----------
  function syncHeaderOffset() {
    var h = document.querySelector('header');
    var body = document.getElementById('ez-body');
    if (h && body) body.style.paddingTop = h.offsetHeight + 'px';
  }

  // ---------- Init ----------
  window.addEventListener('resize', syncHeaderOffset);
  window.addEventListener('load', syncHeaderOffset);
  document.addEventListener('click', handleClick);
  document.addEventListener('input', handleInput);
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('change', handleChange);
  bindStatic();
  renderView();
  syncHeaderOffset();
})();
