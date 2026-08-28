import React, { useState, useEffect } from 'react';
import { FileText, Menu, X, Lock } from 'lucide-react';
import { usePortfolio } from '../../context/portfolioStore';

interface GlassNavbarProps {
  onOpenAdmin?: () => void;
}

export const GlassNavbar: React.FC<GlassNavbarProps> = ({ onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { isAdminAuthenticated } = usePortfolio();

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'protosem', label: 'ProtoSem', badge: '21W' },
    { id: 'evidence', label: 'Evidence Vault' },
    { id: 'achievements', label: 'Honors' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = [
        'hero',
        'about',
        'skills',
        'projects',
        'experience',
        'education',
        'protosem',
        'evidence',
        'achievements',
        'resume',
        'contact'
      ];
      const scrollPos = window.scrollY + 180;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight > scrollPos) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 xl:top-7 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'py-3 glass-nav' : 'py-4 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <a 
          href="#hero" 
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-violet flex items-center justify-center font-display font-bold text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300 border border-white/20">
            K
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm sm:text-base text-white tracking-wide group-hover:text-brand-300 transition-colors">
              Krishna Kanth M
            </span>
            <span className="text-[10px] text-brand-300/80 font-mono flex items-center gap-1">
              <span>MCA • AI/ML • ProtoSem Fellow</span>
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-xl">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`relative px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white bg-brand-600 shadow-md shadow-brand-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Controls & Admin shortcut */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href="resume.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5 shadow-sm hover:scale-105"
          >
            <FileText className="w-3.5 h-3.5 text-brand-400" />
            <span>ATS Resume</span>
          </a>

          {/* Admin CMS Trigger */}
          <button
            onClick={() => {
              if (onOpenAdmin) onOpenAdmin();
              else window.location.hash = '#admin';
            }}
            title={isAdminAuthenticated ? "Open Admin CMS" : "Admin Login"}
            className={`p-2 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 border ${
              isAdminAuthenticated 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white border-white/10 hover:bg-white/10'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden xl:inline">{isAdminAuthenticated ? 'Admin CMS' : 'Admin'}</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => {
              if (onOpenAdmin) onOpenAdmin();
              else window.location.hash = '#admin';
            }}
            title="Admin Login"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
          >
            <Lock className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-white/10 px-4 py-6 mt-2 space-y-3 animate-fadeIn backdrop-blur-2xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between ${
                  activeSection === link.id
                    ? 'bg-brand-600 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/10 flex items-center gap-2">
            <a
              href="resume.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl text-xs font-mono text-center bg-brand-600 hover:bg-brand-500 text-white font-semibold flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Master Resume PDF</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
