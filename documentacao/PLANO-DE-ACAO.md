# Plano de ação — Garagem Lanches (catalogo-acai)

> Histórico de 27/09/2026 no topo. O ciclo de 03/11/2026 está no fim deste arquivo.

| # | Prioridade | Tarefa | Defeito | Critério | Esforço | Status |
|---|---|---|---|---|---|---|
| T01 | Must | Carrinho com quantidade e remoção (reducer puro) | D1 | C1 | 2 | ✅ Feito |
| T02 | Must | Valores em centavos e formato pt-BR | D2 | C1, C5 | 1 | ✅ Feito |
| T03 | Must | Custo de adicionais visível no modal | D3 | C1 | 1 | ✅ Feito |
| T04 | Must | Validação por campo, foco no primeiro erro, sem `alert()` | — | C2, C3 | 1 | ✅ Feito |
| T05 | Must | WhatsApp aberto no gesto do clique; Supabase em segundo plano; sucesso honesto | D8 | C1, C2 | 1 | ✅ Feito |
| T06 | Should | `Dialog` acessível; rótulos; `aria-pressed`; `lang`; contraste | D4 | C3 | 2 | ✅ Feito |
| T07 | Should | Supabase por `.env` + SQL com RLS e CHECKs | D5 | C4 | 1 | ✅ Feito |
| T08 | Should | `base: './'` e build regenerado em `docs/` | D6 | C9 | 1 | ✅ Feito |
| T09 | Should | Tokens `@theme` do Tailwind v4 | D7 | C7 | 1 | ✅ Feito |
| T10 | Should | 13 testes com Vitest | — | C6 | 2 | ✅ Feito |
| T11 | Should | README e documentação | D9 | C10 | 1 | ✅ Feito |
| T12 | Must (usuário) | Criar `.env`, aplicar `supabase-orders.sql`, confirmar preço dos adicionais, apagar arquivos sem uso | D5, D9 | C4 | 1 | ⏳ Com você |
| T13 | Could | Cardápio no Supabase, painel da loja, horário real | — | C1 | 3 | Roadmap |

## Definição de pronto

- `npm test` (13/13), `npm run lint` e `npm run build` sem erros.
- axe-core sem violações no cardápio e no checkout com erros de validação.

## Ciclo de 03/11/2026

> Branch `feature/2026-11-03` → `developer/sprint-2026-11-05` → `main`. Nível: Vitrine (N2), 12 critérios. Estado em `MVP.md`.

### Produto

**Problema e público.** Quem compra na Garagem Lanches monta o pedido no celular e o envia pronto pelo WhatsApp, sem digitar item por item.

**Hipótese e meta.** Pelo menos 30% de quem abre o cardápio toca em "Enviar no WhatsApp". A meta segue proposta; confirmar é do responsável (#16). Medir depende da conta do GoatCounter (#7).

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Pagamento combinado na conversa | Em cardápio por WhatsApp, a forma de pagamento costuma ser acertada no chat. Passamos a perguntar no checkout, para a loja não ter que perguntar depois | [Canaltech: cardápio digital para WhatsApp](https://canaltech.com.br/apps/como-funciona-o-cardapio-digital-para-whatsapp-guia-pratico/) |
| Troco só no dinheiro | Lojas pedem "troco para quanto" só quando o cliente paga em dinheiro; Pix e cartão não precisam. O campo aparece só no dinheiro, e o valor não pode ser menor que o total | [Plugin de troco do WooCommerce](https://wordpress.org/plugins/?p=43432), [Cielo: maquininha para delivery](https://blog.cielo.com.br/produtos-e-servicos/maquininha-para-delivery/) |
| Resumo completo antes de confirmar | Recomenda-se mandar ao cliente um resumo com itens, total e pagamento. A mensagem do WhatsApp agora leva pagamento e observação | [Aurora Inbox: pedidos por WhatsApp](https://www.aurorainbox.com/pt/?p=36602) |
| Link `wa.me` com texto | O WhatsApp pede o número só com dígitos e o texto codificado em `?text=`. Já seguimos; o teste do link continua no CI | [WhatsApp: como usar o click to chat](https://whatsapp.com/faq/en/general/26000030) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | CI também nos PRs para a `developer` | Alto | Baixo | Este ciclo |
| 2 | Forma de pagamento, troco e observação | Alto | Baixo | Este ciclo |
| 3 | `MVP.md` com evidência por linha e resumo batendo | Alto | Baixo | Este ciclo |
| 4 | Proteger a `main` e publicar só com CI | Alto | Baixo | Responsável (#21) |
| 5 | Pedido real com a loja e meta | Alto | Baixo | Responsável (#16) |
| 6 | Medição no GoatCounter | Médio | Baixo | Responsável (#7) |
| 7 | Busca por nome | Médio | Baixo | Issue (#17) |
| 8 | axe no CI | Médio | Baixo | Issue (#18) |
| 9 | Lighthouse no CI | Médio | Médio | Issue (#19) |
| 10 | Dependabot | Médio | Baixo | Issue (#20) |

**Fora do escopo.** Pagamento online, gravar pedidos no Supabase (decisão do responsável, #3), painel da loja, horário de funcionamento.

### Engenharia

**Arquitetura.** SPA React 19 + Vite + Tailwind v4, organizada por FSD (`entities`, `features`, `pages`, `shared`). As regras ficam em funções puras: `order.ts` (preço, validação, mensagem, pagamento) e `cart.ts` (reducer e persistência). A Vercel gera o build da `main`. O Supabase só grava se houver `.env`, e o site publicado não tem.

**Riscos.**
- O `Intl` formata reais com espaço não separável (`R$ 19,00`). Testes com espaço comum falham.
- O campo de troco aceita texto livre. A conversão (`parseBRLToCents`) recusa o que não for valor, e a validação recusa valor menor que o total.
- As formas de pagamento são proposta: a loja confirma no pedido real (#16).
- Sem proteção na `main`, um push direto publica sem CI (#21).

**Qualidade.**
- Testes: 23 no Vitest (eram 18), com 4 novos de regra e 1 de página para pagamento e observação. Rodados também em ordem embaralhada (`--sequence.shuffle`).
- CI: agora também em PR e push para `developer/**`.
- Acessibilidade: campos novos com rótulo, erro ligado ao campo e foco no primeiro erro.
- Desempenho: a mudança só toca o checkout, que abre depois do carregamento.
- Segurança: nada novo é gravado. A observação avisa para não escrever senha nem dado de cartão.

**Definição de pronto.** `npm ci`, `npm run lint`, `npm test` e `npm run build` passam; CI verde no PR; `MVP.md` e README atualizados.

### Plano de ação

**Este ciclo executa.**
1. CI nos PRs para a `developer`.
2. Forma de pagamento (Pix, cartão, dinheiro), troco e observação no checkout e na mensagem, com testes.
3. `MVP.md` com evidência e data por linha, resumo batendo (7 de 12), nível N2 e "Finalizado: sim".
4. README com próximos passos.

**Vira issue.** #16 e #21 (responsável); #17, #18, #19 e #20 (agente). Seguem abertas com o responsável: #3 e #7 (agora com o rótulo `depende-do-responsavel`).
