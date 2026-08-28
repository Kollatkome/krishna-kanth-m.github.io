import React, { useEffect } from 'react';
import { X, ExternalLink, Download, CheckCircle2 } from 'lucide-react';

interface ModalViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category?: string;
  badge?: string;
  children: React.ReactNode;
  downloadUrl?: string;
  viewUrl?: string;
}

export const ModalViewer: React.FC<ModalViewerProps> = ({
  isOpen,
  onClose,
  title,
  category,
  badge,
  children,
  downloadUrl,
  viewUrl
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/20 text-slate-200 space-y-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5 gap-4">
          <div className="space-y-1">
            {category && (
              <span className="text-xs font-mono tracking-widest text-brand-300 uppercase">
                {category}
              </span>
            )}
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white leading-tight">
              {title}
            </h3>
            {badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-brand-500/15 border border-brand-500/30 text-brand-300 mt-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{badge}</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          {children}
        </div>

        {/* Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            {viewUrl && (
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white flex items-center gap-2 transition-all shadow-md"
              >
                <span>Open Full Document</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {downloadUrl && (
              <a
                href={downloadUrl}
                download
                className="px-4 py-2 rounded-xl text-xs font-medium glass-panel hover:bg-white/10 text-slate-300 flex items-center gap-2 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-brand-400" />
                <span>Download PDF</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
