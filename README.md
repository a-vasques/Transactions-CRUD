# Transactions CRUD

Sistema de controle de gastos desenvolvido com **.NET/C#** no back-end e **React com TypeScript** no front-end.

O projeto permite cadastrar pessoas, registrar transações financeiras e consultar os totais de receitas, despesas e saldo por pessoa e da residência como um todo.

## Funcionalidades

### Pessoas

- Cadastro de pessoas.
- Listagem de pessoas cadastradas.
- Exclusão de pessoas.
- Ao excluir uma pessoa, todas as transações vinculadas a ela também são removidas.

Cada pessoa possui:

- Identificador gerado automaticamente.
- Nome.
- Idade.

### Transações

- Cadastro de transações.
- Listagem de transações cadastradas.
- Cada transação pertence a uma pessoa já existente no banco de dados.
- Pessoas menores de 18 anos só podem cadastrar transações do tipo despesa.

Cada transação possui:

- Identificador gerado automaticamente.
- Descrição.
- Valor.
- Tipo: despesa ou receita.
- Identificador da pessoa vinculada.

### Totais

A aplicação exibe:

- Total de receitas por pessoa.
- Total de despesas por pessoa.
- Saldo por pessoa.
- Total geral de receitas.
- Total geral de despesas.
- Saldo líquido geral.

## Tecnologias utilizadas

### Back-end

- .NET
- C#
- ASP.NET Core Web API
- Entity Framework Core
- MySQL
- Pomelo.EntityFrameworkCore.MySql
- Swagger

### Front-end

- React
- TypeScript
- Vite
- Axios
- CSS

## Estrutura geral do projeto

```text
TransactionsCRUDv2
│
├── Controllers
│   ├── PersonApiController.cs
│   ├── TransactionApiController.cs
│   └── TotalsApiController.cs
│
├── Data
│   └── AppDbContext.cs
│
├── DTOs
│   ├── CreatePersonDto.cs
│   └── CreateTransactionDto.cs
│
├── Models
│   ├── Person.cs
│   └── Transaction.cs
│
├── Migrations
│
├── frontend
│   ├── src
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   └── package.json
│
├── Program.cs
├── appsettings.json
└── TransactionsCRUDv2.csproj
```

## Regras de negócio implementadas

### Pessoa obrigatória para transação

Uma transação só pode ser cadastrada se o `PersonId` informado existir no cadastro de pessoas.

### Restrição para menores de idade

Caso a pessoa vinculada à transação seja menor de 18 anos, apenas transações do tipo despesa podem ser cadastradas.

### Exclusão em cascata

Quando uma pessoa é removida, suas transações também são removidas, mantendo a consistência dos dados.

### Cálculo de totais

A consulta de totais considera todas as transações cadastradas e calcula receitas, despesas e saldo individualmente para cada pessoa, além dos totais gerais da residência.

## Como rodar o projeto

### Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- .NET SDK
- Node.js
- MySQL Server
- MySQL Workbench ou outro cliente MySQL
- Git

## Configuração do banco de dados

No arquivo `appsettings.json`, configure a connection string de acordo com seu ambiente local:

```json
{
  "ConnectionStrings": {
    "AppDbConnectionString": "server=localhost;database=TransactionsCRUD;user=root;password=SUA_SENHA;"
  }
}
```

Substitua `SUA_SENHA` pela senha do seu usuário MySQL.

## Rodando o back-end

Na raiz do projeto, execute:

```bash
dotnet restore
```

Depois, aplique as migrations no banco:

```bash
dotnet ef database update
```

Em seguida, inicie a API:

```bash
dotnet run
```

A API será iniciada em uma porta local. Exemplo:

```text
http://localhost:5171
```

O Swagger pode ser acessado em:

```text
http://localhost:5171/swagger
```

## Rodando o front-end

Entre na pasta do front-end:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o projeto React:

```bash
npm run dev
```

Caso esteja usando PowerShell no Windows e o `npm` seja bloqueado por política de execução, use:

```bash
npm.cmd run dev
```

O front-end será iniciado em:

```text
http://localhost:5173
```

## Endpoints principais

### Pessoas

#### Listar pessoas

```http
GET /api/PersonApi
```

#### Cadastrar pessoa

```http
POST /api/PersonApi
```

Exemplo de corpo da requisição:

```json
{
  "personName": "Arthur",
  "personAge": 20
}
```

#### Deletar pessoa

```http
DELETE /api/PersonApi/{id}
```

Ao deletar uma pessoa, suas transações também são excluídas.

## Transações

### Listar transações

```http
GET /api/TransactionApi
```

### Cadastrar transação

```http
POST /api/TransactionApi
```

Exemplo de corpo da requisição:

```json
{
  "transactionDescription": "Mercado",
  "transactionValue": 50,
  "transactionType": 1,
  "personId": 1
}
```

Tipos de transação:

```text
1 = Despesa
2 = Receita
```

A pessoa informada em `personId` precisa existir no banco de dados.

## Totais

### Consultar totais

```http
GET /api/TotalsApi
```

Esse endpoint retorna os totais de receitas, despesas e saldo por pessoa, além dos totais gerais.

Exemplo de resposta:

```json
{
  "people": [
    {
      "personId": 1,
      "personName": "Arthur",
      "personAge": 20,
      "totalIncome": 1000,
      "totalExpenses": 250,
      "balance": 750
    }
  ],
  "generalTotals": {
    "totalIncome": 1000,
    "totalExpenses": 250,
    "balance": 750
  }
}
```

## Observações sobre a implementação

O projeto utiliza DTOs para controlar os dados recebidos pela API nos cadastros. Dessa forma, a aplicação evita que campos gerados automaticamente ou objetos de relacionamento sejam enviados indevidamente pelo front-end.

As entidades `Person` e `Transaction` representam as tabelas do banco de dados, enquanto os DTOs representam apenas os dados necessários para as operações de criação.

A persistência dos dados é feita em banco MySQL por meio do Entity Framework Core.

## Status do projeto

Funcionalidades implementadas:

- Cadastro de pessoas.
- Listagem de pessoas.
- Exclusão de pessoas.
- Exclusão automática das transações da pessoa removida.
- Cadastro de transações.
- Listagem de transações.
- Validação de pessoa existente para transações.
- Bloqueio de receitas para menores de idade.
- Consulta de totais por pessoa.
- Consulta de totais gerais.
- Interface em React com TypeScript.
- Integração entre front-end e back-end.