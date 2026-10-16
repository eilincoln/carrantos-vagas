import styles from "./Faq.module.css";
import { Icon } from "../Icon/Icon";

// Perguntas e respostas genéricas: ajuste os textos conforme a política do RH
const questions = [
  {
    question: "Como envio meu currículo?",
    answer:
      "Clique em “Ver Vaga” na oportunidade desejada e escolha entre se candidatar pelo WhatsApp ou preencher o formulário, anexando seu currículo em PDF (até 5MB).",
  },
  {
    question: "Preciso ter experiência para me candidatar?",
    answer:
      "Cada vaga tem seus próprios requisitos, descritos nos detalhes da oportunidade. Se você ainda não se encaixa em nenhuma vaga aberta, cadastre seu currículo no Banco de Talentos.",
  },
  {
    question: "Posso me candidatar a mais de uma vaga?",
    answer:
      "Sim. Você pode se candidatar a todas as vagas compatíveis com o seu perfil e com a cidade onde deseja trabalhar.",
  },
  {
    question: "Quanto tempo leva para ter um retorno?",
    answer:
      "O prazo varia de acordo com a vaga e o volume de candidaturas. Se o seu perfil for compatível, nossa equipe de RH entrará em contato pelo telefone ou WhatsApp informado.",
  },
  {
    question: "Não encontrei vaga na minha cidade. O que faço?",
    answer:
      "Cadastre seu currículo no Banco de Talentos. Assim que surgir uma oportunidade compatível em uma das nossas unidades, você poderá ser chamado.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Sim. Seus dados e currículo são usados exclusivamente para recrutamento e seleção interna, com armazenamento seguro, em conformidade com a LGPD.",
  },
];

export function Faq() {
  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-title">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Dúvidas</span>
        <h2 id="faq-title" className={styles.title}>
          Perguntas frequentes
        </h2>
      </div>

      <div className={styles.list}>
        {questions.map((item) => (
          <details key={item.question} className={styles.item}>
            <summary className={styles.question}>
              {item.question}
              <Icon name="chevronDown" size={20} className={styles.chevron} />
            </summary>
            <p className={styles.answer}>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
