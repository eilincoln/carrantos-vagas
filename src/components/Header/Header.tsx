import styles from "./Header.module.css";
import logoImg from "../../assets/logo.png";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="/" className={styles.brand}>
          <img src={logoImg} alt="Grupo Carrantos" className={styles.logo} />
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
