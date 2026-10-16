import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import logoImg from "../../assets/logo.png";
import { Icon } from "../Icon/Icon";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}
    >
      <div className={styles.container}>
        <a href="/" className={styles.brand}>
          <img src={logoImg} alt="Grupo Carrantos" className={styles.logo} />
          <span className={styles.brandBadge}>Carreiras</span>
        </a>

        <nav className={styles.nav} aria-label="Navegação principal">
          <a href="#vagas" className={styles.anchorLink}>
            Vagas
          </a>
          <a href="#banco-talentos" className={styles.anchorLink}>
            Banco de Talentos
          </a>
          <a href="#cultura" className={styles.anchorLink}>
            Por que a Carrantos
          </a>
          <a
            href="https://carrantos.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            <span className={styles.labelFull}>Site Institucional</span>
            <span className={styles.labelShort}>Site</span>
            <Icon name="arrowUpRight" size={14} />
          </a>
          <a href="#vagas" className={styles.ctaButton}>
            Ver vagas
          </a>
        </nav>
      </div>
    </header>
  );
}
