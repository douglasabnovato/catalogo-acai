# Deploy · Garagem Cardápio (catalogo-acai)

> Revisto em 16/11/2026. O site está na Vercel, em https://catalogo-acai.vercel.app. O GitHub Pages está desligado desde 30/10/2026. O passo a passo antigo, do Pages, ficou no histórico do Git.

## Como funciona hoje

| Peça | Onde | Quem mexe |
|---|---|---|
| Código | branch `main` | Só por PR, com os jobs `build-and-test` e `e2e` verdes (ruleset `principal-protegida`) |
| Build | Vercel, a cada push na `main` | Automático |
| Configuração do build | `vercel.json` no repositório: `npm ci`, `npm run build`, saída em `docs/` | Agente, por PR |
| Conta, projeto e domínio da Vercel | Painel da Vercel | Só o responsável |
| Supabase | Desligado no MVP (seção 3 do `MVP.md`) | Só o responsável |
| GoatCounter | Código `douglasabnovato`, carregado só no site publicado | Conta do responsável (#7) |

O `vercel.json` repete o que a tela de Settings da Vercel já usava: pasta de saída `docs` (definida em `vite.config.ts`). Se a tela tiver outro valor, o arquivo vence. O preview da Vercel no PR confirma.

## Passo a passo para o responsável

### 1. Conferir a publicação depois do merge na `main`

1. Abrir https://vercel.com e entrar no projeto `catalogo-acai`.
2. Aba **Deployments**: o último deploy de **Production** deve ser o commit do merge, com estado **Ready**.
3. Abrir https://catalogo-acai.vercel.app no celular: o cardápio aparece, e os botões de quantidade do carrinho estão maiores (44×44 px).

### 2. Se o deploy falhar

1. Em **Deployments**, abrir o deploy com erro e ler o **Build Log**.
2. Falha em 2 a 4 segundos, antes da instalação, é configuração do projeto, não do código. Em **Settings → Build and Deployment**, conferir **Framework Preset: Vite**, **Output Directory: docs** (ou deixar o `vercel.json` decidir, sem override).
3. Falha no `npm run build`: rodar `npm ci && npm run build` localmente na mesma versão e abrir uma issue com o log.

### 3. Supabase (só se a loja quiser gravar pedidos)

Hoje fica desligado. Para ligar:

1. No Supabase, **SQL Editor**: colar e executar `documentacao/supabase-orders.sql` (RLS: o site só insere; ninguém anônimo lê).
2. Em **Authentication → Policies**, conferir RLS ligado na tabela `orders`, com só a política de inserção para `anon`.
3. Na Vercel, **Settings → Environment Variables**: criar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (valores em Supabase → **Settings → API**). Não colar os valores em issue nem em PR.
4. Em **Deployments**, clicar em **Redeploy** no último deploy de Production.

Antes, decidir com a loja o cuidado com nome, telefone e endereço (LGPD). O projeto Supabase gratuito pode estar pausado; religar é do responsável.

## Rodar localmente

```bash
npm ci
npm run dev                 # http://localhost:5173
npm run lint
npm test                    # Vitest
npm run build               # gera docs/
npx playwright install chromium   # só na primeira vez
npm run test:e2e            # Playwright sobre o build (porta 4182; outra com PW_PORT)
```

O `@axe-core/playwright` exige Node 22.12 ou mais novo.
