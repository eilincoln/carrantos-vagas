import { useState, useEffect, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import { NewJobModal } from "./NewJobModal";
import type { Job } from "../../types/job";
import styles from "./Admin.module.css";

interface ApplicationRecord {
  id: string;
  created_at: string;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  resume_url: string;
}

export function AdminPage() {
  const [session, setSession] = useState<unknown>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Aba ativa: 'applications' ou 'jobs'
  const [activeTab, setActiveTab] = useState<"applications" | "jobs">(
    "applications",
  );
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchApplications();
        fetchJobs();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchApplications();
        fetchJobs();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setApplications(data as ApplicationRecord[]);
    setIsLoading(false);
  };

  const fetchJobs = async () => {
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      const mappedJobs: Job[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        location: item.location,
        salary: Number(item.salary),
        activities: item.activities,
        education: item.education,
        schedule: item.schedule,
        benefits: item.benefits || [],
        requirements: item.requirements || [],
        whatsappContact: item.whatsapp_contact,
        isActive: item.is_active,
        createdAt: item.created_at,
      }));
      setJobs(mappedJobs);
    }
  };

  const handleToggleJobStatus = async (
    jobId: string,
    currentStatus: boolean | undefined,
  ) => {
    const nextStatus = !currentStatus;
    const { error } = await supabase
      .from("jobs")
      .update({ is_active: nextStatus })
      .eq("id", jobId);

    if (!error) {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, isActive: nextStatus } : j)),
      );
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      setErrorMsg("Credenciais inválidas. Verifique seu e-mail e senha.");
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setApplications([]);
    setJobs([]);
  };

  const handleDownloadResume = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(filePath, 60);

    if (error || !data) {
      alert("Erro ao gerar link do currículo.");
      return;
    }

    window.open(data.signedUrl, "_blank");
  };

  if (!session) {
    return (
      <div className={styles.container}>
        <div className={styles.loginWrapper}>
          <h1 className={styles.loginTitle}>Acesso Restrito RH</h1>
          <p className={styles.loginSubtitle}>Painel de Gestão Carrantos</p>

          {errorMsg && <p className={styles.errorText}>⚠️ {errorMsg}</p>}

          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>E-mail Corporativo</label>
              <input
                type="email"
                required
                className={styles.input}
                placeholder="rh@carrantos.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Senha</label>
              <input
                type="password"
                required
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? "Autenticando..." : "Entrar no Painel"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.dashboardHeader}>
        <div>
          <span
            style={{
              fontSize: "0.8rem",
              color: "var(--color-secondary)",
              fontWeight: 700,
            }}
          >
            PAINEL ADMINISTRATIVO • GRUPO CARRANTOS
          </span>
          <h1 className={styles.dashTitle}>
            {activeTab === "applications"
              ? "Candidaturas Recebidas"
              : "Gestão de Vagas Abertas"}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <a
            href="/"
            style={{
              color: "var(--color-primary)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            ← Ver Portal Público
          </a>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Sair
          </button>
        </div>
      </header>

      {/* Navegação entre Abas */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setActiveTab("applications")}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              border: "1px solid var(--color-border)",
              backgroundColor:
                activeTab === "applications"
                  ? "var(--color-primary)"
                  : "var(--color-surface)",
              color:
                activeTab === "applications"
                  ? "#ffffff"
                  : "var(--color-text-main)",
            }}
          >
            📋 Candidaturas ({applications.length})
          </button>

          <button
            onClick={() => setActiveTab("jobs")}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              border: "1px solid var(--color-border)",
              backgroundColor:
                activeTab === "jobs"
                  ? "var(--color-primary)"
                  : "var(--color-surface)",
              color:
                activeTab === "jobs" ? "#ffffff" : "var(--color-text-main)",
            }}
          >
            💼 Vagas ({jobs.length})
          </button>
        </div>

        {activeTab === "jobs" && (
          <button
            onClick={() => setIsNewJobOpen(true)}
            style={{
              backgroundColor: "#16a34a",
              color: "#ffffff",
              padding: "0.6rem 1.2rem",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "0.9rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            ➕ Nova Vaga
          </button>
        )}
      </div>

      <main>
        <div className={styles.tableWrapper}>
          {activeTab === "applications" ? (
            /* TABELA DE CANDIDATURAS */
            isLoading ? (
              <p
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "var(--color-text-muted)",
                }}
              >
                Carregando candidaturas...
              </p>
            ) : applications.length === 0 ? (
              <p
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "var(--color-text-muted)",
                }}
              >
                Nenhuma candidatura registrada até o momento.
              </p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Data/Hora</th>
                    <th className={styles.th}>Vaga / Destino</th>
                    <th className={styles.th}>Candidato</th>
                    <th className={styles.th}>Contato</th>
                    <th className={styles.th}>Cidade</th>
                    <th className={styles.th}>Currículo</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className={styles.td}>
                        {new Date(app.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className={styles.td}>
                        <strong>{app.job_title}</strong>
                      </td>
                      <td className={styles.td}>{app.full_name}</td>
                      <td className={styles.td}>
                        <div>{app.phone}</div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--color-text-muted)",
                          }}
                        >
                          {app.email}
                        </div>
                      </td>
                      <td className={styles.td}>{app.city}</td>
                      <td className={styles.td}>
                        <button
                          onClick={() => handleDownloadResume(app.resume_url)}
                          className={styles.downloadBtn}
                        >
                          📄 Baixar PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            /* TABELA DE VAGAS */
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Cargo</th>
                  <th className={styles.th}>Área</th>
                  <th className={styles.th}>Unidade</th>
                  <th className={styles.th}>Salário Base</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className={styles.td}>
                      <strong>{job.title}</strong>
                    </td>
                    <td className={styles.td}>{job.category}</td>
                    <td className={styles.td}>{job.location}</td>
                    <td className={styles.td}>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(job.salary)}
                    </td>
                    <td className={styles.td}>
                      <span
                        style={{
                          backgroundColor: job.isActive ? "#dcfce7" : "#fee2e2",
                          color: job.isActive ? "#15803d" : "#b91c1c",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        {job.isActive ? "Ativa" : "Pausada"}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <button
                        onClick={() =>
                          handleToggleJobStatus(job.id, job.isActive)
                        }
                        style={{
                          background: "none",
                          border: "1px solid var(--color-border)",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        {job.isActive ? "⏸️ Pausar" : "▶️ Ativar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <NewJobModal
        isOpen={isNewJobOpen}
        onClose={() => setIsNewJobOpen(false)}
        onJobCreated={fetchJobs}
      />
    </div>
  );
}
