import { useState, useEffect, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import type { Job } from "../../types/job";
import styles from "./Admin.module.css";

interface EditJobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onJobUpdated: () => void;
}

export function EditJobModal({
  job,
  isOpen,
  onClose,
  onJobUpdated,
}: EditJobModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Facilities");
  const [location, setLocation] = useState("Itatiba - SP");
  const [salary, setSalary] = useState("");
  const [education, setEducation] = useState("");
  const [schedule, setSchedule] = useState("");
  const [activities, setActivities] = useState("");
  const [benefits, setBenefits] = useState("");
  const [requirements, setRequirements] = useState("");
  const [whatsappContact, setWhatsappContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (job) {
      setTitle(job.title || "");
      setCategory(job.category || "Facilities");
      setLocation(job.location || "Itatiba - SP");
      setSalary(String(job.salary || ""));
      setEducation(job.education || "");
      setSchedule(job.schedule || "");
      setActivities(job.activities || "");
      setBenefits(job.benefits?.join(", ") || "");
      setRequirements(job.requirements?.join(", ") || "");
      setWhatsappContact(job.whatsappContact || "");
    }
  }, [job]);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const numericSalary = parseFloat(salary.replace(",", "."));
    if (isNaN(numericSalary) || numericSalary <= 0) {
      setErrorMsg("Informe um salário válido.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from("jobs")
      .update({
        title: title.trim(),
        category,
        location,
        salary: numericSalary,
        education: education.trim(),
        schedule: schedule.trim(),
        activities: activities.trim(),
        benefits: benefits
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean),
        requirements: requirements
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
        whatsapp_contact: whatsappContact.trim().replace(/\D/g, ""),
      })
      .eq("id", job.id);

    if (error) {
      setErrorMsg(`Erro ao atualizar vaga: ${error.message}`);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    onJobUpdated();
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        zIndex: 1200,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              color: "var(--color-primary)",
              fontSize: "1.3rem",
              fontWeight: 800,
            }}
          >
            Editar Vaga
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.3rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {errorMsg && <p className={styles.errorText}>⚠️ {errorMsg}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Título do Cargo *</label>
            <input
              type="text"
              required
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className={styles.inputGroup}>
              <label className={styles.label}>Área de Atuação *</label>
              <select
                className={styles.input}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Facilities">Facilities</option>
                <option value="Segurança">Segurança</option>
                <option value="Portaria">Portaria</option>
                <option value="Administrativo">Administrativo</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Unidade / Cidade *</label>
              <select
                className={styles.input}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="Itatiba - SP">Itatiba - SP</option>
                <option value="Atibaia - SP">Atibaia - SP</option>
                <option value="Louveira - SP">Louveira - SP</option>
                <option value="Campinas - SP">Campinas - SP</option>
                <option value="Jundiaí - SP">Jundiaí - SP</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className={styles.inputGroup}>
              <label className={styles.label}>Salário Base (R$) *</label>
              <input
                type="text"
                required
                className={styles.input}
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Escala de Trabalho</label>
              <input
                type="text"
                className={styles.input}
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Escolaridade *</label>
            <input
              type="text"
              required
              className={styles.input}
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Descrição das Atividades *</label>
            <textarea
              required
              rows={3}
              className={styles.input}
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Benefícios (separados por vírgula)
            </label>
            <input
              type="text"
              className={styles.input}
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Requisitos (separados por vírgula)
            </label>
            <input
              type="text"
              className={styles.input}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              WhatsApp para Candidatura (com DDD)
            </label>
            <input
              type="text"
              required
              className={styles.input}
              value={whatsappContact}
              onChange={(e) => setWhatsappContact(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? "Salvando alterações..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}
