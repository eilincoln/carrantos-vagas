import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="/" className={styles.brand}>
          <span className={styles.brandTitle}>Carrantos</span>
          <span className={styles.brandBadge}>Carreiras</span>
        </a>
        <nav>
          <a
            href="https://carrantos.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            Site Institucional ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
