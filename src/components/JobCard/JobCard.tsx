import type { Job } from "../../types/job";
import styles from "./JobCard.module.css";

interface JobCardProps {
  job: Job;
  onSelectJob: (job: Job) => void;
}

export function JobCard({ job, onSelectJob }: JobCardProps) {
  const formattedSalary = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(job.salary);

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.badges}>
          <span className={styles.badgeCategory}>{job.category}</span>
          <span className={styles.badgeLocation}>📍 {job.location}</span>
        </div>
        <h2 className={styles.title}>{job.title}</h2>
        <p className={styles.activities}>{job.activities}</p>
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span>🎓 Escolaridade:</span>
          <strong>{job.education}</strong>
        </div>
        {job.schedule && (
          <div className={styles.detailItem}>
            <span>📅 Escala:</span>
            <strong>{job.schedule}</strong>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.salaryBlock}>
          <span className={styles.salaryLabel}>Salário Base</span>
          <span className={styles.salaryValue}>{formattedSalary}</span>
        </div>

        <button
          type="button"
          className={styles.viewButton}
          onClick={() => onSelectJob(job)}
        >
          Ver Vaga
        </button>
      </div>
    </article>
  );
}
