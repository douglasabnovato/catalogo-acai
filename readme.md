# 🟣 Açaí Garagem

> **Status do Projeto:** 🚀 Em Desenvolvimento (MVP)  
> **Área:** Gastronomia Digital / E-commerce  
> **Tech Stack:** Vue 3 + Tailwind CSS + Laravel

---

## 📝 Descrição do Projeto

O **Açaí Garagem** é uma solução de catálogo digital interativo projetada para otimizar o fluxo de pedidos de uma lanchonete artesanal. O foco principal é a experiência de personalização (**Visual Builder**), permitindo que o cliente monte seu copo em camadas e finalize a compra através de um payload estruturado enviado diretamente ao WhatsApp da unidade.

O projeto segue os pilares de **Engenharia de Performance** da **learnTECH**, priorizando carregamento instantâneo, código limpo (S.O.L.I.D.) e uma interface mobile-first de alta conversão.

---

## 📋 Inventário de Produtos e Informações

Abaixo está a transcrição técnica dos ativos e regras de negócio identificados.

### 🥤 1. Açaí (Montagem Artesanal)

- **Regra de Negócio:** Direito a **3 acompanhamentos gratuitos** inclusos na montagem em camadas.
- **Tamanhos e Preços:**
    - [ ] 300ml — `R$ 17,90`
    - [ ] 400ml — `R$ 21,90`
    - [ ] 500ml — `R$ 24,90`
    - [ ] 700ml — `R$ 26,90`
- **Acompanhamentos Disponíveis:**
    - **Secos:** Leite em pó, Granola, Paçoca, Ovomaltine, Chocoball, Confete.
    - **Frutas:** Morango picado, Banana picada.
    - **Cremes/Caldas:** Calda de chocolate, Mel, Leite condensado, Chantilly.
- **⚡ Adicional Especial (Upsell):** Whey Protein (no açaí ou vitaminas) — `+ R$ 9,00`.

### 🏠 2. Linha para Casa (Bulk)

| Item              | Quantidade   | Preço                |
| :---------------- | :----------- | :------------------- |
| Açaí Tradicional  | 1 Litro      | `R$ 39,00`           |
| Açaí Barra        | 1 KG         | `R$ 29,00`           |
| Xarope de Guaraná | 500 ML / 5 L | `R$ 9,00 / R$ 65,00` |
| Granola Especial  | 1 KG         | `R$ 39,00`           |

### 🥐 3. Complementos (Salgados & Bebidas)

- **Salgados (`R$ 9,50`):** Esfihas (Frango/Carne), Enrolados, Pastel Integral, Cigarrete e Coxinha.
- **Saudáveis & Bebidas (`R$ 11,90`):** Sucos naturais, Vitaminas e Sanduíches (Natural/Sírio).

---

## 🎨 Design & Estratégia de UX

### Guia de Estilo (Look & Feel)

| Elemento            | Referência                           | Aplicação Sugerida                   |
| :------------------ | :----------------------------------- | :----------------------------------- |
| **Cores Primárias** | `Roxo (#6B2D8E)` / `Verde (#2EAD5E)` | Branding, botões de ação e seleção.  |
| **Cores de Apoio**  | `Amarelo Quente` e `Laranja`         | Backgrounds secundários e badges.    |
| **Tipografia**      | `Fredoka One` ou `Poppins`           | Títulos amigáveis e preços legíveis. |
| **Disposição**      | `Cards` com cantos arredondados      | Listagem de produtos e modais.       |

### 🧠 Análise de UX & Design System

- **Visual Builder:** Interface reativa onde o usuário vê o "copo virtual" sendo preenchido conforme seleciona os itens.
- **Progressive Disclosure:** Fluxo guiado para evitar fadiga de decisão: `Tamanho` ➔ `Recheios` ➔ `Extras`.
- **UX de Conversão:** Micro-interações táteis e botões de "Combo Rápido" para diminuir o tempo de checkout.

---

## 🛠️ Pilares de Engenharia (Checklist)

- [x] **Performance:** Otimizar imagens para WebP (redução de overhead).
- [x] **Clean Code:** Nomenclatura semântica seguindo o padrão **learnTECH**.
- [x] **Mobile-First:** Interface focada na ergonomia do polegar (touch).

---

## 🚀 Plano de Ação: Cronograma de Execução

### 🏗️ Fase 1: Arquitetura & Database (Semana 1)

- [ ] Setup do Laravel 11 + Breeze + Vue 3 (Inertia).
- [ ] Modelagem do Schema (SQLite/MySQL) para `products`, `categories` e `orders`.
- [ ] Implementação da lógica de trava de 3 adicionais gratuitos no Backend.

#### 🏗️ Execução

Item 2: Modelagem de Dados (Inteligência)
criar as tabelas que vão sustentar o catálogo do Açaí Garagem

📂 Criar: Migrations de Negócio
Precisamos criar as tabelas de Produtos e Categorias (e possivelmente uma de Adicionais). Como você está usando Laravel, vamos gerar essas migrations agora.

1. Criar a Migration de Categorias
No seu terminal (dentro da pasta do projeto), execute:

Bash
php artisan make:model Category -m
php artisan make:model Product -m

Isso criará o Model e a Migration. No arquivo da migration, adicione: os trechos corretos

Depois execute para criar no banco de dados

Bash
php artisan migrate

Isso fará com que as novas tabelas apareçam no seu phpMyAdmin.


📊 Criar: Seeding de Dados
Assim que as tabelas existirem, vamos criar os Seeders. É aqui que vamos inserir "na força bruta" (via código) os itens que você listou no inventário:

Os tamanhos de Açaí (300ml a 700ml) com seus respectivos preços.

Os salgados a R$ 9,50.

Os sucos e vitaminas.

Bash
php artisan migrate:refresh --seed

---

### 🎨 Fase 2: Frontend & Visual Builder (Semana 2)

- [ ] Configuração do Tailwind CSS com o Guia de Estilo oficial.
- [ ] Desenvolvimento do componente de montagem em camadas (Visual Builder).
- [ ] Criação do stepper de compra: `Tamanho` ➔ `Recheios` ➔ `Adicionais`.

#### 🏗️ Execução

1. Criar a Rota e o Controller (O "Garçom")
No Laravel, precisamos de um Controller que busque esses produtos no banco e os entregue para a página Vue.

Ação sugerida: Criar o ProductController.

Bash
php artisan make:controller ProductController

2. Desenvolver a Vitrine (O "Cardápio")
Agora vamos para o Vue 3. Vamos criar um componente que:

Liste as categorias em um Sticky Header (conforme o plano de UX).

Exiba os produtos em Cards arredondados com os preços que acabamos de inserir.

3. Implementar o Visual Builder (O "Diferencial")
Começaremos a lógica para o usuário escolher o tamanho do açaí e selecionar os 3 acompanhamentos grátis.

### 🔗 Fase 3: Integração & Checkout (Semana 3)

- [ ] Gestão de estado do carrinho (Pinia ou Reactive API).
- [ ] Desenvolvimento do **WhatsApp Payload Parser** (JSON para Texto formatado).
- [ ] Sistema de controle de disponibilidade em tempo real.

### 🚀 Fase 4: Deploy & QA (Semana 4)

- [ ] Testes de usabilidade em dispositivos móveis reais (iOS/Android).
- [ ] Otimização final de assets e remoção de overhead de código.
- [ ] Deploy em produção com SSL e treinamento operacional.
 
---

## ⚠️ Riscos e Mitigação

| Risco                | Impacto | Estratégia de Mitigação                                               |
| :------------------- | :------ | :-------------------------------------------------------------------- |
| **Lentidão em 4G**   | Baixo   | Uso de CSS enxuto e carregamento lazy de imagens.                     |
| **Erro na Montagem** | Alto    | Validação no Frontend impedindo o checkout sem os itens obrigatórios. |

---

> **Lembrete de Gestão:** Verificar sempre se a **BU** (Business Unit) está correta antes de realizar o deploy das alterações.
