import React from 'react';
import { GraduationCap, Award, Calendar, BookOpen, CheckCircle2, Star } from 'lucide-react';
import { usePortfolio } from '../../context/portfolioStore';
import { TiltCard } from '../ui/TiltCard';

export const EducationSection: React.FC = () => {
  const { education } = usePortfolio();

  return (
    <section id="education" className="relative py-20 scroll-mt-24 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>06 // EDUCATION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Academic <span className="gradient-text-cyan">Foundations</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Formal degrees, academic distinctions, and specialized intelligent systems training.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-cyan via-brand-500 to-purple-500 mx-auto rounded-full mt-2" />
        </div>

        {/* Education Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {education.map((item) => (
            <TiltCard key={item.id} maxTilt={6} className="rounded-3xl h-full">
              <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-6 h-full relative overflow-hidden group">
                
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

                <div className="space-y-4">
                  {/* Period & Distinction Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {item.period}
                    </span>

                    {item.score && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs font-mono font-bold text-amber-300">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        {item.score}
                      </span>
                    )}
                  </div>

                  {/* Degree & Institution */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-display font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {item.degree}
                    </h3>
                    <p className="text-sm font-semibold text-brand-300">
                      {item.institution}
                    </p>
                    {item.scoreLabel && (
                      <p className="text-xs font-mono text-amber-200/90 flex items-center gap-1 pt-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{item.scoreLabel}</span>
                      </p>
                    )}
                  </div>

                  {/* Details */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {item.details}
                  </p>
                </div>

                {/* Highlights */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Key Focus & Highlights</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {item.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </TiltCard>
          ))}
        </div>

      </div>
    </section>
  );
};
