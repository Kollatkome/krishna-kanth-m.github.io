import React from 'react';
import { ArrowUp } from 'lucide-react';
import { personalInfo } from '../../data/portfolioData';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-white/10 bg-slate-950/90 py-12 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center font-display font-bold text-white text-sm shadow-md shadow-brand-500/30">
            K
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {personalInfo.name}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              © {new Date().getFullYear()} • From Ideas to Creation • All rights reserved.
            </div>
          </div>
        </div>

        {/* Quick Nav Anchors */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400 font-mono">
          <a href="#about" className="hover:text-brand-300 transition-colors">02 About</a>
          <a href="#projects" className="hover:text-brand-300 transition-colors">03 Projects</a>
          <a href="#protosem" className="hover:text-brand-300 transition-colors">04 ProtoSem</a>
          <a href="#evidence" className="hover:text-brand-300 transition-colors">05 Evidence Vault</a>
          <a href="#resume-section" className="hover:text-brand-300 transition-colors">ATS Resume</a>
        </div>

        {/* Social & Back to Top */}
        <div className="flex items-center gap-3">
          <a
            href={personalInfo.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl glass-panel hover:text-brand-300 hover:border-brand-500/40 transition-all text-slate-400"
            aria-label="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href={personalInfo.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl glass-panel hover:text-brand-300 hover:border-brand-500/40 transition-all text-slate-400"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl glass-panel hover:text-brand-300 hover:border-brand-500/40 transition-all text-slate-400"
            title="Back to top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
