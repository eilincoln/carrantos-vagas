# 🏢 Carrantos Carreiras — Portal Institucional de Oportunidades

> [!NOTE]
> **Projeto de Portfólio & Solução Corporativa:** Desenvolvido para resolver o desafio de centralização, busca regional e captação de talentos para o Grupo Carrantos, validando a arquitetura em React + TypeScript para um MVP de alta performance.

Plataforma front-end moderna e responsiva construída para conectar profissionais às oportunidades de trabalho do Grupo Carrantos nas áreas de Facilities, Segurança Patrimonial, Portaria e Administrativo. O sistema conta com busca textual em tempo real, filtros por unidade geográfica regional, modal acessível de detalhamento da vaga e encaminhamento ágil de candidatos via formulário e API do WhatsApp.

---

## 📱 Demonstração do Projeto

_(Adicione aqui os prints ou GIFs do projeto rodando em desktop e mobile)_

---

## 🚀 Stack Tecnológica e Conceitos Aplicados

- **React:** Construção de interface declarativa baseada em componentes reutilizáveis e desacoplados (`Header`, `Hero`, `JobFilters`, `JobCard`, `JobModal`).
- **TypeScript:** Tipagem estática rigorosa através de _Interfaces_ e _Union Types_, prevenindo inconsistências em tempo de compilação e garantindo a integridade dos dados das vagas.
- **Vite:** Ferramenta de build e bundling ultrarrápida com Hot Module Replacement (HMR).
- **CSS Modules & Design Tokens:** Estilização modular com variáveis nativas em `:root`, assegurando consistência da identidade visual corporativa sem poluição do escopo global.
- **Acessibilidade (a11y) & Semântica HTML5:** Utilização de tags semânticas (`<header>`, `<main>`, `<article>`, `<section>`), atributos ARIA (`aria-modal`, `role="dialog"`) e suporte à navegação por teclado (`Escape key`).
- **Intl.NumberFormat API:** Formatação monetária padronizada nativa para o padrão Real (BRL).

---

## 📝 Funcionalidades em Destaque

- **Filtros Dinâmicos Combinados:** Busca textual por cargo integrada a seletores de Cidade/Unidade (Itatiba, Atibaia, Campinas, Jundiaí) e Categoria de atuação via estado reativo com React `useState`.
- **Layout Responsivo Automático:** Grid flexível com `minmax` e CSS Clamp, garantindo adaptação perfeita de telas móveis a monitores ultrawide.
- **Modal de Detalhamento Interativo:** Visualização completa de atribuições, requisitos e benefícios com bloqueio de propagação de eventos (_event bubbling_).
- **Candidatura Multicanal:** Integração direta com mensagens estruturadas para WhatsApp e formulário de captação de dados para o RH.

---

## 👨‍💻 Autor

Desenvolvido com dedicação por **Lincoln Berto**.

- **LinkedIn:** https://www.linkedin.com/in/lincoln-berto/
- **GitHub:** https://github.com/eilincoln
- **Portfólio:** https://lincolnberto.com.br
