import { useState } from "react";
import { Header } from "./components/Header/Header";
import { Hero } from "./components/Hero/Hero";
import { JobFilters } from "./components/JobFilters/JobFilters";
import { mockJobs } from "./data/jobsData";

function App() {
  // Estados para gerenciar as escolhas do usuário
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Lógica de filtragem dinâmica derivada dos estados
  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation
      ? job.location === selectedLocation
      : true;
    const matchesCategory = selectedCategory
      ? job.category === selectedCategory
      : true;

    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div>
      <Header />
      <Hero />

      <main
        style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}
      >
        {/* Barra de Filtros */}
        <JobFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Contador e Status */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
            Vagas encontradas: <strong>{filteredJobs.length}</strong>
          </p>
        </div>

        {/* Lista de Vagas Filtradas */}
        {filteredJobs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              background: "var(--color-surface)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p style={{ color: "var(--color-text-muted)" }}>
              Nenhuma vaga encontrada para os filtros selecionados.
            </p>
          </div>
        ) : (
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {filteredJobs.map((job) => (
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
                  {job.location} • {job.category}
                </p>
                <p style={{ marginTop: "0.5rem" }}>
                  <strong>Salário:</strong> R$ {job.salary.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default App;
