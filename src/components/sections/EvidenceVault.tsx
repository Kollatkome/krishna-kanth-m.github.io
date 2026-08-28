import React, { useState } from 'react';
import { 
  FolderGit2, 
  Search, 
  FileText, 
  FileCode, 
  FileSpreadsheet, 
  Eye, 
  CheckCircle2
} from 'lucide-react';
import { type EvidenceVaultItem } from '../../data/portfolioData';
import { usePortfolio } from '../../context/portfolioStore';
import { TiltCard } from '../ui/TiltCard';
import { ModalViewer } from '../ui/ModalViewer';
import { CertificationWall } from './CertificationWall';

export const EvidenceVault: React.FC = () => {
  const { evidenceItems } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<EvidenceVaultItem | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Evidence' },
    { id: 'CERTIFICATIONS', label: 'Certificates' },
    { id: 'INTERNSHIP', label: 'Internship' },
    { id: 'PROJECTS', label: 'Projects' },
    { id: 'FORGE', label: 'ProtoSem' },
    { id: 'ACADEMIC', label: 'Academic' },
    { id: 'DOCUMENTS', label: 'Documents' }
  ];

  const filteredItems = evidenceItems.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getFormatIcon = (format: EvidenceVaultItem['format']) => {
    switch (format) {
      case 'PDF': return <FileText className="w-5 h-5 text-rose-400" />;
      case 'REPORT': return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'PPT': return <FileCode className="w-5 h-5 text-amber-400" />;
      default: return <FileText className="w-5 h-5 text-brand-400" />;
    }
  };

  return (
    <section id="evidence" className="relative py-20 scroll-mt-24 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono tracking-widest uppercase">
            <FolderGit2 className="w-3.5 h-3.5 text-brand-400" />
            <span>05 // EVIDENCE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            My Work & <span className="gradient-text-primary">Evidence Vault</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            A comprehensive, verified digital archive of technical reports, academic credentials, internship letters, and project documentation.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-violet via-brand-500 to-brand-cyan mx-auto rounded-full mt-2" />
        </div>

        {/* Search & Category Filter Bar */}
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search documents, skills, credentials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-brand-500 transition-colors shadow-inner"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>

          {/* Results Counter */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>Showing {filteredItems.length} verified artifacts</span>
            <span className="text-brand-300">Click any document to inspect</span>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <TiltCard key={item.id} maxTilt={6} className="rounded-3xl">
              <div 
                className="glass-panel glass-card-interactive rounded-3xl p-6 sm:p-7 space-y-5 border border-white/10 flex flex-col justify-between h-full cursor-pointer group"
                onClick={() => setActiveModalItem(item)}
              >
                
                <div className="space-y-4">
                  {/* Top Bar: Icon + Category + Format */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                      {getFormatIcon(item.format)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-brand-300">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-200 border border-brand-500/20">
                        {item.format}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-display font-bold text-white group-hover:text-brand-200 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-1">
                    {item.highlights.slice(0, 2).map((h, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <CheckCircle2 className="w-3 h-3 text-brand-400 flex-shrink-0" />
                        <span className="line-clamp-1">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar: Meta + Quick View */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-[11px] text-slate-500">{item.date} {item.size ? `• ${item.size}` : ''}</span>
                  <span className="text-brand-300 group-hover:text-white transition-colors flex items-center gap-1">
                    <span>Inspect</span>
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            </TiltCard>
          ))}
        </div>

        {/* Certification Wall Component */}
        <div className="pt-10 border-t border-white/10">
          <CertificationWall />
        </div>

      </div>

      {/* Document Modal Previewer */}
      {activeModalItem && (
        <ModalViewer
          isOpen={Boolean(activeModalItem)}
          onClose={() => setActiveModalItem(null)}
          title={activeModalItem.title}
          category={activeModalItem.category}
          badge="Verified Artifact"
          viewUrl={activeModalItem.viewUrl}
          downloadUrl={activeModalItem.downloadUrl}
        >
          <div className="space-y-5">
            
            {/* Description */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-brand-300 font-semibold">
                Document Description
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed font-light">
                {activeModalItem.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Key Verification Points
              </h4>
              <ul className="space-y-2">
                {activeModalItem.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Document Metadata Table */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-xs font-mono">
              <div>
                <span className="text-slate-500 block">Category</span>
                <span className="text-white font-medium">{activeModalItem.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block">File Format</span>
                <span className="text-white font-medium">{activeModalItem.format}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Date Archived</span>
                <span className="text-white font-medium">{activeModalItem.date}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Verification Status</span>
                <span className="text-emerald-400 font-medium">● Verified Record</span>
              </div>
            </div>

          </div>
        </ModalViewer>
      )}

    </section>
  );
};
