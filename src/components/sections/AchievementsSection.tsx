import React from 'react';
import { 
  Trophy, 
  GraduationCap, 
  Rocket, 
  Award, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { usePortfolio } from '../../context/portfolioStore';
import { TiltCard } from '../ui/TiltCard';

export const AchievementsSection: React.FC = () => {
  const { achievements } = usePortfolio();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-amber-400" />;
      case 'Rocket':
        return <Rocket className="w-6 h-6 text-brand-400" />;
      case 'Award':
        return <Award className="w-6 h-6 text-cyan-400" />;
      default:
        return <Trophy className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <section id="achievements" className="relative py-20 scroll-mt-24 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>09 // ACHIEVEMENTS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Honors & Key <span className="gradient-text-primary">Milestones</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Academic distinctions, fellowship inductions, hackathon engineering recognitions, and certifications.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-500 via-brand-500 to-cyan-500 mx-auto rounded-full mt-2" />
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {achievements.map((item) => (
            <TiltCard key={item.id} maxTilt={6} className="rounded-3xl h-full">
              <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-6 h-full relative overflow-hidden group">
                
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />

                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      {getIcon(item.icon)}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  {/* Title & Organization */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>{item.organization}</span>
                      <span>{item.date}</span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-white group-hover:text-amber-200 transition-colors">
                      {item.title}
                    </h3>
                    {item.score && (
                      <p className="text-xs font-mono text-brand-300 flex items-center gap-1 font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                        <span>{item.score}</span>
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                {/* Highlights */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {item.highlights.map((hl, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span>{hl}</span>
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
