import { useState, type FormEvent, type ChangeEvent } from "react";
import { supabase } from "../../lib/supabase";
import type { Job } from "../../types/job";
import styles from "./ApplicationModal.module.css";

interface ApplicationModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationModal({
  job,
  isOpen,
  onClose,
}: ApplicationModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Formatação automática do telefone enquanto digita
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }

    setPhone(value);
  };

  // Validação estrita do arquivo (apenas PDF até 5MB)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setErrorMessage("");

    if (file) {
      if (file.type !== "application/pdf") {
        setErrorMessage("Por favor, envie o currículo apenas no formato PDF.");
        setResumeFile(null);
        e.target.value = "";
        return;
      }

      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeInBytes) {
        setErrorMessage("O arquivo excede o limite máximo permitido de 5MB.");
        setResumeFile(null);
        e.target.value = "";
        return;
      }

      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName || !email || !phone || !city || !resumeFile) {
      setErrorMessage(
        "Por favor, preencha todos os campos obrigatórios e anexe o currículo em PDF.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Gera um nome de arquivo único com timestamp e sanitização de caracteres
      const fileExt = resumeFile.name.split(".").pop();
      const sanitizedName = fullName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const filePath = `${Date.now()}_${sanitizedName}.${fileExt}`;

      // 2. Upload do PDF para o bucket 'resumes' do Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, resumeFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Erro ao enviar o currículo: ${uploadError.message}`);
      }

      // 3. Gravação dos dados na tabela 'applications'
      const { error: dbError } = await supabase.from("applications").insert([
        {
          job_id: job ? String(job.id) : "banco-talentos",
          job_title: job ? job.title : "Banco de Talentos",
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          city: city.trim(),
          resume_url: filePath,
        },
      ]);

      if (dbError) {
        throw new Error(`Erro ao registrar candidatura: ${dbError.message}`);
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(
          "Ocorreu um erro inesperado ao enviar seus dados. Tente novamente.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsSuccess(false);
    setErrorMessage("");
    setFullName("");
    setEmail("");
    setPhone("");
    setCity("");
    setResumeFile(null);
    onClose();
  };

  return (
    <div
      className={styles.overlay}
      onClick={handleModalClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <span className={styles.jobBadge}>
              {job
                ? `Vaga: ${job.title} (${job.location})`
                : "Cadastro no Banco de Talentos"}
            </span>
            <h2 className={styles.title}>Formulário de Candidatura</h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleModalClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {isSuccess ? (
          <div style={{ padding: "2.5rem 1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✅</div>
            <h3
              style={{ color: "var(--color-primary)", marginBottom: "0.5rem" }}
            >
              Candidatura Enviada com Sucesso!
            </h3>
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                marginBottom: "1.5rem",
              }}
            >
              Seus dados e currículo foram salvos com segurança em nosso banco
              de dados. O time de Recursos Humanos avaliará seu perfil.
            </p>
            <button
              type="button"
              className={styles.submitButton}
              onClick={handleModalClose}
              style={{ width: "100%" }}
            >
              Fechar
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {errorMessage && (
              <p className={styles.errorText}>⚠️ {errorMessage}</p>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="fullname" className={styles.label}>
                Nome Completo *
              </label>
              <input
                id="fullname"
                type="text"
                required
                disabled={isSubmitting}
                className={styles.input}
                placeholder="Ex: Carlos Silva"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                E-mail *
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={isSubmitting}
                className={styles.input}
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.label}>
                WhatsApp / Telefone *
              </label>
              <input
                id="phone"
                type="tel"
                required
                disabled={isSubmitting}
                className={styles.input}
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={handlePhoneChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="city" className={styles.label}>
                Cidade / Estado onde reside *
              </label>
              <input
                id="city"
                type="text"
                required
                disabled={isSubmitting}
                className={styles.input}
                placeholder="Ex: Itatiba - SP"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="resume" className={styles.label}>
                Anexar Currículo (PDF) *
              </label>
              <input
                id="resume"
                type="file"
                accept=".pdf"
                required
                disabled={isSubmitting}
                className={styles.fileInput}
                onChange={handleFileChange}
              />
              <span className={styles.fileHint}>
                Somente formato .PDF (tamanho máximo: 5MB)
              </span>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Enviando dados com segurança..."
                : "Enviar Candidatura"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
