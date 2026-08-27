import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandCol}>
          <div className={styles.logo}>
            GRUPO <span className={styles.logoSpan}>CARRANTOS</span>
          </div>
          <p className={styles.description}>
            Excelência e compromisso em soluções terceirizadas de Facilities,
            Segurança Patrimonial, Controle de Acesso e Gestão Operacional.
          </p>
        </div>

        <div>
          <h4 className={styles.colTitle}>Carreiras</h4>
          <ul className={styles.linkList}>
            <li>
              <a href="#vagas" className={styles.link}>
                Vagas Abertas
              </a>
            </li>
            <li>
              <a href="#banco-talentos" className={styles.link}>
                Banco de Talentos
              </a>
            </li>
            <li>
              <a href="#cultura" className={styles.link}>
                Nossa Cultura
              </a>
            </li>
            <li>
              <a href="#processo" className={styles.link}>
                Processo Seletivo
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className={styles.colTitle}>Unidades</h4>
          <div>
            <span className={styles.badgeUnit}>Itatiba - SP</span>
            <span className={styles.badgeUnit}>Louveira - SP</span>
            <span className={styles.badgeUnit}>Atibaia - SP</span>
            <span className={styles.badgeUnit}>Campinas - SP</span>
            <span className={styles.badgeUnit}>Jundiaí - SP</span>
          </div>
        </div>

        <div>
          <h4 className={styles.colTitle}>Privacidade & LGPD</h4>
          <p style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "#94a3b8" }}>
            Seus dados cadastrais e currículos são tratados estritamente para
            finalidades de recrutamento e seleção interna, com armazenamento
            seguro em nuvem.
          </p>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div>
          © {new Date().getFullYear()} Grupo Carrantos. Todos os direitos
          reservados.
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a href="/admin" className={styles.adminLink}>
            Área do RH 🔒
          </a>
        </div>
      </div>
    </footer>
  );
}
