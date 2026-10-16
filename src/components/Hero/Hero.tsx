import styles from "./Hero.module.css";
import { siteImages } from "../../config/images";
import { Icon } from "../Icon/Icon";

const highlights = [
  { value: "40+", label: "anos de mercado" },
  { value: "5", label: "unidades na região" },
  { value: "4", label: "áreas de atuação" },
];

export function Hero() {
  return (
    <section className={styles.hero}>
      {siteImages.hero && (
        <div
          className={styles.backgroundImage}
          style={{ backgroundImage: `url(${siteImages.hero})` }}
          aria-hidden="true"
        />
      )}
      <div className={styles.pattern} aria-hidden="true" />

      <div className={styles.container}>
        <span className={styles.tagline}>Trabalhe Conosco</span>
        <h1 className={styles.title}>
          Construa sua trajetória no{" "}
          <span className={styles.titleHighlight}>Grupo Carrantos</span>
        </h1>
        <p className={styles.description}>
          Mais de 40 anos de excelência em Segurança e Facilities. Encontre a
          oportunidade ideal nas nossas unidades de Itatiba, Louveira, Atibaia,
          Campinas e Jundiaí.
        </p>

        <div className={styles.actions}>
          <a href="#vagas" className={styles.primaryAction}>
            Ver vagas abertas
            <Icon name="arrowRight" size={18} />
          </a>
          <a href="#banco-talentos" className={styles.secondaryAction}>
            Banco de Talentos
          </a>
        </div>

        <dl className={styles.highlights}>
          {highlights.map((item) => (
            <div key={item.label} className={styles.highlightItem}>
              <dt className={styles.highlightValue}>{item.value}</dt>
              <dd className={styles.highlightLabel}>{item.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
