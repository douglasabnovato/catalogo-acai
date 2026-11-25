# MVP — Garagem Lanches

> Criado em 31/10/2026, com os critérios usados no `movies`. Revisto em 16/11/2026 (ciclo de 16/11/2026; às 12:00, critério 9 com os alertas do Dependabot ligados, PR #45; às 15:04, o último alerta corrigido, PR #47) e em 18/11/2026 (critério 7 medido de novo no site publicado, #37; critério 8 com o fundo inerte e os itens incompletos do axe, #34), contra a régua do repositório `engenharia`.

**Nível:** Vitrine (N2). Os 12 critérios se aplicam.

**Resumo:** 11 de 12 aplicáveis atendidos

**Finalizado:** sim — o único critério fora de "Atende" é o 5, que depende do responsável e tem issue com `depende-do-responsavel` (conta do GoatCounter, #7). O 9 passou a "Atende" em 16/11/2026, 15:04; em 18/11/2026, a API do Dependabot mostra 0 alertas abertos (as correções dos PRs #45 e #47 chegaram à `main`).

## Produto

- **Problema:** pedir pelo WhatsApp obriga o cliente a digitar item por item.
- **Público:** quem compra na Garagem Lanches, pelo celular.
- **Hipótese:** acreditamos que montar o pedido pronto no cardápio faz o cliente concluir a compra pelo WhatsApp. Saberemos quando o painel do GoatCounter mostrar, numa semana, o evento `pedido-enviado` em 30% ou mais das visitas.
- **Métrica:** parcela das visitas com o evento `pedido-enviado` (toque em **Enviar no WhatsApp**), medido por GoatCounter (falta a conta, #7) — meta: 30% ou mais numa semana, decidida pelo coordenador em 10/11/2026 (D1), revisável pelo responsável (#16).

## Problema e hipótese

**Problema e público:** Quem compra na Garagem Lanches monta o pedido no celular e o envia pronto pelo WhatsApp, sem digitar item por item.

**Hipótese:** Acreditamos que montar o pedido pronto no cardápio faz o cliente concluir a compra pelo WhatsApp. **Meta:** pelo menos 30% de quem abre o cardápio toca em **Enviar no WhatsApp**. **Saberemos quando** o painel do GoatCounter mostrar, numa semana, o evento `pedido-enviado` em 30% ou mais das visitas. Meta decidida pelo coordenador em 10/11/2026 (decisão D1), revisável pelo responsável (#16).

## 1. Critérios

| # | Critério | Como verificar | Situação em 18/11/2026 (evidência) |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: frase acima |
| 2 | Hipótese a validar | Aposta escrita, com meta | Atende: hipótese, meta de 30% e "saberemos quando" acima; meta revisável pelo responsável (#16) |
| 3 | Fluxo principal completo | Teste de ponta a ponta no navegador no CI | Atende: `npm run build && npm run test:e2e` (Playwright, job `e2e` do CI), 18/11/2026, local: 24 testes, 0 falhas, 0 pulados (16/11/2026, no CI, job `e2e` do [run 43827698588](https://github.com/douglasabnovato/catalogo-acai/actions/runs/43827698588): 19 passed). `e2e/fluxo.pw.ts` monta o pedido, preenche nome, WhatsApp e retirada e abre o WhatsApp com os itens (o WhatsApp é simulado). O site publicado responde: `curl` HTTP 200, 18/11/2026 |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: seção 3; o WhatsApp é o único canal |
| 5 | Medição de uso | Painel com visitas | Parcial: código pronto, com teste (`e2e/fluxo.pw.ts` e `src/shared/lib/metrics.test.ts`); falta a conta do GoatCounter com o código `douglasabnovato`, do responsável (#7). `curl -s https://douglasabnovato.goatcounter.com`, 18/11/2026: "no site at this domain". Sem painel, não há visitas a mostrar |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta | Atende: `npm run test:e2e`, 16/11/2026, `e2e/falhas.pw.ts` (3 testes): formulário vazio põe o foco no primeiro erro, carrinho que fica vazio avisa e desliga o envio, e a tela de sucesso traz sempre o link de reserva, conferido com a nova aba bloqueada (com `noopener`, o navegador não diz ao app se bloqueou). `npm test`, 16/11/2026: troco menor que o total recusado e carrinho salvo com dado vencido ou inválido ignorado. Carregamento: o cardápio vem no próprio pacote (`menu.data.ts`), sem chamada de rede; o Supabase está desligado (seção 3), então não há espera a tratar |
| 7 | Desempenho aceitável | LCP até 2,5 s no celular, no site publicado | Atende: Lighthouse 12.8.2 móvel em https://catalogo-acai.vercel.app, 18/11/2026, das 20:32 às 20:33 (hora local), 3 execuções válidas (sem `runtimeError`): LCP 1,36 / 1,21 / 1,22 s, **mediana 1,22 s**; TBT 7 / 2 / 5 ms (mediana 5 ms); elemento do LCP `ul.grid > li.bg-zinc-900/60 > div > p.text-xs` (descrição do primeiro item). Mais 2 execuções deram 1,21 s. Build medido: o deploy de Production 7855258347 da Vercel, do commit `047d26a` (a `main` com a sprint-19, PRs #35, #46, #48 e #49), estado `success`, conferido com `gh api "repos/douglasabnovato/catalogo-acai/deployments?environment=Production&per_page=3"`, 18/11/2026. O JavaScript publicado é idêntico, byte a byte, ao do `npm run build` local desse commit (`cmp`; md5 começa com `e652dac7`), com os botões de 44 px. A medição anterior, de 16/11/2026 (mediana 1,31 s, commit `40c44f6`), está na seção "Medições" |
| 8 | Acessibilidade básica | axe e teclado | Atende: `npm run test:e2e`, 18/11/2026, local e no CI do PR #51 (só na sprint-19 até o merge na `main`), `e2e/acessibilidade.pw.ts`: axe (WCAG 2.0, 2.1 e 2.2, A e AA) sem violações no cardápio, no montador, no checkout com erros, na página inteira com o checkout aberto e na tela de sucesso, a 375 px e a 1280 px. Os itens `incomplete` do axe também contam (#34): o `aria-prohibited-attr` da quantidade do carrinho foi corrigido; o `color-contrast` incompleto (fundo translúcido, botão coberto, logo em degradê) só passa com o contraste medido pelo teste, compondo as camadas de fundo: menor valor 6,75:1 em texto pequeno e 6,22:1 no logo (mínimos 4,5:1 e 3:1). Com um diálogo aberto, cabeçalho, categorias, lista e barra do pedido ficam com `inert`: nenhum botão do fundo recebe foco e a árvore de acessibilidade do Chromium não mostra o cardápio; sem a mudança, o teste falha (39 botões do fundo focáveis). Teclado: Tab até o botão, Enter abre, Esc fecha e devolve o foco, Tab e Shift+Tab presos no diálogo, contorno amarelo de 3 px do app. `e2e/alvos.pw.ts`: botões do carrinho e fechar do montador com 44×44 px e itens do carrinho sem rolagem lateral a 320 e 375 px. Uma violação proposital (botão sem nome) faz o teste do cardápio falhar com `button-name`, 18/11/2026. O app tem um tema só, de fundo escuro, sem `prefers-color-scheme`: não há modo claro e escuro a comparar |
| 9 | Segurança e conformidade | Audit, alertas do Dependabot, segredos e dados pessoais | Atende: `gh api "repos/douglasabnovato/catalogo-acai/dependabot/alerts?state=open&per_page=100" --jq length`, 18/11/2026: 0 alertas abertos. Os 16 de 16/11/2026 foram corrigidos pelos PRs #45 e #47 (o `minimatch` com o `typescript-eslint` 8.73.0, versão menor), que chegaram à `main` pelos PRs #46 e #48. 0 sem decisão, 0 em ADR. `npm audit --omit=dev`, 18/11/2026: 0 vulnerabilidades; nenhum segredo no código (só `.env.example` com os nomes); o site publicado não grava dado pessoal, porque o pedido vai só pelo WhatsApp e o Supabase fica desligado (seção 3). O valor dos adicionais aparece como ilustrativo, com teste, até a loja confirmar o preço e o número do WhatsApp (#3); os dois seguem como estão no código. Os PRs do Dependabot de versão maior têm análise e esperam a decisão do responsável (#50) |
| 10 | Entrega confiável | CI nos PRs e principal protegida | Atende: `gh api repos/douglasabnovato/catalogo-acai/rules/branches/main`, 18/11/2026: `deletion`, `non_fast_forward`, `pull_request` e `required_status_checks` com `build-and-test` e `e2e`. A Vercel publica a `main`, que só recebe o que passou nos dois jobs |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI, sem pulados | Atende: 18/11/2026, local, `npm test`: 24 testes Vitest, 0 falhas; `npm run test:e2e`: 24 testes Playwright, 0 falhas, 0 pulados. Os dois rodam no CI: [run 43827698588](https://github.com/douglasabnovato/catalogo-acai/actions/runs/43827698588), 16/11/2026, `build-and-test` com 24 passed e `e2e` com 19 passed |
| 12 | Documentação honesta | README com comandos conferidos | Atende: README e este documento conferidos contra o `package.json` e o `vercel.json` em 18/11/2026 (`PLANO-DE-ACAO.md` e `DEPLOY.md` em 16/11/2026); o README traz a regra do Dependabot (#20); o link publicado respondeu HTTP 200 em 18/11/2026 |

## Histórico

- 20/11/2026: bloco Produto padronizado, sem mudar critérios.
- 18/11/2026: critério 7 medido de novo no site publicado depois da sprint-19 (mediana 1,31 → 1,22 s, #37). Critério 8 mais exigente: fundo inerte com diálogo aberto e itens `incomplete` do axe decididos (#34). Critério 9 com 0 alertas abertos. Resumo segue 11 de 12. Finalizado segue sim.
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
| 10 | Dependabot de versões para npm e Actions | `.github/dependabot.yml` no ciclo de 16/11/2026; regra de merge no README no ciclo de 18/11/2026 (#20); alertas ligados, 0 abertos em 18/11/2026 (#32, o responsável fecha) |
| 11 | Busca por nome e Lighthouse no CI | Próximos passos (#17, #19) |
| 12 | Fundo inerte com diálogo aberto e itens incompletos do axe | Feito na sprint-19 (PR #51) em 18/11/2026; fecha com o merge na `main` (#34) |
| 13 | Medir o LCP de novo depois da publicação da sprint-19 | Feito em 18/11/2026: mediana 1,22 s (#37) |

## 3. Fora do MVP

Gravar pedidos no Supabase: **a decisão proposta é não ligar no MVP**, porque o WhatsApp já entrega o pedido à loja e gravar dados pessoais exigiria mais cuidado com LGPD. O código continua pronto. Também ficam fora pagamento online e painel da loja. A lista é uma proposta e pode mudar com a decisão do responsável.

## Medições de 18/11/2026

Site publicado (deploy 7855258347, commit `047d26a`, a `main` com a sprint-19). Lighthouse 12.8.2, perfil móvel simulado, 5 execuções válidas: LCP 1,36, 1,21, 1,22, 1,21 e 1,21 s; TBT 7, 2, 5, 0 e 4 ms; desempenho 100 e acessibilidade 100 nas 5. Registradas as 3 primeiras no critério 7.

## Medições de 16/11/2026

Site publicado (`main` depois do PR #29). Lighthouse 12.8.2, perfil móvel simulado, 4 execuções válidas (sem `runtimeError`): LCP 1,53, 1,31, 1,27 e 1,26 s; desempenho 98, 99, 100 e 100; acessibilidade 100 nas 4. Registradas as 3 primeiras no critério 7.

## Medições de 03/11/2026

Site publicado depois do PR #23 (bundle com o checkout novo). Mediana do LCP de 1,30 s (1,49, 1,28 e 1,30 s), desempenho 96 (96, 87 e 99), acessibilidade 100 nas 3 execuções. Lighthouse 12.8.2 local, perfil móvel simulado, sem aparelho real.

## Medições de 02/11/2026

Mediana do LCP de 1,58 s (1,58, 1,81 e 1,28 s), desempenho 100, acessibilidade 100. Lighthouse 12.8.2 local, perfil móvel simulado, sem aparelho real.
