import React from 'react';
import { Briefcase, Calendar, Building2, CheckCircle2, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/portfolioStore';
import { TiltCard } from '../ui/TiltCard';

export const ExperienceSection: React.FC = () => {
  const { experience } = usePortfolio();

  return (
    <section id="experience" className="relative py-20 scroll-mt-24 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono tracking-widest uppercase">
            <Briefcase className="w-3.5 h-3.5 text-brand-400" />
            <span>05 // EXPERIENCE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Industry Experience & <span className="gradient-text-primary">Fellowships</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Hands-on software development internships and venture engineering innovation fellowships.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-violet via-brand-500 to-brand-cyan mx-auto rounded-full mt-2" />
        </div>

        {/* Experience Timeline Grid */}
        <div className="max-w-5xl mx-auto space-y-6">
          {experience.map((item, idx) => (
            <TiltCard key={item.id} maxTilt={4} className="rounded-3xl">
              <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-brand-500/40 transition-all space-y-6 relative overflow-hidden group">
                
                {/* Background Accent Glow */}
                <div className="absolute -right-20 -top-20 w-60 h-60 bg-brand-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-500/20 transition-all" />

                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-mono">
                        {item.type}
                      </span>
                      <span className="text-xs font-mono text-slate-500">#{idx + 1}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white group-hover:text-brand-200 transition-colors">
                      {item.role}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                      <Building2 className="w-4 h-4 text-brand-400" />
                      <span>{item.organization}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item.period}</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                  {item.summary}
                </p>

                {/* Bullets */}
                <div className="space-y-2.5 bg-white/[0.02] p-4 sm:p-5 rounded-2xl border border-white/5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-brand-300 font-semibold flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                    <span>Core Responsibilities & Deliverables</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    {item.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-mono text-xs hover:border-brand-400/40 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            </TiltCard>
          ))}
        </div>

      </div>
    </section>
  );
};
