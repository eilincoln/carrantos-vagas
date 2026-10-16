import styles from "./Footer.module.css";
import logoImg from "../../assets/logo.png";
import { Icon } from "../Icon/Icon";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandCol}>
          <img src={logoImg} alt="Grupo Carrantos" className={styles.logo} />
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
            <li>
              <a href="#faq" className={styles.link}>
                Perguntas Frequentes
              </a>
            </li>
            <li>
              <a
                href="https://carrantos.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Site Institucional ↗
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
          <p className={styles.privacyText}>
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
        <div className={styles.bottomLinks}>
          <a href="/admin" className={styles.adminLink}>
            Área do RH <Icon name="lock" size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}
