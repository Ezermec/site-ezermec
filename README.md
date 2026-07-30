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
  painel/                # painel administrativo (protegido por login)
    login/page.tsx       # tela de login
    page.tsx             # lista de produtos + estoque
    produtos/[slug]/     # editar produto existente
    produtos/novo/       # criar produto
    marcas-categorias/   # gerenciar marcas e categorias
    historico/           # histórico de alterações (audit log)
    usuarios/            # gerenciar usuários do painel (só owner)
    actions.ts           # Server Actions (produtos, marcas/categorias, usuários)
components/             # Header, Footer, ProductCard, StockBadge, etc.
  ProductGallery.tsx     # galeria de imagens na página de produto
  admin/ProductForm.tsx  # formulário de produto usado em criar/editar
  admin/ImageManager.tsx # upload de imagens direto ao Storage
lib/
  data.ts               # acesso aos produtos no Supabase
  types.ts              # tipos + normalização das linhas
  config.ts             # contato (WhatsApp/telefone/e-mail) + env Supabase
  content.ts            # conteúdo estático da home (categorias/diferenciais)
  supabase/             # clientes @supabase/ssr (server + browser)
proxy.ts                # sessão Supabase + protege as rotas /painel
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

**Site em produção:** https://ezermec.com.br

Publica a partir da branch `main` no GitHub — o que não foi enviado com `git push`
não está no ar. `http://localhost:3000` é só o servidor de desenvolvimento local.

O endereço público também alimenta o `robots.txt`, o `sitemap.xml` e as URLs
absolutas dos metadados (`lib/config.ts` → `siteUrl`). Se o domínio mudar,
defina `NEXT_PUBLIC_SITE_URL` nas variáveis de ambiente da Vercel.

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

Pelo **painel administrativo** em `/painel` (link "Painel" no header):

1. Acesse `/painel` e faça login com a conta de admin (criada no Supabase Auth).
2. A lista mostra todos os produtos com estoque e status atuais.
3. **Editar**: clique em "Editar" → altere qualquer campo (inclusive
   `stock_quantity`) → "Salvar alterações".
4. **Criar**: botão "Novo produto" — o slug é gerado automaticamente do nome
   se deixado em branco.
5. **Excluir**: dentro da edição, botão "Excluir produto" (com confirmação).

Como as páginas públicas são renderizadas no servidor, a mudança aparece no
próximo carregamento — sem cache para revalidar manualmente.

Alternativa: editar direto em **app.supabase.com** → projeto Ezermec →
**Table Editor** → `products`.

> **Segurança**: a leitura da tabela `products` é pública (RLS); a escrita
> (`insert`/`update`/`delete`) exige um usuário autenticado. As rotas
> `/painel/*` (exceto `/painel/login`) são protegidas em `proxy.ts`, que
> redireciona quem não estiver logado.
>
> Para trocar a senha de um usuário: **app.supabase.com** → projeto Ezermec
> → **Authentication → Users**.

### Usuários e papéis (`/painel/usuarios`)

Existem dois papéis:

- **owner** (administrador principal) — único hoje é `ezermec@gmail.com`.
  Além de gerenciar produtos, pode criar, renomear e remover outros usuários
  em `/painel/usuarios`.
- **admin** — gerencia produtos, marcas, categorias e vê o histórico, mas não
  acessa `/painel/usuarios`.

O papel fica na tabela `profiles` (não em `auth.users`). A criação de usuário
usa o endpoint público de signup do Supabase + uma função no banco
(`admin_finish_new_user`, só chamável pelo owner) que confirma o e-mail e cria
o perfil — **não depende da `service_role` key**.

> **Limite de e-mail do Supabase**: o passo de signup tenta enviar um e-mail
> de confirmação (mesmo sendo confirmado automaticamente em seguida). Contas
> gratuitas do Supabase têm um limite baixo de envios por hora; criar vários
> usuários em sequência pode esbarrar nesse limite (erro "muitas tentativas").
> Se isso acontecer, aguarde alguns minutos. Alternativa: criar o usuário
> direto em **Authentication → Users** no Supabase — no primeiro login dele,
> o app cria o perfil automaticamente (papel `admin`).

### Histórico de alterações (`/painel/historico`)

Toda alteração em produtos, marcas e categorias (criar/editar/remover) é
registrada automaticamente na tabela `audit_log` via **trigger no banco**
(`log_audit_change`) — não depende do código da aplicação, então nenhuma
alteração passa despercebida. Cada registro guarda quem fez (nome/e-mail),
quando, em qual tabela/item, e o que mudou (diff de campos, para updates).
A tabela é somente-leitura para os usuários do painel (só o trigger escreve).

## Pendências antes do go-live

- Substituir as **fotos placeholder** (hero, sobre, estrutura) por imagens reais. Dados de contato (WhatsApp, telefone, e-mail, endereço, horário) já são os reais.
- Habilitar **"Leaked Password Protection"** no Supabase (Authentication →
  Policies) — verifica a senha do admin contra vazamentos conhecidos
  (HaveIBeenPwned). Não requer nenhuma mudança de código, só o toggle no
  painel.
