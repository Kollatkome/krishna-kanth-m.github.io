import React, { useState, useEffect } from 'react';
import { PortfolioProvider } from './context/portfolioStore';
import { ThreeBackground } from './components/3d/ThreeBackground';
import { CustomCursor } from './components/layout/CustomCursor';
import { GlassNavbar } from './components/layout/GlassNavbar';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { PortfolioHero } from './components/sections/PortfolioHero';
import { AboutSection } from './components/sections/AboutSection';
import { SkillMatrix } from './components/sections/SkillMatrix';
import { ProjectShowcase } from './components/sections/ProjectShowcase';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { EducationSection } from './components/sections/EducationSection';
import { ForgeJourney } from './components/sections/ForgeJourney';
import { EvidenceVault } from './components/sections/EvidenceVault';

import { AchievementsSection } from './components/sections/AchievementsSection';
import { ResumeSection } from './components/sections/ResumeSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/layout/Footer';
import { WeekWorkspace } from './components/protosem/WeekWorkspace';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainPortfolioApp: React.FC = () => {
  const [activeWeekSlug, setActiveWeekSlug] = useState<string | null>(null);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  // Sync with URL Hash for direct linkability & browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin' || hash === '#/admin') {
        setIsAdminView(true);
        setActiveWeekSlug(null);
      } else if (hash.startsWith('#protosem/week-') || hash.startsWith('#/protosem/week-')) {
        const slug = hash.replace(/^#\/?protosem\//, '');
        setActiveWeekSlug(slug);
        setIsAdminView(false);
      } else {
        setIsAdminView(false);
        if (activeWeekSlug && !hash.includes('week-')) {
          setActiveWeekSlug(null);
        }
      }
    };

    // Initial check on page load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeWeekSlug]);

  const handleOpenWeekWorkspace = (slug: string) => {
    setActiveWeekSlug(slug);
    setIsAdminView(false);
    window.location.hash = `#protosem/${slug}`;
  };

  const handleOpenAdmin = () => {
    setIsAdminView(true);
    setActiveWeekSlug(null);
    window.location.hash = '#admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPortfolio = () => {
    setActiveWeekSlug(null);
    setIsAdminView(false);
    window.location.hash = '#hero';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-black text-neutral-200 overflow-x-hidden selection:bg-white/15 selection:text-white">
      
      {/* 3D WebGL Scene & Ambient Particle Mesh */}
      <ThreeBackground />

      {/* Desktop Magnetic Custom Cursor */}
      <CustomCursor />

      {/* 1. Admin CMS View */}
      {isAdminView ? (
        <div className="relative z-20">
          <AdminDashboard onBackToPortfolio={handleBackToPortfolio} />
        </div>
      ) : activeWeekSlug ? (
        /* 2. FORGE Week Workspace View */
        <div className="relative z-20">
          <WeekWorkspace
            initialWeekSlug={activeWeekSlug}
            onBackToPortfolio={() => {
              setActiveWeekSlug(null);
              window.location.hash = '#protosem';
              setTimeout(() => {
                const el = document.getElementById('protosem');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
          />
        </div>
      ) : (
        /* 3. Main 12-Section Storyteller Narrative Flow */
        <>
          {/* 12-Chapter Progress Rail */}
          <ScrollProgress />

          {/* Floating Glass Navigation Header */}
          <GlassNavbar onOpenAdmin={handleOpenAdmin} />

          {/* Main Narrative Chapters Container */}
          <main className="relative z-10 space-y-16 sm:space-y-24">
            
            {/* Chapter 01: INTRO */}
            <PortfolioHero />

            {/* Chapter 02: EXPLORE (About Me & Philosophy) */}
            <AboutSection />

            {/* Chapter 03: SKILLS (5-Pillar Competency Matrix) */}
            <SkillMatrix />

            {/* Chapter 04: BUILD (Featured Engineering Projects) */}
            <ProjectShowcase />

            {/* Chapter 05: EXPERIENCE (Internships & Industry Fellowships) */}
            <ExperienceSection />

            {/* Chapter 06: EDUCATION (Academic Degrees & Distinction) */}
            <EducationSection />

            {/* Chapter 07: JOURNEY (PRICE ProtoSem 21-Week Timeline + Before/After) */}
            <ForgeJourney onOpenWeekWorkspace={handleOpenWeekWorkspace} />

            {/* Chapter 08: EVIDENCE (Searchable Work & Evidence Vault) */}
            <EvidenceVault />

            {/* Chapter 10: HONORS (Achievements & Milestones) */}
            <AchievementsSection />

            {/* Chapter 11: RESUME (Master ATS Resume Viewer & PDF Download) */}
            <ResumeSection />

            {/* Chapter 12: CONNECT (Direct Message & Contact Channels) */}
            <ContactSection />

          </main>

          {/* Footer */}
          <Footer />
        </>
      )}

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <MainPortfolioApp />
    </PortfolioProvider>
  );
};

export default App;
