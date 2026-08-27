# 🏢 PORTAL DE VAGAS & SISTEMA ATS — GRUPO CARRANTOS

> [!NOTE]
> **Projeto Full Stack Corporativo:** Aplicação desenvolvida para modernizar e centralizar o fluxo de recrutamento, seleção e gestão de vagas do **Grupo Carrantos**. A plataforma integra um portal público de alta performance para captação de talentos a um **Applicant Tracking System (ATS)** completo para a equipe de Recursos Humanos, com persistência em banco relacional, arquitetura orientada a componentes e conformidade com a LGPD.

Plataforma corporativa de ponta a ponta voltada para as áreas de Facilities, Segurança Patrimonial e Portaria. O projeto entrega uma experiência de candidatura sem fricção em dispositivos móveis e desktops, além de fornecer ao RH controle total sobre o ciclo de vida das vagas e a triagem de candidatos em tempo real.

---

## 🌐 Demonstração do Projeto

- **Portal Público de Carreiras:** [https://carrantos-vagas.vercel.app](https://carrantos-vagas.vercel.app/)
- **Painel Administrativo do RH:** [https://carrantos-vagas.vercel.app/admin](https://carrantos-vagas.vercel.app/admin)

<div align="center">
  <table>
    <tr>
      <td align="center" width="60%">
        <b>💻 Portal de Vagas (Desktop)</b><br><br>
        <img src="./assets/preview-desktop.png" alt="Demonstração Desktop do Portal de Vagas" width="100%">
      </td>
      <td align="center" width="40%">
        <b>📱 Formulário & Mobile</b><br><br>
        <img src="./assets/preview-mobile.png" alt="Demonstração Mobile e Candidatura" width="100%">
      </td>
    </tr>
  </table>
</div>

---

## 🚀 Stack Tecnológica e Decisões de Engenharia

O ecossistema foi projetado priorizando performance, segurança em nível de linha de dados, manutenibilidade e experiência do usuário (UX):

- **React 18 & TypeScript:** Tipagem estrita de contratos de dados, hooks customizados e renderização reativa sem redundâncias.
- **Vite & SPA Routing:** Build otimizado ultrarrápido com roteamento cliente via **React Router DOM v6** e suporte a deep linking em produção (`vercel.json`).
- **CSS Modules & Design Tokens:** Encapsulamento de estilos por componente com tokens corporativos padronizados no `:root` (paleta navy/slate, tipografia e espaçamentos).
- **PostgreSQL & Row Level Security (Supabase):** Modelagem de dados relacional com políticas estritas de RLS — acesso anônimo restrito à leitura de vagas ativas e envio de formulários, mantendo as operações administrativas restritas à role autenticada.
- **Armazenamento Seguro em Nuvem (Cloud Storage):** Bucket privado para currículos com download restrito via *Signed URLs* (links temporários com expiração de 60 segundos).
- **Autenticação Corporativa (Supabase Auth):** Controle de sessão e proteção de rotas para operadores de RH.
- **UX com Skeleton Shimmer & Toasts:** Estados de carregamento fluidos na listagem pública e feedback dinâmico de ações com a biblioteca **Sonner**.

---

## 📝 Funcionalidades em Destaque

### 🌐 Portal Público do Candidato
- **Filtros Multi-Parâmetros em Tempo Real:** Busca reativa combinando texto do cargo, áreas de atuação e unidades operacionais (`Itatiba`, `Louveira`, `Atibaia`, `Campinas` e `Jundiaí`).
- **Modal de Detalhes Acessível:** Visualização completa de atribuições, faixa salarial, escala de trabalho, requisitos e pacote de benefícios.
- **Candidatura Instantânea com Validação Estrita:** Formulário com máscaras dinâmicas de contato, sanitização de dados e upload exclusivo de arquivos `.pdf` (até 5MB).
- **Banco de Talentos Contínuo:** Canal aberto para cadastro proativo de currículos para futuras oportunidades.

### 🛡️ Painel Administrativo / Mini ATS (Área do RH)
- **Dashboard com Indicadores (KPIs):** Contadores automáticos de candidaturas recebidas, vagas ativas e processos pausados.
- **CRUD Completo de Vagas:** Interface para cadastrar, editar descrições/salários, pausar ou excluir vagas diretamente pelo painel.
- **Pipeline de Triagem de Candidatos:** Gerenciamento do status de cada perfil (`Novo` ➔ `Em Triagem` ➔ `Entrevista` ➔ `Aprovado` ➔ `Reprovado`).
- **Contato em 1 Clique via WhatsApp:** Abertura direta do aplicativo com mensagem personalizada preenchida com o nome do candidato e o cargo pretendido.
- **Exportação Tabular:** Download instantâneo da base de inscritos filtrada em formato `.csv` para relatórios operacionais.

---

## ⚙️ Como Executar o Projeto Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/eilincoln/carrantos-vagas.git
cd carrantos-vagas

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente (.env.local)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

---

## 👨‍💻 Autor

Desenvolvido por **Lincoln Berto**.

- **LinkedIn:** [https://www.linkedin.com/in/lincoln-berto/](https://www.linkedin.com/in/lincoln-berto/)
- **GitHub:** [https://github.com/eilincoln](https://github.com/eilincoln)
- **Portfólio:** [https://eilincoln.com.br](https://eilincoln.com.br)
