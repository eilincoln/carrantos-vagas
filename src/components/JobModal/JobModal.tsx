import { useEffect } from "react";
import type { Job } from "../../types/job";
import styles from "./JobModal.module.css";

interface JobModalProps {
  job: Job | null;
  onClose: () => void;
  onApply: (job: Job) => void;
}

export function JobModal({ job, onClose, onApply }: JobModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!job) return null;

  const formattedSalary = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(job.salary);

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse na vaga de *${job.title}* (${job.location}) anunciada no portal de vagas da Carrantos. Segue meu currículo para avaliação.`,
  );
  const whatsappUrl = `https://wa.me/${job.whatsappContact}?text=${whatsappMessage}`;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--color-secondary)",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {job.category} • {job.location}
            </span>
            <h2
              style={{
                color: "var(--color-primary)",
                fontSize: "1.4rem",
                marginTop: "0.25rem",
              }}
            >
              {job.title}
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <div>
            <h3 className={styles.sectionTitle}>📝 Descrição das Atividades</h3>
            <p style={{ color: "var(--color-text-main)", lineHeight: 1.6 }}>
              {job.activities}
            </p>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>🎓 Requisitos & Formação</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <strong>Escolaridade:</strong> {job.education}
              </li>
              {job.schedule && (
                <li className={styles.listItem}>
                  <strong>Escala:</strong> {job.schedule}
                </li>
              )}
              {job.requirements?.map((req, index) => (
                <li key={index} className={styles.listItem}>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>💰 Remuneração & Benefícios</h3>
            <p
              style={{
                marginBottom: "0.5rem",
                color: "var(--color-text-main)",
              }}
            >
              <strong>Salário Base:</strong> {formattedSalary}
            </p>
            <ul className={styles.list}>
              {job.benefits.map((benefit, index) => (
                <li key={index} className={styles.listItem}>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.footer}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnWhatsapp}
          >
            <span>💬 Candidatar via WhatsApp</span>
          </a>
          <button
            type="button"
            className={styles.btnForm}
            onClick={() => onApply(job)}
          >
            <span>📋 Preencher Formulário</span>
          </button>
        </div>
      </div>
    </div>
  );
}
