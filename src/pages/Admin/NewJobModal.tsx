import { useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import styles from "./Admin.module.css";
import { Icon } from "../../components/Icon/Icon";

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: () => void;
}

export function NewJobModal({
  isOpen,
  onClose,
  onJobCreated,
}: NewJobModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Facilities");
  const [location, setLocation] = useState("Itatiba - SP");
  const [salary, setSalary] = useState("");
  const [education, setEducation] = useState("Ensino Médio Completo");
  const [schedule, setSchedule] = useState("Escala 12x36");
  const [activities, setActivities] = useState("");
  const [benefits, setBenefits] = useState(
    "Vale Transporte, Vale Alimentação, Seguro de Vida",
  );
  const [requirements, setRequirements] = useState("");
  const [whatsappContact, setWhatsappContact] = useState("5511999999999");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const benefitsArray = benefits
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
    const requirementsArray = requirements
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    const numericSalary = parseFloat(salary.replace(",", "."));

    if (isNaN(numericSalary) || numericSalary <= 0) {
      setErrorMsg("Por favor, informe um salário válido.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.from("jobs").insert([
      {
        title: title.trim(),
        category,
        location,
        salary: numericSalary,
        education,
        schedule: schedule.trim(),
        activities: activities.trim(),
        benefits: benefitsArray,
        requirements: requirementsArray,
        whatsapp_contact: whatsappContact.trim().replace(/\D/g, ""),
        is_active: true,
      },
    ]);

    if (error) {
      setErrorMsg(`Erro ao criar vaga: ${error.message}`);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    onJobCreated();
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            Cadastrar Nova Vaga
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.modalClose}
            aria-label="Fechar"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Título do Cargo *</label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="Ex: Porteiro Líder"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Área de Atuação *</label>
              <select
                className={styles.input}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Facilities">Facilities</option>
                <option value="Segurança">Segurança</option>
                <option value="Portaria">Portaria</option>
                <option value="Administrativo">Administrativo</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Unidade / Cidade *</label>
              <select
                className={styles.input}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="Itatiba - SP">Itatiba - SP</option>
                <option value="Atibaia - SP">Atibaia - SP</option>
                <option value="Campinas - SP">Campinas - SP</option>
                <option value="Jundiaí - SP">Jundiaí - SP</option>
                <option value="Louveira - SP">Louveira - SP</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Salário Base (R$) *</label>
              <input
                type="text"
                required
                className={styles.input}
                placeholder="Ex: 2150.00"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Escala de Trabalho</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Ex: 12x36 ou 5x2"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Escolaridade *</label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="Ex: Ensino Médio Completo"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Descrição das Atividades *</label>
            <textarea
              required
              rows={3}
              className={styles.input}
              placeholder="Descreva as principais funções operacionais..."
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Benefícios (separados por vírgula)
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="Vale Refeição, Vale Transporte, Seguro de Vida"
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Requisitos (separados por vírgula)
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="Ex: CNH B, Experiência prévia em condomínios"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              WhatsApp para Candidatura (com DDD)
            </label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="5511999999999"
              value={whatsappContact}
              onChange={(e) => setWhatsappContact(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? "Salvando vaga..." : "Publicar Vaga"}
          </button>
        </form>
      </div>
    </div>
  );
}
