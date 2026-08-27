import { useState, useEffect, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";
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
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);

  // Checa se o usuário já está logado
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchApplications();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchApplications();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setApplications(data as ApplicationRecord[]);
    }
    setIsLoading(false);
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
  };

  // Baixa o currículo com link seguro temporário (Signed URL)
  const handleDownloadResume = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(filePath, 60); // Link válido por 60 segundos apenas

    if (error || !data) {
      alert("Erro ao gerar download seguro do currículo.");
      return;
    }

    window.open(data.signedUrl, "_blank");
  };

  if (!session) {
    return (
      <div className={styles.container}>
        <div className={styles.loginWrapper}>
          <h1 className={styles.loginTitle}>Acesso Restrito RH</h1>
          <p className={styles.loginSubtitle}>
            Painel de Gestão de Candidaturas Carrantos
          </p>

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
            PORTAL RH • GRUPO CARRANTOS
          </span>
          <h1 className={styles.dashTitle}>Candidaturas Recebidas</h1>
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

      <main>
        <div className={styles.tableWrapper}>
          {isLoading ? (
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
          )}
        </div>
      </main>
    </div>
  );
}
