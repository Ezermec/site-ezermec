# Ezermec — Site Institucional

Site institucional estático da **Ezermec** — peças e soluções para manutenção industrial, revenda autorizada Fischertec.

Implementado em **HTML + CSS + JavaScript puro** (sem framework, sem build step).

## Estrutura

```
index.html       # marcação, header/rodapé, estilos
app.js           # lógica do site (busca, filtros, páginas) + integração Supabase
assets/          # logos e imagens
supabase/        # schema.sql do banco (referência/versionamento)
vercel.json      # configuração de deploy (cache, headers)
```

## Backend (Supabase)

Os produtos e o **estoque** vêm da tabela `products` no Supabase (projeto
`qawzvbgxlyohppereybe`). O site é estático e lê os dados via API REST usando a
**chave publicável** (segura para o frontend — o acesso é somente leitura,
garantido por Row Level Security).

- Configuração no topo do `app.js`, objeto `SUPABASE` (`url` + `key`).
- Schema completo em [`supabase/schema.sql`](supabase/schema.sql).

### Como o estoque funciona

Cada produto tem `stock_quantity` (quantidade real). O status exibido no site
(`Em estoque` / `Estoque baixo` / `Sem estoque`) é **calculado automaticamente**
pelo banco a partir da quantidade e do `low_stock_threshold` (padrão 5):

| Quantidade | Status         |
|-----------:|----------------|
| `0`        | Sem estoque    |
| `1..limite`| Estoque baixo  |
| `> limite` | Em estoque     |

### Gerenciar produtos/estoque

Enquanto não há painel administrativo com login, edite direto no Supabase:

1. Acesse **app.supabase.com** → projeto Ezermec → **Table Editor** → `products`.
2. Altere `stock_quantity` (ou outros campos) e salve.
3. O site reflete a mudança no próximo carregamento da página.

> A escrita é bloqueada por RLS para o público; alterações só acontecem pelo
> painel do Supabase (ou service_role). Um painel de admin com autenticação
> pode ser adicionado depois.

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
