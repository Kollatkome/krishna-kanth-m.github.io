import React from 'react';
import { 
  Search, 
  Wrench, 
  Brain, 
  Presentation, 
  Zap, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { beforeAfterComparison } from '../../data/portfolioData';
import { TiltCard } from '../ui/TiltCard';

export const BeforeAfterModule: React.FC = () => {
  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search': return <Search className="w-5 h-5 text-cyan-400" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-purple-400" />;
      case 'Brain': return <Brain className="w-5 h-5 text-brand-300" />;
      case 'Presentation': return <Presentation className="w-5 h-5 text-emerald-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      default: return <Sparkles className="w-5 h-5 text-brand-400" />;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Module Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h3 className="text-xl sm:text-3xl font-display font-bold text-white">
          The Transformation // <span className="gradient-text-primary">Before ➔ Journey ➔ After</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 font-light">
          A qualitative comparison of engineering mindset, problem validation, and rapid execution capability.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beforeAfterComparison.map((item, idx) => (
          <TiltCard key={idx} maxTilt={6} className="rounded-3xl">
            <div className="glass-panel rounded-3xl p-6 space-y-4 border border-white/10 flex flex-col justify-between h-full">
              
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                  {getPillarIcon(item.icon)}
                </div>
                <h4 className="font-display font-bold text-white text-base">
                  {item.pillar}
                </h4>
              </div>

              {/* 3 Step Comparison */}
              <div className="space-y-3 text-xs leading-relaxed">
                {/* Before */}
                <div className="p-3 rounded-2xl bg-rose-500/[0.04] border border-rose-500/20 space-y-1">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-rose-300 uppercase block">
                    Before:
                  </span>
                  <p className="text-slate-300">{item.before}</p>
                </div>

                {/* Journey */}
                <div className="p-3 rounded-2xl bg-brand-500/[0.04] border border-brand-500/20 space-y-1">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-brand-300 uppercase block">
                    The ProtoSem Journey:
                  </span>
                  <p className="text-slate-300">{item.journey}</p>
                </div>

                {/* After */}
                <div className="p-3 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/25 space-y-1">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-300 uppercase block flex items-center gap-1">
                    <span>Validated Capability (After):</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </span>
                  <p className="text-slate-200 font-medium">{item.after}</p>
                </div>
              </div>

            </div>
          </TiltCard>
        ))}
      </div>

    </div>
  );
};
