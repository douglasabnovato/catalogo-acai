# Plano de ação — Garagem Lanches (catalogo-acai)

> Histórico de 27/09/2026. O plano vigente é `PLANO-ESTRATEGICO.md`.

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
