# MVP — Garagem Lanches

> Criado em 31/10/2026, com os critérios usados no `movies`. Revisto em 16/11/2026 (ciclo de 16/11/2026; às 12:00, critério 9 com os alertas do Dependabot ligados, PR #45; às 15:04, o último alerta corrigido, PR #47), contra a régua do repositório `engenharia`.

**Nível:** Vitrine (N2). Os 12 critérios se aplicam.

**Resumo:** 11 de 12 aplicáveis atendidos

**Finalizado:** sim — o único critério fora de "Atende" é o 5, que depende do responsável e tem issue com `depende-do-responsavel` (conta do GoatCounter, #7). O 9 passou a "Atende" em 16/11/2026, 15:04: os 16 alertas do Dependabot têm correção na sprint-19 (15 no PR #45 e 1 no PR #47).

## Problema e hipótese

**Problema e público:** Quem compra na Garagem Lanches monta o pedido no celular e o envia pronto pelo WhatsApp, sem digitar item por item.

**Hipótese:** Acreditamos que montar o pedido pronto no cardápio faz o cliente concluir a compra pelo WhatsApp. **Meta:** pelo menos 30% de quem abre o cardápio toca em **Enviar no WhatsApp**. **Saberemos quando** o painel do GoatCounter mostrar, numa semana, o evento `pedido-enviado` em 30% ou mais das visitas. Meta decidida pelo coordenador em 10/11/2026 (decisão D1), revisável pelo responsável (#16).

## 1. Critérios

| # | Critério | Como verificar | Situação em 16/11/2026 (evidência) |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: frase acima |
| 2 | Hipótese a validar | Aposta escrita, com meta | Atende: hipótese, meta de 30% e "saberemos quando" acima; meta revisável pelo responsável (#16) |
| 3 | Fluxo principal completo | Teste de ponta a ponta no navegador no CI | Atende: `npm run build && npm run test:e2e` (Playwright, job `e2e` do CI), 16/11/2026: 19 testes, 0 falhas, 0 pulados; no CI, job `e2e` do [run 43827698588](https://github.com/douglasabnovato/catalogo-acai/actions/runs/43827698588): 19 passed. `e2e/fluxo.pw.ts` monta o pedido, preenche nome, WhatsApp e retirada e abre o WhatsApp com os itens (o WhatsApp é simulado). O site publicado responde: `curl` HTTP 200, 16/11/2026 |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: seção 3; o WhatsApp é o único canal |
| 5 | Medição de uso | Painel com visitas | Parcial: código pronto, com teste (`e2e/fluxo.pw.ts` e `src/shared/lib/metrics.test.ts`); falta a conta do GoatCounter com o código `douglasabnovato`, do responsável (#7). Sem painel, não há visitas a mostrar |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta | Atende: `npm run test:e2e`, 16/11/2026, `e2e/falhas.pw.ts` (3 testes): formulário vazio põe o foco no primeiro erro, carrinho que fica vazio avisa e desliga o envio, e a tela de sucesso traz sempre o link de reserva, conferido com a nova aba bloqueada (com `noopener`, o navegador não diz ao app se bloqueou). `npm test`, 16/11/2026: troco menor que o total recusado e carrinho salvo com dado vencido ou inválido ignorado. Carregamento: o cardápio vem no próprio pacote (`menu.data.ts`), sem chamada de rede; o Supabase está desligado (seção 3), então não há espera a tratar |
| 7 | Desempenho aceitável | LCP até 2,5 s no celular, no site publicado | Atende: Lighthouse 12.8.2 móvel em https://catalogo-acai.vercel.app, 16/11/2026, 3 execuções válidas: LCP 1,53 / 1,31 / 1,27 s, **mediana 1,31 s**; TBT 79 / 44 / 60 ms (mediana 60 ms); elemento do LCP `ul.grid > li > div > p.text-xs` (descrição do primeiro item). Uma 4ª execução deu 1,26 s. Build medido: o deploy de Production 7814926941 da Vercel, do commit `40c44f6` (a `main` depois do PR #29), publicado às 00:38 de 16/11/2026 (hora local); as execuções do Lighthouse foram das 04:35 às 04:38, depois dele. Conferido com `gh api "repos/douglasabnovato/catalogo-acai/deployments?environment=Production&per_page=3"`, 16/11/2026: último deploy, estado `success`. É a versão da principal, mas ainda sem os botões de 44 px deste ciclo (que só aparecem no checkout, fora da primeira tela): refazer a medição depois que o PR #35 for publicado (#37) |
| 8 | Acessibilidade básica | axe e teclado | Atende: `npm run test:e2e`, 16/11/2026, local e no job `e2e` do run 43827698588 (verde), `e2e/acessibilidade.pw.ts`: axe (WCAG 2.0, 2.1 e 2.2, A e AA) sem violações no cardápio, no montador, no checkout com erros e na tela de sucesso, a 375 px e a 1280 px; teclado com Tab até o botão, Enter abre, Esc fecha e devolve o foco, Tab preso no diálogo, contorno amarelo de 3 px do app. `e2e/alvos.pw.ts`: botões do carrinho e fechar do montador com 44×44 px. O app tem um tema só, de fundo escuro, sem `prefers-color-scheme`: não há modo claro e escuro a comparar |
| 9 | Segurança e conformidade | Audit, alertas do Dependabot, segredos e dados pessoais | Atende: `gh api "repos/douglasabnovato/catalogo-acai/dependabot/alerts?state=open&per_page=100"`, 16/11/2026, 15:04: 16 alertas abertos, todos de desenvolvimento. 15 corrigidos na sprint-19 (PR #45) e 1 (`minimatch` 10.2.6, #22) corrigido na sprint-19 (PR #47), com o `typescript-eslint` 8.72.2 → 8.73.0, versão menor; fecham no merge na principal (conferido contra o lockfile: nenhuma versão vulnerável restante nos 16). 0 sem decisão, 0 em ADR. Com o lockfile novo, 16/11/2026: `npm ci`, `npm run lint` sem erros, `npm test` 24 de 24, `npm run build` ok. `npm audit --omit=dev --package-lock-only`, 16/11/2026: 0 vulnerabilidades; nenhum segredo no código (só `.env.example` com os nomes); o site publicado não grava dado pessoal, porque o pedido vai só pelo WhatsApp e o Supabase fica desligado (seção 3). O valor dos adicionais aparece como ilustrativo, com teste, até a loja confirmar o preço e o número do WhatsApp (#3); os dois seguem como estão no código |
| 10 | Entrega confiável | CI nos PRs e principal protegida | Atende: `gh api repos/douglasabnovato/catalogo-acai/rules/branches/main`, 16/11/2026: `deletion`, `non_fast_forward`, `pull_request` e `required_status_checks` com `build-and-test` e `e2e`. A Vercel publica a `main`, que só recebe o que passou nos dois jobs |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI, sem pulados | Atende: 16/11/2026, `npm test`: 24 testes Vitest, 0 falhas; `npm run test:e2e`: 19 testes Playwright, 0 falhas, 0 pulados. Os dois rodam no CI: [run 43827698588](https://github.com/douglasabnovato/catalogo-acai/actions/runs/43827698588), 16/11/2026, `build-and-test` com 24 passed e `e2e` com 19 passed |
| 12 | Documentação honesta | README com comandos conferidos | Atende: README, este documento, `PLANO-DE-ACAO.md` e `DEPLOY.md` conferidos contra o `package.json` e o `vercel.json` em 16/11/2026; o link publicado respondeu HTTP 200 em 16/11/2026 |

## Histórico

- 16/11/2026, 15:04: regra geral do responsável para os alertas. O único que restava (`minimatch` 10.2.6, #44) tinha correção sem versão maior: o `typescript-eslint` 8.73.0 já pede o `minimatch` 11 (PR #47). Critério 9: Parcial → Atende. Resumo 10 → 11 de 12. Finalizado: não → sim.
- 16/11/2026, 12:00: alertas do Dependabot ligados. Critério 9 segue Parcial, com motivo novo (1 alerta sem correção nem decisão, #44; 15 corrigidos só na sprint, PR #45). Resumo segue 10 de 12. Finalizado: sim → não.

- 10/11/2026: o documento dizia 11 de 12. Na revisão de 16/11/2026, dois "Atende" não batiam com a régua: o 8 citava só o Lighthouse, sem axe no navegador nem teclado (corrigido com `e2e/acessibilidade.pw.ts`), e o 9 estava "Atende" com os alertas do Dependabot desligados (volta a Parcial, #32). Contagem honesta antes deste ciclo: 9 de 12.
- 03/11/2026, critério 10 revisto em 10/11/2026: 7 de 12. Parciais: 2 (meta proposta), 3 (pedido real), 5 (falta a conta), 9 (preço e Supabase sem decisão) e 10 (Vercel sem esperar o CI).

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Manter o carrinho ao recarregar | Feito (PR #5) |
| 2 | Remover de `docs/` o build que nada publica | Feito (PR #6) |
| 3 | Forma de pagamento, troco e observação no pedido | Feito em 03/11 |
| 4 | Confirmar com a loja o preço de R$ 2,00 por adicional e o WhatsApp | Com o responsável (#3); o código mantém os valores atuais e o aviso de "ilustrativo" |
| 5 | Coletar a métrica com o GoatCounter: sem cookies, evento `pedido-enviado`, meta de 30% dos acessos | Código pronto; falta a conta (#7) |
| 6 | Testar um pedido real com a loja e confirmar a meta | Com o responsável (#16) |
| 7 | Proteger a `main` e publicar só com CI verde | Feito: ruleset com `build-and-test` e `e2e` (16/11/2026); a #21 fecha com o responsável |
| 8 | axe e teclado no navegador | Feito no ciclo de 16/11/2026 (#18) |
| 9 | Alvos de toque de 44×44 px no carrinho | Feito no ciclo de 16/11/2026 (#31) |
| 10 | Dependabot de versões para npm e Actions | `.github/dependabot.yml` no ciclo de 16/11/2026 (#20); os alertas são do responsável (#32) |
| 11 | Busca por nome e Lighthouse no CI | Próximos passos (#17, #19) |

## 3. Fora do MVP

Gravar pedidos no Supabase: **a decisão proposta é não ligar no MVP**, porque o WhatsApp já entrega o pedido à loja e gravar dados pessoais exigiria mais cuidado com LGPD. O código continua pronto. Também ficam fora pagamento online e painel da loja. A lista é uma proposta e pode mudar com a decisão do responsável.

## Medições de 16/11/2026

Site publicado (`main` depois do PR #29). Lighthouse 12.8.2, perfil móvel simulado, 4 execuções válidas (sem `runtimeError`): LCP 1,53, 1,31, 1,27 e 1,26 s; desempenho 98, 99, 100 e 100; acessibilidade 100 nas 4. Registradas as 3 primeiras no critério 7.

## Medições de 03/11/2026

Site publicado depois do PR #23 (bundle com o checkout novo). Mediana do LCP de 1,30 s (1,49, 1,28 e 1,30 s), desempenho 96 (96, 87 e 99), acessibilidade 100 nas 3 execuções. Lighthouse 12.8.2 local, perfil móvel simulado, sem aparelho real.

## Medições de 02/11/2026

Mediana do LCP de 1,58 s (1,58, 1,81 e 1,28 s), desempenho 100, acessibilidade 100. Lighthouse 12.8.2 local, perfil móvel simulado, sem aparelho real.
