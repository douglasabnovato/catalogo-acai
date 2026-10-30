# Avaliação — Garagem Lanches (catalogo-acai)

> Data: 30/10/2026 · Base: `main` em `7ca6db8` · Complementa `ANALISE.md`, de 27/09/2026.

## Evidências

| Item | Resultado |
|---|---|
| `npm ci`, `npm run lint`, `npm run build` | Passam |
| Testes | 13 passam; o do fluxo principal estourou 5 s em 1 de 3 execuções |
| `npm audit --omit=dev` | Nenhuma vulnerabilidade |
| CI | Não existe; só há as execuções antigas do GitHub Pages |
| Site na Vercel | Abre com o cardápio, sem rolagem horizontal na largura testada |
| GitHub Pages | Desligado (HTTP 404), embora o README o indique como demonstração |
| Supabase no site publicado | O JavaScript publicado não contém endereço do Supabase: os pedidos seguem só pelo WhatsApp |

**Não testado:** envio de pedido no site publicado, para não gerar um pedido falso para a loja; regras de RLS no Supabase; configuração da Vercel, que não está no repositório.

## Achados

| # | Severidade | Achado | Encaminhamento |
|---|---|---|---|
| A1 | Alta | O README promete registro de pedidos no Supabase, mas o site publicado não grava nada | Documentação corrigida; ligar depende do responsável |
| A2 | Média | README e documentos descrevem o GitHub Pages; o site real está na Vercel | Corrigido nesta documentação |
| A3 | Média | Sem CI | PR #1 |
| A4 | Média | Teste instável por tempo limite | PR #1 |
| A5 | Baixa | `docs/` guarda um build antigo que nada publica | Remover depois de confirmar na Vercel |
| A6 | A confirmar | O preço de R$ 2,00 por adicional ainda é um valor de exemplo | Confirmar com a loja |

## Nota

Nota anterior do portfólio: 6,3. **Nota atual: 7,0, com o PR #1 aplicado.** É um julgamento técnico. Para chegar ao nível N2, faltam os testes de ponta a ponta e a confirmação dos itens A1 e A6.
