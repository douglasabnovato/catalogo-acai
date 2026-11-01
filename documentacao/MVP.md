# MVP — Garagem Lanches

> Criado em 31/10/2026, com os critérios usados no `movies`. Situação baseada em `AVALIACAO.md` e na conferência deste ciclo.

## Problema e hipótese

**Problema e público:** Quem compra na Garagem Lanches monta o pedido no celular e o envia pronto pelo WhatsApp, sem digitar item por item.

**Hipótese:** Pelo menos 30% de quem abre o cardápio chega a tocar em **Enviar no WhatsApp**. Proposta inicial, para o responsável confirmar ou trocar. Sem medição, a meta ainda não pode ser conferida.

## 1. Critérios

| # | Critério | Como verificar | Situação em 31/10/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Parcial: meta proposta, sem confirmação da loja |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: testado por automação; envio real não testado para não gerar pedido falso |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: o WhatsApp é o único canal do MVP |
| 5 | Medição de uso | A métrica principal é coletada | Parcial: toque em enviar registrado no código, sem dado pessoal; meta de 30% dos acessos; falta a conta do GoatCounter (#7) |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: formulário validado, carrinho vazio e pop-up bloqueado têm resposta; a persistência do carrinho está em PR |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não medido neste ciclo |
| 8 | Acessibilidade básica | Lighthouse e teclado | Parcial: leitor de tela, foco e rótulos tratados no código; teclado não testado de ponta a ponta |
| 9 | Segurança e conformidade | Riscos decididos; termos de terceiros cumpridos | Parcial: sem dado pessoal gravado; aviso de uso dos dados na tela |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial: a Vercel publica a `main` sem esperar o CI; `main` sem proteção |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: regras e fluxo principal no CI |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende com este documento |

**Resultado:** 5 de 12 critérios atendidos por inteiro. É um julgamento técnico.

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Manter o carrinho ao recarregar | PR aberto |
| 2 | Remover de `docs/` o build que nada publica | PR aberto |
| 3 | Confirmar com a loja o preço de R$ 2,00 por adicional e o WhatsApp | Com o responsável (#3) |
| 4 | Coletar a métrica com o GoatCounter: sem cookies, evento `pedido-enviado` e meta proposta de 30% dos acessos | Código pronto; falta a conta (#7) |
| 5 | Testar um pedido real com a loja | Com o responsável |

## 3. Fora do MVP

Gravar pedidos no Supabase: **a decisão proposta é não ligar no MVP**, porque o WhatsApp já entrega o pedido à loja e gravar dados pessoais exigiria mais cuidado com LGPD. O código continua pronto. Também ficam fora pagamento online e painel da loja. A lista é uma proposta e pode mudar com a decisão do responsável.
