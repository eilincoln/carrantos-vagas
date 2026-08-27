export type JobCategory =
  | "Facilities"
  | "Segurança"
  | "Portaria"
  | "Administrativo"
  | string;
export type JobLocation =
  | "Itatiba - SP"
  | "Atibaia - SP"
  | "Campinas - SP"
  | "Jundiaí - SP"
  | string;

export interface Job {
  id: string;
  title: string;
  category: JobCategory;
  location: JobLocation;
  salary: number;
  activities: string;
  education: string;
  schedule?: string;
  benefits: string[];
  requirements?: string[];
  whatsappContact: string;
  isActive?: boolean;
  createdAt?: string;
}
