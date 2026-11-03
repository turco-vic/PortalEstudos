import type { Materia } from '../../types'

export const backend: Materia = {
  id: 'backend',
  nome: 'Desenvolvimento Back-End',
  semestre: 2,
  status: 'em andamento',
  provas: [{ titulo: 'Prova', data: '2026-11-11' }],

  resumo: [
    {
      id: 'o-que-e-backend',
      titulo: 'O que é o back-end',
      texto: `
É a parte da aplicação que **roda no servidor** e que o usuário não vê. O front-end mostra a tela; o back-end recebe os pedidos do front, aplica as **regras de negócio**, conversa com o **banco de dados** e devolve uma resposta, quase sempre em **JSON**.

Responsabilidades principais:
- Regras de negócio (ex.: não deixar vender produto sem estoque)
- Persistência: salvar, buscar, alterar e apagar dados no banco
- Validação dos dados que chegam
- Segurança: autenticação e autorização
- Expor uma **API** pro front-end (e outros clientes) consumir
`,
    },
    {
      id: 'api-rest-http',
      titulo: 'API REST e comunicação via HTTP',
      texto: `
**API** (Application Programming Interface) é o contrato que define como o front pede coisas pro back. Numa **API REST**, cada recurso tem uma URL (endpoint) e a ação é dada pelo **verbo HTTP**:

- **GET** busca dados (GET /produtos, GET /produtos/5)
- **POST** cria (POST /produtos com JSON no corpo)
- **PUT** atualiza (PUT /produtos/5)
- **DELETE** remove (DELETE /produtos/5)

Uma **requisição** tem método, URL, cabeçalhos (headers, como Content-Type e Authorization) e, às vezes, um corpo (body) em JSON. A **resposta** tem um **status code** e, normalmente, um corpo em JSON.

Status mais cobrados:
- 200 OK: deu certo
- 201 Created: recurso criado (resposta típica do POST)
- 204 No Content: deu certo e não tem corpo (típico do DELETE)
- 400 Bad Request: dados inválidos
- 401 Unauthorized: não está autenticado
- 403 Forbidden: autenticado, mas sem permissão
- 404 Not Found: recurso não existe
- 500 Internal Server Error: erro no servidor
`,
    },
    {
      id: 'camadas',
      titulo: 'Arquitetura em camadas',
      texto: `
O projeto Spring Boot é dividido em camadas, cada uma com **uma responsabilidade**:

- **Controller** (@RestController): recebe as requisições HTTP, extrai parâmetros e chama o Service. **Não tem regra de negócio.**
- **Service** (@Service): concentra a lógica e as **regras de negócio**.
- **Repository** (@Repository): faz a comunicação com o **banco de dados**. Geralmente é uma interface que estende JpaRepository.
- **Model / Entity** (@Entity): representa uma **tabela** do banco.
- **DTO**: objetos que transportam dados entre a API e o cliente.

Fluxo de uma requisição:

~~~text
Front-end -> Controller -> Service -> Repository -> Banco
Front-end <- Controller <- Service <- Repository <- Banco
~~~

Estrutura de pastas típica:

~~~text
src/main/java/com/senai/loja/
  controller/   ProdutoController.java
  service/      ProdutoService.java
  repository/   ProdutoRepository.java
  model/        Produto.java, Categoria.java
  dto/          ProdutoRequestDTO.java
  LojaApplication.java
src/main/resources/application.properties
pom.xml
~~~
`,
    },
    {
      id: 'pom-xml',
      titulo: 'Spring Boot e o pom.xml',
      texto: `
As dependências do projeto ficam declaradas no **pom.xml** (projetos Maven, o padrão do Spring Initializr). Em projetos Gradle o arquivo é o build.gradle.

Starters mais comuns:
- spring-boot-starter-web: API REST, Controller, servidor Tomcat embutido
- spring-boot-starter-data-jpa: JPA, Hibernate e repositórios
- spring-boot-starter-validation: anotações de validação (@NotBlank, @Email...)
- spring-boot-starter-security: autenticação e autorização
- driver do banco: mysql-connector-j ou postgresql
- lombok: gera getters, setters e construtores

A **configuração** do banco (URL, usuário, senha) não fica no pom.xml, e sim no **application.properties**.
`,
    },
    {
      id: 'anotacoes-web',
      titulo: 'Anotações de mapeamento web',
      texto: `
- @RestController: marca a classe como controller REST (o retorno vira JSON)
- @RequestMapping("/produtos"): define o caminho base da classe
- @GetMapping, @PostMapping, @PutMapping, @DeleteMapping: ligam um método a um verbo HTTP
- @PathVariable: pega um valor **do caminho** da URL. Em /produtos/5, o 5
- @RequestParam: pega um valor **da query string**. Em /produtos?nome=mouse, o "mouse"
- @RequestBody: converte o **JSON do corpo** da requisição em objeto Java
- @Valid: dispara a validação das anotações do objeto recebido
`,
    },
    {
      id: 'jpa',
      titulo: 'JPA: entidades e relacionamentos',
      texto: `
**JPA** é a especificação Java pra mapear objetos em tabelas (ORM). O Spring usa o **Hibernate** como implementação.

- @Entity: a classe vira uma tabela
- @Table(name = "produtos"): define o nome da tabela
- @Id: chave primária
- @GeneratedValue(strategy = GenerationType.IDENTITY): id gerado pelo banco (auto incremento)
- @Column(nullable = false, length = 100): configura a coluna
- @ManyToOne + @JoinColumn: **muitos** produtos pra **uma** categoria. Cria a chave estrangeira
- @OneToMany(mappedBy = "categoria"): o lado inverso (uma categoria, muitos produtos)

Os imports vêm de **jakarta.persistence** (Spring Boot 3). Em versões antigas era javax.persistence.
`,
    },
    {
      id: 'repository',
      titulo: 'Spring Data JPA e JpaRepository',
      texto: `
Ao criar uma interface que estende **JpaRepository<Entidade, TipoDoId>**, o Spring gera a implementação sozinho. Você ganha, sem escrever SQL:

- save(obj): insere (sem id) ou atualiza (com id)
- findAll(): lista todos
- findById(id): busca por id e devolve um **Optional**
- deleteById(id) e delete(obj): remove
- existsById(id), count()

Também dá pra criar **query methods** só pelo nome: findByEmail, findByNomeContainingIgnoreCase. Pra consultas específicas, existe @Query.
`,
    },
    {
      id: 'crud-responseentity',
      titulo: 'CRUD com ResponseEntity',
      texto: `
**ResponseEntity** representa a resposta HTTP inteira: **status + cabeçalhos + corpo**. Com ele o controller escolhe o status certo pra cada caso.

- Listar: GET, findAll(), **200**
- Buscar por id: GET, findById(), **200** ou **404**
- Criar: POST, save(), **201**
- Atualizar: PUT, findById() + save(), **200** ou **404**
- Remover: DELETE, deleteById(), **204** ou **404**

Formas de montar: ResponseEntity.ok(obj), ResponseEntity.status(HttpStatus.CREATED).body(obj), ResponseEntity.noContent().build(), ResponseEntity.notFound().build().
`,
    },
    {
      id: 'dto',
      titulo: 'DTO',
      texto: `
**DTO (Data Transfer Object)** é um objeto simples, sem regra de negócio, usado só pra **transportar dados** entre o cliente e a API.

Por que usar:
- Não expor a entidade inteira (ex.: nunca devolver a **senha**)
- Controlar o que entra (RequestDTO) e o que sai (ResponseDTO)
- Colocar as validações no objeto de entrada
- Desacoplar a API da estrutura do banco
- Evitar loop infinito ao serializar relacionamentos dos dois lados

Em Java moderno, um **record** é ótimo pra DTO.
`,
    },
    {
      id: 'validacao',
      titulo: 'Validação no front e no back',
      texto: `
- **Front-end**: melhora a experiência, dá retorno imediato (campo obrigatório, formato de e-mail). Mas **pode ser burlada** (DevTools, Postman).
- **Back-end**: **obrigatória**. É a última barreira que garante dados corretos e seguros.

No Spring: dependência spring-boot-starter-validation, anotações no DTO (@NotBlank, @NotNull, @Email, @Size, @Positive, @Min) e @Valid no parâmetro do controller. Dado inválido gera **400 Bad Request**.

Regras que dependem do banco (ex.: e-mail já cadastrado) são validadas no **Service**.
`,
    },
    {
      id: 'seguranca-jwt',
      titulo: 'Autenticação, autorização e JWT',
      texto: `
- **Autenticação**: provar **quem você é** (login e senha). Falhou: **401**.
- **Autorização**: verificar **o que você pode fazer** (perfil ADMIN, USER). Sem permissão: **403**.

**JWT (JSON Web Token)** é um token assinado no formato header.payload.signature. O servidor gera no login e o cliente manda em cada requisição no cabeçalho:

~~~text
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
~~~

O back valida a **assinatura** e a **expiração** a cada requisição, sem guardar sessão (**stateless**). O payload é só codificado em Base64, **não é criptografado**: nunca coloque senha nele.
`,
    },
  ],

  perguntas: [
    {
      id: 'p01',
      fonte: 'Exercícios 4',
      pergunta: 'O que é o Backend e quais são suas principais funções em uma aplicação web?',
      resposta: `
O back-end é a parte da aplicação que **roda no servidor** e não é vista pelo usuário. Ele recebe as requisições feitas pelo front-end, **processa** essas requisições e devolve uma resposta, normalmente em **JSON**.

Principais funções:
- **Regras de negócio**: aplicar a lógica do sistema (ex.: não permitir uma compra sem estoque, calcular o total de um pedido).
- **Persistência de dados**: salvar, buscar, atualizar e excluir informações no **banco de dados**.
- **Validação**: conferir se os dados recebidos estão corretos antes de usar.
- **Segurança**: **autenticação** (quem é o usuário) e **autorização** (o que ele pode fazer).
- **Disponibilizar uma API**: expor endpoints para o front-end e outros sistemas consumirem.
- **Integrações**: conversar com outros serviços (pagamento, envio de e-mail, APIs externas).

Resumindo: o front-end é a "vitrine" e o back-end é o "estoque e o caixa" da loja, onde as coisas realmente acontecem.
`,
    },
    {
      id: 'p02',
      fonte: 'Exercícios 4',
      pergunta: 'Qual é a função da API no Projeto Integrador?',
      resposta: `
A **API (Application Programming Interface)** é a **ponte de comunicação** entre o front-end e o back-end. No Projeto Integrador, ela é uma **API REST** feita com **Spring Boot** que define quais operações o sistema oferece e como pedir cada uma.

Funções da API no projeto:
- **Receber as requisições HTTP** do front-end (GET, POST, PUT, DELETE) em endpoints como /produtos ou /usuarios.
- **Centralizar as regras de negócio** e o acesso ao banco: o front nunca acessa o banco direto.
- **Devolver respostas padronizadas** em JSON, com **status HTTP** (200, 201, 404...).
- **Separar front e back**: cada parte pode ser desenvolvida e publicada de forma independente.
- **Permitir reaproveitamento**: o mesmo back-end pode atender um site, um app mobile ou outro sistema.
- **Garantir segurança**: validar dados e controlar o acesso (ex.: com JWT).

Exemplo de fluxo: a tela de cadastro envia um POST /produtos com o JSON do produto; a API valida, salva no banco e responde 201 Created com o produto criado.
`,
    },
    {
      id: 'p03',
      fonte: 'Exercícios 4',
      pergunta: 'Como funciona a validação de dados no Frontend e no Backend?',
      resposta: `
A validação acontece nos dois lados, mas com **objetivos diferentes**.

**No front-end**, a validação serve para **melhorar a experiência do usuário**: ela dá um retorno imediato, sem precisar ir até o servidor. Exemplos: campo obrigatório, formato de e-mail, senha com tamanho mínimo. Pode ser feita com atributos HTML (required, type="email", minlength) ou com JavaScript/React. Porém ela **pode ser burlada**: dá para desativar pelo navegador ou mandar a requisição direto pelo Postman.

**No back-end**, a validação é **obrigatória**, porque é a última barreira antes do banco. Ela garante a **integridade** e a **segurança** dos dados. No Spring Boot usamos o **Bean Validation** (dependência spring-boot-starter-validation):
- anotações no DTO: @NotBlank, @NotNull, @Email, @Size, @Min, @Positive
- @Valid no parâmetro do controller para ativar a validação
- se algum dado for inválido, a API responde **400 Bad Request**

~~~java
public record ProdutoRequestDTO(
    @NotBlank(message = "O nome é obrigatório")
    String nome,

    @NotNull @Positive
    BigDecimal preco
) {}

@PostMapping
public ResponseEntity<Produto> criar(@Valid @RequestBody ProdutoRequestDTO dto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
}
~~~

Regras que dependem do banco (ex.: "e-mail já cadastrado") são validadas no **Service**.

Frase para lembrar: **o front valida para ajudar o usuário; o back valida para proteger o sistema.**
`,
    },
    {
      id: 'p04',
      fonte: 'Exercícios 4',
      pergunta: 'Como ocorre a comunicação entre o Frontend e o Backend?',
      resposta: `
A comunicação acontece pelo **protocolo HTTP**, no modelo **cliente-servidor** de **requisição e resposta**. O front-end (cliente) faz uma requisição para API e o back-end (servidor) devolve uma resposta. Os dados trafegam normalmente em **JSON**.

**A requisição** contém:
- **Método HTTP**: GET (buscar), POST (criar), PUT (atualizar), DELETE (remover)
- **URL / endpoint**: ex.: http://localhost:8080/produtos/5
- **Cabeçalhos (headers)**: ex.: Content-Type: application/json e Authorization: Bearer token
- **Corpo (body)**: os dados em JSON (no POST e no PUT)

**A resposta** contém:
- **Status code**: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401, 403, 404 Not Found, 500
- **Corpo**: os dados em JSON

No front, a requisição é feita com fetch ou axios:

~~~javascript
const resposta = await fetch('http://localhost:8080/produtos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome: 'Mouse', preco: 89.9 }),
})
const produto = await resposta.json()
~~~

No back, o **Controller** recebe essa requisição, chama o Service e devolve um ResponseEntity. Como front e back costumam rodar em portas diferentes, é preciso liberar o **CORS** (ex.: com @CrossOrigin).
`,
    },
    {
      id: 'p05',
      fonte: 'Exercícios 4',
      pergunta: 'Em qual arquivo do Spring Boot são declaradas as dependências do projeto?',
      resposta: `
No arquivo **pom.xml**, que fica na raiz do projeto. Ele é o arquivo de configuração do **Maven**, o gerenciador de dependências padrão gerado pelo Spring Initializr. (Se o projeto usar **Gradle**, o arquivo é o build.gradle.)

Cada dependência é declarada dentro da tag dependencies:

~~~xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>
  <dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
  </dependency>
</dependencies>
~~~

Dependências comuns: spring-boot-starter-web (API REST), spring-boot-starter-data-jpa (banco com JPA), spring-boot-starter-validation (validações), spring-boot-starter-security (segurança), o driver do banco e o lombok.

Atenção para não confundir: as **configurações** (URL do banco, usuário, senha, porta) ficam no **application.properties**, não no pom.xml.
`,
    },
    {
      id: 'p06',
      fonte: 'Exercícios 4',
      pergunta: 'Qual camada do Backend é responsável pela comunicação com o Frontend?',
      resposta: `
A camada **Controller**.

Ela é a **porta de entrada** da API: recebe as **requisições HTTP** vindas do front-end, extrai os dados (parâmetros da URL, query string, corpo em JSON), **chama o Service** e devolve a resposta com o **status HTTP** adequado, normalmente usando ResponseEntity.

É anotada com @RestController e usa @RequestMapping, @GetMapping, @PostMapping, @PutMapping, @DeleteMapping, @PathVariable, @RequestParam e @RequestBody.

Importante: o Controller **não deve conter regras de negócio**. Ele só recebe, repassa para o Service e responde.
`,
    },
    {
      id: 'p07',
      fonte: 'Exercícios 4',
      pergunta: 'O que é um DTO e qual é sua utilidade no Backend?',
      resposta: `
**DTO (Data Transfer Object)** é um objeto simples, **sem regras de negócio**, usado só para **transportar dados** entre o cliente e a API (ou entre camadas).

Utilidades:
- **Proteger dados sensíveis**: não expor a entidade inteira. Ex.: a entidade Usuario tem senha, mas o DTO de resposta não.
- **Controlar a entrada e a saída**: o RequestDTO define o que o cliente pode enviar; o ResponseDTO define o que a API devolve.
- **Concentrar as validações** de entrada (@NotBlank, @Email...).
- **Desacoplar** a API do banco: dá para mudar a entidade sem quebrar o front.
- Evitar **loop infinito** na conversão para JSON quando há relacionamentos nos dois sentidos.

~~~java
public record UsuarioRequestDTO(
    @NotBlank String nome,
    @Email String email,
    @Size(min = 6) String senha
) {}

public record UsuarioResponseDTO(Long id, String nome, String email) {}
~~~

O Service converte o DTO em entidade antes de salvar, e a entidade em DTO antes de devolver.
`,
    },
    {
      id: 'p08',
      fonte: 'Exercícios 4',
      pergunta: 'Qual é a diferença entre autenticação e autorização?',
      resposta: `
- **Autenticação** verifica **quem é o usuário**. É o processo de provar a identidade, normalmente com login e senha. Se falhar ou se o usuário não estiver logado, a resposta é **401 Unauthorized**.
- **Autorização** verifica **o que o usuário pode fazer**, depois que ele já foi identificado. Depende do perfil (role), como ADMIN ou USER. Se ele estiver logado mas não tiver permissão, a resposta é **403 Forbidden**.

A autenticação sempre vem **antes** da autorização.

Analogia: na portaria de uma empresa, mostrar o crachá é a **autenticação** (provar quem você é). Poder entrar ou não na sala da diretoria é a **autorização** (o que você tem permissão de acessar).

Exemplo no sistema: qualquer usuário logado pode ver os produtos (autenticado), mas só o ADMIN pode excluir um produto (autorizado).
`,
    },
    {
      id: 'p09',
      fonte: 'Exercícios 4',
      pergunta: 'O que é JWT e como utilizá-lo no Projeto Integrador?',
      resposta: `
**JWT (JSON Web Token)** é um **token** compacto e **assinado digitalmente**, usado para **autenticação stateless**: o servidor não precisa guardar sessão, porque todas as informações necessárias estão no próprio token.

Ele tem três partes separadas por ponto: **header.payload.signature**
- **Header**: o algoritmo da assinatura (ex.: HS256)
- **Payload**: os dados (claims), como o usuário (sub), o perfil e a **expiração** (exp)
- **Signature**: a assinatura feita com uma **chave secreta** do servidor; garante que o token não foi alterado

Como usar no Projeto Integrador:
1. O usuário faz login: o front envia POST /auth/login com e-mail e senha.
2. O back confere as credenciais (a senha salva com **BCrypt**) e **gera o JWT** com a chave secreta e um tempo de expiração.
3. O front **guarda o token** (ex.: localStorage) e envia em **toda requisição** no cabeçalho Authorization: Bearer token.
4. No back, um **filtro do Spring Security** intercepta cada requisição, valida a assinatura e a expiração e identifica o usuário. Se o token for inválido ou estiver ausente, responde **401**; se o perfil não tiver permissão, **403**.

Dependências: spring-boot-starter-security e uma biblioteca de JWT (ex.: jjwt ou java-jwt).

Cuidado: o payload é só codificado em Base64, **não é criptografado**. Qualquer um consegue ler, então **nunca coloque senha** no token.
`,
    },
    {
      id: 'p10',
      fonte: 'Exercícios 4',
      pergunta: 'Qual é a função do Controller e quais são suas principais anotações e importações?',
      resposta: `
**Função:** é a camada que **recebe as requisições HTTP** do front-end, extrai os parâmetros, **chama o Service** e devolve a resposta com o status adequado. **Não contém regras de negócio.**

**Principais anotações:**
- @RestController: define a classe como controller REST (junta @Controller e @ResponseBody; o retorno vira JSON)
- @RequestMapping("/produtos"): caminho base dos endpoints
- @GetMapping, @PostMapping, @PutMapping, @DeleteMapping: mapeiam os verbos HTTP
- @PathVariable: valor que vem no caminho (/produtos/{id})
- @RequestParam: valor da query string (/produtos?nome=x)
- @RequestBody: converte o JSON do corpo em objeto Java
- @Valid: ativa a validação do objeto recebido
- @CrossOrigin: libera o acesso do front (CORS)
- @Autowired: injeção de dependência (ou injeção pelo construtor)

**Principais importações:**
- org.springframework.web.bind.annotation.* (RestController, RequestMapping, GetMapping, PathVariable...)
- org.springframework.http.ResponseEntity
- org.springframework.http.HttpStatus
- jakarta.validation.Valid
- java.util.List

~~~java
@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
~~~
`,
    },
    {
      id: 'p11',
      fonte: 'Exercícios 4',
      pergunta: 'Qual é a função do Service e quais são suas principais anotações e importações?',
      resposta: `
**Função:** concentra a **lógica da aplicação e as regras de negócio**. Fica entre o Controller e o Repository: recebe os dados do Controller, aplica as regras (validações de negócio, cálculos, conversão DTO e entidade) e usa o Repository para acessar o banco.

**Principais anotações:**
- @Service: marca a classe como componente de serviço, gerenciado pelo Spring (pode ser injetado em outras classes)
- @Autowired: injeta o Repository (ou injeção pelo construtor, que é a forma recomendada)
- @Transactional: executa o método dentro de uma **transação**; se der erro, tudo é desfeito (rollback)

**Principais importações:**
- org.springframework.stereotype.Service
- org.springframework.beans.factory.annotation.Autowired
- org.springframework.transaction.annotation.Transactional
- java.util.List e java.util.Optional

~~~java
@Service
public class ProdutoService {

    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    public List<Produto> listar() {
        return repository.findAll();
    }

    public Optional<Produto> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public Produto criar(Produto produto) {
        if (produto.getPreco().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero");
        }
        return repository.save(produto);
    }
}
~~~
`,
    },
    {
      id: 'p12',
      fonte: 'Exercícios 4',
      pergunta: 'Qual é a função do Model e quais são suas principais anotações e importações?',
      resposta: `
**Função:** o Model (ou **Entity**) **representa uma tabela do banco de dados** como uma classe Java. Cada **atributo** vira uma **coluna** e cada **objeto** é uma **linha** da tabela. Quem faz esse mapeamento é a **JPA** (com o Hibernate por baixo).

**Principais anotações:**
- @Entity: indica que a classe é uma entidade (tabela)
- @Table(name = "produtos"): define o nome da tabela
- @Id: define a chave primária
- @GeneratedValue(strategy = GenerationType.IDENTITY): id gerado automaticamente pelo banco
- @Column(nullable = false, length = 100, unique = true): configura a coluna
- @ManyToOne e @JoinColumn: relacionamento muitos-para-um (cria a chave estrangeira)
- @OneToMany(mappedBy = "..."): relacionamento um-para-muitos
- Lombok (opcional): @Getter, @Setter, @NoArgsConstructor, @AllArgsConstructor ou @Data

**Principais importações:**
- jakarta.persistence.* (Entity, Table, Id, GeneratedValue, GenerationType, Column, ManyToOne, JoinColumn)
- lombok.* (se usar Lombok)

~~~java
@Entity
@Table(name = "produtos")
@Getter @Setter @NoArgsConstructor
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false)
    private BigDecimal preco;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
}
~~~

A JPA exige um **construtor vazio** (por isso o @NoArgsConstructor).
`,
    },
    {
      id: 'p13',
      fonte: 'Exercícios 4',
      pergunta: 'Qual é a função do Repository e quais são suas principais interfaces e importações?',
      resposta: `
**Função:** é a camada de **acesso ao banco de dados**. Faz as operações de salvar, buscar, atualizar e excluir sem precisar escrever SQL, porque o **Spring Data JPA** gera a implementação automaticamente.

É criado como uma **interface** que estende **JpaRepository<Entidade, TipoDoId>**:

~~~java
@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByNomeContainingIgnoreCase(String nome);

    Optional<Produto> findByNome(String nome);
}
~~~

**Principais interfaces:**
- **JpaRepository**: a mais usada; herda tudo das outras e adiciona recursos da JPA
- **CrudRepository**: operações básicas de CRUD
- **PagingAndSortingRepository**: paginação e ordenação

**Métodos que já vêm prontos:** save(), findAll(), findById() (retorna Optional), deleteById(), delete(), existsById(), count().

Também dá para criar **query methods** só pelo nome do método (findByEmail, findByPrecoLessThan) ou escrever a consulta com @Query.

**Principais importações:**
- org.springframework.data.jpa.repository.JpaRepository
- org.springframework.stereotype.Repository
- org.springframework.data.jpa.repository.Query (se usar consulta própria)
- java.util.List e java.util.Optional

A anotação @Repository é **opcional** quando a interface estende JpaRepository (o Spring já reconhece), mas é comum colocar para deixar claro.
`,
    },
    {
      id: 'p14',
      fonte: 'Formativa 01',
      pergunta: 'Explique a arquitetura em camadas de um projeto Spring Boot e como as pastas são organizadas.',
      resposta: `
O projeto é dividido em camadas, e cada uma tem **uma única responsabilidade**. Isso deixa o código organizado, fácil de manter e de testar.

- **Controller** (@RestController): recebe as requisições HTTP, extrai os parâmetros e chama o Service. **Não deve conter regras de negócio.**
- **Service** (@Service): concentra a **lógica da aplicação e as regras de negócio**.
- **Repository** (@Repository): faz a **comunicação com o banco**. Geralmente são interfaces que estendem JpaRepository.
- **Model / Entity** (@Entity): **representa as tabelas** do banco.

Fluxo de uma requisição:

~~~text
Front-end -> Controller -> Service -> Repository -> Banco de dados
~~~

e a resposta faz o caminho de volta.

Organização das pastas:

~~~text
src/main/java/com/senai/loja/
  controller/   ProdutoController.java
  service/      ProdutoService.java
  repository/   ProdutoRepository.java
  model/        Produto.java
  dto/          ProdutoRequestDTO.java
  LojaApplication.java   (classe com @SpringBootApplication)
src/main/resources/
  application.properties (configuração do banco)
pom.xml                  (dependências)
~~~
`,
    },
    {
      id: 'p15',
      fonte: 'Formativa 01',
      pergunta: 'Quais são as anotações de mapeamento web do Spring e para que serve cada uma? Qual a diferença entre @PathVariable e @RequestParam?',
      resposta: `
- @GetMapping: mapeia requisições **GET** (buscar dados)
- @PostMapping: mapeia **POST** (criar)
- @PutMapping: mapeia **PUT** (atualizar)
- @DeleteMapping: mapeia **DELETE** (excluir)
- @RequestMapping: define o caminho base do controller (ex.: /produtos)
- @RequestBody: transforma o JSON do corpo em objeto Java

**Diferença entre @PathVariable e @RequestParam:**
- @PathVariable pega o valor que faz **parte do caminho**. Usado para identificar **um recurso específico**. Ex.: GET /produtos/**5**
- @RequestParam pega o valor da **query string** (depois do ?). Usado para **filtros e opções**. Ex.: GET /produtos?**categoria=livros**

~~~java
@GetMapping("/{id}")
public ResponseEntity<Produto> buscar(@PathVariable Long id) { ... }

@GetMapping("/busca")
public ResponseEntity<List<Produto>> buscarPorNome(@RequestParam String nome) { ... }
~~~
`,
    },
    {
      id: 'p16',
      fonte: 'Formativa 01',
      pergunta: 'Quais são as principais anotações de persistência da JPA e como mapear um relacionamento @ManyToOne?',
      resposta: `
- @Entity: transforma a classe em entidade (tabela)
- @Table(name = "..."): define o nome da tabela
- @Id: chave primária
- @GeneratedValue(strategy = GenerationType.IDENTITY): id gerado automaticamente pelo banco
- @Column: configura a coluna (nullable, length, unique)

**@ManyToOne** é usado quando **muitos registros** de uma entidade se ligam a **um registro** de outra. Exemplo: **muitos produtos** pertencem a **uma categoria**. Fica no lado "muitos" (Produto) e, junto com @JoinColumn, cria a **chave estrangeira** na tabela.

~~~java
@Entity
@Table(name = "categorias")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;
}

@Entity
@Table(name = "produtos")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "categoria_id")   // coluna da chave estrangeira
    private Categoria categoria;
}
~~~

O lado inverso, se precisar, usa @OneToMany(mappedBy = "categoria") na Categoria. Outros relacionamentos: @OneToOne e @ManyToMany.
`,
    },
    {
      id: 'p17',
      fonte: 'Formativa 01',
      pergunta: 'Como construir um CRUD completo com Spring Data JPA (save, findAll, findById, delete) retornando os status HTTP corretos com ResponseEntity?',
      resposta: `
O **Repository** (JpaRepository) já oferece os métodos. O **Service** usa esses métodos, e o **Controller** devolve um **ResponseEntity** com o status certo para cada caso.

- Listar: GET /produtos, findAll(), **200 OK**
- Buscar: GET /produtos/{id}, findById(), **200 OK** ou **404 Not Found**
- Criar: POST /produtos, save(), **201 Created**
- Atualizar: PUT /produtos/{id}, findById() + save(), **200 OK** ou **404**
- Excluir: DELETE /produtos/{id}, deleteById(), **204 No Content** ou **404**

~~~java
@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoRepository repository;

    public ProdutoController(ProdutoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Produto> criar(@RequestBody Produto produto) {
        Produto salvo = repository.save(produto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable Long id, @RequestBody Produto dados) {
        return repository.findById(id)
                .map(produto -> {
                    produto.setNome(dados.getNome());
                    produto.setPreco(dados.getPreco());
                    return ResponseEntity.ok(repository.save(produto));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
~~~

Aqui o controller chama o repository direto para deixar o exemplo curto. No projeto em camadas, essas chamadas ficam no **Service**, e o controller só chama o service.
`,
    },
  ],

  flashcards: [
    { id: 'f01', frente: 'O que é o back-end?', verso: 'A parte da aplicação que roda no **servidor**: recebe requisições, aplica regras de negócio, acessa o banco e devolve respostas (geralmente JSON).' },
    { id: 'f02', frente: 'O que é uma API?', verso: '**Application Programming Interface**: a ponte/contrato de comunicação entre o front-end e o back-end.' },
    { id: 'f03', frente: 'Em qual arquivo ficam as dependências do Spring Boot (Maven)?', verso: 'No **pom.xml** (no Gradle, build.gradle).' },
    { id: 'f04', frente: 'Onde ficam as configurações do banco (URL, usuário, senha)?', verso: 'No **application.properties** (ou application.yml).' },
    { id: 'f05', frente: 'Qual camada se comunica com o front-end?', verso: 'O **Controller** (@RestController).' },
    { id: 'f06', frente: 'Qual camada concentra as regras de negócio?', verso: 'O **Service** (@Service).' },
    { id: 'f07', frente: 'Qual camada acessa o banco de dados?', verso: 'O **Repository**, normalmente uma interface que estende JpaRepository.' },
    { id: 'f08', frente: 'O que o Model / Entity representa?', verso: 'Uma **tabela** do banco. Atributos viram colunas e cada objeto é uma linha.' },
    { id: 'f09', frente: 'O que é um DTO?', verso: '**Data Transfer Object**: objeto simples, sem regra de negócio, que só transporta dados entre o cliente e a API.' },
    { id: 'f10', frente: 'Cite 2 motivos pra usar DTO', verso: 'Não expor dados sensíveis (ex.: **senha**) e **controlar** o que entra e o que sai da API. Também concentra validações e desacopla a API do banco.' },
    { id: 'f11', frente: 'Autenticação x autorização', verso: '**Autenticação**: quem você é (login). **Autorização**: o que você pode fazer (permissões/roles).' },
    { id: 'f12', frente: '401 x 403', verso: '**401 Unauthorized**: não autenticado. **403 Forbidden**: autenticado, mas sem permissão.' },
    { id: 'f13', frente: 'O que significa JWT?', verso: '**JSON Web Token**: token assinado usado pra autenticação stateless.' },
    { id: 'f14', frente: 'Quais são as 3 partes de um JWT?', verso: '**header.payload.signature** (cabeçalho, dados/claims e assinatura).' },
    { id: 'f15', frente: 'Como o front envia o JWT em cada requisição?', verso: 'No cabeçalho **Authorization: Bearer token**.' },
    { id: 'f16', frente: 'O payload do JWT é criptografado?', verso: '**Não.** É só codificado em Base64 e assinado. Nunca coloque senha nele.' },
    { id: 'f17', frente: '@RestController', verso: 'Marca a classe como controller REST. Junta @Controller e @ResponseBody (retorno vira JSON).' },
    { id: 'f18', frente: '@PathVariable', verso: 'Pega um valor do **caminho** da URL. Em /produtos/5, pega o **5**.' },
    { id: 'f19', frente: '@RequestParam', verso: 'Pega um valor da **query string**. Em /produtos?nome=mouse, pega **mouse**.' },
    { id: 'f20', frente: '@RequestBody', verso: 'Converte o **JSON do corpo** da requisição em um objeto Java.' },
    { id: 'f21', frente: '@Entity', verso: 'Indica que a classe é uma **entidade JPA**, ou seja, uma tabela.' },
    { id: 'f22', frente: '@Id + @GeneratedValue', verso: '@Id marca a **chave primária**; @GeneratedValue(strategy = GenerationType.IDENTITY) faz o banco gerar o id (auto incremento).' },
    { id: 'f23', frente: '@Column', verso: 'Configura a coluna: nullable, length, unique, name.' },
    { id: 'f24', frente: '@ManyToOne', verso: '**Muitos pra um**: muitos produtos pra uma categoria. Usado com @JoinColumn, cria a **chave estrangeira**.' },
    { id: 'f25', frente: 'JpaRepository<T, ID>: o que são T e ID?', verso: '**T** é a entidade (ex.: Produto) e **ID** é o tipo da chave primária (ex.: Long).' },
    { id: 'f26', frente: 'O que findById() retorna?', verso: 'Um **Optional**, porque o registro pode não existir.' },
    { id: 'f27', frente: 'save() insere ou atualiza?', verso: 'Os dois: **sem id** insere; **com id existente** atualiza.' },
    { id: 'f28', frente: 'O que é ResponseEntity?', verso: 'A resposta HTTP completa: **status + cabeçalhos + corpo**.' },
    { id: 'f29', frente: 'Status ideal de um POST que criou um recurso', verso: '**201 Created**.' },
    { id: 'f30', frente: 'Status ideal de um DELETE bem-sucedido', verso: '**204 No Content**.' },
    { id: 'f31', frente: '@Service', verso: 'Marca a classe como componente de **serviço** (regras de negócio) gerenciado pelo Spring.' },
    { id: 'f32', frente: '@Transactional', verso: 'Executa o método numa **transação**: se der erro, tudo é desfeito (rollback).' },
    { id: 'f33', frente: 'Import das anotações JPA no Spring Boot 3', verso: '**jakarta.persistence** (ex.: import jakarta.persistence.Entity). Antes era javax.persistence.' },
    { id: 'f34', frente: 'Por que validar no back-end se o front já valida?', verso: 'Porque a validação do front **pode ser burlada** (DevTools, Postman). O back é a última barreira.' },
    { id: 'f35', frente: '@Valid', verso: 'Ativa a validação (Bean Validation) do objeto recebido no controller. Dado inválido gera **400 Bad Request**.' },
  ],

  questoes: [
    {
      id: 'q01',
      tipo: 'multipla',
      enunciado: 'Qual camada do back-end é responsável por receber as requisições HTTP do front-end?',
      opcoes: ['Controller', 'Service', 'Repository', 'Model'],
      correta: 0,
      explicacao: 'O Controller (@RestController) é a porta de entrada: recebe a requisição, extrai os parâmetros e chama o Service.',
    },
    {
      id: 'q02',
      tipo: 'multipla',
      enunciado: 'Em qual arquivo são declaradas as dependências de um projeto Spring Boot com Maven?',
      opcoes: ['pom.xml', 'application.properties', 'package.json', 'Application.java'],
      correta: 0,
      explicacao: 'O pom.xml é o arquivo do Maven. O application.properties guarda configurações (como os dados do banco), não dependências.',
    },
    {
      id: 'q03',
      tipo: 'vf',
      enunciado: 'O Controller deve conter as regras de negócio da aplicação.',
      correta: false,
      explicacao: 'Regras de negócio ficam no Service. O Controller só recebe a requisição, chama o Service e devolve a resposta.',
    },
    {
      id: 'q04',
      tipo: 'multipla',
      enunciado: 'Na URL GET /produtos/5, qual anotação captura o valor 5?',
      opcoes: ['@PathVariable', '@RequestParam', '@RequestBody', '@Column'],
      correta: 0,
      explicacao: '@PathVariable pega valores que fazem parte do caminho. @RequestParam pega valores da query string (depois do ?).',
    },
    {
      id: 'q05',
      tipo: 'multipla',
      enunciado: 'Na URL GET /produtos?categoria=livros, qual anotação captura "livros"?',
      opcoes: ['@RequestParam', '@PathVariable', '@RequestBody', '@RequestMapping'],
      correta: 0,
      explicacao: 'Valores depois do ? formam a query string, lida com @RequestParam.',
    },
    {
      id: 'q06',
      tipo: 'multipla',
      enunciado: 'Qual status HTTP é o mais adequado pra resposta de um POST que criou um recurso?',
      opcoes: ['201 Created', '200 OK', '204 No Content', '404 Not Found'],
      correta: 0,
      explicacao: '201 Created indica que um novo recurso foi criado. Ex.: ResponseEntity.status(HttpStatus.CREATED).body(salvo).',
    },
    {
      id: 'q07',
      tipo: 'multipla',
      enunciado: 'Qual status é o mais adequado pra um DELETE que removeu o recurso e não devolve corpo?',
      opcoes: ['204 No Content', '201 Created', '400 Bad Request', '500 Internal Server Error'],
      correta: 0,
      explicacao: '204 No Content: deu certo e não há corpo na resposta. Ex.: ResponseEntity.noContent().build().',
    },
    {
      id: 'q08',
      tipo: 'vf',
      enunciado: 'O método findById() do JpaRepository retorna um Optional.',
      correta: true,
      explicacao: 'Retorna Optional porque o registro pode não existir. Por isso usamos .map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build()).',
    },
    {
      id: 'q09',
      tipo: 'multipla',
      enunciado: 'O que significa a sigla DTO?',
      opcoes: ['Data Transfer Object', 'Data Type Object', 'Database Transaction Operation', 'Dynamic Template Object'],
      correta: 0,
      explicacao: 'DTO é Data Transfer Object: um objeto que só transporta dados entre o cliente e a API.',
    },
    {
      id: 'q10',
      tipo: 'multipla',
      enunciado: 'Qual é uma vantagem de usar DTO em vez de devolver a entidade direto?',
      opcoes: [
        'Evitar expor dados sensíveis, como a senha',
        'Deixar as consultas ao banco mais rápidas',
        'Dispensar o uso do Repository',
        'Criar as tabelas automaticamente',
      ],
      correta: 0,
      explicacao: 'Com DTO você escolhe exatamente o que entra e o que sai da API, sem expor campos como a senha.',
    },
    {
      id: 'q11',
      tipo: 'multipla',
      enunciado: 'Um usuário logado tenta excluir um produto, mas o perfil dele não tem permissão. Qual status a API deve devolver?',
      opcoes: ['403 Forbidden', '401 Unauthorized', '404 Not Found', '400 Bad Request'],
      correta: 0,
      explicacao: 'Ele está autenticado (sabemos quem é), mas não está autorizado. Falha de autorização é 403. O 401 é pra quem não está autenticado.',
    },
    {
      id: 'q12',
      tipo: 'vf',
      enunciado: 'Autenticação verifica o que o usuário pode fazer no sistema.',
      correta: false,
      explicacao: 'Isso é autorização. Autenticação verifica quem o usuário é (identidade).',
    },
    {
      id: 'q13',
      tipo: 'multipla',
      enunciado: 'Quais são as três partes de um JWT?',
      opcoes: ['Header, payload e signature', 'Usuário, senha e token', 'Request, response e status', 'Chave, valor e expiração'],
      correta: 0,
      explicacao: 'O JWT tem o formato header.payload.signature, separados por ponto.',
    },
    {
      id: 'q14',
      tipo: 'vf',
      enunciado: 'O payload de um JWT é criptografado, então é seguro guardar a senha do usuário nele.',
      correta: false,
      explicacao: 'O payload é só codificado em Base64 e assinado. Qualquer um consegue ler. Nunca coloque senha no token.',
    },
    {
      id: 'q15',
      tipo: 'multipla',
      enunciado: 'Como o front-end normalmente envia o JWT pro back-end?',
      opcoes: [
        'No cabeçalho Authorization: Bearer token',
        'No corpo de toda requisição GET',
        'Como parâmetro na URL',
        'Dentro do pom.xml',
      ],
      correta: 0,
      explicacao: 'O padrão é o cabeçalho Authorization com o prefixo Bearer.',
    },
    {
      id: 'q16',
      tipo: 'vf',
      enunciado: 'A validação no front-end é suficiente, porque o usuário não consegue enviar dados sem passar por ela.',
      correta: false,
      explicacao: 'Dá pra burlar o front (DevTools, Postman, curl). A validação no back-end é obrigatória.',
    },
    {
      id: 'q17',
      tipo: 'multipla',
      enunciado: 'Qual anotação ativa a validação dos dados recebidos no parâmetro do controller?',
      opcoes: ['@Valid', '@Service', '@Entity', '@Transactional'],
      correta: 0,
      explicacao: '@Valid junto com @RequestBody faz o Spring checar as anotações do DTO (@NotBlank, @Email...). Se falhar, responde 400.',
    },
    {
      id: 'q18',
      tipo: 'multipla',
      enunciado: 'Qual anotação define a chave primária de uma entidade?',
      opcoes: ['@Id', '@Column', '@Table', '@JoinColumn'],
      correta: 0,
      explicacao: '@Id marca a chave primária. Normalmente vem junto com @GeneratedValue.',
    },
    {
      id: 'q19',
      tipo: 'multipla',
      enunciado: 'Muitos produtos pertencem a uma categoria. Qual anotação vai no atributo categoria da classe Produto?',
      opcoes: ['@ManyToOne', '@OneToMany', '@OneToOne', '@ManyToMany'],
      correta: 0,
      explicacao: 'Do ponto de vista do Produto: muitos produtos pra uma categoria, então @ManyToOne (com @JoinColumn).',
    },
    {
      id: 'q20',
      tipo: 'vf',
      enunciado: 'No Spring Boot 3, as anotações da JPA são importadas de jakarta.persistence.',
      correta: true,
      explicacao: 'A partir do Spring Boot 3 o pacote mudou de javax.persistence pra jakarta.persistence.',
    },
    {
      id: 'q21',
      tipo: 'multipla',
      enunciado: 'Como se declara corretamente um repository de Produto com id Long?',
      opcoes: [
        'interface ProdutoRepository extends JpaRepository<Produto, Long>',
        'class ProdutoRepository implements JpaRepository<Long, Produto>',
        'interface ProdutoRepository extends Produto<Long>',
        'class ProdutoRepository extends Repository',
      ],
      correta: 0,
      explicacao: 'O Repository é uma interface que estende JpaRepository<Entidade, TipoDoId>. O Spring gera a implementação.',
    },
    {
      id: 'q22',
      tipo: 'vf',
      enunciado: 'O método save() do JpaRepository serve tanto pra inserir quanto pra atualizar.',
      correta: true,
      explicacao: 'Sem id (ou com id inexistente) ele insere; com um id que já existe, ele atualiza.',
    },
    {
      id: 'q23',
      tipo: 'multipla',
      enunciado: 'Qual anotação marca a classe que concentra as regras de negócio?',
      opcoes: ['@Service', '@RestController', '@Repository', '@Entity'],
      correta: 0,
      explicacao: '@Service marca a camada de serviço, onde ficam a lógica e as regras de negócio.',
    },
    {
      id: 'q24',
      tipo: 'multipla',
      enunciado: 'O que o ResponseEntity permite controlar na resposta?',
      opcoes: ['Status, cabeçalhos e corpo', 'Só o corpo', 'Só a URL da requisição', 'A estrutura da tabela no banco'],
      correta: 0,
      explicacao: 'ResponseEntity representa a resposta HTTP inteira: status code, headers e body.',
    },
    {
      id: 'q25',
      tipo: 'vf',
      enunciado: '@RestController é a junção de @Controller com @ResponseBody.',
      correta: true,
      explicacao: 'Por isso os métodos de um @RestController já devolvem o objeto convertido em JSON.',
    },
    {
      id: 'q26',
      tipo: 'multipla',
      enunciado: 'Qual verbo HTTP é usado pra atualizar um recurso existente?',
      opcoes: ['PUT', 'GET', 'POST', 'DELETE'],
      correta: 0,
      explicacao: 'PUT atualiza (ex.: PUT /produtos/5). POST cria, GET busca, DELETE remove.',
    },
    {
      id: 'q27',
      tipo: 'vf',
      enunciado: 'A anotação @RequestBody converte o JSON do corpo da requisição em um objeto Java.',
      correta: true,
      explicacao: 'É usada principalmente em POST e PUT, onde os dados vêm no corpo.',
    },
    {
      id: 'q28',
      tipo: 'multipla',
      enunciado: 'Onde deve ser validada uma regra como "não permitir cadastrar e-mail repetido"?',
      opcoes: ['No Service', 'No Controller', 'No pom.xml', 'Só no front-end'],
      correta: 0,
      explicacao: 'É uma regra de negócio que depende do banco, então fica no Service (usando o Repository pra consultar).',
    },
  ],
}
