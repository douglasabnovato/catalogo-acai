# 🍔 Garagem Cardápio 

<div align="center">

[![Status do Projeto](https://img.shields.io/badge/STATUS-EM%20PRODU%C3%87%C3%83O-emerald?style=for-the-badge)](https://github.com)
[![Tecnologias](https://img.shields.io/badge/React-Vite-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Estilização](https://img.shields.io/badge/TailwindCSS-v4-cyan?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Banco de Dados](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com)

*Aplicativo de autoatendimento digital (estilo totem/delivery) desenvolvido para a Garagem Lanches, integrando cardápio imersivo, montador de açaí customizável em camadas, persistência de dados em tempo real e checkout integrado com o WhatsApp.*

</div>

---

## 🚀 Sobre o Projeto

O **Garagem Lanches** é uma solução completa de cardápio digital desenvolvida para modernizar o atendimento da lanchonete e açaí local. Inspirado nos padrões visuais dos grandes apps de fast-food (como McDonald's) e alinhado à identidade real do estabelecimento (parceria com a Rede Apogeu e copos personalizados), o sistema oferece uma experiência de usuário extremamente fluida, rápida e focada em conversão.

---

## 🎨 Identidade Visual e Inspiração

O projeto foi estruturado com base no material físico e promocional da lanchonete:
* **Paleta de Cores Imersiva:** Fundo grafite escuro premium (`#09090b`), detalhes vibrantes em **Amarelo Ouro** (`#FFC72C`) para chamadas de ação e preços, e tons de **Roxo Açaí** para a customização artesanal de copos.
* **Experiência Visual de Totem:** Carrossel de categorias fluido com ícones dedicados e cards limpos que separam produtos prontos para consumo de itens customizáveis.

---

## ✨ Principais Funcionalidades

* 📱 **Cardápio por Categorias:** Navegação rápida entre Açaís, Salgados, Sanduíches, Combos, Sucos/Vitaminas e itens Para Casa.
* 🥣 **Construtor de Açaí Artesanal:** Modal interativo com 3 acompanhamentos inclusos, adicionais a partir do 4º com preço visível e adição opcional de Whey Protein.
* 🛒 **Carrinho Flutuante e Editável:** Acompanhamento em tempo real, com ajuste de quantidade e remoção de itens antes de enviar.
* 📋 **Checkout Inteligente:** Coleta de dados essenciais do cliente (Nome Completo, WhatsApp/Telefone, tipo de atendimento entre Entrega em Casa ou Retirada no Balcão, e Endereço com Referência).
* 💳 **Pagamento e observação:** O cliente escolhe Pix, cartão ou dinheiro (com "troco para", que não aceita valor menor que o total) e pode deixar uma observação. Tudo vai na mensagem do WhatsApp; o pagamento é feito com a loja.
* 🗄️ **Persistência opcional no Supabase:** O código registra os pedidos quando as variáveis estão configuradas. O site publicado hoje não as usa, então os pedidos seguem só pelo WhatsApp.
* 💬 **Disparo via WhatsApp:** Formatação automática de uma mensagem limpa e profissional contendo todos os dados do cliente e os itens do pedido, abrindo diretamente no canal de atendimento da lanchonete.
* 🎉 **Tela de Sucesso e Reset:** Feedback visual após o envio do pedido e retorno imediato ao cardápio pronto para novos atendimentos.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias modernas de desenvolvimento web:

* **React 19** + **TypeScript** (Desenvolvimento de componentes tipados)
* **Vite** (Empacotador de alta performance)
* **Tailwind CSS v4** (Estilização utilitária avançada)
* **Lucide React** (Biblioteca de ícones modernos)
* **Supabase** (Banco de dados relacional e políticas de segurança RLS)
* **Vitest** + **Testing Library** (24 testes de regras e tela)
* **Playwright** + **axe** (24 testes no navegador: fluxo, falhas, acessibilidade e alvos de toque)

---

## ▶️ Como executar

```bash
npm install
cp .env.example .env     # preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (opcional)
npm run dev              # http://localhost:5173
npm run lint
npm test                 # 24 testes Vitest
npm run build            # gera o build em docs/
npx playwright install chromium   # só na primeira vez
npm run test:e2e         # 24 testes Playwright sobre o build (porta 4182; outra com PW_PORT)
```

O `@axe-core/playwright` exige Node 22.12 ou mais novo.

Sem o `.env`, o cardápio funciona e envia os pedidos só pelo WhatsApp.

### Dependências

O `.github/dependabot.yml` abre PRs semanais para npm e GitHub Actions (#20). Regra para mesclar:
- **patch e minor:** vêm agrupados num PR só (`patch-e-minor`); com `build-and-test` e `e2e` verdes, o responsável mescla.
- **versão maior:** só com revisão. Cada PR recebe a análise (o que muda, CI, risco) e o responsável decide; a triagem fica numa issue (#50).

### Supabase

Rode [documentacao/supabase-orders.sql](./documentacao/supabase-orders.sql) no SQL Editor. Ele cria a tabela `orders` com validações e deixa o site **apenas inserir** pedidos; a leitura fica restrita a usuários autenticados da loja, protegendo nomes, telefones e endereços dos clientes.

### Publicação

O site está na Vercel, com o build definido no `vercel.json`. O GitHub Pages está desligado. Detalhes em [documentacao/DEPLOY.md](documentacao/DEPLOY.md).

**Demonstração:** https://catalogo-acai.vercel.app

---

## 📊 Estado do MVP & Documentação

| Documento | Conteúdo |
|---|---|
| [documentacao/ANALISE.md](./documentacao/ANALISE.md) | Requisitos, diagnóstico, rubrica e BDD |
| [documentacao/ARQUITETURA.md](./documentacao/ARQUITETURA.md) | C4, FSD, modelo de dados e ADRs |
| [documentacao/MVP.md](./documentacao/MVP.md) | Estado do MVP: 11 de 12 critérios, N2, Finalizado: sim |
| [documentacao/PLANO-DE-ACAO.md](./documentacao/PLANO-DE-ACAO.md) | Tarefas de 27/09/2026 e ciclos de 03/11 e 16/11/2026 (pesquisa, produto e engenharia) |
| [documentacao/DEPLOY.md](./documentacao/DEPLOY.md) | Publicação na Vercel e passo a passo do responsável |
| [documentacao/AVALIACAO.md](./documentacao/AVALIACAO.md) | Evidências e achados de 30/10/2026 |
| [documentacao/PLANO-ESTRATEGICO.md](./documentacao/PLANO-ESTRATEGICO.md) | Plano vigente e execução |

| Momento | Nota MVP | Situação |
|---|---|---|
| Antes (27/09/2026) | 4,54 | Reprovado — carrinho sem remoção, adicionais cobrados sem aviso e modais inacessíveis |
| Depois (27/09/2026) | 8,48 | Aprovado |

---

## Estado e próximos passos (ciclo de 18/11/2026)

No ar em https://catalogo-acai.vercel.app (HTTP 200 em 18/11/2026). Nível Vitrine (N2): 11 de 12 critérios atendidos, Finalizado: sim. Falta só a conta do GoatCounter (#7, do responsável). Alertas do Dependabot abertos: 0 em 18/11/2026 (os 16 de 16/11/2026 foram corrigidos pelos PRs #45 e #47, já na `main`). A `main` exige os jobs `build-and-test` e `e2e` verdes.

**O que foi feito**

- Com um diálogo aberto, o cardápio atrás dele fica inerte (`inert`): sem foco e fora da árvore de acessibilidade. O axe passa a contar os itens que não decide sozinho (`incomplete`), com o contraste medido no teste (ciclo de 18/11/2026, #34).
- LCP medido de novo no site publicado depois da sprint de 19/11/2026: mediana 1,22 s (ciclo de 18/11/2026, #37).
- Regra do Dependabot no README, seção "Dependências" (ciclo de 18/11/2026, #20).

- Alertas do Dependabot ligados pelo responsável em 16/11/2026: 15 dos 16 corrigidos só no `package-lock.json`, sem versão maior (PR #45); o `minimatch` do `typescript-eslint` saiu com a versão menor 8.73.0 do `typescript-eslint` (PR #47, #44).
- axe (WCAG A e AA) no navegador, no celular e no desktop, e percurso só com teclado: `e2e/acessibilidade.pw.ts` (ciclo de 16/11/2026, #18).
- Botões do carrinho e fechar do montador com 44×44 px, com teste: `e2e/alvos.pw.ts` (ciclo de 16/11/2026, #31).
- Falhas testadas no navegador: formulário com erro, carrinho vazio e link de reserva com a nova aba bloqueada: `e2e/falhas.pw.ts` (ciclo de 16/11/2026).
- `.github/dependabot.yml` para npm e GitHub Actions (#20) e `vercel.json` com o build (ciclo de 16/11/2026).
- `MVP.md` revisto contra a régua: o critério 9 volta a Parcial enquanto os alertas do Dependabot estão desligados (ciclo de 16/11/2026).
- GoatCounter ligado ao código `douglasabnovato`, só no site publicado (PR #30).
- Fluxo principal no navegador com Playwright e job `e2e` no CI (PR #30).
- Forma de pagamento (Pix, cartão ou dinheiro), troco validado e observação no pedido (PR #22).

**O que queremos fazer**

- Do responsável: fechar a #32 (alertas ligados, 0 abertos em 18/11/2026) e a #21 (proteção da `main` com `build-and-test` e `e2e`), criar a conta do GoatCounter com o código `douglasabnovato` (#7), confirmar o preço dos adicionais e o WhatsApp da loja (#3), fazer um pedido real e revisar a meta de 30% (#16) e decidir os PRs do Dependabot de versão maior (#50).
- Do código (próximos passos): busca por nome no cardápio (#17), Lighthouse no CI com orçamento de LCP (#19) e o merge na `main` do fundo inerte e do axe com itens incompletos (#34).

**Onde está a documentação**

- [documentacao/MVP.md](documentacao/MVP.md): critérios, evidências e medições.
- [documentacao/PLANO-DE-ACAO.md](documentacao/PLANO-DE-ACAO.md): seção "Ciclo de 16/11/2026", com pesquisa, produto e engenharia.
- [documentacao/DEPLOY.md](documentacao/DEPLOY.md): publicação na Vercel e passo a passo do responsável.
