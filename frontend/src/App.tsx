import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import "./App.css";

type Person = {
  personId: number;
  personName: string;
  personAge: number;
};

type Transaction = {
  transactionId: number;
  transactionDescription: string;
  transactionValue: number;
  transactionType: number;
  personId: number;
};

type PersonTotal = {
  personId: number;
  personName: string;
  personAge: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
};

type TotalsResponse = {
  people: PersonTotal[];
  generalTotals: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
};

type Page = "people" | "transactions" | "totals";

const API_URL = "http://localhost:5171/api";

function App() {
  const [page, setPage] = useState<Page>("people");

  const [people, setPeople] = useState<Person[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState<TotalsResponse | null>(null);

  const [personName, setPersonName] = useState("");
  const [personAge, setPersonAge] = useState("");

  const [transactionDescription, setTransactionDescription] = useState("");
  const [transactionValue, setTransactionValue] = useState("");
  const [transactionType, setTransactionType] = useState("1");
  const [transactionPersonId, setTransactionPersonId] = useState("");

  const [personError, setPersonError] = useState("");
  const [transactionError, setTransactionError] = useState("");
  const [totalsError, setTotalsError] = useState("");

  function getErrorMessage(error: unknown) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;

      if (typeof data === "string") {
        return data;
      }

      if (data?.title) {
        return data.title;
      }

      return error.message;
    }

    return "Erro inesperado.";
  }

  async function loadPeople() {
    const response = await axios.get<Person[]>(`${API_URL}/PersonApi`);
    setPeople(response.data);
  }

  async function loadTransactions() {
    const response = await axios.get<Transaction[]>(`${API_URL}/TransactionApi`);
    setTransactions(response.data);
  }

  async function loadTotals() {
    const response = await axios.get<TotalsResponse>(`${API_URL}/TotalsApi`);
    setTotals(response.data);
  }

  async function loadAllData() {
    try {
      await loadPeople();
      await loadTransactions();
      await loadTotals();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }

  useEffect(() => {
    loadAllData();
  }, []);

  async function addPerson(event: FormEvent) {
    event.preventDefault();
    setPersonError("");

    try {
      await axios.post(`${API_URL}/PersonApi`, {
        personName,
        personAge: Number(personAge),
      });

      setPersonName("");
      setPersonAge("");

      await loadAllData();
    } catch (error) {
      setPersonError(getErrorMessage(error));
    }
  }

  async function deletePerson(personId: number) {
    setPersonError("");

    try {
      await axios.delete(`${API_URL}/PersonApi/${personId}`);
      await loadAllData();
    } catch (error) {
      setPersonError(getErrorMessage(error));
    }
  }

  async function addTransaction(event: FormEvent) {
    event.preventDefault();
    setTransactionError("");

    if (!transactionPersonId) {
      setTransactionError("Selecione uma pessoa.");
      return;
    }

    try {
      await axios.post(`${API_URL}/TransactionApi`, {
        transactionDescription,
        transactionValue: Number(transactionValue),
        transactionType: Number(transactionType),
        personId: Number(transactionPersonId),
      });

      setTransactionDescription("");
      setTransactionValue("");
      setTransactionType("1");
      setTransactionPersonId("");

      await loadAllData();
    } catch (error) {
      setTransactionError(getErrorMessage(error));
    }
  }

  async function refreshTotals() {
    setTotalsError("");

    try {
      await loadTotals();
    } catch (error) {
      setTotalsError(getErrorMessage(error));
    }
  }

  function getTransactionTypeName(type: number) {
    return type === 1 ? "Despesa" : "Receita";
  }

  function getPersonName(personId: number) {
    const person = people.find((p) => p.personId === personId);
    return person ? person.personName : `Pessoa ${personId}`;
  }

return (
  <main className="app">
    <header className="app-header">
      <div>
        <h1>Controle de Gastos</h1>
      </div>
    </header>

    <nav className="tabs">
      <button
        className={page === "people" ? "tab active" : "tab"}
        onClick={() => setPage("people")}
      >
        Pessoas
      </button>

      <button
        className={page === "transactions" ? "tab active" : "tab"}
        onClick={() => setPage("transactions")}
      >
        Transações
      </button>

      <button
        className={page === "totals" ? "tab active" : "tab"}
        onClick={() => setPage("totals")}
      >
        Totais
      </button>
    </nav>

    {page === "people" && (
      <section className="page-grid">
        <div className="card">
          <div className="card-header">
            <h2>Cadastrar pessoa</h2>
            <p>Informe o nome e a idade do morador.</p>
          </div>

          <form className="form" onSubmit={addPerson}>
            <div className="field">
              <label>Nome</label>
              <input
                type="text"
                value={personName}
                onChange={(event) => setPersonName(event.target.value)}
                placeholder="Ex: Arthur"
              />
            </div>

            <div className="field">
              <label>Idade</label>
              <input
                type="number"
                value={personAge}
                onChange={(event) => setPersonAge(event.target.value)}
                placeholder="Ex: 20"
              />
            </div>

            <button className="primary-button" type="submit">
              Cadastrar pessoa
            </button>
          </form>

          {personError && <p className="error-message">{personError}</p>}
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Pessoas cadastradas</h2>
            <p>Lista de moradores registrados no sistema.</p>
          </div>

          {people.length === 0 ? (
            <p className="empty-state">Nenhuma pessoa cadastrada.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Idade</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {people.map((person) => (
                    <tr key={person.personId}>
                      <td>{person.personId}</td>
                      <td>{person.personName}</td>
                      <td>{person.personAge}</td>
                      <td>
                        <button
                          className="danger-button"
                          onClick={() => deletePerson(person.personId)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    )}

    {page === "transactions" && (
      <section className="page-grid">
        <div className="card">
          <div className="card-header">
            <h2>Cadastrar transação</h2>
            <p>Registre uma receita ou despesa para uma pessoa existente.</p>
          </div>

          <form className="form" onSubmit={addTransaction}>
            <div className="field">
              <label>Descrição</label>
              <input
                type="text"
                value={transactionDescription}
                onChange={(event) =>
                  setTransactionDescription(event.target.value)
                }
                placeholder="Ex: Mercado"
              />
            </div>

            <div className="field">
              <label>Valor</label>
              <input
                type="number"
                value={transactionValue}
                onChange={(event) => setTransactionValue(event.target.value)}
                placeholder="Ex: 50"
              />
            </div>

            <div className="field">
              <label>Tipo</label>
              <select
                value={transactionType}
                onChange={(event) => setTransactionType(event.target.value)}
              >
                <option value="1">Despesa</option>
                <option value="2">Receita</option>
              </select>
            </div>

            <div className="field">
              <label>Pessoa</label>
              <select
                value={transactionPersonId}
                onChange={(event) =>
                  setTransactionPersonId(event.target.value)
                }
              >
                <option value="">Selecione uma pessoa</option>

                {people.map((person) => (
                  <option key={person.personId} value={person.personId}>
                    {person.personName}
                  </option>
                ))}
              </select>
            </div>

            <button className="primary-button" type="submit">
              Cadastrar transação
            </button>
          </form>

          {transactionError && (
            <p className="error-message">{transactionError}</p>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Transações cadastradas</h2>
            <p>Histórico de receitas e despesas registradas.</p>
          </div>

          {transactions.length === 0 ? (
            <p className="empty-state">Nenhuma transação cadastrada.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Tipo</th>
                    <th>Pessoa</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.transactionId}>
                      <td>{transaction.transactionId}</td>
                      <td>{transaction.transactionDescription}</td>
                      <td>R$ {transaction.transactionValue.toFixed(2)}</td>
                      <td>
                        <span
                          className={
                            transaction.transactionType === 1
                              ? "badge expense"
                              : "badge income"
                          }
                        >
                          {getTransactionTypeName(transaction.transactionType)}
                        </span>
                      </td>
                      <td>{getPersonName(transaction.personId)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    )}

    {page === "totals" && (
      <section className="page-column">
        <div className="card">
          <div className="card-header row">
            <div>
              <h2>Totais</h2>
              <p>Resumo financeiro por pessoa e total geral da residência.</p>
            </div>

            <button className="secondary-button" onClick={refreshTotals}>
              Atualizar
            </button>
          </div>

          {totalsError && <p className="error-message">{totalsError}</p>}

          {!totals ? (
            <p className="empty-state">Carregando totais...</p>
          ) : (
            <>
              {totals.people.length === 0 ? (
                <p className="empty-state">Nenhuma pessoa cadastrada.</p>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Pessoa</th>
                        <th>Idade</th>
                        <th>Receitas</th>
                        <th>Despesas</th>
                        <th>Saldo</th>
                      </tr>
                    </thead>

                    <tbody>
                      {totals.people.map((person) => (
                        <tr key={person.personId}>
                          <td>{person.personId}</td>
                          <td>{person.personName}</td>
                          <td>{person.personAge}</td>
                          <td>R$ {person.totalIncome.toFixed(2)}</td>
                          <td>R$ {person.totalExpenses.toFixed(2)}</td>
                          <td>R$ {person.balance.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {totals && (
          <div className="summary-grid">
            <div className="summary-card">
              <span>Receitas totais</span>
              <strong>R$ {totals.generalTotals.totalIncome.toFixed(2)}</strong>
            </div>

            <div className="summary-card">
              <span>Despesas totais</span>
              <strong>R$ {totals.generalTotals.totalExpenses.toFixed(2)}</strong>
            </div>

            <div className="summary-card">
              <span>Saldo líquido</span>
              <strong>R$ {totals.generalTotals.balance.toFixed(2)}</strong>
            </div>
          </div>
        )}
      </section>
    )}
  </main>
);
}
export default App;