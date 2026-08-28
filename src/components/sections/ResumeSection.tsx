import React from 'react';
import { 
  FileText, 
  Printer, 
  ExternalLink, 
  CheckCircle2,
} from 'lucide-react';

export const ResumeSection: React.FC = () => {
  const handlePrint = () => {
    window.open('resume.html', '_blank');
  };

  return (
    <section id="resume-section" className="relative py-20 scroll-mt-24 space-y-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono tracking-widest uppercase">
            <FileText className="w-3.5 h-3.5 text-brand-400" />
            <span>CURRICULUM VITAE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            ATS-Optimized <span className="gradient-text-primary">Resume Suite</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Recruiter-friendly, semantic single-column document formatted for both digital inspection and instant A4 printing.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-violet via-brand-500 to-brand-cyan mx-auto rounded-full mt-2" />
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-white/10 no-print">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>ATS Compliance Score: 100% (Clean Typography & Semantic HTML)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white flex items-center gap-2 transition-all shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <a
              href="resume.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-medium glass-panel hover:bg-white/10 text-slate-300 flex items-center gap-2 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Open Standalone Page</span>
            </a>
          </div>
        </div>


      </div>
    </section>
  );
};
