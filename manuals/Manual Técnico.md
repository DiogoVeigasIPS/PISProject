# Manual Técnico

## Introdução

Este manual tem como objetivo fornecer uma compreensão abrangente da API desenvolvida para o projeto de Gestão de Receitas. Aqui, encontrará informações detalhadas sobre a arquitetura da aplicação, os web services implementados, a integração de serviços externos, as funcionalidades disponíveis e as tecnologias utilizadas.

Durante a leitura deste manual, será guiado através dos componentes fundamentais que compõem a estrutura da aplicação, aprenderá sobre os serviços web que possibilitam a manipulação eficiente da base de dados, entenderá como serviços externos foram incorporados para aprimorar a experiência do utilizador e descobrirá as diversas funcionalidades implementadas para atender às exigências do projeto.

A divisão por seções facilitará a procura de informações específicas, proporcionando uma leitura fluída e eficiente. Vamos explorar, passo a passo, cada aspecto essencial da API, desde a sua arquitetura até as tecnologias subjacentes que a sustentam.

Com base nos documentos fornecidos, a arquitetura da aplicação pode ser descrita da seguinte forma:

## Arquitetura da Aplicação

A aplicação segue uma estrutura modular, organizada em camadas distintas para melhor manutenção e escalabilidade. As principais componentes incluem:

### 1. **Estrutura de Diretórios:**

   - **static:** Contém recursos estáticos, como imagens e folhas de estilo.
   - **views:** Armazena os ficheiros de visualização (usando o motor de templates Mustache).
   - **api:** Responsável por manipular as requisições relacionadas à API.
   - **controllers:** Contém os controladores que gerem a lógica de negócios.
   - **models:** Define os modelos de dados da aplicação.
   - **actions:** Contém a lógica específica para realizar ações em diferentes partes da aplicação.
   - **routes:** Agrega todas as rotas da API.

### 2. **Express App:**

   - **Inicialização:**
     - Carrega as dependências necessárias como `express`, `body-parser`, `mustache-express`, e `dotenv`.
     - Configuração do ambiente utilizando o arquivo `.env`.

   - **Middlewares:**
     - Utiliza o middleware `body-parser` para processar dados JSON.
     - Configura a manipulação de requisições estáticas e favicon.

   - **Configuração do Mustache:**
     - Configura o mecanismo de visualização Mustache para renderizar as views.

   - **Roteamento:**
     - Utiliza os roteadores `apiRouter` e `appRouter` para direcionar requisições para as rotas correspondentes.

   - **Tratamento de Erros:**
     - Implementa uma rota para lidar com requisições não correspondentes (`404 Not Found`).

   - **Inicialização do Servidor:**
     - Inicia o servidor na porta especificada no arquivo `.env`.

### 3. **Rotas:**

   - **API Roteador:**
     - Agrega todas as rotas da API, utilizando roteadores específicos para utilizadores, áreas, categorias, dificuldades, ingredientes, receitas e sementes.

   - **Roteador da Aplicação:**
     - Roteia as requisições da aplicação principal.

### 4. **Controladores, Modelos e Ações:**

   - **Controladores:**
     - Agregam a lógica de manipulação de dados para utilizadores, áreas, categorias, dificuldades, ingredientes, receitas e sementes.

   - **Modelos:**
     - Representam as entidades de dados da aplicação.

   - **Ações:**
     - Contém a lógica específica para realizar ações relacionadas a utilizadores, áreas, categorias, dificuldades, ingredientes, receitas e sementes.

### 5. **Entidades principais:**

   - **Utilizador:**
    - Consiste nos utilizadores da aplicação, para além de determinar a sua autorização.

   - **Categoria:**
    - Categoria de uma receita, pode facilitar na procura de receitas através da sua categoria.

   - **Ingredient:**
    - Ingredientes tal como tomates e bananas, estes podem ser adicionados numa receita com a indicação da sua quantidade.

   - **Região:**
    - Região de origem da receita.

   - **Dificuldade:**
    - Dificuldade de preparo de uma dada receita.

   - **Receita:**
    - A receita, composta por diversos atributos. É a entidade mais importante e mais dependente da API.
### 6. **Base de Dados:**

   - **Tabelas Simples:**
    - A base de dados é composta por múltiplas tabelas simples, sendo estas essenciais para um bom funcionamento e relacionamento dinâmico entre entidades. Um exemplo destas são os ingredientes, categorias e dificuldade.

   - **Tabelas Compostas:**
    - Uma tabela composta são aquelas que possuem chaves estrangeiras para indicar um determinado valor, como exemplo, temos a tabela das receitas, que deve indicar a sua região, dificuldade, categoria, entre outros através de uma chave estrangeira.

   - **Tabelas Relacionais:**
    - Ainda que todas as tabelas de uma base de dados relacional sejam relacionais, este nome foi escolhido para aquelas tabelas que servem para realizar os relacionamentos de N-N, isto é, relacionar receitas e ingredientes (recipe_ingredients), como também o relacionamento de receitas favoritas (favorite_recipes).

   - **Views:**
    - A base de dados possui também algumas views para que seja mais fácil selecionar as receitas dos ingredients, e realizar pesquisas mais rápidas com menos campos de forma mais eficiente (por exemplo, detalhes da receita, tabelas ou cartões).

Esta arquitetura modular tenta seguir as boas práticas de desenvolvimento, separando claramente as responsabilidades entre diferentes componentes da aplicação.

## Web Services

    Categorização dos web services em Elementares e Compostos.
    Descrição detalhada de como cada serviço funciona.
    Exemplos práticos de uso dos web services.

## Integração de Serviços Externos

    Explicação sobre a integração de serviços externos, como login através do Google e utilização da API relacionada com receitas.
    Detalhes sobre como esses serviços são utilizados na aplicação.

## Funcionalidades Implementadas

Descrição das funcionalidades principais, incluindo autenticação de utilizadores, marcação de receitas como favoritas, criação de coleções, gestão de conteúdos, entre outras.

## Tecnologias Utilizadas

    Detalhes sobre a escolha do Node.js e Express.js.
    Justificativa para a escolha do MySQL como base de dados.
    Uso de JSON para troca de mensagens.
