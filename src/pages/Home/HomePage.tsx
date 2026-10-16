import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Header } from "../../components/Header/Header";
import { Hero } from "../../components/Hero/Hero";
import { JobFilters } from "../../components/JobFilters/JobFilters";
import { JobCard } from "../../components/JobCard/JobCard";
import { JobSkeleton } from "../../components/JobSkeleton/JobSkeleton";
import { JobModal } from "../../components/JobModal/JobModal";
import { ApplicationModal } from "../../components/ApplicationModal/ApplicationModal";
import { TalentBank } from "../../components/TalentBank/TalentBank";
import { HiringProcess } from "../../components/HiringProcess/HiringProcess";
import { CompanyCulture } from "../../components/CompanyCulture/CompanyCulture";
import { Footer } from "../../components/Footer/Footer";
import { Icon } from "../../components/Icon/Icon";
import type { Job } from "../../types/job";
import styles from "./HomePage.module.css";

export function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [jobForApplication, setJobForApplication] = useState<Job | null>(null);

  useEffect(() => {
    async function loadJobs() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
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
      setIsLoading(false);
    }

    loadJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation
      ? job.location === selectedLocation
      : true;
    const matchesCategory = selectedCategory
      ? job.category === selectedCategory
      : true;

    return matchesSearch && matchesLocation && matchesCategory;
  });

  const handleOpenApplication = (job: Job | null) => {
    setSelectedJob(null);
    setJobForApplication(job);
    setIsApplicationOpen(true);
  };

  return (
    <div>
      <Header />
      <Hero />

      <main className={styles.main}>
        <JobFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <section id="vagas" aria-labelledby="jobs-title">
          <div className={styles.sectionHeader}>
            <h2 id="jobs-title" className={styles.sectionTitle}>
              Vagas abertas
            </h2>
            <p className={styles.resultsCount}>
              Vagas encontradas:{" "}
              <strong>{isLoading ? "..." : filteredJobs.length}</strong>
            </p>
          </div>

          {isLoading ? (
            <div className={styles.jobsGrid}>
              <JobSkeleton />
              <JobSkeleton />
              <JobSkeleton />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>
                <Icon name="search" size={28} />
              </span>
              <h3 className={styles.emptyTitle}>
                Nenhuma vaga aberta com estes filtros
              </h3>
              <p className={styles.emptyText}>
                Experimente limpar os seletores ou cadastre seu currículo no
                nosso Banco de Talentos logo abaixo.
              </p>
            </div>
          ) : (
            <div className={styles.jobsGrid}>
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSelectJob={(job) => setSelectedJob(job)}
                />
              ))}
            </div>
          )}
        </section>

        <TalentBank onOpenApplication={() => handleOpenApplication(null)} />
        <HiringProcess />
        <CompanyCulture />
      </main>

      <Footer />

      <JobModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onApply={(job) => handleOpenApplication(job)}
      />

      <ApplicationModal
        job={jobForApplication}
        isOpen={isApplicationOpen}
        onClose={() => setIsApplicationOpen(false)}
      />
    </div>
  );
}
