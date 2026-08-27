import type { JobCategory, JobLocation } from "../../types/job";
import styles from "./JobFilters.module.css";

interface JobFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export function JobFilters({
  searchTerm,
  onSearchChange,
  selectedLocation,
  onLocationChange,
  selectedCategory,
  onCategoryChange,
}: JobFiltersProps) {
  const locations: JobLocation[] = [
    "Itatiba - SP",
    "Louveira - SP",
    "Atibaia - SP",
    "Campinas - SP",
    "Jundiaí - SP",
  ];

  const categories: JobCategory[] = [
    "Facilities",
    "Segurança",
    "Portaria",
    "Administrativo",
  ];

  return (
    <div className={styles.filterContainer}>
      {/* Campo de Busca por Cargo */}
      <div className={styles.inputGroup}>
        <label htmlFor="search-input" className={styles.label}>
          Buscar por cargo
        </label>
        <input
          id="search-input"
          type="text"
          placeholder="Ex: Vigia, Serviços Gerais..."
          className={styles.input}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Select de Cidade / Unidade */}
      <div className={styles.inputGroup}>
        <label htmlFor="location-select" className={styles.label}>
          Unidade / Cidade
        </label>
        <select
          id="location-select"
          className={styles.select}
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
        >
          <option value="">Todas as Cidades</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Select de Área / Categoria */}
      <div className={styles.inputGroup}>
        <label htmlFor="category-select" className={styles.label}>
          Área de Atuação
        </label>
        <select
          id="category-select"
          className={styles.select}
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Todas as Áreas</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
