import { useState, useEffect, useMemo, type FormEvent } from "react";
import { Toaster, toast } from "sonner";
import { supabase } from "../../lib/supabase";
import { NewJobModal } from "./NewJobModal";
import { EditJobModal } from "./EditJobModal";
import type { Job } from "../../types/job";
import styles from "./Admin.module.css";
import { Icon } from "../../components/Icon/Icon";
import logoImg from "../../assets/logo.png";

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

// As cores de cada status ficam no Admin.module.css (atributo data-status)
const statusConfig: Record<CandidateStatus, { label: string }> = {
  novo: { label: "Novo" },
  triagem: { label: "Em Triagem" },
  entrevista: { label: "Entrevista" },
  aprovado: { label: "Aprovado" },
  reprovado: { label: "Reprovado" },
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
    } else {
      toast.error("Erro ao atualizar o status da vaga.");
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
    // Escapa aspas e impede que valores iniciados por = + - @ virem fórmulas no Excel
    const csvCell = (value: string) => {
      const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
      return `"${safe.replace(/"/g, '""')}"`;
    };

    const headers = "Data,Status,Vaga,Nome,Email,Telefone,Cidade\n";
    const rows = filteredApplications
      .map((a) =>
        [
          new Date(a.created_at).toLocaleDateString("pt-BR"),
          a.status || "novo",
          a.job_title,
          a.full_name,
          a.email,
          a.phone,
          a.city,
        ]
          .map((value) => csvCell(String(value ?? "")))
          .join(","),
      )
      .join("\n");

    // O BOM (\uFEFF) faz o Excel reconhecer o UTF-8 e exibir os acentos corretamente
    const blob = new Blob(["\uFEFF" + headers + rows], {
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
      <div className={styles.loginPage}>
        <Toaster position="top-center" richColors />
        <div className={styles.loginWrapper}>
          <div className={styles.loginHeader}>
            <img src={logoImg} alt="Grupo Carrantos" className={styles.loginLogo} />
            <span className={styles.loginBadge}>
              <Icon name="lock" size={12} /> Acesso Restrito RH
            </span>
            <p className={styles.loginSubtitle}>Painel de Gestão Carrantos</p>
          </div>

          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="login-email" className={styles.label}>
                E-mail Corporativo
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                className={styles.input}
                placeholder="rh@carrantos.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="login-password" className={styles.label}>
                Senha
              </label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
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

          <a href="/" className={styles.loginBackLink}>
            <Icon name="arrowLeft" size={14} /> Voltar ao portal de vagas
          </a>
        </div>
      </div>
    );
  }

  const activeJobsCount = jobs.filter((j) => j.isActive).length;
  const pausedJobsCount = jobs.length - activeJobsCount;

  return (
    <div className={styles.container}>
      <Toaster position="top-right" richColors />

      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.topBarBrand}>
            <img src={logoImg} alt="Grupo Carrantos" className={styles.topBarLogo} />
            <span className={styles.topBarBadge}>Painel RH</span>
          </div>
          <div className={styles.topBarActions}>
            <a
              href="/"
              className={styles.portalLink}
              aria-label="Ver Portal Público"
              title="Ver Portal Público"
            >
              <Icon name="arrowUpRight" size={14} />
              <span>Ver Portal Público</span>
            </a>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <Icon name="logOut" size={16} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      <header className={styles.dashboardHeader}>
        <span className={styles.eyebrow}>
          Painel Administrativo • Grupo Carrantos
        </span>
        <h1 className={styles.dashTitle}>
          {activeTab === "applications"
            ? "Candidaturas Recebidas"
            : "Gestão de Vagas"}
        </h1>
      </header>

      {/* KPIs */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={`${styles.kpiIcon} ${styles.kpiIconPrimary}`}>
            <Icon name="users" size={22} />
          </span>
          <div>
            <span className={styles.kpiLabel}>Total de Candidatos</span>
            <div className={styles.kpiValue}>{applications.length}</div>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <span className={`${styles.kpiIcon} ${styles.kpiIconSuccess}`}>
            <Icon name="checkCircle" size={22} />
          </span>
          <div>
            <span className={styles.kpiLabel}>Vagas Ativas no Site</span>
            <div className={`${styles.kpiValue} ${styles.kpiValueSuccess}`}>
              {activeJobsCount}
            </div>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <span className={`${styles.kpiIcon} ${styles.kpiIconWarning}`}>
            <Icon name="pause" size={20} />
          </span>
          <div>
            <span className={styles.kpiLabel}>Vagas Pausadas</span>
            <div className={`${styles.kpiValue} ${styles.kpiValueWarning}`}>
              {pausedJobsCount}
            </div>
          </div>
        </div>
      </div>

      {/* Abas e Ações */}
      <div className={styles.toolbar}>
        <div className={styles.tabs} role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === "applications"}
            onClick={() => setActiveTab("applications")}
            className={`${styles.tab} ${activeTab === "applications" ? styles.tabActive : ""}`}
          >
            <Icon name="fileText" size={16} />
            Candidaturas
            <span className={styles.tabCount}>{applications.length}</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "jobs"}
            onClick={() => setActiveTab("jobs")}
            className={`${styles.tab} ${activeTab === "jobs" ? styles.tabActive : ""}`}
          >
            <Icon name="briefcase" size={16} />
            Vagas
            <span className={styles.tabCount}>{jobs.length}</span>
          </button>
        </div>

        {activeTab === "applications" ? (
          <button onClick={handleExportCSV} className={styles.secondaryBtn}>
            <Icon name="download" size={16} />
            Exportar CSV
          </button>
        ) : (
          <button
            onClick={() => setIsNewJobOpen(true)}
            className={styles.primaryBtn}
          >
            <Icon name="plus" size={16} />
            Nova Vaga
          </button>
        )}
      </div>

      {/* Barra de Filtros */}
      <div className={styles.filterBar}>
        {activeTab === "applications" ? (
          <>
            <div className={styles.searchWrapper}>
              <Icon name="search" size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar por candidato, e-mail..."
                aria-label="Buscar candidaturas"
                className={`${styles.input} ${styles.searchInput}`}
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
              />
            </div>
            <select
              aria-label="Filtrar por vaga"
              className={`${styles.input} ${styles.select}`}
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
              aria-label="Filtrar por status"
              className={`${styles.input} ${styles.select}`}
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
              aria-label="Filtrar por status da vaga"
              className={`${styles.input} ${styles.select}`}
              value={jobStatusFilter}
              onChange={(e) => setJobStatusFilter(e.target.value as any)}
            >
              <option value="all">Todos os Status</option>
              <option value="active">Apenas Ativas</option>
              <option value="paused">Apenas Pausadas</option>
            </select>
            <select
              aria-label="Filtrar por unidade"
              className={`${styles.input} ${styles.select}`}
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
              <p className={styles.emptyState}>Carregando candidaturas...</p>
            ) : filteredApplications.length === 0 ? (
              <div className={styles.emptyState}>
                <Icon name="inbox" size={28} />
                <p>Nenhuma candidatura encontrada.</p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Data</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Vaga</th>
                    <th className={styles.th}>Candidato / Cidade</th>
                    <th className={styles.th}>Contato</th>
                    <th className={`${styles.th} ${styles.thRight}`}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => {
                    const currentStatus = (app.status || "novo") as CandidateStatus;

                    return (
                      <tr key={app.id} className={styles.tr}>
                        <td className={`${styles.td} ${styles.dateCell}`}>
                          {new Date(app.created_at).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                        <td className={styles.td}>
                          <select
                            value={currentStatus}
                            onChange={(e) =>
                              handleUpdateStatus(
                                app.id,
                                e.target.value as CandidateStatus
                              )
                            }
                            aria-label={`Status de ${app.full_name}`}
                            data-status={currentStatus}
                            className={styles.statusSelect}
                          >
                            <option value="novo">Novo</option>
                            <option value="triagem">Em Triagem</option>
                            <option value="entrevista">Entrevista</option>
                            <option value="aprovado">Aprovado</option>
                            <option value="reprovado">Reprovado</option>
                          </select>
                        </td>
                        <td className={`${styles.td} ${styles.jobTitleCell}`}>
                          <strong>{app.job_title}</strong>
                        </td>
                        <td className={`${styles.td} ${styles.candidateCell}`}>
                          <div className={styles.candidateName}>{app.full_name}</div>
                          <div className={styles.mutedText}>{app.city}</div>
                        </td>
                        <td className={`${styles.td} ${styles.contactCell}`}>
                          <div className={styles.phoneText}>{app.phone}</div>
                          <div className={styles.emailText}>{app.email}</div>
                        </td>
                        <td className={`${styles.td} ${styles.actionsCell}`}>
                          <div className={styles.actions}>
                            <button
                              onClick={() => handleDownloadResume(app.resume_url)}
                              className={styles.downloadBtn}
                              title="Baixar Currículo"
                            >
                              <Icon name="download" size={14} />
                              PDF
                            </button>
                            <button
                              onClick={() => handleOpenWhatsApp(app)}
                              className={`${styles.iconBtn} ${styles.iconBtnWhatsapp}`}
                              title="Chamar no WhatsApp"
                              aria-label={`Chamar ${app.full_name} no WhatsApp`}
                            >
                              <Icon name="messageCircle" size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteApplication(
                                  app.id,
                                  app.full_name,
                                  app.resume_url
                                )
                              }
                              className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                              title="Excluir"
                              aria-label={`Excluir candidatura de ${app.full_name}`}
                            >
                              <Icon name="trash" size={16} />
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
            /* TABELA DE GESTÃO DE VAGAS */
            jobs.length === 0 ? (
              <div className={styles.emptyState}>
                <Icon name="briefcase" size={28} />
                <p>Nenhuma vaga cadastrada.</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className={styles.emptyState}>
                <Icon name="search" size={28} />
                <p>Nenhuma vaga encontrada com estes filtros.</p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Cargo</th>
                    <th className={styles.th}>Setor</th>
                    <th className={styles.th}>Unidade</th>
                    <th className={styles.th}>Status</th>
                    <th className={`${styles.th} ${styles.thRight}`}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className={styles.tr}>
                      <td className={`${styles.td} ${styles.jobTitleCell}`}>
                        <strong>{job.title}</strong>
                      </td>
                      <td className={styles.td}>{job.category}</td>
                      <td className={styles.td}>{job.location}</td>
                      <td className={styles.td}>
                        <button
                          onClick={() => handleToggleJobStatus(job.id, job.isActive)}
                          className={`${styles.jobStatusBtn} ${job.isActive ? styles.jobStatusActive : styles.jobStatusPaused}`}
                          title={job.isActive ? "Clique para pausar" : "Clique para ativar"}
                        >
                          <span className={styles.statusDot} />
                          {job.isActive ? "Ativa" : "Pausada"}
                        </button>
                      </td>
                      <td className={`${styles.td} ${styles.actionsCell}`}>
                        <div className={styles.actions}>
                          <button
                            onClick={() => setEditingJob(job)}
                            className={styles.editBtn}
                            title="Editar Vaga"
                          >
                            <Icon name="pencil" size={14} />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                            title="Excluir Vaga"
                            aria-label={`Excluir vaga ${job.title}`}
                          >
                            <Icon name="trash" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
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
