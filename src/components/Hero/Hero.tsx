import { useEffect, useState } from "react";
import styles from "./Hero.module.css";
import { siteImages } from "../../config/images";
import { Icon } from "../Icon/Icon";

const YEARS_IN_MARKET = 40;
const COUNT_DURATION_MS = 1600;

// Conta de 0 até o valor final com desaceleração no fim (ease-out)
function useCountUp(target: number) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [value, setValue] = useState(prefersReducedMotion ? target : 0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let frameId: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / COUNT_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, prefersReducedMotion]);

  return value;
}

export function Hero() {
  const years = useCountUp(YEARS_IN_MARKET);

  return (
    <section className={styles.hero}>
      {siteImages.hero && (
        <div
          className={styles.backgroundImage}
          style={{ backgroundImage: `url(${siteImages.hero})` }}
          aria-hidden="true"
        />
      )}
      {!siteImages.hero && <div className={styles.pattern} aria-hidden="true" />}

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

        <p className={styles.highlight}>
          <span className={styles.srOnly}>
            Mais de {YEARS_IN_MARKET} anos de mercado, desde 1985
          </span>
          <span className={styles.highlightValue} aria-hidden="true">
            {years}+
          </span>
          <span className={styles.highlightLabel} aria-hidden="true">
            anos de mercado
            <small>desde 1985</small>
          </span>
        </p>
      </div>
    </section>
  );
}
