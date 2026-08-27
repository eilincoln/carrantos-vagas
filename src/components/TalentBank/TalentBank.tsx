import styles from "./TalentBank.module.css";

export function TalentBank() {
  return (
    <section className={styles.section} aria-labelledby="talent-bank-title">
      <div className={styles.container}>
        <span className={styles.badge}>Oportunidades Futuras</span>
        <h2 id="talent-bank-title" className={styles.title}>
          Não encontrou a vaga ideal para o seu perfil?
        </h2>
        <p className={styles.description}>
          Cadastre seu currículo no nosso Banco de Talentos oficial. Quando
          surgir uma oportunidade alinhada à sua experiência nas áreas de
          Portaria, Segurança, Facilities ou Administrativo, nossa equipe
          entrará em contato.
        </p>
        <a
          href="https://forms.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.actionButton}
        >
          <span>Cadastrar no Banco de Talentos ↗</span>
        </a>
      </div>
    </section>
  );
}
