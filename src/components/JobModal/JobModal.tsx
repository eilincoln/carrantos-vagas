import { useEffect, useState } from "react";
import type { Job } from "../../types/job";
import { getJobCode } from "../../utils/formatters";
import styles from "./JobModal.module.css";

interface JobModalProps {
  job: Job | null;
  onClose: () => void;
  onApply: (job: Job) => void;
}

export function JobModal({ job, onClose, onApply }: JobModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!job) return null;

  const jobCode = getJobCode(job.id, job.location);

  const formattedSalary = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(job.salary);

  const shareUrl = `${window.location.origin}/?vaga=${job.id}`;

  const handleShare = async () => {
    const shareData = {
      title: `Vaga: ${job.title} - Carrantos`,
      text: `Confira esta oportunidade de ${job.title} (${jobCode}) na Carrantos:`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Usuário cancelou o compartilhamento nativo
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse na vaga de *${job.title}* (${jobCode} - ${job.location}) anunciada no portal de vagas da Carrantos. Segue meu currículo para avaliação.`,
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
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.25rem" }}>
              <span
                style={{
                  backgroundColor: "#1e293b",
                  color: "#f8fafc",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  padding: "0.15rem 0.45rem",
                  borderRadius: "4px",
                }}
              >
                {jobCode}
              </span>
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
            </div>
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
          {/* Seção de Compartilhamento */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#f1f5f9",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "#475569", fontWeight: 500 }}>
              📢 Conhece alguém para esta vaga?
            </span>
            <button
              type="button"
              onClick={handleShare}
              style={{
                background: copied ? "#16a34a" : "#0f172a",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.4rem 0.85rem",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {copied ? "✓ Link Copiado!" : "Compartilhar Vaga"}
            </button>
          </div>

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