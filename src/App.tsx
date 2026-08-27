import { mockJobs } from "./data/jobsData";

function App() {
  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "var(--color-primary)" }}>
        Portal de Vagas — Grupo Carrantos
      </h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        Total de vagas ativas no sistema: <strong>{mockJobs.length}</strong>
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
            <h2 style={{ fontSize: "1.25rem", color: "var(--color-primary)" }}>
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
  );
}

export default App;
