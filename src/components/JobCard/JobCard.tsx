import { useEffect, useRef, useState } from "react";
import type { Job } from "../../types/job";
import styles from "./JobCard.module.css";
import { Icon } from "../Icon/Icon";

interface JobCardProps {
  job: Job;
  onSelectJob: (job: Job) => void;
}

export function JobCard({ job, onSelectJob }: JobCardProps) {
  const activitiesRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  // Só mostra "Ver mais" quando o texto realmente passa de 3 linhas
  useEffect(() => {
    const element = activitiesRef.current;
    if (!element) return;

    const checkTruncation = () => {
      if (isExpanded) return;
      setIsTruncated(element.scrollHeight > element.clientHeight + 1);
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [job.activities, isExpanded]);

  const formattedSalary = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(job.salary);

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.badges}>
          <span className={styles.badgeCategory}>{job.category}</span>
          <span className={styles.badgeLocation}>
            <Icon name="mapPin" size={13} />
            {job.location}
          </span>
        </div>
        <h3 className={styles.title}>{job.title}</h3>
        <p
          ref={activitiesRef}
          className={`${styles.activities} ${isExpanded ? "" : styles.activitiesClamped}`}
        >
          {job.activities}
        </p>
        {(isTruncated || isExpanded) && (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setIsExpanded((current) => !current)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Ver menos" : "Ver mais"}
          </button>
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <Icon name="graduation" size={16} className={styles.detailIcon} />
          <span>Escolaridade:</span>
          <strong>{job.education}</strong>
        </div>
        {job.schedule && (
          <div className={styles.detailItem}>
            <Icon name="calendar" size={16} className={styles.detailIcon} />
            <span>Escala:</span>
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
          <Icon name="arrowRight" size={16} className={styles.viewButtonIcon} />
        </button>
      </div>
    </article>
  );
}
