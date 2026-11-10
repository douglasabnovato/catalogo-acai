# MVP — Garagem Lanches

> Criado em 31/10/2026, com os critérios usados no `movies`. Revisto em 10/11/2026 (ciclo da faixa de 90%, decisões D1 a D7 do repositório `engenharia`).

**Resumo:** 11 de 12 aplicáveis atendidos

**Finalizado:** sim — falta só a conta do GoatCounter, do responsável (#7, com `depende-do-responsavel`).

## Problema e hipótese

**Problema e público:** Quem compra na Garagem Lanches monta o pedido no celular e o envia pronto pelo WhatsApp, sem digitar item por item.

**Hipótese:** Pelo menos 30% de quem abre o cardápio chega a tocar em **Enviar no WhatsApp**. Meta decidida pelo coordenador em 10/11/2026 (decisão D1), revisável pelo responsável (#16). O evento que conta é `pedido-enviado`.

## 1. Critérios

**Nível:** Vitrine (N2). Os 12 critérios se aplicam.

| # | Critério | Como verificar | Situação em 10/11/2026 (evidência) |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: frase acima |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: meta decidida pelo coordenador em 10/11/2026 (decisão D1), revisável pelo responsável (#16) |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende (decisão D2): `npm run test:e2e` (Playwright, novo job `e2e` no CI), 10/11/2026: 4 testes, 0 falhas; monta o pedido, preenche nome, WhatsApp e retirada e abre o WhatsApp com os itens (o WhatsApp é simulado). O fluxo roda todo no navegador; o site publicado responde (`curl`, HTTP 200, 10/11/2026). O pedido real com a loja virou validação (#16) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: seção 3; o WhatsApp é o único canal |
| 5 | Medição de uso | A métrica principal é coletada | Parcial: código pronto; falta a conta (decisão D5, #7). O GoatCounter usa o código `douglasabnovato` no site publicado, sem cookie, só com o evento `pedido-enviado`; não carrega em localhost nem nos testes (Vitest e Playwright) |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: formulário validado com foco no erro, troco menor que o total recusado, carrinho vazio, pop-up bloqueado com link de reserva, carrinho mantido ao recarregar (PR #5) |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Atende: Lighthouse 12.8.2 móvel no site publicado, 10/11/2026: 1,40 / 1,42 / 1,28 s, mediana 1,40 s, TBT 61 ms, elemento do LCP `li > div > p.text-xs` (descrição do primeiro item) |
| 8 | Acessibilidade básica | Lighthouse e teclado | Atende: Lighthouse 100 nas 3 execuções de 03/11; campos novos com rótulo, erro ligado por `aria-describedby` e botões com `aria-pressed` |
| 9 | Segurança e conformidade | Riscos decididos; termos de terceiros cumpridos | Atende (decisão D4): o site publicado não grava dado pessoal (o pedido vai só pelo WhatsApp); o Supabase fica desligado no MVP (seção 3); o valor dos adicionais, sem confirmação da loja, aparece na tela como ilustrativo, com teste (Vitest e Playwright), 10/11/2026. `npm audit --omit=dev`: 0 vulnerabilidades; Dependabot desligado (API 403), 10/11/2026. Confirmar o preço e o número do WhatsApp segue com o responsável (#3) |
| 10 | Entrega confiável | Publicação só depois de CI verde | Atende: `gh api repos/douglasabnovato/catalogo-acai/rules/branches/main`, 10/11/2026: `required_status_checks` com `build-and-test`, além de PR obrigatório e bloqueio de force push e exclusão. A Vercel publica a `main`, que só recebe o que passou no CI. Incluir o novo job `e2e` nos checks é do responsável (#21) |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: `npm test`, 10/11/2026: 24 testes Vitest, 0 falhas; 4 testes Playwright no job `e2e` |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende: README, este documento e `PLANO-DE-ACAO.md` conferidos contra o `package.json` em 10/11/2026 |

## Histórico

- 03/11/2026, critério 10 revisto em 10/11/2026: 7 de 12. Parciais: 2 (meta proposta), 3 (pedido real), 5 (falta a conta), 9 (preço e Supabase sem decisão) e 10 (Vercel sem esperar o CI).

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Manter o carrinho ao recarregar | Feito (PR #5) |
| 2 | Remover de `docs/` o build que nada publica | Feito (PR #6) |
| 3 | Forma de pagamento, troco e observação no pedido | Feito em 03/11 |
| 4 | Confirmar com a loja o preço de R$ 2,00 por adicional e o WhatsApp | Com o responsável (#3) |
| 5 | Coletar a métrica com o GoatCounter: sem cookies, evento `pedido-enviado`, meta proposta de 30% dos acessos | Código pronto; falta a conta (#7) |
| 6 | Testar um pedido real com a loja e confirmar a meta | Com o responsável (#16) |
| 7 | Proteger a `main` e publicar só com CI verde | Proteção feita em 10/11/2026; a Vercel esperar o CI segue com o responsável (#21) |
| 8 | Busca, axe e Lighthouse no CI, Dependabot | Próximos passos (#17, #18, #19, #20) |

## 3. Fora do MVP

Gravar pedidos no Supabase: **a decisão proposta é não ligar no MVP**, porque o WhatsApp já entrega o pedido à loja e gravar dados pessoais exigiria mais cuidado com LGPD. O código continua pronto. Também ficam fora pagamento online e painel da loja. A lista é uma proposta e pode mudar com a decisão do responsável.

## Medições de 02/11/2026

Mediana do LCP de 1,58 s (1,58, 1,81 e 1,28 s), desempenho 100, acessibilidade 100. Lighthouse 12.8.2 local, perfil móvel simulado, sem aparelho real.

## Medições de 03/11/2026

Site publicado depois do PR #23 (bundle com o checkout novo). Mediana do LCP de 1,30 s (1,49, 1,28 e 1,30 s), desempenho 96 (96, 87 e 99), acessibilidade 100 nas 3 execuções. Lighthouse 12.8.2 local, perfil móvel simulado, sem aparelho real.
