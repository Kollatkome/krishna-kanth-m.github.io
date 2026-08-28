import React, { useState, useRef } from 'react';
import {
  Lock,
  Unlock,
  LayoutDashboard,
  FileText,
  FolderGit2,
  Award,
  Compass,
  UserCheck,
  Settings,
  Plus,
  Upload,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Key,
  Database,
  X,
  Trash2,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { usePortfolio } from '../../context/portfolioStore';
import type { 
  ProjectItem, 
  EvidenceVaultItem, 
  CertificationItem, 
  ProtoSemWeek,
  AttachmentType
} from '../../data/portfolioData';

interface AdminDashboardProps {
  onBackToPortfolio: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToPortfolio }) => {
  const {
    personalInfo,
    projects,
    evidenceItems,
    certifications,
    protoSemWeeks,
    achievements,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    addProject,
    deleteProject,
    addEvidenceItem,
    deleteEvidenceItem,
    addCertification,
    deleteCertification,
    createProtoSemWeek,
    renameProtoSemWeek,
    deleteProtoSemWeek,
    addDateEntry,
    updateDateEntry,
    deleteDateEntry,
    deleteAttachmentFromEntry,
    updatePersonalInfo,
    resetToVerifiedDefaults
  } = usePortfolio();

  // Authentication state
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'documents' | 'projects' | 'certifications' | 'forge' | 'media' | 'profile' | 'settings'
  >('overview');

  // Notifications
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // --- Document Modal & Form State ---
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<EvidenceVaultItem['category']>('DOCUMENTS');
  const [docFormat, setDocFormat] = useState<EvidenceVaultItem['format']>('PDF');
  const [docDescription, setDocDescription] = useState('');
  const [docDate] = useState(new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  const [docHighlights, setDocHighlights] = useState('');
  const [docFileUrl, setDocFileUrl] = useState('');
  const [docFileSize, setDocFileSize] = useState('1.5 MB');
  const docFileInputRef = useRef<HTMLInputElement>(null);

  // --- Project Modal & Form State ---
  const [isProjModalOpen, setIsProjModalOpen] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projCategoryLabel, setProjCategoryLabel] = useState('AI & Software Engineering');
  const [projShortDesc, setProjShortDesc] = useState('');
  const [projProblem, setProjProblem] = useState('');
  const [projSolution, setProjSolution] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projRole, setProjRole] = useState('Lead Developer');
  const [projGithub, setProjGithub] = useState('');

  // --- Certification Modal State ---
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certTitle, setCertTitle] = useState('');
  const [certOrg, setCertOrg] = useState('');
  const [certScore, setCertScore] = useState('');
  const [certId, setCertId] = useState('');
  const [certSkills, setCertSkills] = useState('');
  const [certDesc, setCertDesc] = useState('');


  // --- PROTOSEM MANAGEMENT STATE ---
  // Create Week Modal
  const [isCreateWeekModalOpen, setIsCreateWeekModalOpen] = useState(false);
  const [newWeekNumber, setNewWeekNumber] = useState<number>(protoSemWeeks.length);
  const [newWeekName, setNewWeekName] = useState<string>('');

  // Delete Week Modal
  const [weekToDelete, setWeekToDelete] = useState<ProtoSemWeek | null>(null);

  // Content Management Focus
  const [selectedManageWeekId, setSelectedManageWeekId] = useState<string | null>(null);
  const selectedManageWeek = protoSemWeeks.find((w) => w.id === selectedManageWeekId || w.slug === selectedManageWeekId) || null;

  // Add Date Entry Modal
  const [isAddDateModalOpen, setIsAddDateModalOpen] = useState(false);
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [entryTitle, setEntryTitle] = useState<string>('');
  const [entryNotes, setEntryNotes] = useState<string>('');
  const [entryStatus, setEntryStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED');
  const [tempAttachments, setTempAttachments] = useState<Array<{ type: AttachmentType; name: string; url: string; size?: string }>>([]);
  const dateAttachmentInputRef = useRef<HTMLInputElement>(null);

  // Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(passkeyInput.trim())) {
      setAuthError(null);
      setPasskeyInput('');
      triggerToast('Welcome back, Krishna! Authenticated as Admin.');
    } else {
      setAuthError('Invalid Admin Passkey. Please try again.');
    }
  };

  // Document Upload Handler
  const handleDocFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        setDocFileUrl(res);
        setDocFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
        if (!docTitle) setDocTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
        triggerToast(`File loaded: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDocument = () => {
    if (!docTitle.trim()) {
      triggerToast('Please provide a document title.');
      return;
    }
    const newDoc: EvidenceVaultItem = {
      id: `doc-${Date.now()}`,
      title: docTitle.trim(),
      category: docCategory,
      format: docFormat,
      description: docDescription.trim() || 'Official verified document artifact in Krishna Kanth M Work Vault.',
      date: docDate,
      size: docFileSize,
      downloadUrl: docFileUrl || '#',
      viewUrl: docFileUrl || '#',
      previewType: 'pdf',
      highlights: docHighlights ? docHighlights.split(',').map((s) => s.trim()) : ['Verified Work Artifact'],
      verified: true
    };
    addEvidenceItem(newDoc);
    setIsDocModalOpen(false);
    setDocTitle('');
    setDocDescription('');
    setDocHighlights('');
    setDocFileUrl('');
    triggerToast('Document published to Evidence Vault!');
  };

  // Project Save Handler
  const handleSaveProject = () => {
    if (!projTitle.trim()) {
      triggerToast('Please provide a project title.');
      return;
    }
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: projTitle.trim(),
      category: 'AI_DEV',
      categoryLabel: projCategoryLabel,
      shortDescription: projShortDesc.trim() || 'Engineered software/hardware solution.',
      fullProblem: projProblem.trim() || 'Industry problem statement.',
      solution: projSolution.trim() || 'Architecture and implementation.',
      technologies: projTech.split(',').map((t) => t.trim()),
      role: projRole,
      status: 'Completed',
      icon: 'Cpu',
      accentColor: 'brand',
      githubUrl: projGithub.trim() || 'https://github.com/krishna-kanth-m',
      highlights: ['System Architecture', 'Engineered Solution'],
      evidenceType: 'Project Repository & Technical Dossier'
    };
    addProject(newProj);
    setIsProjModalOpen(false);
    setProjTitle('');
    setProjShortDesc('');
    setProjProblem('');
    setProjSolution('');
    setProjTech('');
    triggerToast('Project published to portfolio showcase!');
  };

  // Certification Save Handler
  const handleSaveCert = () => {
    if (!certTitle.trim() || !certOrg.trim()) {
      triggerToast('Please enter certification title and organization.');
      return;
    }
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      title: certTitle.trim(),
      organization: certOrg.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      score: certScore.trim(),
      credentialId: certId.trim() || 'VERIFIED-CREDENTIAL',
      verified: true,
      skills: certSkills ? certSkills.split(',').map((s) => s.trim()) : ['Cloud Computing', 'Architecture'],
      description: certDesc.trim() || 'Demonstrated domain competence and verified credential validation.'
    };
    addCertification(newCert);
    setIsCertModalOpen(false);
    setCertTitle('');
    setCertOrg('');
    setCertScore('');
    setCertId('');
    setCertSkills('');
    setCertDesc('');
    triggerToast('Certification added to portfolio!');
  };


  // --- PROTOSEM HANDLERS ---
  const handleCreateWeek = () => {
    if (newWeekNumber < 0) {
      triggerToast('Please enter a valid week number (>= 0).');
      return;
    }
    const created = createProtoSemWeek(newWeekNumber, newWeekName);
    setIsCreateWeekModalOpen(false);
    setNewWeekNumber(protoSemWeeks.length + 1);
    setNewWeekName('');
    triggerToast(`Week ${created.weekNumber < 10 ? `0${created.weekNumber}` : created.weekNumber} created successfully!`);
  };

  const handleConfirmDeleteWeek = () => {
    if (!weekToDelete) return;
    deleteProtoSemWeek(weekToDelete.id);
    if (selectedManageWeekId === weekToDelete.id) {
      setSelectedManageWeekId(null);
    }
    triggerToast(`Week ${weekToDelete.weekNumber} and all its entries have been deleted.`);
    setWeekToDelete(null);
  };

  // Date Entry Attachment Upload
  const handleEntryAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let type: AttachmentType = 'PDF';
      if (['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(ext)) {
        type = 'IMAGE';
      } else if (['ppt', 'pptx'].includes(ext)) {
        type = 'PPT';
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        if (res) {
          setTempAttachments((prev) => [
            ...prev,
            {
              type,
              name: file.name,
              url: res,
              size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
            }
          ]);
          triggerToast(`Attached: ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDateEntry = () => {
    if (!selectedManageWeekId) {
      triggerToast('Please select a week first.');
      return;
    }
    if (!entryDate) {
      triggerToast('Please choose a date.');
      return;
    }

    const createdEntry = addDateEntry(selectedManageWeekId, {
      date: entryDate,
      title: entryTitle.trim(),
      notes: entryNotes.trim(),
      status: entryStatus,
      attachments: tempAttachments.map((att) => ({
        ...att,
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        uploadedAt: new Date().toISOString()
      }))
    });

    setIsAddDateModalOpen(false);
    setEntryTitle('');
    setEntryNotes('');
    setTempAttachments([]);
    triggerToast(`Date entry for ${createdEntry.date} saved!`);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({
        personalInfo,
        projects,
        evidenceItems,
        certifications,
        protoSemWeeks,
        achievements
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `KrishnaKanth_Portfolio_Backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('Backup JSON downloaded!');
  };

  // =========================================================================
  // IF NOT AUTHENTICATED: SHOW SECURE PASSKEY LOGIN
  // =========================================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050811] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
        
        {/* Background glow blobs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-md glass-panel-elevated rounded-3xl p-8 border border-white/20 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-violet mx-auto flex items-center justify-center border border-white/20 shadow-lg shadow-brand-500/30">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Krishna Kanth M // Content Management System
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-brand-400" />
                <span>Security Passkey</span>
              </label>
              <input
                type="password"
                value={passkeyInput}
                onChange={(e) => {
                  setPasskeyInput(e.target.value);
                  setAuthError(null);
                }}
                placeholder="Enter admin passkey..."
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white text-sm font-mono focus:outline-none focus:border-brand-500 transition-colors shadow-inner"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Suite</span>
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center">
            <button
              onClick={onBackToPortfolio}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Portfolio</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED ADMIN SUITE
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#050811] text-slate-200 pb-24 selection:bg-brand-500/40 selection:text-white">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900/95 border border-brand-500/50 text-brand-200 font-mono text-xs shadow-2xl shadow-brand-500/20 backdrop-blur-xl flex items-center gap-2.5 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortfolio}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-brand-400" />
              <span>View Live Portfolio</span>
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-slate-400">Authenticated: <strong className="text-white">Krishna Kanth M</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              title="Download full JSON backup of portfolio state"
              className="px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Backup JSON</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono text-rose-300 hover:text-white bg-rose-500/15 hover:bg-rose-600 border border-rose-500/30 transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Admin</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'forge', label: `FORGE ProtoSem (${protoSemWeeks.length} Weeks)`, icon: Compass },
            { id: 'documents', label: `Documents & PDFs (${evidenceItems.length})`, icon: FileText },
            { id: 'projects', label: `Projects (${projects.length})`, icon: FolderGit2 },
            { id: 'certifications', label: `Certifications (${certifications.length})`, icon: Award },
            { id: 'profile', label: 'Profile & Resume', icon: UserCheck },
            { id: 'settings', label: 'System Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="glass-panel-elevated rounded-3xl p-6 sm:p-10 border border-white/15 space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
                System Status: Active & Synced
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white">
                Content Management Suite
              </h2>
              <p className="text-slate-300 text-sm sm:text-base font-light max-w-3xl leading-relaxed">
                Welcome to your private administration suite. All modifications made here (managing ProtoSem weekly dated journals, uploading PDFs, updating project records, adding media) persist automatically and immediately update the public portfolio website.
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'ProtoSem Weeks', val: protoSemWeeks.length, icon: Compass, color: 'text-brand-400', tab: 'forge' },
                { label: 'Projects', val: projects.length, icon: FolderGit2, color: 'text-cyan-400', tab: 'projects' },
                { label: 'Documents & PDFs', val: evidenceItems.length, icon: FileText, color: 'text-rose-400', tab: 'documents' },
                { label: 'Certifications', val: certifications.length, icon: Award, color: 'text-amber-400', tab: 'certifications' },
                { label: 'Achievements', val: achievements.length, icon: Sparkles, color: 'text-emerald-400', tab: 'settings' }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveTab(stat.tab as any)}
                    className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-brand-500/40 transition-all cursor-pointer space-y-2 group"
                  >
                    <Icon className={`w-5 h-5 ${stat.color} group-hover:scale-110 transition-transform`} />
                    <div className="text-2xl font-display font-bold text-white">
                      {stat.val}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Action Shortcuts */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-brand-300 font-bold">
                Quick CMS Actions
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setActiveTab('forge');
                    setIsCreateWeekModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-mono text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New ProtoSem Week</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('documents');
                    setIsDocModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Document / PDF</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('projects');
                    setIsProjModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Project</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FORGE PROTOSEM WEEKS & DATE JOURNAL MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'forge' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header with Create Week Trigger */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                  FORGE ProtoSem Weekly System ({protoSemWeeks.length} Weeks)
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Manage Week 00–20+ containers, edit week names, and publish date-based notes, PDFs, images & PPT decks
                </p>
              </div>

              <button
                onClick={() => {
                  setNewWeekNumber(protoSemWeeks.length);
                  setNewWeekName('');
                  setIsCreateWeekModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-mono text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-brand-500/25 hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Week</span>
              </button>
            </div>

            {/* If a Week is Selected for Content Management */}
            {selectedManageWeek ? (
              <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-brand-500/30 space-y-6">
                
                {/* Back to Week Directory Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedManageWeekId(null)}
                      className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <span className="text-[11px] font-mono text-brand-300 uppercase tracking-widest font-bold">
                        WEEK {selectedManageWeek.weekNumber < 10 ? `0${selectedManageWeek.weekNumber}` : selectedManageWeek.weekNumber} JOURNAL MANAGER
                      </span>
                      <h3 className="text-xl font-display font-bold text-white">
                        {selectedManageWeek.name || `Week ${selectedManageWeek.weekNumber}`}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEntryDate(new Date().toISOString().split('T')[0]);
                        setEntryTitle('');
                        setEntryNotes('');
                        setTempAttachments([]);
                        setIsAddDateModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Date Entry</span>
                    </button>
                  </div>
                </div>

                {/* Date Entries List for this Week */}
                <div className="space-y-4">
                  {selectedManageWeek.entries.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-3">
                      <p className="text-xs font-mono text-slate-400">
                        No dated entries in this week yet.
                      </p>
                      <button
                        onClick={() => {
                          setEntryDate(new Date().toISOString().split('T')[0]);
                          setEntryTitle('');
                          setEntryNotes('');
                          setTempAttachments([]);
                          setIsAddDateModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-mono bg-brand-600 hover:bg-brand-500 text-white"
                      >
                        + Add First Date Entry
                      </button>
                    </div>
                  ) : (
                    selectedManageWeek.entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-lg bg-brand-500/15 text-brand-300 font-mono text-xs font-bold">
                              {entry.date}
                            </span>
                            {entry.title && (
                              <h4 className="text-sm font-display font-bold text-white">{entry.title}</h4>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Toggle Publish / Draft */}
                            <button
                              onClick={() => {
                                const newStatus = entry.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
                                updateDateEntry(selectedManageWeek.id, entry.id, { status: newStatus });
                                triggerToast(`Entry status set to ${newStatus}`);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-colors ${
                                entry.status === 'PUBLISHED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                              }`}
                            >
                              {entry.status} (Click to toggle)
                            </button>

                            {/* Delete Entry */}
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete dated entry for ${entry.date}?`)) {
                                  deleteDateEntry(selectedManageWeek.id, entry.id);
                                  triggerToast('Date entry deleted.');
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20"
                              title="Delete Date Entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Notes Preview */}
                        {entry.notes && (
                          <div className="text-xs text-slate-300 font-light leading-relaxed whitespace-pre-wrap bg-white/[0.01] p-3.5 rounded-xl border border-white/5">
                            {entry.notes}
                          </div>
                        )}

                        {/* Attachments */}
                        {entry.attachments && entry.attachments.length > 0 && (
                          <div className="space-y-2 pt-1">
                            <span className="text-[11px] font-mono text-slate-400">Attachments ({entry.attachments.length}):</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                              {entry.attachments.map((att) => (
                                <div
                                  key={att.id}
                                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-2 text-xs font-mono"
                                >
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="text-brand-300 font-bold text-[10px]">[{att.type}]</span>
                                    <span className="truncate text-slate-200 text-[11px]">{att.name}</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      deleteAttachmentFromEntry(selectedManageWeek.id, entry.id, att.id);
                                      triggerToast('Attachment removed.');
                                    }}
                                    className="p-1 text-rose-400 hover:bg-rose-500/20 rounded"
                                    title="Delete Attachment"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

              </div>
            ) : (
              /* Week Directory List */
              <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {protoSemWeeks.map((week) => {
                    const numStr = week.weekNumber < 10 ? `0${week.weekNumber}` : `${week.weekNumber}`;
                    const publishedCount = week.entries.filter((e) => e.status === 'PUBLISHED').length;
                    const draftCount = week.entries.filter((e) => e.status === 'DRAFT').length;

                    return (
                      <div
                        key={week.id}
                        className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-brand-500/40 transition-all space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-300 font-mono text-xs font-bold">
                              WEEK {numStr}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                              publishedCount > 0
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : draftCount > 0
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : 'bg-white/5 text-slate-400 border-white/10'
                            }`}>
                              {publishedCount > 0 ? `${publishedCount} Published` : draftCount > 0 ? `${draftCount} Draft` : 'Empty'}
                            </span>
                          </div>

                          {/* Editable Week Name Input */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-400">Week Name / Title</label>
                            <input
                              type="text"
                              defaultValue={week.name}
                              placeholder={`Week ${numStr} name...`}
                              onBlur={(e) => {
                                if (e.target.value !== week.name) {
                                  renameProtoSemWeek(week.id, e.target.value);
                                  triggerToast(`Week ${numStr} renamed to: ${e.target.value || `Week ${numStr}`}`);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.currentTarget.blur();
                                }
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-mono">
                          <button
                            onClick={() => setSelectedManageWeekId(week.id)}
                            className="px-3 py-1.5 rounded-xl bg-brand-600/30 hover:bg-brand-600 text-brand-200 hover:text-white border border-brand-500/40 transition-all flex items-center gap-1 font-semibold"
                          >
                            <span>Manage Journal ({week.entries.length})</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setWeekToDelete(week)}
                            className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-500/20 transition-colors"
                            title="Delete Week"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: DOCUMENTS & PDF MANAGER (EVIDENCE VAULT) */}
        {/* ========================================================================= */}
        {activeTab === 'documents' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                  Evidence Vault & PDF Documents Manager
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Upload reports, certificates, and pitch decks to appear live in the public Evidence Vault
                </p>
              </div>

              <button
                onClick={() => setIsDocModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-mono text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-brand-500/25"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Document</span>
              </button>
            </div>

            {/* Document List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evidenceItems.map((doc) => (
                <div
                  key={doc.id}
                  className="glass-panel-elevated rounded-2xl p-5 border border-white/10 hover:border-brand-500/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-brand-300 font-mono text-[11px]">
                        {doc.category} // {doc.format}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{doc.date}</span>
                    </div>

                    <h3 className="text-base font-display font-bold text-white group-hover:text-brand-200 transition-colors">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-2">
                      {doc.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-mono">
                    <span className="text-slate-500">{doc.size || 'Verified'}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteEvidenceItem(doc.id)}
                        className="px-3 py-1 rounded-lg text-rose-300 hover:bg-rose-500/20 transition-colors"
                        title="Delete Document"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PROJECT MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                  Engineering Project Manager
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Manage featured projects, problem-solution statements, and repository links
                </p>
              </div>

              <button
                onClick={() => setIsProjModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/25"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="glass-panel-elevated rounded-2xl p-5 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[11px]">
                        {proj.categoryLabel}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{proj.status}</span>
                    </div>

                    <h3 className="text-base font-display font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-2">
                      {proj.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.technologies.map((tech, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded bg-white/5 text-slate-400 font-mono text-[10px]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-mono">
                    <span className="text-slate-500">Role: {proj.role}</span>
                    <button
                      onClick={() => deleteProject(proj.id)}
                      className="px-3 py-1 rounded-lg text-rose-300 hover:bg-rose-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CERTIFICATION MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'certifications' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                  Certification Manager
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Manage verified credentials and exam scores
                </p>
              </div>

              <button
                onClick={() => setIsCertModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-amber-500/25"
              >
                <Plus className="w-4 h-4" />
                <span>Add Certification</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="glass-panel-elevated rounded-2xl p-5 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[11px]">
                        {cert.organization}
                      </span>
                      {cert.score && (
                        <span className="text-[11px] font-mono font-bold text-amber-300">Score: {cert.score}</span>
                      )}
                    </div>

                    <h3 className="text-base font-display font-bold text-white group-hover:text-amber-200 transition-colors">
                      {cert.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      {cert.description}
                    </p>

                    <p className="text-[11px] font-mono text-slate-400">
                      Credential ID: <code className="text-brand-300">{cert.credentialId}</code>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-mono">
                    <span className="text-slate-500">{cert.date}</span>
                    <button
                      onClick={() => deleteCertification(cert.id)}
                      className="px-3 py-1 rounded-lg text-rose-300 hover:bg-rose-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}


        {/* ========================================================================= */}
        {/* TAB 7: PROFILE & RESUME MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn max-w-4xl">
            
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                Profile & Master Resume Settings
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Update professional headlines, contact channels, and resume document details
              </p>
            </div>

            <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Full Name</label>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Professional Title Headline</label>
                  <input
                    type="text"
                    value={personalInfo.title}
                    onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Email Address</label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Phone Number</label>
                  <input
                    type="text"
                    value={personalInfo.phone}
                    onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={personalInfo.linkedinUrl}
                    onChange={(e) => updatePersonalInfo({ linkedinUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">GitHub Profile URL</label>
                  <input
                    type="text"
                    value={personalInfo.githubUrl}
                    onChange={(e) => updatePersonalInfo({ githubUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Tagline</label>
                <textarea
                  rows={2}
                  value={personalInfo.tagline}
                  onChange={(e) => updatePersonalInfo({ tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Short Bio</label>
                <textarea
                  rows={3}
                  value={personalInfo.shortBio}
                  onChange={(e) => updatePersonalInfo({ shortBio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => triggerToast('Profile details updated!')}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-mono text-xs font-semibold shadow-lg shadow-brand-500/25"
                >
                  Save Profile Updates
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: SYSTEM SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn max-w-3xl">
            
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                System & Security Settings
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Manage backup downloads, passkeys, and verified defaults
              </p>
            </div>

            {/* Passkey Update */}
            <div className="glass-panel-elevated rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-brand-300 font-bold flex items-center gap-2">
                <Key className="w-4 h-4" />
                <span>Change Admin Passkey</span>
              </h3>
              <p className="text-xs text-slate-400">
                Set a custom passkey to protect your private administration dashboard.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  id="newPasskey"
                  placeholder="Enter new security passkey..."
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono w-72 focus:outline-none focus:border-brand-500"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('newPasskey') as HTMLInputElement;
                    if (el && el.value.trim().length >= 4) {
                      localStorage.setItem('portfolio_admin_custom_passkey', el.value.trim());
                      el.value = '';
                      triggerToast('Security passkey updated successfully!');
                    } else {
                      triggerToast('Passkey must be at least 4 characters long.');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-mono text-xs font-semibold"
                >
                  Update Passkey
                </button>
              </div>
            </div>

            {/* Reset to Defaults */}
            <div className="glass-panel rounded-3xl p-6 border border-rose-500/20 space-y-3">
              <h3 className="text-sm font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Verified Defaults</span>
              </h3>
              <p className="text-xs text-slate-400">
                Clears all custom additions and restores the verified original dataset from the master portfolio records.
              </p>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all portfolio data back to verified defaults?')) {
                    resetToVerifiedDefaults();
                    triggerToast('Portfolio reset to verified defaults.');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 font-mono text-xs font-semibold transition-all"
              >
                Reset All Records
              </button>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* CREATE PROTOSEM WEEK MODAL */}
      {/* ========================================================================= */}
      {isCreateWeekModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsCreateWeekModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/20 text-slate-200 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-display font-bold text-white">
                Create New ProtoSem Week
              </h3>
              <button onClick={() => setIsCreateWeekModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-400">Week Number (e.g. 21) *</label>
                <input
                  type="number"
                  min={0}
                  value={newWeekNumber}
                  onChange={(e) => setNewWeekNumber(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Week Name / Milestone Title (Optional)</label>
                <input
                  type="text"
                  value={newWeekName}
                  onChange={(e) => setNewWeekName(e.target.value)}
                  placeholder="e.g. Venture Pitching & Demo Day"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsCreateWeekModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWeek}
                className="px-5 py-2 rounded-xl text-xs font-mono font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md"
              >
                Create Week
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE PROTOSEM WEEK CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {weekToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setWeekToDelete(null)}
        >
          <div
            className="relative w-full max-w-md glass-panel-elevated rounded-3xl p-6 border border-rose-500/40 text-slate-200 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400 border-b border-white/10 pb-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-lg font-display font-bold text-white">
                Delete Week {weekToDelete.weekNumber < 10 ? `0${weekToDelete.weekNumber}` : weekToDelete.weekNumber}?
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Are you sure you want to delete <strong className="text-white">Week {weekToDelete.weekNumber}</strong>?
              {weekToDelete.entries.length > 0 && (
                <span className="block text-rose-300 mt-2">
                  ⚠️ Warning: This week contains {weekToDelete.entries.length} date entries and associated file attachments which will also be permanently deleted.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setWeekToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteWeek}
                className="px-5 py-2 rounded-xl text-xs font-mono font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md"
              >
                Yes, Delete Week
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD DATE ENTRY MODAL */}
      {/* ========================================================================= */}
      {isAddDateModalOpen && selectedManageWeek && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsAddDateModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/20 text-slate-200 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-brand-300 uppercase">
                  Week {selectedManageWeek.weekNumber < 10 ? `0${selectedManageWeek.weekNumber}` : selectedManageWeek.weekNumber}
                </span>
                <h3 className="text-lg font-display font-bold text-white">
                  Add Date Entry & Upload Attachments
                </h3>
              </div>
              <button onClick={() => setIsAddDateModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Date *</label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Visibility Status</label>
                  <select
                    value={entryStatus}
                    onChange={(e) => setEntryStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="PUBLISHED">PUBLISHED (Visible to Public)</option>
                    <option value="DRAFT">DRAFT (Admin Only)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Entry Headline / Focus (Optional)</label>
                <input
                  type="text"
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  placeholder="e.g. Hardware Sensor Calibration & Telemetry Sprints"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Field Notes (Markdown & formatting supported)</label>
                <textarea
                  rows={4}
                  value={entryNotes}
                  onChange={(e) => setEntryNotes(e.target.value)}
                  placeholder="• What happened today...&#10;• What challenges were solved...&#10;• Outcomes and next steps..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Attachments Section */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="text-slate-400">Attachments (PDF, Images, PPT / PPTX)</label>
                
                <input
                  ref={dateAttachmentInputRef}
                  type="file"
                  multiple
                  accept=".pdf,image/*,.ppt,.pptx"
                  onChange={handleEntryAttachmentUpload}
                  className="hidden"
                />

                <div
                  onClick={() => dateAttachmentInputRef.current?.click()}
                  className="p-4 rounded-xl border border-dashed border-white/20 hover:border-brand-500 text-center cursor-pointer bg-white/[0.02] space-y-1"
                >
                  <Upload className="w-5 h-5 mx-auto text-brand-400" />
                  <p className="text-slate-300 font-sans">
                    Click to browse files (PDF reports, photos, presentation decks)
                  </p>
                  <span className="text-[10px] text-slate-500">Supports PDF, JPG/PNG/WEBP, PPT, PPTX</span>
                </div>

                {/* Staged Attachments List */}
                {tempAttachments.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] text-brand-300 font-bold">Staged Files ({tempAttachments.length}):</span>
                    <div className="space-y-1">
                      {tempAttachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-brand-300 font-bold text-[10px]">[{att.type}]</span>
                            <span className="truncate text-white">{att.name}</span>
                            <span className="text-slate-500 text-[10px]">{att.size}</span>
                          </div>
                          <button
                            onClick={() => setTempAttachments((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsAddDateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDateEntry}
                className="px-5 py-2 rounded-xl text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
              >
                Save Date Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DOCUMENT UPLOAD MODAL */}
      {/* ========================================================================= */}
      {isDocModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsDocModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/20 text-slate-200 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-display font-bold text-white">
                Upload Document / PDF to Evidence Vault
              </h3>
              <button onClick={() => setIsDocModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-400">Document Title *</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. IoT Home Automation Capstone Report"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Category</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                  >
                    <option value="PROJECTS">PROJECTS</option>
                    <option value="FORGE">FORGE PROTOSEM</option>
                    <option value="INTERNSHIP">INTERNSHIP</option>
                    <option value="CERTIFICATIONS">CERTIFICATIONS</option>
                    <option value="ACADEMIC">ACADEMIC</option>
                    <option value="DOCUMENTS">DOCUMENTS</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Format</label>
                  <select
                    value={docFormat}
                    onChange={(e) => setDocFormat(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                  >
                    <option value="PDF">PDF</option>
                    <option value="REPORT">REPORT</option>
                    <option value="PPT">PPT</option>
                    <option value="IMAGE">IMAGE</option>
                    <option value="CODE">CODE</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">File Attachment (PDF / Document)</label>
                <input
                  ref={docFileInputRef}
                  type="file"
                  onChange={handleDocFileUpload}
                  className="hidden"
                />
                <div
                  onClick={() => docFileInputRef.current?.click()}
                  className="p-4 rounded-xl border border-dashed border-white/20 hover:border-brand-500 text-center cursor-pointer bg-white/[0.02]"
                >
                  <Upload className="w-5 h-5 mx-auto text-brand-400 mb-1" />
                  <span className="text-slate-300">
                    {docFileUrl ? 'File Selected & Encoded' : 'Click to select document file (PDF / DOC)'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Description</label>
                <textarea
                  rows={2}
                  value={docDescription}
                  onChange={(e) => setDocDescription(e.target.value)}
                  placeholder="Brief summary of the document's verification value..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Highlights (Comma-separated)</label>
                <input
                  type="text"
                  value={docHighlights}
                  onChange={(e) => setDocHighlights(e.target.value)}
                  placeholder="Hardware Schematics, System Architecture, Tested Results"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsDocModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDocument}
                className="px-5 py-2 rounded-xl text-xs font-mono font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md"
              >
                Publish Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROJECT MODAL */}
      {/* ========================================================================= */}
      {isProjModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsProjModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/20 text-slate-200 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-display font-bold text-white">
                Publish Project to Portfolio Showcase
              </h3>
              <button onClick={() => setIsProjModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-400">Project Title *</label>
                <input
                  type="text"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  placeholder="e.g. AI-Powered Retail Analytics Pipeline"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Category Tag</label>
                  <input
                    type="text"
                    value={projCategoryLabel}
                    onChange={(e) => setProjCategoryLabel(e.target.value)}
                    placeholder="AI & Machine Learning"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Your Role</label>
                  <input
                    type="text"
                    value={projRole}
                    onChange={(e) => setProjRole(e.target.value)}
                    placeholder="Lead Developer"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Technologies (Comma-separated)</label>
                <input
                  type="text"
                  value={projTech}
                  onChange={(e) => setProjTech(e.target.value)}
                  placeholder="Python, Machine Learning, SQL, REST APIs"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Short Summary</label>
                <textarea
                  rows={2}
                  value={projShortDesc}
                  onChange={(e) => setProjShortDesc(e.target.value)}
                  placeholder="One sentence description for the portfolio card..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Problem Statement</label>
                <textarea
                  rows={2}
                  value={projProblem}
                  onChange={(e) => setProjProblem(e.target.value)}
                  placeholder="What friction or challenge does this solve?"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Engineered Solution</label>
                <textarea
                  rows={2}
                  value={projSolution}
                  onChange={(e) => setProjSolution(e.target.value)}
                  placeholder="How was the architecture engineered?"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">GitHub Repository URL</label>
                <input
                  type="text"
                  value={projGithub}
                  onChange={(e) => setProjGithub(e.target.value)}
                  placeholder="https://github.com/krishna-kanth-m/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsProjModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                className="px-5 py-2 rounded-xl text-xs font-mono font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md"
              >
                Publish Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CERTIFICATION MODAL */}
      {/* ========================================================================= */}
      {isCertModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsCertModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md glass-panel-elevated rounded-3xl p-6 border border-white/20 text-slate-200 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-display font-bold text-white">Add Certification</h3>
              <button onClick={() => setIsCertModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-400">Certification Name *</label>
                <input
                  type="text"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="Google Cloud Computing Foundations"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Organization</label>
                  <input
                    type="text"
                    value={certOrg}
                    onChange={(e) => setCertOrg(e.target.value)}
                    placeholder="NPTEL / Google Cloud"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Score / Grade</label>
                  <input
                    type="text"
                    value={certScore}
                    onChange={(e) => setCertScore(e.target.value)}
                    placeholder="73%"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Credential ID</label>
                <input
                  type="text"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  placeholder="NPTEL-GCP-2024-73"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Description</label>
                <textarea
                  rows={2}
                  value={certDesc}
                  onChange={(e) => setCertDesc(e.target.value)}
                  placeholder="Competencies demonstrated..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsCertModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCert}
                className="px-5 py-2 rounded-xl text-xs font-mono font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-md"
              >
                Save Certificate
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};
