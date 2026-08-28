import React from 'react';
import { 
  Compass, 
  ArrowRight
} from 'lucide-react';
import { usePortfolio } from '../../context/portfolioStore';
import type { ProtoSemWeek } from '../../types/protosem';
import { TiltCard } from '../ui/TiltCard';
import { BeforeAfterModule } from './BeforeAfterModule';

interface ForgeJourneyProps {
  onOpenWeekWorkspace?: (slug: string) => void;
}

export const ForgeJourney: React.FC<ForgeJourneyProps> = ({ onOpenWeekWorkspace }) => {
  const { protoSemWeeks } = usePortfolio();

  const handleCardClick = (week: ProtoSemWeek) => {
    if (onOpenWeekWorkspace) {
      onOpenWeekWorkspace(week.slug);
    } else {
      window.location.hash = `#protosem/${week.slug}`;
    }
  };

  return (
    <section id="protosem" className="relative py-20 scroll-mt-24 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono tracking-widest uppercase">
            <Compass className="w-3.5 h-3.5 text-brand-400" />
            <span>07 // JOURNEY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            FORGE <span className="gradient-text-primary">ProtoSem Journey</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs font-mono">
              PRICE Innovation Fellowship
            </span>
            <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 text-xs font-mono">
              Week 00 – Week 19 ({protoSemWeeks.length} Weekly Sprints)
            </span>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-violet via-brand-500 to-brand-cyan mx-auto rounded-full mt-2" />
        </div>

        {/* Narrative & Focus Areas Card */}
        <div className="max-w-5xl mx-auto glass-panel-elevated rounded-3xl p-6 sm:p-10 space-y-6 border border-white/15 relative overflow-hidden">
          <div className="space-y-3">
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-light">
              Interactive 20-week innovation timeline tracking structured field research, hardware/software prototypes, dated journal reflections, and downloadable PDF dossiers. Click any week to open its workspace — type notes, upload files, and publish your journey.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-mono">
              Click on any week below to explore its date-based entries, rich notes, PDF reports, prototype images, and presentation decks.
            </p>
          </div>
        </div>

        {/* Week 00 to Week 20 Cards Container */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-display font-bold text-white">
                Sprint Timeline: Week 00 to Week 19
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {protoSemWeeks.length} Weekly Milestones • Date-Based Journal & Dossier System
              </p>
            </div>
          </div>

          {/* Week Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {protoSemWeeks.map((item) => {
              const numStr = item.weekNumber < 10 ? `0${item.weekNumber}` : `${item.weekNumber}`;
              const publishedEntries = item.entries.filter((e) => e.status === 'PUBLISHED');
              const hasContent = publishedEntries.length > 0;

              return (
                <TiltCard key={item.id} maxTilt={8} className="rounded-2xl h-full">
                  <div
                    onClick={() => handleCardClick(item)}
                    className="glass-panel glass-card-interactive rounded-2xl p-4 border border-white/10 hover:border-brand-500/50 flex flex-col justify-between space-y-3 h-full cursor-pointer group relative overflow-hidden"
                  >
                    {/* Top Accent Line */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${hasContent ? 'from-emerald-500 to-cyan-400' : 'from-brand-500 to-purple-500'} opacity-0 group-hover:opacity-100 transition-opacity`} />

                    {/* Top Tag & Status */}
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-brand-300 font-bold">
                        WEEK {numStr}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        hasContent 
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                          : 'bg-slate-800/80 text-slate-400 border-slate-700/50'
                      }`}>
                        {hasContent ? `${publishedEntries.length} ${publishedEntries.length === 1 ? 'ENTRY' : 'ENTRIES'}` : 'EMPTY'}
                      </span>
                    </div>

                    {/* Title & Body */}
                    <div className="space-y-1.5 py-1 flex-1">
                      <h4 className="text-sm font-display font-bold text-white group-hover:text-brand-200 transition-colors line-clamp-2 leading-snug">
                        {item.name ? item.name : `Week ${numStr}`}
                      </h4>
                      <p className="text-xs text-slate-400 font-light line-clamp-2">
                        {hasContent ? (
                          (() => {
                            const lastEntry = publishedEntries[publishedEntries.length - 1];
                            try {
                              const d = new Date(lastEntry.date);
                              return <span>{isNaN(d.getTime()) ? lastEntry.date : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>;
                            } catch { return <span>{lastEntry.date}</span>; }
                          })()
                        ) : (
                          <span className="italic text-slate-500">No content yet.</span>
                        )}
                      </p>
                    </div>

                    {/* Footer Action */}
                    <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-500">
                        {hasContent ? 'Published' : 'No entries'}
                      </span>
                      <div className="flex items-center gap-1 text-brand-400 group-hover:translate-x-1 transition-transform font-bold">
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>

                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>

        {/* Before -> Journey -> After Module */}
        <div className="pt-10 border-t border-white/10">
          <BeforeAfterModule />
        </div>

      </div>
    </section>
  );
};
