import styles from "./TalentBank.module.css";
import { siteImages } from "../../config/images";
import { Icon } from "../Icon/Icon";

interface TalentBankProps {
  onOpenApplication: () => void;
}

export function TalentBank({ onOpenApplication }: TalentBankProps) {
  return (
    <section
      id="banco-talentos"
      className={styles.section}
      aria-labelledby="talent-bank-title"
    >
      <div className={styles.content}>
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
        <button
          type="button"
          className={styles.actionButton}
          onClick={onOpenApplication}
        >
          <Icon name="fileText" size={18} />
          <span>Cadastrar no Banco de Talentos</span>
        </button>
      </div>

      <div className={styles.visual} aria-hidden="true">
        {siteImages.talentBank ? (
          <img src={siteImages.talentBank} alt="" className={styles.image} />
        ) : (
          // Visual provisório até a foto institucional ser adicionada
          <div className={styles.placeholder}>
            <div className={styles.placeholderRing}>
              <div className={styles.placeholderIcon}>
                <Icon name="briefcase" size={40} />
              </div>
            </div>
            <div className={`${styles.floatingChip} ${styles.chipTop}`}>
              <Icon name="shield" size={14} /> Segurança
            </div>
            <div className={`${styles.floatingChip} ${styles.chipBottom}`}>
              <Icon name="users" size={14} /> Facilities
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
