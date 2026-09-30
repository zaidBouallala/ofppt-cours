import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { educationQueries } from "../api/queries";
import ThemeToggle from "../components/ui/ThemeToggle";
import LevelCard from "../components/ui/LevelCard";
import BrandLogo from "../components/ui/BrandLogo";
import SEO from "../components/common/SEO";
import { ErrorState } from "../components/ui/States";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function EducationLevelPage() {
  const navigate = useNavigate();
  const { data: years, isLoading, isError, error, refetch } = useQuery({
    ...educationQueries.years(),
    retry: 1,
  });

  /**
   * Associe chaque niveau à un label de catégorie, une couleur,
   * une micro-description, et une couleur d'accent pour la barre latérale.
   */
  const getYearMetadata = (yearName) => {
    const name = (yearName || "").toLowerCase();

    if (name.includes("1") || name.includes("premier")) {
      return {
        subtitle: "Début du parcours",
        description: "Posez les fondations de votre parcours technique.",
        color: "blue",
      };
    } else if (name.includes("2") || name.includes("deux")) {
      return {
        subtitle: "Orientation Professionnelle",
        description: "Approfondissez vos compétences et choisissez votre voie.",
        color: "violet",
      };
    } else if (
      name.includes("3") ||
      name.includes("trois") ||
      name.includes("licence")
    ) {
      return {
        subtitle: "Maîtrise & Expertise",
        description:
          "Devenez expert et préparez votre insertion professionnelle.",
        color: "amber",
      };
    }

    return {
      subtitle: "Année Académique",
      description: "Explorez les ressources pédagogiques de votre formation.",
      color: "slate",
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-page)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    const isNetworkError = error?.message?.toLowerCase().includes('network') ||
      error?.code === 'ECONNREFUSED' ||
      !navigator.onLine;
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center bg-[var(--bg-page)] p-6">
        <ThemeToggle />
        <div className="w-full max-w-lg">
          <ErrorState
            title={isNetworkError ? "Serveur inaccessible" : "Erreur de chargement"}
            message={
              isNetworkError
                ? "Impossible de contacter le serveur. Vérifiez votre connexion internet et réessayez."
                : (error?.message || "Nous n'avons pas pu charger les niveaux. Veuillez réessayer.")
            }
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full transition-colors duration-300 bg-[var(--bg-page)] text-[var(--text-primary)] font-sans">
      <SEO
        title="Niveaux d'Éducation — OFPPT Cours"
        description="Sélectionnez votre niveau d'études pour parcourir les formations et les cours."
        keywords="ofppt, niveaux éducation, formations, cours"
      />
      <ThemeToggle />

      {/* ── Decorative gradient — dual-tone for depth ── */}
      <div
        className="absolute inset-x-0 top-0 h-[28rem] pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-indigo-50/20 to-transparent dark:from-blue-950/30 dark:via-indigo-950/10 dark:to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.08),transparent)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.12),transparent)]" />
      </div>

      {/* ── Main container ── */}
      <div className="relative flex flex-col items-center justify-center min-h-screen py-16 px-4 sm:px-6">

        {/* ── Header ── */}
        <header className="flex flex-col items-center mb-14 text-center max-w-lg mx-auto animate-fade-in">

          {/* Logo container — light bg in both modes keeps the black logo readable */}
          <div className="w-14 h-14 mb-6 p-2 rounded-xl
                         bg-white dark:bg-slate-800
                         border border-slate-200/80 dark:border-slate-600
                         shadow-sm dark:shadow-lg
                         dark:ring-1 dark:ring-white/15
                         transition-all duration-300 flex items-center justify-center">
            <BrandLogo size={64} className="w-full h-full" />
          </div>

          {/* Context badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-4
                          rounded-full text-xs font-medium tracking-wide
                          bg-slate-100 text-slate-500
                          dark:bg-slate-800 dark:text-slate-400
                          border border-slate-200/60 dark:border-slate-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
            OFPPT · Plateforme Éducative
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2
                         text-[var(--text-primary)]">
            Sélectionner un Niveau
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed text-balance">
            Choisissez votre année de formation pour continuer.
          </p>
        </header>

        {/* ── Cards list ── */}
        <section
          aria-label="Liste des niveaux de formation"
          className="w-full max-w-2xl flex flex-col gap-4"
          role="list"
        >
          {years
            .filter((year) => {
              const name = (year.name || "").toLowerCase();
              return name.match(/1|2|3|premier|deux|trois/);
            })
            .map((year, index) => {
              const meta = getYearMetadata(year.name);
              return (
                <div role="listitem" key={year.id}>
                  <LevelCard
                    categoryLabel={meta.subtitle}
                    title={year.name}
                    description={meta.description}
                    color={meta.color}
                    onClick={() => navigate(`/formations/${year.id}`)}
                    animationDelay={index * 0.07}
                  />
                </div>
              );
            })}
        </section>

        {/* ── Footer ── */}
        <footer className="mt-16 text-center">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-400 uppercase tracking-widest">
            Plateforme Officielle d'Apprentissage
          </p>
        </footer>
      </div>
    </div>
  );
}
