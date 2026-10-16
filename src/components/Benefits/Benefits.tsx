import styles from "./Benefits.module.css";
import { Icon, type IconName } from "../Icon/Icon";

export function Benefits() {
  const benefits: { icon: IconName; title: string }[] = [
    { icon: "bus", title: "Vale Transporte" },
    { icon: "cart", title: "Vale Alimentação" },
    { icon: "utensils", title: "Vale Refeição" },
    { icon: "heart", title: "Seguro de Vida" },
    { icon: "award", title: "Prêmio Assiduidade" },
  ];

  return (
    <section
      id="beneficios"
      className={styles.section}
      aria-labelledby="benefits-title"
    >
      <div className={styles.header}>
        <span className={styles.eyebrow}>Benefícios</span>
        <h2 id="benefits-title" className={styles.title}>
          Cuidamos de quem faz parte do time
        </h2>
      </div>

      <ul className={styles.grid}>
        {benefits.map((benefit) => (
          <li key={benefit.title} className={styles.item}>
            <span className={styles.icon}>
              <Icon name={benefit.icon} size={24} />
            </span>
            <span className={styles.itemTitle}>{benefit.title}</span>
          </li>
        ))}
      </ul>

      <p className={styles.note}>
        * Os benefícios podem variar conforme a vaga e a unidade. Confira os
        detalhes em cada oportunidade.
      </p>
    </section>
  );
}
