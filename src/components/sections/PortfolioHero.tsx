import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  FileText, 
  Mail, 
  Phone, 
  Sparkles, 
  Cpu, 
  FolderGit2
} from 'lucide-react';
import { usePortfolio } from '../../context/portfolioStore';
import { MagneticButton } from '../ui/MagneticButton';
import { TiltCard } from '../ui/TiltCard';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';
import profilePhoto from '../../assets/profile.jpg';

const typedRoles = [
  'MCA Student @ Kumaraguru',
  'PRICE ProtoSem Innovation Trainee',
  'AI / ML & Intelligent Systems',
  'Python & SQL Data Modeling',
  'Modern Frontend Developer',
  'IoT & Applied Engineer'
];

export const PortfolioHero: React.FC = () => {
  const { personalInfo } = usePortfolio();
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = typedRoles[roleIndex];
    const typingSpeed = isDeleting ? 30 : 60;

    const timeout = setTimeout(() => {
      if (!isDeleting && text === currentRole) {
        setTimeout(() => setIsDeleting(true), 1600);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % typedRoles.length);
      } else {
        setText(currentRole.substring(0, text.length + (isDeleting ? -1 : 1)));
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex]);

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Narrative & Controls */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Chapter 01 & Status Badge */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-500/15 border border-brand-500/35 text-brand-300 text-xs font-mono tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>01 // INTRO</span>
              </span>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-white/10 text-slate-300 text-xs font-mono backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{personalInfo.statusBadge}</span>
              </div>
            </div>

            {/* Main Greeting & Name */}
            <div className="space-y-2">
              <h2 className="text-slate-400 font-display text-lg sm:text-xl font-medium tracking-wide">
                From Ideas to Creation // Hello World, I'm
              </h2>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-none">
                Krishna <span className="gradient-text-primary">Kanth M</span>
              </h1>
            </div>

            {/* Dynamic Typed Subtitle */}
            <div className="h-10 sm:h-12 flex items-center justify-center lg:justify-start text-xl sm:text-2xl font-mono text-slate-300">
              <span className="text-brand-400 mr-2">&gt;</span>
              <span className="text-brand-200 font-semibold">{text}</span>
              <span className="w-2 h-6 bg-brand-cyan ml-1 animate-pulse" />
            </div>

            {/* Concise Bio */}
            <p className="text-slate-300/90 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
              Master of Computer Applications student at <strong className="text-white font-medium">Kumaraguru College of Technology</strong> building intelligent, scalable software solutions with <span className="text-brand-300 font-medium">Artificial Intelligence, Machine Learning, Python, and Modern Web Architectures</span>.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <MagneticButton
                asAnchor
                href="#projects"
                className="px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 transition-all duration-300 gap-2.5 group"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>

              <MagneticButton
                asAnchor
                href="#evidence"
                className="px-6 py-3.5 rounded-xl font-medium text-slate-200 glass-panel hover:bg-white/10 hover:text-white border-white/15 transition-all duration-300 gap-2.5 group"
              >
                <FolderGit2 className="w-4 h-4 text-brand-cyan group-hover:scale-110 transition-transform" />
                <span>Evidence Vault</span>
              </MagneticButton>

              <MagneticButton
                asAnchor
                href="#resume-section"
                className="px-5 py-3.5 rounded-xl font-medium text-slate-300 glass-panel hover:bg-white/10 text-xs sm:text-sm gap-2"
              >
                <FileText className="w-4 h-4 text-brand-400" />
                <span>ATS Resume</span>
              </MagneticButton>
            </div>

            {/* Verified Social Channels */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-slate-400">
              <a
                href={personalInfo.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl glass-panel hover:text-brand-300 hover:border-brand-500/40 transition-all hover:scale-110 shadow-sm"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href={personalInfo.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl glass-panel hover:text-brand-300 hover:border-brand-500/40 transition-all hover:scale-110 shadow-sm"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                className="p-3 rounded-2xl glass-panel hover:text-brand-300 hover:border-brand-500/40 transition-all hover:scale-110 shadow-sm"
                aria-label="Email Krishna Kanth"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
                className="p-3 rounded-2xl glass-panel hover:text-brand-300 hover:border-brand-500/40 transition-all hover:scale-110 shadow-sm"
                aria-label="Phone Contact"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>

          </div>

          {/* Right Column: 3D Tilt Identity Holographic Card */}
          <div className="lg:col-span-5 flex justify-center">
            <TiltCard maxTilt={10} className="w-full max-w-sm rounded-3xl">
              
              {/* Outer ambient glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-violet via-brand-500 to-brand-cyan rounded-3xl blur-xl opacity-35" />

              {/* Glass Card Surface */}
              <div className="relative glass-panel-elevated rounded-3xl p-6 sm:p-8 text-center space-y-5 border border-white/15">
                
                {/* Avatar with fallback avatar API */}
                <div className="relative mx-auto w-36 h-36 sm:w-40 sm:h-40">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-brand-violet to-brand-500 blur-md opacity-60 animate-pulse-subtle" />
                  <img
                    src={profilePhoto}
                    alt={personalInfo.name}
                    id="profile-avatar"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(personalInfo.name)}&background=6366f1&color=ffffff&size=256&bold=true`;
                    }}
                    className="relative w-full h-full object-cover rounded-2xl border-2 border-white/25 shadow-2xl p-1 bg-slate-900/80"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-slate-900/95 border border-brand-500/40 px-2.5 py-1 rounded-full text-[11px] font-mono text-brand-300 flex items-center gap-1 shadow-lg">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    <span>AI/ML</span>
                  </div>
                </div>

                {/* Identity Text */}
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-bold text-white">
                    {personalInfo.name}
                  </h3>
                  <p className="text-xs text-brand-300 font-mono">
                    {personalInfo.currentProgram}
                  </p>
                  <p className="text-xs text-slate-400">
                    {personalInfo.college}
                  </p>
                </div>

                {/* Focus Badges */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  <span className="px-2.5 py-1 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-200 text-[11px] font-mono">
                    PRICE ProtoSem
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-[11px] font-mono">
                    IoT Automation
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-200 text-[11px] font-mono">
                    Google Cloud
                  </span>
                </div>

                {/* Status Indicator */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <GithubIcon className="w-3.5 h-3.5 text-slate-300" />
                    <span>@{personalInfo.githubUsername}</span>
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Active</span>
                  </span>
                </div>

              </div>
            </TiltCard>
          </div>

        </div>

      </div>
    </section>
  );
};
