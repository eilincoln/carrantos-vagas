import styles from "./CompanyCulture.module.css";
import { Icon, type IconName } from "../Icon/Icon";

export function CompanyCulture() {
  const pillars: { icon: IconName; title: string; description: string }[] = [
    {
      icon: "shield",
      title: "Mais de 40 Anos de Solidez",
      description:
        "Atuação consolidada no mercado desde 1985 em Segurança e Facilities, oferecendo estabilidade profissional e compromisso com nossos colaboradores.",
    },
    {
      icon: "trendingUp",
      title: "Treinamento e Supervisão",
      description:
        "Processos padronizados e certificados, com acompanhamento técnico contínuo para você evoluir em sua carreira operacional.",
    },
    {
      icon: "users",
      title: "Respeito e Pontualidade",
      description:
        "Compromisso rigoroso com remuneração, benefícios em dia e um ambiente de trabalho pautado na transparência e valorização humana.",
    },
  ];

  return (
    <section
      id="cultura"
      className={styles.section}
      aria-labelledby="culture-title"
    >
      <div className={styles.header}>
        <span className={styles.eyebrow}>Nossa Cultura</span>
        <h2 id="culture-title" className={styles.title}>
          Por que fazer parte da Carrantos?
        </h2>
        <p className={styles.subtitle}>
          Construa seu futuro em uma das empresas mais respeitadas de Segurança
          e Facilities do interior paulista.
        </p>
      </div>

      <div className={styles.grid}>
        {pillars.map((pillar, index) => (
          <article key={index} className={styles.card}>
            <span className={styles.icon}>
              <Icon name={pillar.icon} size={24} />
            </span>
            <h3 className={styles.cardTitle}>{pillar.title}</h3>
            <p className={styles.cardDescription}>{pillar.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
