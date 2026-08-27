import { useState, useEffect, useMemo, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import { NewJobModal } from "./NewJobModal";
import { EditJobModal } from "./EditJobModal";
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

  const [activeTab, setActiveTab] = useState<"applications" | "jobs">(
    "applications",
  );
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  // Modais de Criação e Edição
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Filtros
  const [appSearch, setAppSearch] = useState("");
  const [appJobFilter, setAppJobFilter] = useState("");
  const [appCityFilter, setAppCityFilter] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState<
    "all" | "active" | "paused"
  >("all");
  const [jobLocationFilter, setJobLocationFilter] = useState("");

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

  // Excluir Vaga
  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (
      !window.confirm(
        `Tem certeza que deseja excluir a vaga "${jobTitle}" permanentemente?`,
      )
    ) {
      return;
    }

    const { error } = await supabase.from("jobs").delete().eq("id", jobId);
    if (!error) {
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } else {
      alert(`Erro ao excluir vaga: ${error.message}`);
    }
  };

  // Excluir Candidatura
  const handleDeleteApplication = async (
    appId: string,
    candidateName: string,
    resumeUrl: string,
  ) => {
    if (
      !window.confirm(
        `Excluir a candidatura de "${candidateName}" e seu currículo?`,
      )
    ) {
      return;
    }

    // 1. Remove o registro do banco
    const { error: dbError } = await supabase
      .from("applications")
      .delete()
      .eq("id", appId);
    if (dbError) {
      alert(`Erro ao excluir: ${dbError.message}`);
      return;
    }

    // 2. Remove o arquivo do Storage
    await supabase.storage.from("resumes").remove([resumeUrl]);

    setApplications((prev) => prev.filter((a) => a.id !== appId));
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) setErrorMsg("Credenciais inválidas.");
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
      alert("Erro ao gerar download do currículo.");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const searchLower = appSearch.toLowerCase();
      const matchesSearch =
        app.full_name.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        app.job_title.toLowerCase().includes(searchLower);

      const matchesJob = appJobFilter ? app.job_title === appJobFilter : true;
      const matchesCity = appCityFilter
        ? app.city.toLowerCase().includes(appCityFilter.toLowerCase())
        : true;

      return matchesSearch && matchesJob && matchesCity;
    });
  }, [applications, appSearch, appJobFilter, appCityFilter]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesStatus =
        jobStatusFilter === "all"
          ? true
          : jobStatusFilter === "active"
            ? job.isActive === true
            : job.isActive === false;

      const matchesLocation = jobLocationFilter
        ? job.location === jobLocationFilter
        : true;

      return matchesStatus && matchesLocation;
    });
  }, [jobs, jobStatusFilter, jobLocationFilter]);

  const uniqueJobTitles = useMemo(
    () => Array.from(new Set(applications.map((a) => a.job_title))),
    [applications],
  );
  const uniqueJobLocations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location))),
    [jobs],
  );

  const handleExportCSV = () => {
    if (filteredApplications.length === 0) return;
    const headers = "Data,Vaga,Nome,Email,Telefone,Cidade\n";
    const rows = filteredApplications
      .map(
        (a) =>
          `"${new Date(a.created_at).toLocaleDateString("pt-BR")}","${a.job_title}","${a.full_name}","${a.email}","${a.phone}","${a.city}"`,
      )
      .join("\n");

    const blob = new Blob([headers + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `candidaturas_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const activeJobsCount = jobs.filter((j) => j.isActive).length;
  const pausedJobsCount = jobs.length - activeJobsCount;

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
              : "Gestão de Vagas"}
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

      {/* KPIs */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        <div
          style={{
            background: "var(--color-surface)",
            padding: "1.25rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
              fontWeight: 600,
            }}
          >
            Total de Candidatos
          </span>
          <div
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--color-primary)",
              marginTop: "0.25rem",
            }}
          >
            {applications.length}
          </div>
        </div>
        <div
          style={{
            background: "var(--color-surface)",
            padding: "1.25rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
              fontWeight: 600,
            }}
          >
            Vagas Ativas no Site
          </span>
          <div
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#16a34a",
              marginTop: "0.25rem",
            }}
          >
            {activeJobsCount}
          </div>
        </div>
        <div
          style={{
            background: "var(--color-surface)",
            padding: "1.25rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
              fontWeight: 600,
            }}
          >
            Vagas Pausadas
          </span>
          <div
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#d97706",
              marginTop: "0.25rem",
            }}
          >
            {pausedJobsCount}
          </div>
        </div>
      </div>

      {/* Abas e Ações */}
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

        {activeTab === "applications" ? (
          <button
            onClick={handleExportCSV}
            style={{
              backgroundColor: "var(--color-surface)",
              color: "var(--color-primary)",
              border: "1px solid var(--color-border)",
              padding: "0.6rem 1.2rem",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            📥 Exportar CSV
          </button>
        ) : (
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

      {/* Barra de Filtros */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 1.5rem",
          background: "var(--color-surface)",
          padding: "1rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {activeTab === "applications" ? (
          <>
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou cargo..."
              className={styles.input}
              value={appSearch}
              onChange={(e) => setAppSearch(e.target.value)}
            />
            <select
              className={styles.input}
              value={appJobFilter}
              onChange={(e) => setAppJobFilter(e.target.value)}
            >
              <option value="">Todas as Vagas</option>
              {uniqueJobTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Filtrar por cidade..."
              className={styles.input}
              value={appCityFilter}
              onChange={(e) => setAppCityFilter(e.target.value)}
            />
          </>
        ) : (
          <>
            <select
              className={styles.input}
              value={jobStatusFilter}
              onChange={(e) => setJobStatusFilter(e.target.value as any)}
            >
              <option value="all">Todos os Status</option>
              <option value="active">Apenas Ativas</option>
              <option value="paused">Apenas Pausadas</option>
            </select>
            <select
              className={styles.input}
              value={jobLocationFilter}
              onChange={(e) => setJobLocationFilter(e.target.value)}
            >
              <option value="">Todas as Unidades</option>
              {uniqueJobLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <main>
        <div className={styles.tableWrapper}>
          {activeTab === "applications" ? (
            /* TABELA DE CANDIDATURAS COM DOWNLOAD E EXCLUSÃO */
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
            ) : filteredApplications.length === 0 ? (
              <p
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "var(--color-text-muted)",
                }}
              >
                Nenhuma candidatura encontrada.
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
                    <th className={styles.th}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
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
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleDownloadResume(app.resume_url)}
                            className={styles.downloadBtn}
                          >
                            📄 PDF
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteApplication(
                                app.id,
                                app.full_name,
                                app.resume_url,
                              )
                            }
                            style={{
                              background: "#fee2e2",
                              color: "#b91c1c",
                              border: "none",
                              padding: "0.4rem 0.6rem",
                              borderRadius: "var(--radius-sm)",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            /* TABELA DE VAGAS COM EDIÇÃO, PAUSA E EXCLUSÃO */
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Cargo</th>
                  <th className={styles.th}>Área</th>
                  <th className={styles.th}>Unidade</th>
                  <th className={styles.th}>Salário Base</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Nenhuma vaga encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
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
                            backgroundColor: job.isActive
                              ? "#dcfce7"
                              : "#fee2e2",
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
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button
                            onClick={() => setEditingJob(job)}
                            style={{
                              background: "var(--color-surface)",
                              border: "1px solid var(--color-border)",
                              padding: "0.3rem 0.6rem",
                              borderRadius: "var(--radius-sm)",
                              fontSize: "0.8rem",
                              cursor: "pointer",
                            }}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() =>
                              handleToggleJobStatus(job.id, job.isActive)
                            }
                            style={{
                              background: "var(--color-surface)",
                              border: "1px solid var(--color-border)",
                              padding: "0.3rem 0.6rem",
                              borderRadius: "var(--radius-sm)",
                              fontSize: "0.8rem",
                              cursor: "pointer",
                            }}
                          >
                            {job.isActive ? "⏸️" : "▶️"}
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            style={{
                              background: "#fee2e2",
                              color: "#b91c1c",
                              border: "none",
                              padding: "0.3rem 0.6rem",
                              borderRadius: "var(--radius-sm)",
                              fontSize: "0.8rem",
                              cursor: "pointer",
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
      <EditJobModal
        job={editingJob}
        isOpen={!!editingJob}
        onClose={() => setEditingJob(null)}
        onJobUpdated={fetchJobs}
      />
    </div>
  );
}
