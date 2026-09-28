# Análise do projeto — Garagem Lanches (catalogo-acai)

> Data da análise: 27/09/2026 · Branch analisada: `main` · Grupo: **front-end com BaaS (Supabase)**
>
> Os documentos deste projeto ficam em `documentacao/` porque a pasta `docs/` é a saída do build publicada no GitHub Pages (o Vite apaga o conteúdo dela a cada build).

## 1. Contexto de produto

| Item | Descrição |
|---|---|
| Problema | A lanchonete recebe pedidos por WhatsApp em texto livre: itens ambíguos, açaí sem montagem clara, endereço incompleto e retrabalho no balcão. |
| Público | Cliente da Garagem Lanches no celular (entrega ou retirada) e a equipe que recebe os pedidos. |
| Proposta de valor | Cardápio digital com montagem de açaí em camadas e um pedido **estruturado** que chega pronto no WhatsApp da loja, com registro no banco para histórico. |
| Métricas (propostas) | Conversão cardápio → pedido enviado; ticket médio; % de pedidos com adicionais; pedidos refeitos por dado faltante. |

## 2. Especificação de requisitos

### 2.1 Requisitos funcionais

| ID | Requisito | Situação encontrada |
|---|---|---|
| RF01 | Navegar por categorias. | Atende |
| RF02 | Montar açaí com 3 acompanhamentos inclusos e whey opcional. | Parcial: cobra R$ 2,00 por acompanhamento extra **sem avisar** (comentário "exemplo" no código). |
| RF03 | Revisar o carrinho: alterar quantidade e remover itens. | **Não atende**: só é possível adicionar. |
| RF04 | Informar nome, WhatsApp, tipo de atendimento e endereço. | Parcial: validação por `alert()`, sem formato de telefone. |
| RF05 | Enviar o pedido formatado ao WhatsApp da loja. | Parcial: `window.open` depois de `await` é bloqueado como pop-up no Safari/iOS. |
| RF06 | Registrar o pedido no Supabase. | Atende quando a chave funciona; falha silenciosa. |
| RF07 | Confirmar o envio ao cliente. | Parcial: diz "enviado com sucesso" antes de a pessoa tocar em enviar no WhatsApp. |

### 2.2 Requisitos não funcionais

| ID | Característica | Requisito | Situação |
|---|---|---|---|
| RNF01 | Segurança / privacidade | Pedidos com dados pessoais não podem ser lidos pelo público; credenciais fora do código. | Não verificável no código: depende das políticas RLS; URL e chave fixas no fonte (D5). |
| RNF02 | Acessibilidade | Modais com foco e Esc, rótulos ligados aos campos, botões com nome. | Não atende (D4) |
| RNF03 | Corretude monetária | Valores em centavos e formato `R$ 17,90`. | Não atende (D2) |
| RNF04 | Portabilidade | Build funciona no GitHub Pages em subcaminho. | Não atende (D6) |
| RNF05 | Testabilidade | Regras de preço, carrinho e mensagem testadas. | Não atende (sem testes) |

## 3. Diagnóstico

| ID | Severidade | Onde | Defeito | Referência |
|---|---|---|---|---|
| D1 | Alta | `CardapioPage` | Carrinho sem remover/quantidade: um toque errado obriga a recomeçar ou corrigir no WhatsApp. | Nielsen nº 3 (controle e liberdade) |
| D2 | Alta | preços | Soma em ponto flutuante e `toFixed(2)` com ponto decimal ("R$ 17.90"). | IEEE 754; padrão monetário pt-BR |
| D3 | Alta | `AcaiBuilderModal` | Cobrança de adicionais não exibida (preço muda sem explicação) — padrão enganoso. | Transparência de preço (CDC art. 6º, III) |
| D4 | Média | modais e formulário | Sem `role="dialog"`, Esc ou foco; `label` sem `htmlFor`; botão fechar só com ícone; `lang="en"`; `text-zinc-500` com contraste 3,9:1. | WCAG 2.2 — 1.3.1, 1.4.3, 2.1.2, 4.1.2 |
| D5 | Média | `shared/api/supabase.ts` | URL e chave no código; sem `.env.example`; sem documentação da tabela e da RLS. | 12-Factor III; OWASP A01 (se RLS permitir SELECT) |
| D6 | Média | `vite.config.ts` | `base` absoluto: em `usuario.github.io/repo/` os assets `/assets/...` quebram. | Configuração de deploy |
| D7 | Média | `index.css` / `tailwind.config.js` | Tailwind v4 ignora o `tailwind.config.js`: `text-brand-yellow` e `text-brand-green` não geram CSS. | Tailwind v4 (`@theme`) |
| D8 | Baixa | fluxo de envio | `window.open` após `await` (bloqueio de pop-up) e mensagem de sucesso prematura. | Gesto do usuário (HTML Living Standard) |
| D9 | Baixa | repositório | `App.css` vazio, `react.svg`, `vite.svg`, `hero.png`, `icons.svg` sem uso; `tsconfig.app.tsbuildinfo` versionado; README diz React 18 (é 19). | Higiene |

## 4. Critérios de MVP e nota atual

Pesos do grupo **front-end**. Aprovação: média ≥ 7,0 e C1 e C4 ≥ 5.

| # | Critério | Peso | Nota atual | Justificativa |
|---|---|---|---|---|
| C1 | Núcleo de valor | 20% | 6 | Pedido chega ao WhatsApp; carrinho não editável; preço opaco. |
| C2 | Estados | 12% | 4 | `alert()`, sucesso prematuro, carrinho vazio sem estado. |
| C3 | Acessibilidade | 12% | 3 | D4. |
| C4 | Segurança / privacidade | 12% | 5 | Chave publishable é pública por natureza, mas RLS não documentada. |
| C5 | Dados | 4% | 5 | Itens como texto livre no pedido; sem quantidade. |
| C6 | Testes | 10% | 0 | Nenhum. |
| C7 | Qualidade de código | 10% | 6 | Estrutura FSD boa; página com 400 linhas e regras misturadas. |
| C8 | Desempenho | 8% | 7 | Bundle ~68 kB gzip. |
| C9 | Operação | 6% | 4 | D6; build versionado sem `base`. |
| C10 | Documentação | 6% | 5 | README de produto; sem execução, schema ou RLS. |

**Nota atual: 4,54 / 10 — REPROVADO.**

### 4.1 Critérios de aceite (BDD)

```gherkin
Funcionalidade: Pedido pelo cardápio

  Cenário: Corrigir o carrinho
    Dado que adicionei duas esfirras de carne
    Quando diminuo a quantidade para 1
    Então o total mostra R$ 9,50

  Cenário: Adicionais transparentes
    Quando escolho 4 acompanhamentos num Açaí 300ml
    Então vejo "inclui 1 adicional(is)" e o valor R$ 19,90 antes de adicionar

  Cenário: Dados incompletos
    Quando envio sem nome
    Então vejo "Informe seu nome." junto ao campo, com foco nele
    E o WhatsApp não é aberto
```

## 5. Nota depois do ciclo de melhorias (27/09/2026)

| # | Critério | Antes | Depois | O que mudou |
|---|---|---|---|---|
| C1 | Núcleo de valor | 6 | 9 | Carrinho com quantidade e remoção; preço discriminado; envio confiável. |
| C2 | Estados | 4 | 9 | Erros por campo com foco, carrinho vazio, confirmação honesta com link de reenvio. |
| C3 | Acessibilidade | 3 | 9 | axe-core: 0 violações no cardápio e no checkout com erros; diálogo acessível. |
| C4 | Segurança / privacidade | 5 | 7 | Variáveis de ambiente, SQL com RLS só-inserção e CHECKs, aviso de uso dos dados. Vai a 9 quando a RLS for aplicada. |
| C5 | Dados | 5 | 8 | Itens estruturados (nome, detalhes, quantidade, centavos); telefone só dígitos. |
| C6 | Testes | 0 | 8 | 13 testes (Vitest + Testing Library). |
| C7 | Qualidade de código | 6 | 9 | Regras puras em `entities/cart` e `features/order`; `Dialog` reutilizável. |
| C8 | Desempenho | 7 | 8 | Mesmo bundle, sem animações para quem pede movimento reduzido. |
| C9 | Operação | 4 | 8 | `base: './'`, `.env.example`, build regenerado em `docs/`. |
| C10 | Documentação | 5 | 9 | README com execução, deploy e Supabase; `documentacao/` completo. |

**Nota depois: 8,48 / 10 — APROVADO.**
