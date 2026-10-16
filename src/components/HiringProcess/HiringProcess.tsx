import styles from "./HiringProcess.module.css";
import { Icon, type IconName } from "../Icon/Icon";

export function HiringProcess() {
  const steps: { icon: IconName; title: string; description: string }[] = [
    {
      icon: "search",
      title: "Encontre sua vaga",
      description:
        "Use os filtros para achar oportunidades na sua cidade e área de atuação.",
    },
    {
      icon: "fileText",
      title: "Envie sua candidatura",
      description:
        "Candidate-se pelo WhatsApp ou pelo formulário, anexando seu currículo em PDF.",
    },
    {
      icon: "users",
      title: "Triagem do RH",
      description:
        "Nossa equipe de Recursos Humanos analisa seu perfil com atenção.",
    },
    {
      icon: "messageCircle",
      title: "Entrevista",
      description:
        "Se o seu perfil for compatível, entramos em contato para agendar uma conversa.",
    },
    {
      icon: "checkCircle",
      title: "Contratação",
      description:
        "Aprovado, você recebe todas as orientações para começar na Carrantos.",
    },
  ];

  return (
    <section
      id="processo"
      className={styles.section}
      aria-labelledby="process-title"
    >
      <div className={styles.header}>
        <span className={styles.eyebrow}>Passo a passo</span>
        <h2 id="process-title" className={styles.title}>
          Como funciona o processo seletivo
        </h2>
        <p className={styles.subtitle}>
          Um processo simples e transparente, do envio do currículo até o seu
          primeiro dia.
        </p>
      </div>

      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li key={step.title} className={styles.step}>
            <div className={styles.stepMarker}>
              <span className={styles.stepIcon}>
                <Icon name={step.icon} size={22} />
              </span>
              <span className={styles.stepNumber}>{index + 1}</span>
            </div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
