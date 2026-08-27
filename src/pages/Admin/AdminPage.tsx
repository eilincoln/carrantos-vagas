import { useState, useEffect, useMemo, type FormEvent } from "react";
import { Toaster, toast } from "sonner";
import { supabase } from "../../lib/supabase";
import { NewJobModal } from "./NewJobModal";
import { EditJobModal } from "./EditJobModal";
import type { Job } from "../../types/job";
import styles from "./Admin.module.css";

type CandidateStatus =
  | "novo"
  | "triagem"
  | "entrevista"
  | "aprovado"
  | "reprovado";

interface ApplicationRecord {
  id: string;
  created_at: string;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  resume_url: string;
  status?: CandidateStatus;
}

const statusConfig: Record<
  CandidateStatus,
  { label: string; bg: string; color: string }
> = {
  novo: { label: "Novo", bg: "#e0f2fe", color: "#0369a1" },
  triagem: { label: "Em Triagem", bg: "#fef3c7", color: "#b45309" },
  entrevista: { label: "Entrevista", bg: "#f3e8ff", color: "#6b21a8" },
  aprovado: { label: "Aprovado", bg: "#dcfce7", color: "#15803d" },
  reprovado: { label: "Reprovado", bg: "#fee2e2", color: "#b91c1c" },
};

export function AdminPage() {
  const [session, setSession] = useState<unknown>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"applications" | "jobs">(
    "applications",
  );
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Filtros
  const [appSearch, setAppSearch] = useState("");
  const [appJobFilter, setAppJobFilter] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState<string>("");
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

  const handleUpdateStatus = async (
    appId: string,
    newStatus: CandidateStatus,
  ) => {
    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", appId);

    if (error) {
      toast.error("Erro ao atualizar status.");
      return;
    }

    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)),
    );
    toast.success(`Status atualizado para "${statusConfig[newStatus].label}"`);
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
      toast.success(
        nextStatus ? "Vaga ativada no site!" : "Vaga pausada com sucesso.",
      );
    }
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!window.confirm(`Excluir a vaga "${jobTitle}" permanentemente?`))
      return;

    const { error } = await supabase.from("jobs").delete().eq("id", jobId);
    if (!error) {
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      toast.success("Vaga excluída com sucesso.");
    } else {
      toast.error("Erro ao excluir vaga.");
    }
  };

  const handleDeleteApplication = async (
    appId: string,
    candidateName: string,
    resumeUrl: string,
  ) => {
    if (!window.confirm(`Excluir a candidatura de "${candidateName}"?`)) return;

    const { error: dbError } = await supabase
      .from("applications")
      .delete()
      .eq("id", appId);
    if (dbError) {
      toast.error("Erro ao excluir registro.");
      return;
    }

    await supabase.storage.from("resumes").remove([resumeUrl]);
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    toast.success("Candidatura removida com sucesso.");
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      toast.error("Credenciais inválidas. Verifique seu e-mail e senha.");
    } else {
      toast.success("Bem-vindo(a) ao Painel Carrantos!");
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setApplications([]);
    setJobs([]);
    toast.info("Sessão encerrada.");
  };

  const handleDownloadResume = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(filePath, 60);
    if (error || !data) {
      toast.error("Erro ao gerar download seguro.");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const handleOpenWhatsApp = (candidate: ApplicationRecord) => {
    const cleanPhone = candidate.phone.replace(/\D/g, "");
    const phoneWithCountry = cleanPhone.startsWith("55")
      ? cleanPhone
      : `55${cleanPhone}`;
    const message = encodeURIComponent(
      `Olá ${candidate.full_name}, tudo bem? Aqui é do RH do Grupo Carrantos! Vimos sua candidatura para a vaga de ${candidate.job_title} e gostaríamos de conversar com você.`,
    );
    window.open(`https://wa.me/${phoneWithCountry}?text=${message}`, "_blank");
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const searchLower = appSearch.toLowerCase();
      const matchesSearch =
        app.full_name.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        app.job_title.toLowerCase().includes(searchLower);

      const matchesJob = appJobFilter ? app.job_title === appJobFilter : true;
      const matchesStatus = appStatusFilter
        ? (app.status || "novo") === appStatusFilter
        : true;

      return matchesSearch && matchesJob && matchesStatus;
    });
  }, [applications, appSearch, appJobFilter, appStatusFilter]);

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
    const headers = "Data,Status,Vaga,Nome,Email,Telefone,Cidade\n";
    const rows = filteredApplications
      .map(
        (a) =>
          `"${new Date(a.created_at).toLocaleDateString("pt-BR")}","${a.status || "novo"}","${a.job_title}","${a.full_name}","${a.email}","${a.phone}","${a.city}"`,
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
      `candidaturas_carrantos_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Relatório CSV baixado com sucesso!");
  };

  if (!session) {
    return (
      <div className={styles.container}>
        <Toaster position="top-center" richColors />
        <div className={styles.loginWrapper}>
          <h1 className={styles.loginTitle}>Acesso Restrito RH</h1>
          <p className={styles.loginSubtitle}>Painel de Gestão Carrantos</p>

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
      <Toaster position="top-right" richColors />

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
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {activeTab === "applications" ? (
          <>
            <input
              type="text"
              placeholder="Buscar por candidato, e-mail..."
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
            <select
              className={styles.input}
              value={appStatusFilter}
              onChange={(e) => setAppStatusFilter(e.target.value)}
            >
              <option value="">Todos os Status</option>
              <option value="novo">Novo</option>
              <option value="triagem">Em Triagem</option>
              <option value="entrevista">Entrevista</option>
              <option value="aprovado">Aprovado</option>
              <option value="reprovado">Reprovado</option>
            </select>
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
            /* TABELA DE CANDIDATURAS COM STATUS E WHATSAPP */
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
                    <th className={styles.th}>Data</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Vaga</th>
                    <th className={styles.th}>Candidato / Cidade</th>
                    <th className={styles.th}>Contato</th>
                    <th className={styles.th}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => {
                    const currentStatus = (app.status ||
                      "novo") as CandidateStatus;
                    const statusInfo =
                      statusConfig[currentStatus] || statusConfig.novo;

                    return (
                      <tr key={app.id}>
                        <td className={styles.td}>
                          {new Date(app.created_at).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )}
                        </td>
                        <td className={styles.td}>
                          <select
                            value={currentStatus}
                            onChange={(e) =>
                              handleUpdateStatus(
                                app.id,
                                e.target.value as CandidateStatus,
                              )
                            }
                            style={{
                              backgroundColor: statusInfo.bg,
                              color: statusInfo.color,
                              border: "none",
                              padding: "0.3rem 0.6rem",
                              borderRadius: "999px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              outline: "none",
                            }}
                          >
                            <option value="novo">Novo</option>
                            <option value="triagem">Em Triagem</option>
                            <option value="entrevista">Entrevista</option>
                            <option value="aprovado">Aprovado</option>
                            <option value="reprovado">Reprovado</option>
                          </select>
                        </td>
                        <td className={styles.td}>
                          <strong>{app.job_title}</strong>
                        </td>
                        <td className={styles.td}>
                          <div>{app.full_name}</div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            {app.city}
                          </div>
                        </td>
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
                        <td className={styles.td}>
                          <div
                            style={{
                              display: "flex",
                              gap: "0.4rem",
                              alignItems: "center",
                            }}
                          >
                            <button
                              onClick={() =>
                                handleDownloadResume(app.resume_url)
                              }
                              className={styles.downloadBtn}
                              title="Baixar Currículo"
                            >
                              📄 PDF
                            </button>
                            <button
                              onClick={() => handleOpenWhatsApp(app)}
                              style={{
                                backgroundColor: "#25D366",
                                color: "#fff",
                                border: "none",
                                padding: "0.4rem 0.6rem",
                                borderRadius: "var(--radius-sm)",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                              }}
                              title="Chamar no WhatsApp"
                            >
                              💬
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
                              title="Excluir"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
