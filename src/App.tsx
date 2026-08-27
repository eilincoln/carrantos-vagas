import { useState } from "react";
import { Header } from "./components/Header/Header";
import { Hero } from "./components/Hero/Hero";
import { JobFilters } from "./components/JobFilters/JobFilters";
import { JobCard } from "./components/JobCard/JobCard";
import { mockJobs } from "./data/jobsData";
import type { Job } from "./types/job";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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

  const handleSelectJob = (job: Job) => {
    console.log("Vaga selecionada para modal:", job);
  };

  return (
    <div>
      <Header />
      <Hero />

      <main
        style={{
          maxWidth: "1200px",
          margin: "2.5rem auto",
          padding: "0 1.5rem",
        }}
      >
        <JobFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
            Vagas encontradas: <strong>{filteredJobs.length}</strong>
          </p>
        </div>

        {filteredJobs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 1.5rem",
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
            }}
          >
            <h3
              style={{ color: "var(--color-primary)", marginBottom: "0.5rem" }}
            >
              Nenhuma vaga encontrada
            </h3>
            <p style={{ color: "var(--color-text-muted)" }}>
              Tente alterar os termos da busca ou limpar os filtros de cidade e
              área.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onSelectJob={handleSelectJob} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
