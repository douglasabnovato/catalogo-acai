# 🍔 Garagem Cardápio 

<div align="center">

[![Status do Projeto](https://img.shields.io/badge/STATUS-EM%20PRODU%C3%87%C3%83O-emerald?style=for-the-badge)](https://github.com)
[![Tecnologias](https://img.shields.io/badge/React-Vite-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Estilização](https://img.shields.io/badge/TailwindCSS-v4-cyan?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Banco de Dados](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com)

*Aplicativo de autoatendimento digital (estilo totem/delivery) desenvolvido para a Garagem Lanches, integrando cardápio imersivo, montador de açaí customizável em camadas, persistência de dados em tempo real e checkout integrado com o WhatsApp.*

</div>

---

## 🚀 Sobre o Projeto

O **Garagem Lanches** é uma solução completa de cardápio digital desenvolvida para modernizar o atendimento da lanchonete e açaí local. Inspirado nos padrões visuais dos grandes apps de fast-food (como McDonald's) e alinhado à identidade real do estabelecimento (parceria com a Rede Apogeu e copos personalizados), o sistema oferece uma experiência de usuário extremamente fluida, rápida e focada em conversão.

---

## 🎨 Identidade Visual e Inspiração

O projeto foi estruturado com base no material físico e promocional da lanchonete:
* **Paleta de Cores Imersiva:** Fundo grafite escuro premium (`#09090b`), detalhes vibrantes em **Amarelo Ouro** (`#FFC72C`) para chamadas de ação e preços, e tons de **Roxo Açaí** para a customização artesanal de copos.
* **Experiência Visual de Totem:** Carrossel de categorias fluido com ícones dedicados e cards limpos que separam produtos prontos para consumo de itens customizáveis.

---

## ✨ Principais Funcionalidades

* 📱 **Cardápio por Categorias:** Navegação rápida entre Açaís, Salgados, Sanduíches, Combos, Sucos/Vitaminas e itens Para Casa.
* 🥣 **Construtor de Açaí Artesanal:** Modal interativo com 3 acompanhamentos inclusos, adicionais a partir do 4º com preço visível e adição opcional de Whey Protein.
* 🛒 **Carrinho Flutuante e Editável:** Acompanhamento em tempo real, com ajuste de quantidade e remoção de itens antes de enviar.
* 📋 **Checkout Inteligente:** Coleta de dados essenciais do cliente (Nome Completo, WhatsApp/Telefone, tipo de atendimento entre Entrega em Casa ou Retirada no Balcão, e Endereço com Referência).
* 🗄️ **Persistência opcional no Supabase:** O código registra os pedidos quando as variáveis estão configuradas. O site publicado hoje não as usa, então os pedidos seguem só pelo WhatsApp.
* 💬 **Disparo via WhatsApp:** Formatação automática de uma mensagem limpa e profissional contendo todos os dados do cliente e os itens do pedido, abrindo diretamente no canal de atendimento da lanchonete.
* 🎉 **Tela de Sucesso e Reset:** Feedback visual após o envio do pedido e retorno imediato ao cardápio pronto para novos atendimentos.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias modernas de desenvolvimento web:

* **React 19** + **TypeScript** (Desenvolvimento de componentes tipados)
* **Vite** (Empacotador de alta performance)
* **Tailwind CSS v4** (Estilização utilitária avançada)
* **Lucide React** (Biblioteca de ícones modernos)
* **Supabase** (Banco de dados relacional e políticas de segurança RLS)
* **Vitest** + **Testing Library** (13 testes de regras e fluxo)

---

## ▶️ Como executar

```bash
npm install
cp .env.example .env     # preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (opcional)
npm run dev              # http://localhost:5173
npm test                 # 13 testes
npm run build            # gera o build em docs/
```

Sem o `.env`, o cardápio funciona e envia os pedidos só pelo WhatsApp.

### Supabase

Rode [documentacao/supabase-orders.sql](./documentacao/supabase-orders.sql) no SQL Editor. Ele cria a tabela `orders` com validações e deixa o site **apenas inserir** pedidos; a leitura fica restrita a usuários autenticados da loja, protegendo nomes, telefones e endereços dos clientes.

### Publicação

O site está na Vercel. O GitHub Pages está desligado. Detalhes em [documentacao/DEPLOY.md](documentacao/DEPLOY.md).

**Demonstração:** https://catalogo-acai.vercel.app

---

## 📊 Estado do MVP & Documentação

| Documento | Conteúdo |
|---|---|
| [documentacao/ANALISE.md](./documentacao/ANALISE.md) | Requisitos, diagnóstico, rubrica e BDD |
| [documentacao/ARQUITETURA.md](./documentacao/ARQUITETURA.md) | C4, FSD, modelo de dados e ADRs |
| [documentacao/PLANO-DE-ACAO.md](./documentacao/PLANO-DE-ACAO.md) | Histórico das tarefas de 27/09/2026 |
| [documentacao/AVALIACAO.md](./documentacao/AVALIACAO.md) | Evidências e achados de 30/10/2026 |
| [documentacao/PLANO-ESTRATEGICO.md](./documentacao/PLANO-ESTRATEGICO.md) | Plano vigente e execução |

| Momento | Nota MVP | Situação |
|---|---|---|
| Antes (27/09/2026) | 4,54 | Reprovado — carrinho sem remoção, adicionais cobrados sem aviso e modais inacessíveis |
| Depois (27/09/2026) | 8,48 | Aprovado |

---

## Próximos passos do responsável

- Confirmar com a loja o preço de R$ 2,00 por adicional e o número do WhatsApp.
- Criar uma conta gratuita no [GoatCounter](https://www.goatcounter.com/) e definir `VITE_GOATCOUNTER_CODE` no ambiente de build, com o código da conta. Sem isso, os eventos não são enviados.

Acompanhamento nas issues #3 e #7.
