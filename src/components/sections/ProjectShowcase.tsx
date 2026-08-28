import React, { useState } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Cpu, 
  Home, 
  ShieldCheck, 
  Trophy, 
  ArrowRight, 
  CheckCircle2
} from 'lucide-react';
import { type ProjectItem } from '../../data/portfolioData';
import { usePortfolio } from '../../context/portfolioStore';
import { TiltCard } from '../ui/TiltCard';
import { ModalViewer } from '../ui/ModalViewer';

export const ProjectShowcase: React.FC = () => {
  const { projects } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const getProjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home': return <Home className="w-6 h-6 text-cyan-400" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-purple-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-brand-300" />;
      case 'Trophy': return <Trophy className="w-6 h-6 text-amber-400" />;
      default: return <FolderGit2 className="w-6 h-6 text-brand-400" />;
    }
  };

  return (
    <section id="projects" className="relative py-20 scroll-mt-24 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono tracking-widest uppercase">
            <FolderGit2 className="w-3.5 h-3.5 text-brand-400" />
            <span>03 // BUILD</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Featured Projects & <span className="gradient-text-primary">Engineering</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Tangible evidence of software architectures, embedded IoT prototypes, and data intelligence labs.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-violet via-brand-500 to-brand-cyan mx-auto rounded-full mt-2" />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <TiltCard key={project.id} maxTilt={8} className="rounded-3xl">
              <div 
                className="glass-panel glass-card-interactive rounded-3xl p-7 sm:p-8 space-y-6 border border-white/10 flex flex-col justify-between h-full group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                
                <div className="space-y-4">
                  {/* Top Bar: Icon + Category Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      {getProjectIcon(project.icon)}
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300">
                      {project.categoryLabel}
                    </span>
                  </div>

                  {/* Title & Short Summary */}
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white group-hover:text-brand-200 transition-colors flex items-center justify-between">
                      <span>{project.title}</span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-1">
                    {project.highlights.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar: Tech Tags & Evidence Type */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-slate-300 font-mono text-[11px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
                    <span className="text-brand-300">{project.evidenceType}</span>
                    <span className="text-slate-500 group-hover:text-white transition-colors flex items-center gap-1">
                      <span>Inspect Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>

              </div>
            </TiltCard>
          ))}
        </div>

      </div>

      {/* Project Deep Dive Modal */}
      {selectedProject && (
        <ModalViewer
          isOpen={Boolean(selectedProject)}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          category={selectedProject.categoryLabel}
          badge={selectedProject.status}
          viewUrl={selectedProject.githubUrl}
        >
          <div className="space-y-6">
            
            {/* Problem & Solution Breakdown */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-rose-300 font-semibold">
                  The Problem & Challenge
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed font-light">
                  {selectedProject.fullProblem}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                  Engineering Solution
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed font-light">
                  {selectedProject.solution}
                </p>
              </div>
            </div>

            {/* Role & Key Deliverables */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                My Role & Key Highlights
              </h4>
              <p className="text-xs font-mono text-brand-300">
                Role: {selectedProject.role}
              </p>
              <ul className="space-y-2 pt-1">
                {selectedProject.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stack Tags */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Technologies Applied
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-200 font-mono text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </ModalViewer>
      )}

    </section>
  );
};
