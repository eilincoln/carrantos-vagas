import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <span className={styles.tagline}>Trabalhe Conosco</span>
        <h1 className={styles.title}>
          Construa sua trajetória no Grupo Carrantos
        </h1>
        <p className={styles.description}>
          Mais de 40 anos de excelência em Segurança e Facilities. Encontre a
          oportunidade ideal nas nossas unidades de Itatiba, Atibaia, Campinas e
          Jundiaí.
        </p>
      </div>
    </section>
  );
}
