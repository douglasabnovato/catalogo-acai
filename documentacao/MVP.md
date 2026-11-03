# MVP — Garagem Lanches

> Criado em 31/10/2026, com os critérios usados no `movies`. Revisto em 03/11/2026 (ciclo de 03/11, `PLANO-DE-ACAO.md`).

## Problema e hipótese

**Problema e público:** Quem compra na Garagem Lanches monta o pedido no celular e o envia pronto pelo WhatsApp, sem digitar item por item.

**Hipótese:** Pelo menos 30% de quem abre o cardápio chega a tocar em **Enviar no WhatsApp**. Proposta inicial, para o responsável confirmar ou trocar. Sem medição, a meta ainda não pode ser conferida.

## 1. Critérios

**Nível:** Vitrine (N2). Os 12 critérios se aplicam.

| # | Critério | Como verificar | Situação em 03/11/2026 (evidência) |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: frase acima |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Parcial: meta de 30% proposta; confirmar com a loja é do responsável (#16) |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: 5 testes de página cobrem montar, editar, pagar e enviar; o pedido real com a loja é do responsável (#16) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: seção 3; o WhatsApp é o único canal |
| 5 | Medição de uso | A métrica principal é coletada | Parcial: evento `pedido-enviado` no código (`src/shared/lib/metrics.ts`, com teste); falta a conta do GoatCounter (#7) |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: formulário validado com foco no erro, troco menor que o total recusado, carrinho vazio, pop-up bloqueado com link de reserva, carrinho mantido ao recarregar (PR #5) |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Atende: ver "Medições de 03/11/2026" |
| 8 | Acessibilidade básica | Lighthouse e teclado | Atende: ver "Medições de 03/11/2026"; campos novos com rótulo, erro ligado por `aria-describedby` e botões com `aria-pressed` |
| 9 | Segurança e conformidade | Riscos decididos; termos de terceiros cumpridos | Parcial: o site publicado não grava dado pessoal; aviso de uso dos dados na tela; a observação pede para não escrever senha nem cartão. Ligar o Supabase segue decisão do responsável (#3) |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial: CI em PR e push para `main` e `developer/**` (desde 03/11); a Vercel publica a `main` sem esperar o CI e a `main` está sem proteção (#21) |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 23 testes Vitest (regras, carrinho, medição e página) em `npm test`, no CI |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende: README, este documento e `PLANO-DE-ACAO.md` revistos em 03/11 |

**Resultado:** 7 de 12 critérios atendidos (1, 4, 6, 7, 8, 11 e 12); 5 parciais (2, 3, 5, 9 e 10). É um julgamento técnico.

**Finalizado: sim.** Os 5 parciais dependem do responsável, e cada um tem issue aberta com o rótulo `depende-do-responsavel`: #16 (2 e 3), #7 (5), #3 (9) e #21 (10).

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Manter o carrinho ao recarregar | Feito (PR #5) |
| 2 | Remover de `docs/` o build que nada publica | Feito (PR #6) |
| 3 | Forma de pagamento, troco e observação no pedido | Feito em 03/11 |
| 4 | Confirmar com a loja o preço de R$ 2,00 por adicional e o WhatsApp | Com o responsável (#3) |
| 5 | Coletar a métrica com o GoatCounter: sem cookies, evento `pedido-enviado`, meta proposta de 30% dos acessos | Código pronto; falta a conta (#7) |
| 6 | Testar um pedido real com a loja e confirmar a meta | Com o responsável (#16) |
| 7 | Proteger a `main` e publicar só com CI verde | Com o responsável (#21) |
| 8 | Busca, axe e Lighthouse no CI, Dependabot | Próximos passos (#17, #18, #19, #20) |

## 3. Fora do MVP

Gravar pedidos no Supabase: **a decisão proposta é não ligar no MVP**, porque o WhatsApp já entrega o pedido à loja e gravar dados pessoais exigiria mais cuidado com LGPD. O código continua pronto. Também ficam fora pagamento online e painel da loja. A lista é uma proposta e pode mudar com a decisão do responsável.

## Medições de 02/11/2026

Mediana do LCP de 1,58 s (1,58, 1,81 e 1,28 s), desempenho 100, acessibilidade 100. Lighthouse 12.8.2 local, perfil móvel simulado, sem aparelho real.
