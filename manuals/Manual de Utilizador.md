<!-- title: Manual de Utilizador --> 
# Manual de Utilizador

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

## Índice

- [Manual de Utilizador](#manual-de-utilizador)
  - [Índice](#índice)
  - [Introdução](#introdução)
  - [Autenticação](#autenticação)
    - [É um Desenvolvedor?](#é-um-desenvolvedor)
  - [Exploração do Frontoffice](#exploração-do-frontoffice)
    - [Navegação](#navegação)
    - [Página Inicial](#página-inicial)
    - [Página Pessoal](#página-pessoal)
    - [Página de Receitas, Categorias e Sobre Nós](#página-de-receitas-categorias-e-sobre-nós)
  - [Funcionalidades Adicionais](#funcionalidades-adicionais)
    - [Receitas Favoritas (API)](#receitas-favoritas-api)
    - [Listas de Receitas (API)](#listas-de-receitas-api)
  - [Gestão de Conteúdos](#gestão-de-conteúdos)
  - [Notas Finais](#notas-finais)

## Introdução

Neste manual de utilizador será abordado o método de autenticação da API, uma breve exploração do frontoffice, as suas principais funcionalidades, como gerir as principais entidades através do backoffice, bem como algumas notas finais.

## Autenticação

Este sistema (API e *web app*) não requerem autenticação, caso queira apenas consultar recursos que não estão protegidos, claro.
Para se autenticar, deve possuir uma conta, que deve ser criada através do frontend na página de autenticação, ou através da API, com o método POST no seguinte URL:
```bash
http://localhost:8081/api/user/signup
```
Com o seguinte corpo:
```bash
{
	"username": "diogoveigas1222",
	"password": "admin",
	"repeatPassword": "admin",
	"email": "diogo@gmail.com",
	"firstName": "irineu",
	"lastName": "irinau"
}
```

Caso possua um conta já autenticada, parabéns, basta realizar login na página de autenticação, ou poderá fazê-lo através da API com o método POST:
```bash
http://localhost:8081/api/user/login
``` 
E deverá de enviar um corpo JSON no seguinte formato:
```bash 
{
    "username": "theusername",
    "password": "thepassword"
}
```
Mas tenha em atenção o seguinte, para utilizar a aplicação web, é recomendado que a autenticação seja realizada na mesma, apenas no caso de desejar realizar testes com a API, é que deverá autenticar-se com a mesa. Isto deve-se ao facto de que o frontend guardará o token em armazenamento local para o utilizar para todos os pedidos que terá de fazer à API através da aplicação web automaticamente, sem que tenha de se preocupar.

### É um Desenvolvedor?

Caso pretenda instalar este projeto e planeia gerir os dados de cada uma das entidades, é recomendado que verifique também o manual técnico que se encontra em conjunto deste manual de utilizador.

## Exploração do Frontoffice

No frontoffice, ou mais concretamente, na aplicação web para não administradores, existem 5 páginas principais:
- **Página inicial:**
Com receitas, categorias, regiões e uma barra de pesquisa.
- **Página de receita:**
Todos os detalhes de uma receita, até mesmo os seus ingredientes e respetivas quantidades.
- **Página de categorias:**
Uma lista de todas as categorias disponíveis.
- **Página pessoal:**
Esta alternará entre página de login/signup e área pessoal com receitas favoritas.
- **Página sobre nós:**
Esta página simplesmente apresentará alguns detalhes sobre os desenvolvedores, o âmbito do projeto, entre outros.

De seguida, estarão alguns detalhes sobre o que poderá realizar em cada uma das páginas acima mencionadas, para além do meio de navegação estre estas.

### Navegação

Antes das páginas em si, existem 2 meios de navegação na aplicação web, através da barra de navegação superior, como também através do rodapé, onde também se encontra o logo da escola dos desenvolvedores.

### Página Inicial

Para além da barra de navegação e rodapé, esta página está dividida em quatro secções, caixa de pesquisa de receitas, receitas (aleatórias ou categorizadas), categorias e regiões das receitas.

  - **Pesquisa por nome:**
  Ao escrever o nome de uma receita na pesquisa de receitas e submeter o seu pedido, verificará que as receitas abaixo serão alteradas consoante a sua pesquisa.

  - **Ver detalhes de uma receita:**
  Quando carrega em ver mais detalhes sobre uma receita, é aberta uma página com todos os detalhes da receita.

  - **Pesquisa por categoria:**
  As receitas da página tornam-se em receitas dessa categoria.

  - **Pesquisa por região:**
  Ao carregar na bandeira de um dado país, as receitas serão filtradas.

### Página Pessoal

Esta página está encarregada de autenticar os utilizadores da aplicação, bem como guardar as receitas favoritas de um utilizador.

Mais concretamente, esta página será inicialmente um formulário de login, no entanto, no caso de não possuir conta, ao carregar num link abaixo, um formulário de criação será apresentado.

Após iniciar a sessão, através da criação de uma nova conta ou iniciar sessão com uma conta previamente existente, será redirecionado para a página pessoal. Esta, para além de conter alguns detalhes do utilizador, possuirá também funcionalidades adicionais que serão descritas mais à frente.

No caso de querer **alterar a sua palavra passe**, pode fazê-lo apenas através da API, para tal, utilizando o método PATCH:
```bash
http://localhost:8081/api/user/changePassword
``` 
Com o corpo:
```bash
{
    "oldPassword": "diogo1",
    "newPassword": "diogo",
    "repeatNewPassword": "diogo"
}
```

### Página de Receitas, Categorias e Sobre Nós

Sendo que estas páginas são bastante intuitivas, foi determinado que é desnecessário falar mais sobre estas.

## Funcionalidades Adicionais

Existem algumas funcionalidades adicionais para os utilizadores que se autenticam, sendo elas:

  - **Receitas favoritas:**
    - Adicionar e remover receitas aos seus favoritos;
    - Pode adicionar uma receita como favorito através da página de detalhes da mesma;
    - Pode consultar todas as suas receitas favoritas através da sua página pessoal, e filtrá-las por nome através da barra de pesquisa acima.

  - **Listas de receitas:**
    - Infelizmente, as listas de receitas são uma funcionalidade muito difícil de implementar no frontend, portanto, devido a limitações temporais, foi apenas realizada através da API.

### Receitas Favoritas (API)

A gestão de receitas da API utiliza o seguinte URL:
```bash
http://localhost:8081/api/user/user_id/favoriteRecipe
```

Existem também diferentes variações, consultar todas as receitas favoritas, adicionar uma receita e remover uma receita. Para consultar as receitas, deve utilizar o método GET e não terá de enviar mais nada no URL.
No entanto, para adicionar e remover receitas dos favoritos, devem ser utilizados os métodos POST e DELETE respetivamente. Para enviar a referência da receita, como deve calcular, é da seguinte maneira:
```bash
http://localhost:8081/api/user/user_id/favoriteRecipe/recipe_id
```

### Listas de Receitas (API)

A explicação das listas de receitas será ligeiramente mais breve, focando-se mais nas suas possibilidades, e não tanto numa descrição teórica.

**Gestão de listas:**
Abaixo estão os métodos e URL para a consulta de todas as listas, criação, edição e remoção de uma lista.
Pode ter de enviar um corpo com o atributo ```name``` para criação e edição de listas.
Cada utilizador só pode aceder às suas listas, ou seja, tentar aceder a listas de outros utilizadores será impossível.
```bash
GET: http://localhost:8081/api/user/user_id/recipeList
```
```bash
POST: http://localhost:8081/api/user/user_id/recipeList
```
```bash
PATCH: http://localhost:8081/api/user/user_id/recipeList/list_id
```
```bash
DELETE: http://localhost:8081/api/user/user_id/recipeList/list_id
```

**Gestão de uma lista:**
Cada uma das listas pode ter a ela associadas várias receitas, para tal:
```bash
GET: http://localhost:8081/api/user/user_id/recipeList/list_id
```
```bash
POST: http://localhost:8081/api/user/user_id/recipeList/list_id/recipe/recipe_id
```
```bash
DELETE: http://localhost:8081/api/user/user_id/recipeList/list_id/recipe/recipe_id
```
A gestão de receitas de uma lista possui o URL mais longo da API, sendo necessário enviar o id do utilizador, da lista e da receita. Este poderia ter sido reduzido ao remover o id do utilizador, já que o mesmo tem de enviar o seu token, que também possui o id do utilizador. No entanto, foi concluído que desta forma as rotas ficariam mais *standard*.

## Gestão de Conteúdos

Esta aplicação web também possui um backoffice, ou seja, permite uma gestão eficiente dos dois recursos mais importantes da aplicação, os ingredientes e as receitas.

Para entrar na área de administração, o utilizador deve carregar na hiperligação cinzenta de *copyright* no rodapé da página, e será redirecionado para a página de gestão de recursos. No caso do utilizador não ter permissões para lá entrar, o mesmo será reencaminhado para uma página explicativa.

A gestão destas consiste nas operações básicas de um CRUD, portanto, consulta, criação, edição e remoção. Todas estes são realizados com modals, uma técnica que apresenta um menu que está sob o resto da página, e utiliza a função fetch do JavaScript do lado do cliente para realizar estes pedidos à base de dados.

O backoffice da aplicação foi realizado de maneira a possibilitar a realização de alterações na base de dados através da API, com alterações realizadas automaticamente sem reiniciar a página, com mensagens de feedback, para sempre que uma criação, alteração ou remoção de um recurso for realizada.

Existe também a funcionalidade de pesquisa por nome do recurso, bem como cada item do cabeçalho dos atributos do recurso a azul podem ser selecionados, e uma ordenação ascendente sobre esse recurso será executada. 

Para maior partilha de informação entre utilizadores, neste caso, administradores, também pode ser partilhada a pesquisa com os parâmetos de nome e ordenação para que outros utilizadores possuam a mesma pesquisa efetuada. Também é possível partilhar um recurso através do link no fim do modal dos detalhes do mesmo. Esta página permite a rápida e fácil partilha de um dado recurso e a edição do mesmo nessa mesma página.

## Notas Finais

Esta aplicação, tal como pode ser verificado na página *About Us* é um projeto realizado por alunos do Instituto Politécnico de Setúbal. Caso deseje utilizar esta aplicação ou alterá-la deve contactar a mesma.