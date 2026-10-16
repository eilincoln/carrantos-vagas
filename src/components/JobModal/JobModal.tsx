import { useEffect } from "react";
import type { Job } from "../../types/job";
import styles from "./JobModal.module.css";
import { Icon } from "../Icon/Icon";

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
      aria-labelledby="job-modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.badges}>
              <span className={styles.badgeCategory}>{job.category}</span>
              <span className={styles.badgeLocation}>
                <Icon name="mapPin" size={13} />
                {job.location}
              </span>
            </div>
            <h2 id="job-modal-title" className={styles.title}>
              {job.title}
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.summary}>
            <div className={styles.salaryBox}>
              <span className={styles.summaryLabel}>Salário base</span>
              <span className={styles.salaryValue}>{formattedSalary}</span>
            </div>
            <div className={styles.factBox}>
              <span className={styles.summaryLabel}>
                <Icon name="graduation" size={14} /> Escolaridade
              </span>
              <span className={styles.factValue}>{job.education}</span>
            </div>
            {job.schedule && (
              <div className={styles.factBox}>
                <span className={styles.summaryLabel}>
                  <Icon name="calendar" size={14} /> Escala
                </span>
                <span className={styles.factValue}>{job.schedule}</span>
              </div>
            )}
          </div>

          <section>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>
                <Icon name="fileText" size={16} />
              </span>
              Descrição das atividades
            </h3>
            <p className={styles.description}>{job.activities}</p>
          </section>

          {job.requirements && job.requirements.length > 0 && (
            <section>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>
                  <Icon name="clipboard" size={16} />
                </span>
                Requisitos
              </h3>
              <ul className={styles.list}>
                {job.requirements.map((req, index) => (
                  <li key={index} className={styles.listItem}>
                    <Icon name="check" size={16} className={styles.checkIcon} />
                    {req}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.benefits.length > 0 && (
            <section>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>
                  <Icon name="gift" size={16} />
                </span>
                Benefícios
              </h3>
              <ul className={styles.benefits}>
                {job.benefits.map((benefit, index) => (
                  <li key={index} className={styles.benefitChip}>
                    <Icon name="check" size={14} className={styles.checkIcon} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className={styles.footer}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnWhatsapp}
          >
            <Icon name="messageCircle" size={18} />
            <span>Candidatar via WhatsApp</span>
          </a>
          <button
            type="button"
            className={styles.btnForm}
            onClick={() => onApply(job)}
          >
            <Icon name="fileText" size={18} />
            <span>Preencher Formulário</span>
          </button>
        </div>
      </div>
    </div>
  );
}
