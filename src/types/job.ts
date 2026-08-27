export type JobLocation =
  | "Itatiba - SP"
  | "Atibaia - SP"
  | "Campinas - SP"
  | "Jundiaí - SP";
export type JobCategory =
  | "Facilities"
  | "Segurança"
  | "Portaria"
  | "Administrativo";

export interface Job {
  id: string;
  title: string;
  location: JobLocation;
  category: JobCategory;
  education: string;
  requirements?: string[];
  schedule?: string;
  activities: string;
  salary: number;
  benefits: string[];
  whatsappContact: string;
}
