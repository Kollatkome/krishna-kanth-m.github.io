import React from 'react';
import { Sparkles, Globe, Code2, Brain, BarChart3 } from 'lucide-react';
import { TiltCard } from '../ui/TiltCard';

const skills = [
  {
    name: 'Web Development',
    icon: Globe,
    gradient: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/25 hover:border-cyan-400/50',
    iconColor: 'text-cyan-400',
    glow: 'group-hover:shadow-cyan-500/20',
  },
  {
    name: 'Python',
    icon: Code2,
    gradient: 'from-yellow-500/20 to-orange-500/20',
    border: 'border-yellow-500/25 hover:border-yellow-400/50',
    iconColor: 'text-yellow-400',
    glow: 'group-hover:shadow-yellow-500/20',
  },
  {
    name: 'AI & Machine Learning',
    icon: Brain,
    gradient: 'from-purple-500/20 to-brand-500/20',
    border: 'border-purple-500/25 hover:border-purple-400/50',
    iconColor: 'text-purple-400',
    glow: 'group-hover:shadow-purple-500/20',
  },
  {
    name: 'Data Analytics',
    icon: BarChart3,
    gradient: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/25 hover:border-emerald-400/50',
    iconColor: 'text-emerald-400',
    glow: 'group-hover:shadow-emerald-500/20',
  },
];

export const SkillMatrix: React.FC = () => {
  return (
    <section id="skills" className="relative py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>TECHNOLOGY ECOSYSTEM</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Technical &amp; Applied <span className="gradient-text-cyan">Competencies</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            An interactive matrix of verified languages, intelligent computing tools, and engineering methodologies.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 via-brand-500 to-purple-500 mx-auto rounded-full mt-2" />
        </div>

        {/* Skill Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <TiltCard key={skill.name} maxTilt={8} className="rounded-2xl">
                <div
                  className={`group relative glass-panel rounded-2xl p-8 flex flex-col items-center justify-center gap-4 border ${skill.border} bg-gradient-to-br ${skill.gradient} transition-all duration-300 shadow-lg ${skill.glow} hover:shadow-xl cursor-default h-full`}
                >
                  {/* Subtle ambient glow behind icon */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${skill.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Icon */}
                  <div className={`relative z-10 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${skill.iconColor}`} />
                  </div>

                  {/* Name */}
                  <span className="relative z-10 text-center font-display font-bold text-white text-base sm:text-lg tracking-wide leading-tight">
                    {skill.name}
                  </span>
                </div>
              </TiltCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};
