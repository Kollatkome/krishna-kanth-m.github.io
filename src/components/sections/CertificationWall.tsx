import React from 'react';
import { Award, CheckCircle2, Cloud } from 'lucide-react';
import { usePortfolio } from '../../context/portfolioStore';
import { TiltCard } from '../ui/TiltCard';

export const CertificationWall: React.FC = () => {
  const { certifications } = usePortfolio();

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5">
            <Award className="w-5 h-5 text-purple-400" />
            <span>Verified Credentials & Honors</span>
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Directly verified certifications from accredited platforms
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert) => (
          <TiltCard key={cert.id} maxTilt={6} className="rounded-3xl">
            <div className="glass-panel-elevated rounded-3xl p-6 sm:p-7 space-y-4 border border-white/15 flex flex-col justify-between h-full">
              
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 flex-shrink-0">
                      <Cloud className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-display font-bold text-white leading-tight">
                        {cert.title}
                      </h4>
                      <p className="text-xs text-purple-300 font-mono">
                        {cert.organization}
                      </p>
                    </div>
                  </div>
                  {cert.score && (
                    <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-mono font-bold flex-shrink-0">
                      Score: {cert.score}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {cert.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cert.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-slate-300 font-mono text-[11px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Credential ({cert.date})</span>
                </span>
                <span className="text-slate-500 text-[11px]">{cert.credentialId}</span>
              </div>

            </div>
          </TiltCard>
        ))}

        {/* Lifelong Learning Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-dashed border-white/20 flex flex-col justify-center space-y-3">
          <div className="flex items-center gap-3 text-brand-300">
            <Award className="w-6 h-6 text-brand-400" />
            <h4 className="font-display font-bold text-white text-base">
              Continuous Upskilling & Mastery
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            Regularly completing applied laboratories in neural architectures, prompt workflows, cloud orchestration, and responsive interface design.
          </p>
          <div className="text-[11px] font-mono text-brand-300">
            Current Focus: Advanced Machine Learning & Autonomous Agents
          </div>
        </div>

      </div>

    </div>
  );
};
