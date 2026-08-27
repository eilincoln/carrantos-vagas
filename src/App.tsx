import { Header } from "./components/Header/Header";
import { Hero } from "./components/Hero/Hero";
import { mockJobs } from "./data/jobsData";

function App() {
  return (
    <div>
      {/* Componentes estruturais do topo */}
      <Header />
      <Hero />

      {/* Conteúdo principal com a listagem de vagas */}
      <main
        style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}
      >
        <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
          Vagas disponíveis: <strong>{mockJobs.length}</strong>
        </p>

        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {mockJobs.map((job) => (
            <li
              key={job.id}
              style={{
                background: "var(--color-surface)",
                padding: "1.5rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
              }}
            >
              <h2
                style={{ fontSize: "1.25rem", color: "var(--color-primary)" }}
              >
                {job.title}
              </h2>
              <p style={{ color: "var(--color-text-muted)" }}>
                {job.location} | {job.category}
              </p>
              <p style={{ marginTop: "0.5rem" }}>
                <strong>Salário:</strong> R$ {job.salary.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
