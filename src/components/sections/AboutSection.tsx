import React from 'react';
import { 
  GraduationCap, 
  Award, 
  Briefcase, 
  Sparkles, 
  Compass, 
  Layers, 
  Brain, 
  Code2, 
  Calendar 
} from 'lucide-react';
import { TiltCard } from '../ui/TiltCard';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-20 scroll-mt-24 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono tracking-widest uppercase">
            <Compass className="w-3.5 h-3.5 text-brand-400" />
            <span>02 // EXPLORE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Who I Am & <span className="gradient-text-primary">What I Explore</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Deconstructing complex challenges, mastering emerging AI paradigms, and engineering responsive digital experiences.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-violet via-brand-500 to-brand-cyan mx-auto rounded-full mt-2" />
        </div>

        {/* Narrative & Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Narrative Card */}
          <div className="lg:col-span-7 glass-panel-elevated rounded-3xl p-7 sm:p-9 space-y-6 border border-white/15">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center border border-brand-500/30">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                  Intelligent Computing & Human-Centric Systems
                </h3>
                <p className="text-xs text-slate-400 font-mono">Foundations • Mindset • Objectives</p>
              </div>
            </div>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              <p>
                I am a motivated Master of Computer Applications (MCA) student at <strong className="text-white font-medium">Kumaraguru College of Technology</strong>, passionate about connecting theoretical machine learning algorithms with production-ready software architectures.
              </p>
              <p>
                With hands-on experience in frontend web development and foundational mastery in Python, SQL, and prompt engineering, I enjoy building accessible interfaces, analyzing data pipelines, and developing IoT embedded solutions.
              </p>
            </div>

            {/* 4 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="text-brand-300 font-semibold text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>AI & Machine Learning</span>
                </div>
                <p className="text-xs text-slate-400 font-light">
                  Exploratory data analysis, baseline model evaluation, and prompt engineering automation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="text-cyan-300 font-semibold text-sm flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Frontend & Design</span>
                </div>
                <p className="text-xs text-slate-400 font-light">
                  Building modular, accessible, and high-performance user interfaces with modern web standards.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="text-emerald-300 font-semibold text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Hardware & IoT Systems</span>
                </div>
                <p className="text-xs text-slate-400 font-light">
                  Microcontroller interfacing, sensor telemetry, and automated appliance control.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="text-rose-300 font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <span>Innovation Mindset</span>
                </div>
                <p className="text-xs text-slate-400 font-light">
                  Customer discovery, rapid proof-of-concept prototyping, and agile problem solving.
                </p>
              </div>
            </div>
          </div>

          {/* Academic Credentials & Internship Stack */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* MCA Card */}
            <TiltCard maxTilt={6} className="rounded-2xl">
              <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center border border-brand-500/30">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white">MCA (2025–2027)</h4>
                      <p className="text-xs text-brand-300 font-mono">Kumaraguru College of Technology</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-300 text-[11px] font-mono">
                    In Progress
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1 font-light">
                  Specializing in advanced computing systems, intelligent algorithms, and modern software engineering practices.
                </p>
              </div>
            </TiltCard>

            {/* B.Voc Card */}
            <TiltCard maxTilt={6} className="rounded-2xl">
              <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white">B.Voc in ICT (2022–2025)</h4>
                      <p className="text-xs text-emerald-300 font-mono">National College</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                    9.29 CGPA
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  First Class with Distinction • Capstone in IoT Home Automation
                </div>
              </div>
            </TiltCard>

            {/* Internship Card */}
            <TiltCard maxTilt={6} className="rounded-2xl">
              <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white">Frontend Developer Intern</h4>
                      <p className="text-xs text-purple-300 font-mono">FG Global</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 text-[11px] font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Aug 2024</span>
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1 font-light">
                  Engineered responsive UI components and modern frontend workflows adhering to industry design standards.
                </p>
              </div>
            </TiltCard>

          </div>

        </div>

      </div>
    </section>
  );
};
