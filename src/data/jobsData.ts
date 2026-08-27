import type { Job } from "../types/job";

export const mockJobs: Job[] = [
  {
    id: "vaga-servicos-gerais-01",
    title: "Serviços Gerais",
    location: "Itatiba - SP",
    category: "Facilities",
    education: "Ensino Fundamental",
    activities:
      "Desenvolver suas atividades utilizando normas e procedimentos de biossegurança e/ou segurança do trabalho; zelar pela guarda, conservação, manutenção e limpeza dos equipamentos, instrumentos e materiais utilizados, bem como do local de trabalho.",
    salary: 1805.43,
    benefits: [
      "Vale-transporte",
      "Vale-refeição de R$ 26,03 por dia trabalhado",
      "Vale-alimentação de R$ 205,91",
      "Prêmio de assiduidade: R$ 315,00",
    ],
    whatsappContact: "5511950253677",
  },
  {
    id: "vaga-vigia-02",
    title: "Vigia",
    location: "Itatiba - SP",
    category: "Segurança",
    education: "Ensino Médio Completo",
    schedule: "Escala 12x36",
    requirements: ["Informática básica", "CNH A/B obrigatória"],
    activities:
      "Controle de entrada e saída de veículos e pessoas pela portaria; realização de rondas pelo patrimônio.",
    salary: 2031.57,
    benefits: [
      "Vale-transporte",
      "Vale-refeição de R$ 26,03 por dia trabalhado",
      "Vale-alimentação de R$ 205,91",
      "Prêmio de assiduidade: R$ 110,00",
    ],
    whatsappContact: "5511950253677",
  },
];
