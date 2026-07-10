# Ezermec — Site Institucional

Site institucional da **Ezermec** — peças e soluções para manutenção industrial, revenda autorizada Fischertec.

Construído com **Next.js (App Router) + TypeScript**, com produtos e estoque servidos pelo **Supabase** via renderização no servidor (SSR).

## Stack

- **Next.js 16** (App Router, Server Components) + **React 19** + **TypeScript**
- **Supabase** (`@supabase/ssr`) — dados de produtos/estoque
- Estilos com CSS global + estilos inline (design portado do protótipo original)
- Ícones Phosphor e fontes Archivo / JetBrains Mono

## Estrutura

```
app/
  layout.tsx            # layout raiz: fontes, header, footer, WhatsApp flutuante
  globals.css           # design system (cores, cards, botões, header…)
  page.tsx              # Home
  catalogo/page.tsx     # Catálogo (SSR) + CatalogClient (filtros/busca/paginação)
  produto/[slug]/page.tsx  # Página de produto (SSR)
  sobre/page.tsx        # Sobre
  not-found.tsx         # 404
components/             # Header, Footer, ProductCard, StockBadge, etc.
lib/
  data.ts               # acesso aos produtos no Supabase
  types.ts              # tipos + normalização das linhas
  config.ts             # contato (WhatsApp/telefone/e-mail) + env Supabase
  content.ts            # conteúdo estático da home (categorias/diferenciais)
  supabase/             # clientes @supabase/ssr (server + browser)
proxy.ts                # sessão Supabase (base pronta para auth futura)
supabase/schema.sql     # schema do banco (referência/versionamento)
public/assets/          # logos e imagens
```

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:3000
```

As variáveis do Supabase ficam em `.env.local` (veja `.env.example`). A chave é
publicável (segura no frontend); há também um fallback embutido em `lib/config.ts`,
então o projeto roda mesmo sem `.env.local`.

```bash
npm run build      # build de produção
npm start          # servir a build
```

## Deploy na Vercel

A Vercel detecta o Next.js automaticamente — sem configuração manual de build.

1. Importe o repositório em [vercel.com/new](https://vercel.com/new).
2. (Opcional, recomendado) Configure as env vars em *Settings → Environment Variables*:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Sem elas, o site usa o fallback público embutido.
3. Deploy. Cada `git push` na `main` refaz o deploy.

## Backend (Supabase)

Produtos e **estoque** vêm da tabela `products` (projeto `qawzvbgxlyohppereybe`),
lidos no servidor via `@supabase/ssr`. Acesso somente-leitura garantido por RLS.

### Como o estoque funciona

Cada produto tem `stock_quantity` (quantidade real). O status exibido
(`Em estoque` / `Estoque baixo` / `Sem estoque`) é **calculado pelo banco** a
partir da quantidade e do `low_stock_threshold` (padrão 5):

| Quantidade  | Status         |
|------------:|----------------|
| `0`         | Sem estoque    |
| `1..limite` | Estoque baixo  |
| `> limite`  | Em estoque     |

### Gerenciar produtos/estoque

Enquanto não há painel administrativo com login, edite direto no Supabase:

1. **app.supabase.com** → projeto Ezermec → **Table Editor** → `products`.
2. Altere `stock_quantity` (ou outros campos) e salve.
3. Como as páginas são renderizadas no servidor, a mudança aparece já no próximo
   carregamento.

> A escrita é bloqueada por RLS para o público. Os clientes `@supabase/ssr` e o
> `proxy.ts` já deixam a base pronta para adicionar autenticação de admin e um
> painel `/painel` no futuro.

## Pendências antes do go-live

- Substituir os **dados de contato** (placeholder) em `lib/config.ts` e no rodapé.
- Substituir as **fotos placeholder** (hero, sobre, estrutura) por imagens reais.
