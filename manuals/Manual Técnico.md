# Manual Técnico

<div>
    <img src="https://www.ips.pt/ips_si/imagens/_ips-logotipo-site-2023" alt="Logo IPS" align="right">
    <p><strong>Programação e Integração de Serviços</strong></p>
    <p>CTeSP – TPSI</p>
    <p>Projeto de Época Normal – 2023/2024</p>
    <p>Docente Bruno Pereira</p>
    <p>Alunos:</p>
    <ul>
        <li>André Carvalho 202200878</li>
        <li>Diogo Veigas 202200879</li>
    </ul>
</div>

<hr>

## Introdução

Este manual tem como objetivo fornecer uma compreensão abrangente da API desenvolvida para o projeto de Gestão de Receitas. Aqui, encontrará informações detalhadas sobre a arquitetura da aplicação, os web services implementados, a integração de serviços externos, as funcionalidades disponíveis e as tecnologias utilizadas.

Durante a leitura deste manual, será guiado através dos componentes fundamentais que compõem a estrutura da aplicação, aprenderá sobre os serviços web que possibilitam a manipulação eficiente da base de dados, entenderá como serviços externos foram incorporados para aprimorar a experiência do utilizador e descobrirá as diversas funcionalidades implementadas para atender às exigências do projeto.

A divisão por secções facilitará a procura de informações específicas, proporcionando uma leitura fluída e eficiente. Vamos explorar, passo a passo, cada aspecto essencial da API, desde a sua arquitetura até as tecnologias subjacentes que a sustentam.

Com base nos documentos fornecidos, a arquitetura da aplicação pode ser descrita da seguinte forma:

## Instalação da Aplicação

Para instalar a aplicação (API e frontend), siga os passos abaixo:

1. **Node.js e NPM:**
   - Instale o Node.js em [nodejs.org](https://nodejs.org/en) (escolha a versão LTS).
   - Inclua a instalação do NPM (Node Package Manager).

2. **MySQL:**
   - Instale o MySQL Workbench em [dev.mysql.com](https://dev.mysql.com/downloads/workbench/).

3. **Configuração e Inicialização:**
   - Abra o terminal na pasta raiz e execute: `npm i` para instalar as dependências.
   - Execute o servidor de banco de dados.
   - Configure o arquivo `.env` com variáveis de ambiente.

4. **Inicialização do Servidor:**
   - Execute `npm start` no terminal.

## Arquitetura da Aplicação

A aplicação segue uma arquitetura RESTful, baseada no padrão MVC, em que a aplicação está dividida em modelos, vistas e controladores, que no caso desta aplicação estão sub divididos em rotas e ações.
De seguida, poderá encontrar a estrutura de pastas, as configurações da framework Express, bem como outros detalhes importantes para a aplicação como um todo:

### **Estrutura de Diretórios:**

   - **static:** Recursos estáticos.
   - **views:** Arquivos de visualização (Mustache).
   - **api:** Manipulação de requisições relacionadas à API.
     - **api/controllers:** Controladores para a lógica de negócios.
     - **api/models:** Modelos de dados.
     - **api/actions:** Lógica específica para ações.
     - **api/routes:** Agregação de rotas da API.
   - **app:** Gerenciamento de rotas do frontend.
     - **app/user:** Parte do utilizador (backoffice).
     - **app/admin:** Gestão de dados (backoffice).
   - **.env:** Variáveis de ambiente sensíveis.

### **Express App:**

  - **Inicialização:**
    Carrega as dependências necessárias como `express`, `body-parser`, `mustache-express`, e `dotenv`.
    Configuração do ambiente utilizando o arquivo `.env`.

  - **Middlewares:**
    Utiliza o middleware `body-parser` para processar dados JSON.
    Configura a manipulação de requisições estáticas e favicon.

  - **Configuração do Mustache:**
    Configura o mecanismo de visualização Mustache para renderizar as views.

  - **Roteamento:**
    Utiliza os roteadores `apiRouter` e `appRouter` para direcionar requisições para as rotas correspondentes.

  - **Tratamento de Erros:**
    Para os erros mais comuns de falha em encontrar a rota pedida, foi utilizada a resposta (`404 Not Found`).

  - **Inicialização do Servidor:**
    Inicia o servidor na porta especificada no arquivo `.env`.

### **Rotas:**

  - **API Roteador:**
    Agrega todas as rotas da API, utilizando roteadores específicos para utilizadores, áreas, categorias, dificuldades, ingredientes, receitas e sementes.

  - **Roteador da Aplicação:**
    Roteia as requisições da aplicação principal.

### **Controladores, Modelos e Ações:**

  - **Controladores:**
    Agregam a lógica de manipulação de dados para utilizadores, áreas, categorias, dificuldades, ingredientes, receitas e sementes.

  - **Modelos:**
    Representam as entidades de dados da aplicação.

  - **Ações:**
    Contém a lógica específica para realizar ações relacionadas a utilizadores, áreas, categorias, dificuldades, ingredientes, receitas e sementes.

### **Entidades principais:**

  - **Utilizador:**
    Consiste nos utilizadores da aplicação, para além de determinar a sua autorização.

  - **Categoria:**
    Categoria de uma receita, pode facilitar na procura de receitas através da sua categoria.

  - **Ingredient:**
    Ingredientes tal como tomates e bananas, estes podem ser adicionados numa receita com a indicação da sua quantidade.

  - **Região:**
    Região de origem da receita.

  - **Dificuldade:**
    Dificuldade de preparo de uma dada receita.

  - **Receita:**
    A receita, composta por diversos atributos. É a entidade mais importante e mais dependente da API.

### **Base de Dados:**

  - **Tabelas Simples:**
    A base de dados é composta por múltiplas tabelas simples, sendo estas essenciais para um bom funcionamento e relacionamento dinâmico entre entidades. Um exemplo destas são os ingredientes, categorias e dificuldade.

  - **Tabelas Compostas:**
    Uma tabela composta são aquelas que possuem chaves estrangeiras para indicar um determinado valor, como exemplo, temos a tabela das receitas, que deve indicar a sua região, dificuldade, categoria, entre outros através de uma chave estrangeira.

  - **Tabelas Relacionais:**
    Ainda que todas as tabelas de uma base de dados relacional sejam relacionais, este nome foi escolhido para aquelas tabelas que servem para realizar os relacionamentos de N-N, isto é, relacionar receitas e ingredientes (recipe_ingredients), como também o relacionamento de receitas favoritas (favorite_recipes).

  - **Views:**
    A base de dados possui também algumas views para que seja mais fácil selecionar as receitas dos ingredients, e realizar pesquisas mais rápidas com menos campos de forma mais eficiente (por exemplo, detalhes da receita, tabelas ou cartões).

Esta arquitetura modular tenta seguir as boas práticas de desenvolvimento, separando claramente as responsabilidades entre diferentes componentes da aplicação.

## Web Services

Nesta secção serão apresentados, de forma breve, os serviços web que esta API disponibiliza, uma descrição para cada serviço, bem como alguns exemplos práticos para facilitar a compreensão.

### **Tipos de Serviço:**

  - **Elementares:**
    Esta API é composta por múltiplos serviços, sendo a maioria deles elementares. Estes dizem-se elementares por ser de natureza simples, tal como a criação ou visualização de um dado recurso numa base de dados. De seguida, podem ser vistos todos os serviços disponíveis nesta API:
      - Gestão de regiões;
      - Gestão de categorias;
      - Gestão de dificuldades;
      - Gestão de ingredientes;
      - Gestão de utilizadores.

  - **Compostos:**
    Esta API possui também alguns serviços compostos, que utilizam um ou mais serviços elementares para efetuar operções mais complexas, como por exemplo, as ações de *seeding*, que consistem na remoção e criação de dados em massa provenientes de uma outra API externa.
    - Outros serviços que podem ser considerados compostos são:
      - Gestão de receitas, quando criada ou editada podem ser incluídos os seus ingredientes; 
      - Inserção em massa de novas categorias, regiões, dificuldades, receitas à base de dados;
      - Gestão de listas de receitas favoritas de um utilizador;
      - Etc. 

### **Uso dos Serviços:**

A descrição do uso dos serviços será organizada em várias secções para garantir abrangência sem repetição excessiva. A primeira parte abordará o uso de serviços elementares, destacando a gestão de ingredientes, receitas e categorias. Em seguida, serão exploradas práticas de autenticação e autorização. Posteriormente, serão apresentados serviços mais complexos, exemplificados pela orquestração na gestão de ingredientes. Por fim, serão indicados os ficheiros a que deve recorrer em caso de dúvida. Esta estrutura procura dar a entender o método de usa da API da forma mais simplificada possível.

  - **Uso de Sistemas Elementares**
    Para utilizar os sistemas elementares de gestão de entidades, deverá recorrer ao seguinte URL:
    ```http://localhost:8081/api/entidade```
    Onde 8081 é a porta em que a API está localizada, mais sobre isso mais tarde, e entidade poderá ser substituída por qualquer entidade principal da aplicação, a seguir:
    - area;
    - category;
    - difficulty;
    - ingredient;
    - recipe;
    - user.
    
    Portanto, para puder consultar as categorias disponíveis na base de dados, poderá utilizar:
    ```http://localhost:8081/api/category```

  - **Enviar Parâmetros**
    - Como deve calcular, sendo que esta API segue uma arquitetura RESTful, a gestão de cada uma das entidades envolve também o envio de parâmetros para especificar em qual das instâncias da entidade se pretende realizar uma dada operação.
    - Para tal, pode ser introduzido um id logo após a entidade e uma barra "/":
    ```http://localhost:8081/api/entidade/id```
    Portanto, seguindo o exemplo anterior da categoria, para puder aceder a categoria com o id=5, deverá utilizar o seguinte URL:
    ```http://localhost:8081/api/category/5```

  - **Autenticar identidade**
    Para que um utilizador autentique a sua identidade, o mesmo deverá realizar um *login*, e no caso de não possuir conta, um *signup*.
    Com uma conta, um utilizador será capaz de utilizar rotas adicionais, pois as únicas rotas que os utilizadores sem conta poderão executar serão as de visualização, com a exceção de visualização de utilizadores e *seeding*.
    Para iniciar sessão, o mesmo poderá fazê-lo através de:
    ```http://localhost:8081/api/user/login``` 
    E deverá de enviar um corpo JSON no seguinte formato:
    ```bash 
    {
      "username": "theusername",
      "password": "thepassword"
    }
    ```
    Após iniciar sessão, poderá copiar um token que será recebido, e utilizá-lo para autenticar as suas próximas ações. Para o fazer, deve enviar um cabeçalho com os seguinte nome
    ```x-access-token``` em conjunto do seu token.

  - **Enviar um Corpo**
    Para enviar um corpo nos pedidos para a gestão dos serviços elementares, ou seja, para puder criar e alterar um dado recurso, existe um truque bastante simples, que ainda assim, vale a pena ser analisado.
    Sempre que quiser, por exemplo, adicionar um ingrediente através da API, é aconselhado que seja realizado um pedido à API do ingrediente, e copie a resposta. Com essa resposta, deverá colá-la no corpo JSON que quer enviar à API, com os seus valores alterados. Desta maneira garante que nunca se enganará.
    Sempre que seguir esta regra, de utilizar o mesmo formato que recebe para enviar, poderá escapar ao código HTTP 400 e 422. No entanto, existe uma outra regra, que provavelmente o poderá ajudar. Sempre que tiver de enviar uma receita, por exemplo, poderá enviar apenas o id do autor, ingredient, região (area), pois o resto dos dados não serão lidos, apenas o id será guardado.

  - **Serviços Baseados em Relacionamentos**
    Existem diversos serviços baseados em relacionamentos, tais como as listas de receitas, os favoritos, bem como a gestão de ingredientes de uma receita, e estes devem ser consultados diretamente ao respetivo ficheiro de rotas que será mencionado mais tarde.
    No entanto, sempre que se quiser adicionar um ingrediente a uma receita, poderá utilizar uma rota que segue a arquitetura RESTful, por exemplo:
    ```http://localhost:8081/api/recipe/recipe_id/addIngredient/ingredient_id```
    Acima, poderá ver o URL que deve ser utilizado para adicionar um ingrediente a uma receita, podendo também reparar que o parent, ou a receita, deverá estar sempre em primeiro lugar, enquanto que o filho, ou ingredient, deve ser provido por último.

  - **Decrição das Rotas**
    Para que possa consultar de forma mais clara as rotas disponíveis nesta API deve aceder ao seguinte ficheiro a partir da raiz do projeto:
    ```/api/routes/index.js```
    No ficheiro acima estão descritas as rotas das entidades disponíveis desta API, como também pode encontrar os ficheiros designados a cada uma das rotas específicas.
   
### **Exemplos Práticos:**

Nesta parte serão dados alguns exemplos de como utilizar a API. Estarão presentes exemplos desde como realizar pedidos mais técnicos que não foram abordados previamente, como também como corrigir problemas no caso dos mesmo surgirem.

  - **Tipos de Rotas**
    Como deve prever, existem diferentes tipos de rotas disponíveis nesta API, e de seguida serão apresentadas algumas das rotas que deverão ser mais utilizadas com exemplos práticos e funcionais:
    - Consultar todas as receitas:
      - Método: ```"GET"```
      - ```http://localhost:8081/api/recipe```
    - Consultar um ingrediente:
      - Método: ```"GET"```
      - ```http://localhost:8081/api/ingredient/378```
    - Criar uma area (região):
      - Método: ```"POST"```
      - ```http://localhost:8081/api/area```
      - Corpo:
      ```bash
      {
        "name": "Portuguese"
      }
      ```
      - Cabeçalho:
      ```bash
      { x-access-token: token }
      ```
    - Editar o utilizador predefinido (1)
      - Método: ```"PUT"```
      - ```http://localhost:8081/api/user/1```
      - Corpo:
      ```bash
      {
        "username": "newUsername",
        "email": "new@email.com",
        "password": "myNewPassword",
        "firstName": "newName",
        "lastName": "newLast",
        "image": "newImageURL",
        "isAdmin": 1
      }
      ```
      - Notas: A palavra passe será codificada antes de inserida na base de dados.
      - Cabeçalho:
      ```bash
      { x-access-token: token }
      ```
    - Remover uma receita (33)
      - Método: ```"DELETE"```
      - ```http://localhost:8081/api/recipe/33```
      - Cabeçalho:
      ```bash
      { x-access-token: token }
      ```
    - Adicionar um ingredient (5) a uma receita (33)
      - Método: ```"POST"```
      - ```http://localhost:8081/api/recipe/33/ingredient/55```
      - Corpo:
      ```bash
      {
        "quantity": "A gosto"
      }
      ```
      - Cabeçalho:
      ```bash
      { x-access-token: token }
      ```

  - **Especificações**
  Para um uso correto das rotas, as mesmas estão preparadas com mensagens costumizadas com códigos HTTP intuitivos para que o utilizador da API seja guiado a corrigir o seu pedido.
  Vale referir que ainda existem outras nuances que serão descritas em secções futuras sobre a população da API com dados provenientes de uma outra API, como também detalhes sobre parâmetros de pesquisa sobre as entidades.

## Integração de Serviços Externos

Esta API, como mencionado anteriormente, é capaz de utilizar uma API externa para popular a base de dados. Sendo ela a API [TheMealDB](https://www.themealdb.com/api.php).
Existem quatro rotas que convertem as respostas provenientes desta API nos modelos utilizados pela base de dados desta aplicação, para depois ser inserida na mesma. Sendo as rotas as seguintes:
  - ```http://localhost:8081/api/seed/categories```
  - ```http://localhost:8081/api/seed/ingredients```
  - ```http://localhost:8081/api/seed/areas```
  - ```http://localhost:8081/api/seed/recipes```
Deve manter em mente que para criar as receitas, é necessário ter criado as regiões, ingredientes e categorias primeiro.
Mas para facilitar a população de dados, foi também criada a seguinte rota:
```bash
http://localhost:8081/api/seed/all
```
Esta está responsável por executar todas as rotas da ordem correta sem dificuldades ou transtornos. Recomenda-se utilizar apenas esta para evitar qualquer tipo de transtorno.
Mas ainda há mais, com o uso de um parâmetro de pesquisa, é capaz de forçar essas quatro tabelas a reiniciar, podendo inserir os dados a qualquer momento. Ainda assim, é recomendado que a população seja efetuada antes que utilizadores comecem a utilizar a aplicação e comecem a criar listas com receitas temporárias. Abaixo está a rota de populaçao geral com o parâmetro adicional:
```bash
http://localhost:8081/api/seed/all?force=true
```

## Funcionalidades Implementadas

Algumas das funcionalidades presentes consistem na gestão das respetivas entidades referidas anteriormente, bem como na realização de relacionamentos entre elas e a gestão destes, como também na população da base de dados referida anteriormente, e, autenticação e detalhes sober autorização, e por fim, o uso de parâmetros de pesquisa adicionais para as mais importantes entidades.

  - **Gestão de Entidades**
  Para evitar que a mesma coisa seja repetida vezes sem conta, é aconselhado que seja verificada a rota de pesquisa de uma dada entidade (GET), e verifique como é que o corpo é organizado, pois este é valido para inserção e atualização de recursos também.

  - **Relacionamentos**
  Novamente, como referido anteriormente, é possível relacionar entidades, tal como, ingredientes a receitas, receitas favoritas de um utilizador, listas de receitas a um utilizador, bem como, receitas a uma dada lista.
  No entanto, diferentes rotas podem precisar de corpos diferentes, como é o caso do ingrediente que deve receber a sua quantidade no corpo. No entanto, caso siga o URL abaixo, será capaz de realizar a maioria das ações de associação, ou, pelo menos, ser guiado a como corriji-las:
  ```bash
  http://localhost:8081/api/entidade/id_entidade/sub_entidade/id_sub_entidade
  ```
  Vale acrescentar que existem rotas, como no caso das listas personalizadas de receitas de utilizadores pode ainda existir uma terceira entidade a referir, mas novamente, ao consultar o ficheiro de rotas individual da entidade, será capaz de encontrar esses detalhes.

  - **Autenticação**
  A autenticação nesta aplicação é realizada através de (JSW) Json Web Tokens, que permitem assinar e verificar um dado token, a sua validade, bem como dados inseridos na mesma através do uso de uma palavra secreta. Coincidentemente, esta palavra secreta pode ser encontrada no ficheiro ```.env```.
  Pode consultar a base de dados e verificar que o único utilizador por definição é o "admin", cuja palavra passe é também admin. É aconselhado atualizar a palavra passe do administrador o quanto antes através de uma de duas rotas:
    - ```http://localhost:8081/api/user/changePassword``` (recomendada)
      - Esta rota deve receber três elementos no corpo, ```oldPassword```, ```newPassword```, ```repeatNewPassword```
    - Ou então utilizar a edição de utilizador disponível na gestão básica de entidades 
      - ```http://localhost:8081/api/user/1```
    - Deve ter em atenção que é necessário enviar o token de autenticação para ambas as rotas, logo, deverá realizar login primeiro para obter o token de administrador.

  - **Parâmetros de Pesquisa**
  Nesta API existem também diversos parâmetros de pesquisa para as seguintes entidades:
    - Category, Ingredient, Recipe;
    - Como mencionado acima, o *seeder* também possui o um parâmetro de *force*, ainda que não deva ser considerada uma entidade.
  
  Ainda assim, as entidades acima possuem diversos parâmetros de pesquisa, tais como nome, tamanho máximo, aleatoriadade, e muitos outros. Estes foram implementados para que pudesse ser realizada uma pesquisa mais personalizada às entidades mais relevantes. Dado o tempo disponibilizado para o desenvolvimento da API, os desenvolvedores tiveram de se concentrar em acrescentar funcionalidades, ao invés de replicar as mesmas funcionalidades para todas as entidades.

  - *Lista extensiva de parâmetros de pesquisa*
  Os parâmetros podem ser observados com mais detalhe na rota de consulta global de cada uma das entidades mencionadas acima, ainda assim, para fins de demonstração, a consulta de receitas possui os seguintes parâmetros:
    - order
      - Define por que atributo deve ser realizada a ordenação.
    - max
      - Define o limite de registos a receber.
    - random
      - Define que a ordenação deve ser aleatória.
    - name
      - Pesquisa apenas receitas que incluem o nome enviado por parâmetro.
    - partial
      - Dá a saber à API que a pesqusia é parcial, ou seja, mais adequada para ser apresentada em cartões (apenas a imagem, nome, id e chaves estrangeiras são enviados).
    - named
      - Caso a pesquisa seja parcial, quando a pesquisa também é nomeada, enviará os nomes respetivos às chaves estrangeiras (id da categoria e o seu nome), normalmente usado em tabelas de backoffice.
    - area
      - Pesquisa receitas de uma dada região (por id).
    - category
      - Pesquisa receitas de uma dada categoria (por id).
    - author
      - O mesmo para o autor.
    - difficulty
      - O mesmo para a dificuldade.

## Tecnologias Utilizadas

Conforme aprendido em aulas da unidade curricular, foi escolhido utilizar o Node.js com o Express.js para desenvolver o backend da aplicação, não apenas a API, bem como também as rotas da frontend.
Foi também decidido utilizar o MySQL devido à sua facilidade de uso e aprendizado da mesma em cadeiras anteriores.
Como também foram utilizadas outras ferramentas ainda não mencionadas, sendo elas:
  - [Mustache](https://github.com/janl/mustache.js/)
    - Motor de templates que permite a inicialização de páginas HTML de forma mais dinâmica e simplificada.
  - [Bootstrap 5](https://getbootstrap.com/)
    - Framework que embeleza uma aplicação web (frontend).
  - [JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON)
    - Notação moderna usada para comunicar entre o backend e frontend.
    - Esta API utilizará JSON para enviar qualquer tipo de recurso. Só enviará texto em caso de erro ou não fazer sentido enviar um objeto.
  - Ainda que seja óbvio, foi também utilizado HTML e CSS para o desenvolvmento das páginas web, bem como JavaScript para programar estas páginas e programar o backend com Node.js.


## Mais Informações

Para mais informações, pode consultar o manual de utilizador, que dará uma melhor perspectiva numa ótica de utilizador.
