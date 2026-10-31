# Plano estratégico — Garagem Lanches (catalogo-acai)

> Criado em 30/10/2026. Diagnóstico em `AVALIACAO.md`.

## Objetivo

Chegar ao nível N2 (vitrine): demo no ar, fluxos principais testados, CI e documentação que descreve o que existe de verdade.

## Execução

| Etapa | Entrega | Situação |
|---|---|---|
| 1 | CI, teste estável e limpeza de arquivos | PR #1 aberto |
| 2 | Avaliação, plano e documentação alinhados ao site real | PR #2 aberto |
| 3 | Teste de ponta a ponta do pedido, com WhatsApp simulado | Próximo ciclo |
| 4 | Remover `docs/` e ajustar `outDir` para `dist` | Depois de conferir a Vercel |

## Depende do responsável

1. Decidir se os pedidos devem ser gravados. Se sim, aplicar `supabase-orders.sql` e configurar as variáveis na Vercel.
2. Confirmar com a loja o preço dos adicionais e o número do WhatsApp.
3. Conferir na Vercel qual pasta é publicada, antes da etapa 4.

## O que você pode melhorar

- **Arquitetura:** tirar o cardápio do código quando a loja precisar mudar preços sem um novo deploy.
- **Engenharia:** proteger a `main`, exigindo CI verde, porque a Vercel publica o que chega nela.
- **Produto:** medir a conversão de cardápio para pedido enviado, a métrica já proposta em `ANALISE.md`.
