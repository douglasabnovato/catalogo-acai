# Deploy · Garagem Cardápio (catalogo-acai)

Plano de ação para publicar o cardápio em hospedagem gratuita.

## 1. Desafio

Publicar um cardápio em React + Vite que grava pedidos no Supabase e envia pelo WhatsApp, sem expor dados de clientes e sem custo.

## 2. Conteúdo

### Decisão de hospedagem

| Opção | Resultado |
|---|---|
| **GitHub Pages servindo a pasta `/docs` da `main` (escolhida, já era o desenho do projeto)** | Gratuito, sem conta extra; o build é gerado localmente com o `.env` e versionado em `docs/` |
| Render Static Site com build na nuvem | Evitaria versionar o build, mas mudaria o endereço público que o projeto já usa |

### Por que o RLS vem antes da publicação

A chave `anon` do Supabase vai dentro do JavaScript do site: qualquer pessoa pode lê-la. Quem protege os dados é o **Row Level Security**. Sem ele, um visitante consegue listar nomes, telefones e endereços dos outros clientes (LGPD). O script `documentacao/supabase-orders.sql` deixa o visitante **apenas inserir** pedidos.

### Comportamento sem Supabase configurado

Se o build for feito sem `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`, o site continua funcionando e o pedido segue só pelo WhatsApp (o canal principal da loja). O build que está hoje em `docs/` foi gerado **sem** essas variáveis.

### Verificação feita antes da entrega

- `npm ci` limpo, 13 testes passando (3 arquivos), `npm run lint` sem erros, `npm run build` gera `docs/` com caminhos relativos.
- `npm audit --omit=dev`: nenhuma vulnerabilidade.

## 3. Solução (passo a passo)

### Etapa 1 · Proteger os dados no Supabase

1. No painel do Supabase, abrir **SQL Editor**.
2. Colar e executar o conteúdo de `documentacao/supabase-orders.sql`.
3. Em **Authentication → Policies**, conferir que a tabela `orders` tem RLS ligado e só a política de inserção para `anon`.

### Etapa 2 · Gerar o build com as variáveis (Git Bash)

1. `cd /c/ambiente-projeto/ser-mvp/catalogo-acai`
2. `cp .env.example .env` e preencher `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (Supabase → Settings → API).
3. `npm ci`
4. `npm test && npm run lint`
5. `npm run build` (recria `docs/` e apaga os arquivos antigos de `docs/assets`)

### Etapa 3 · Subir para o GitHub

1. `git rm tailwind.config.js src/App.css src/assets/react.svg src/assets/vite.svg src/assets/hero.png public/icons.svg` (arquivos sem uso; o Tailwind v4 ignora o `tailwind.config.js`)
2. `git rm --cached tsconfig.app.tsbuildinfo`
3. `git status` (o `.env` **não** pode aparecer; `docs/` deve aparecer com o build novo)
4. `git add -A`
5. `git commit -m "feat: carrinho em centavos, Supabase por env, RLS, dialog acessível, testes, docs e novo build"`
6. `git push`

### Etapa 4 · Conferir o GitHub Pages

1. **Settings → Pages**: **Deploy from a branch**, branch `main`, pasta **/docs** (se já estiver assim, nada muda).
2. Esperar 1 a 2 minutos.

### Etapa 5 · Conferir no ar

1. `https://douglasabnovato.github.io/catalogo-acai/` abre o cardápio.
2. Montar um açaí com 4 acompanhamentos e ver a cobrança de R$ 2,00 a partir do 4º.
3. Finalizar o pedido: abre o WhatsApp com o resumo e o pedido aparece na tabela `orders` do Supabase.
4. No console do navegador, tentar ler pedidos com a chave `anon` deve retornar lista vazia (RLS funcionando).

### Etapa 6 · Fechar

1. No GitHub, **About → Website**: colar a URL.
2. Confirmar com a loja o valor de R$ 2,00 por acompanhamento extra.
