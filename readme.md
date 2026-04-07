# Catálogo de Açaí

Um catálogo de açaí para montar a melhor versão do seu açaí

## Plano de Ação do projeto

📋 Plano de Ação: Catálogo Açaí Garagem (Fullstack)
Configuração de Ambiente de Desenvolvimento (Sênior): Alinhamento de PHP, Composer, Node.js e Laragon para garantir que o terminal responda globalmente.

Arquitetura Base e Instalação Clean: Criação do projeto Laravel + Breeze + Vue 3 em pasta limpa, evitando erros de diretório ocupado.

Estruturação do Banco de Dados (Schema): Criação das migrations para Produtos (tamanhos de açaí, salgados, sucos) e Adicionais, usando SQLite.

Desenvolvimento do Backend (API & Inertia): Criação dos Models, Controllers e as rotas que levarão os dados do banco para o Vue.

Desenvolvimento do Frontend (UI/UX): Implementação da Landing Page, Componente de Seleção de Açaí (lógica de 3 adicionais gratuitos) e Grid de Produtos com Tailwind CSS.

Integração e Checkout Simples: Configuração do fluxo de fechamento de pedido com envio direto para o WhatsApp da lanchonete.

Deploy e Homologação: Preparação para colocar o catálogo online (Produção).


### 🚀 Tópico 01: Configuração do Ambiente no Computador
Para desenvolver com Vue (Frontend) e Laravel (Backend) sem conflitos, seu computador precisa falar essas três linguagens fluentemente. Vamos garantir os "pilares":

1. O Servidor Local (PHP & MySQL/SQLite)
O Laragon já está instalado, mas precisamos garantir que ele "mande" no terminal:

Abra o Laragon > Botão Direito > PHP > Quick Settings > Add Laragon to PATH.

Faça o mesmo para o Composer se a opção estiver disponível.

Teste: Abra um novo terminal e digite php -v. Se aparecer "PHP 8.3", o primeiro pilar está ok.

2. O Motor do Frontend (Node.js & NPM)
O Laravel 11 + Vue utiliza o Vite para compilar o código em milissegundos. Para isso, você precisa do Node.js:

Baixe a versão LTS do Node.js.

Teste: No terminal, digite node -v e npm -v.

3. Extensões Indispensáveis no VS Code
Para você ter produtividade de Sênior, instale estas extensões agora:

Volar: Essencial para suporte ao Vue 3.

Tailwind CSS IntelliSense: Para o auto-complete das classes de design.

PHP Intelephense: Para o Laravel não ficar "cheio de erros" vermelhos no editor.

Verificação de Prontidão
Antes de passarmos para o próximo tópico (Instalação Clean), preciso que você confirme:

O comando php -v retorna a versão 8.2 ou 8.3?

O comando node -v retorna uma versão (ex: v20 ou v22)?

O comando composer -v mostra o logo do Composer no terminal?