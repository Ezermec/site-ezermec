# Ezermec — Site Institucional

Site institucional estático da **Ezermec** — peças e soluções para manutenção industrial, revenda autorizada Fischertec.

Implementado em **HTML + CSS + JavaScript puro** (sem framework, sem build step).

## Estrutura

```
index.html      # marcação, header/rodapé, estilos
app.js          # dados dos produtos + toda a lógica (busca, filtros, páginas)
assets/         # logos e imagens
vercel.json     # configuração de deploy (cache, headers)
```

## Rodar localmente

Basta servir a pasta como estático. Exemplos:

```bash
# Node
node .claude/serve.js        # http://localhost:4321

# ou npx
npx serve .
```

## Deploy na Vercel

O projeto é estático e não precisa de build. Ao importar o repositório na Vercel:

- **Framework Preset:** Other
- **Build Command:** (vazio)
- **Output Directory:** (vazio / raiz)

O `vercel.json` já cuida do cache dos assets e dos headers de segurança.

## Pendências antes do go-live

- Substituir os **dados de contato** (placeholder) no objeto `CFG` em `app.js` e no rodapé de `index.html`: telefone, WhatsApp, e-mail, endereço e horário.
- Substituir as **fotos placeholder** (hero, sobre, estrutura) por imagens reais.
