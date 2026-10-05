import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Presentation,
  Calendar,
  X,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Upload,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link,
  AlertTriangle,
  Check,
  RefreshCw,
  Pencil,
  Globe,
  BookOpen,
  Image as ImageIcon,
  Box
} from 'lucide-react';
import { usePortfolio } from '../../context/portfolioStore';
import type { ProtoSemWeek, ProtoSemDateEntry } from '../../types/protosem';
import { generateWeekPDF } from '../../utils/pdfReportGenerator';
import { resolveAssetUrl } from '../../utils/assetUrl';
import { Week6MatrixChoice, type MatrixPillChoice } from './Week6MatrixChoice';

interface WeekWorkspaceProps {
  initialWeekSlug?: string;
  onBackToPortfolio: () => void;
}

// ─── Week 6 Pill / Reality Classifier Helper ─────────────────────────────────
const getWeek6EntryType = (entry: ProtoSemDateEntry): 'laser' | '3d' | 'cad' | 'other' => {
  const title = (entry.title || '').toLowerCase();
  const id = (entry.id || '').toLowerCase();
  
  if (
    title.includes('3d print') || 
    title.includes('slicing') || 
    title.includes('bambu') || 
    id.includes('3d-printing') || 
    id.includes('02_tuesday')
  ) {
    return '3d';
  }
  if (
    title.includes('laser') || 
    title.includes('scanning') || 
    id.includes('laser') || 
    id.includes('01_monday')
  ) {
    return 'laser';
  }
  if (
    title.includes('clay') || 
    title.includes('designing in 3d') || 
    title.includes('fusion') || 
    id.includes('06_saturday')
  ) {
    return 'cad';
  }
  return 'other';
};

// ─── Minimal Rich Text Editor ────────────────────────────────────────────────
interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minRows?: number;
}

const RichEditor: React.FC<RichEditorProps> = ({ value, onChange, placeholder = 'Type notes here...', minRows = 5 }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (prefix: string, suffix: string = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const newVal = value.slice(0, start) + replacement + value.slice(end);
    onChange(newVal);
    setTimeout(() => {
      el.focus();
      const cursor = start + prefix.length + (selected ? selected.length : 4);
      el.setSelectionRange(cursor, cursor);
    }, 0);
  };

  const insertLinePrefix = (prefix: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newVal = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(newVal);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, label: 'Bold', action: () => insertFormat('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertFormat('_', '_') },
    { icon: Heading1, label: 'Heading 1', action: () => insertLinePrefix('# ') },
    { icon: Heading2, label: 'Heading 2', action: () => insertLinePrefix('## ') },
    { icon: List, label: 'Bullet List', action: () => insertLinePrefix('• ') },
    { icon: ListOrdered, label: 'Numbered', action: () => insertLinePrefix('1. ') },
    { icon: Link, label: 'Link', action: () => insertFormat('[', '](url)') },
  ];

  return (
    <div className="rounded-2xl border border-white/15 overflow-hidden bg-white/[0.02] focus-within:border-brand-500/60 transition-colors">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-white/10 bg-white/[0.02]">
        {toolbarButtons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.label}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); btn.action(); }}
              title={btn.label}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          );
        })}
        <div className="ml-auto text-[10px] font-mono text-slate-500">Markdown supported</div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={minRows}
        className="w-full px-4 py-3 bg-transparent text-slate-200 text-sm font-sans leading-relaxed resize-y focus:outline-none placeholder:text-slate-500"
        style={{ minHeight: `${minRows * 1.625}rem` }}
      />
    </div>
  );
};

// ─── Render formatted notes (theme-aware markdown rendering) ───────────────────
type NoteTheme = 'red' | 'blue' | 'purple' | 'brand';

const renderNotes = (text: string, theme: NoteTheme = 'brand') => {
  if (!text) return null;
  const rawLines = text.split('\n');

  // Theme styling helpers
  const styles = {
    red: {
      container: 'text-rose-100',
      p: 'text-rose-100/90 font-light leading-relaxed',
      h1: 'text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 bg-clip-text text-transparent mt-6 mb-3 tracking-tight',
      h2: 'text-lg sm:text-xl font-bold text-red-300 border-b border-red-500/30 pb-2 mt-5 mb-2.5 flex items-center gap-2',
      h3: 'text-base font-semibold text-red-400 mt-4 mb-1.5',
      blockquote: 'border-l-4 border-red-500 pl-4 py-2.5 my-3 text-rose-200 italic bg-red-950/40 rounded-r-2xl font-sans border-y-0 border-r-0',
      bullet: 'text-red-400 font-bold',
      num: 'text-red-400 font-mono font-bold text-xs',
      listText: 'text-rose-100/90 leading-relaxed',
      tableTh: 'bg-red-950/90 border-red-800/80 text-red-200 text-xs font-mono uppercase tracking-wider',
      tableTd: 'border-red-500/20 text-rose-100/90 text-xs',
      tableBorder: 'border-red-500/30 bg-red-950/20',
      hr: 'border-red-500/25 my-5',
      inlineStrong: 'text-red-200 font-bold',
      inlineEm: 'text-rose-300 italic',
      inlineLink: 'text-red-400 hover:text-red-200 underline font-semibold transition-colors',
      badge: 'bg-red-500/20 border-red-500/40 text-red-300',
    },
    blue: {
      container: 'text-cyan-100',
      p: 'text-cyan-100/90 font-light leading-relaxed',
      h1: 'text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-300 bg-clip-text text-transparent mt-6 mb-3 tracking-tight',
      h2: 'text-lg sm:text-xl font-bold text-cyan-200 border-b border-cyan-500/30 pb-2 mt-5 mb-2.5 flex items-center gap-2',
      h3: 'text-base font-semibold text-cyan-300 mt-4 mb-1.5',
      blockquote: 'border-l-4 border-cyan-400 pl-4 py-2.5 my-3 text-cyan-200 italic bg-cyan-950/40 rounded-r-2xl font-sans border-y-0 border-r-0',
      bullet: 'text-cyan-400 font-bold',
      num: 'text-cyan-400 font-mono font-bold text-xs',
      listText: 'text-cyan-100/90 leading-relaxed',
      tableTh: 'bg-cyan-950/90 border-cyan-800/80 text-cyan-200 text-xs font-mono uppercase tracking-wider',
      tableTd: 'border-cyan-500/20 text-cyan-100/90 text-xs',
      tableBorder: 'border-cyan-500/30 bg-cyan-950/20',
      hr: 'border-cyan-500/25 my-5',
      inlineStrong: 'text-cyan-200 font-bold',
      inlineEm: 'text-cyan-300 italic',
      inlineLink: 'text-cyan-300 hover:text-cyan-100 underline font-semibold transition-colors',
      badge: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
    },
    purple: {
      container: 'text-purple-100',
      p: 'text-purple-100/90 font-light leading-relaxed',
      h1: 'text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-300 via-fuchsia-200 to-pink-300 bg-clip-text text-transparent mt-6 mb-3 tracking-tight',
      h2: 'text-lg sm:text-xl font-bold text-purple-200 border-b border-purple-500/30 pb-2 mt-5 mb-2.5 flex items-center gap-2',
      h3: 'text-base font-semibold text-purple-300 mt-4 mb-1.5',
      blockquote: 'border-l-4 border-purple-400 pl-4 py-2.5 my-3 text-purple-200 italic bg-purple-950/40 rounded-r-2xl font-sans border-y-0 border-r-0',
      bullet: 'text-purple-400 font-bold',
      num: 'text-purple-400 font-mono font-bold text-xs',
      listText: 'text-purple-100/90 leading-relaxed',
      tableTh: 'bg-purple-950/90 border-purple-800/80 text-purple-200 text-xs font-mono uppercase tracking-wider',
      tableTd: 'border-purple-500/20 text-purple-100/90 text-xs',
      tableBorder: 'border-purple-500/30 bg-purple-950/20',
      hr: 'border-purple-500/25 my-5',
      inlineStrong: 'text-purple-200 font-bold',
      inlineEm: 'text-purple-300 italic',
      inlineLink: 'text-purple-300 hover:text-purple-100 underline font-semibold transition-colors',
      badge: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
    },
    brand: {
      container: 'text-slate-200',
      p: 'text-slate-200 font-light leading-relaxed',
      h1: 'text-2xl sm:text-3xl font-extrabold text-white mt-6 mb-3 tracking-tight',
      h2: 'text-lg sm:text-xl font-bold text-brand-200 border-b border-white/10 pb-2 mt-5 mb-2.5 flex items-center gap-2',
      h3: 'text-base font-semibold text-brand-300 mt-4 mb-1.5',
      blockquote: 'border-l-4 border-brand-400 pl-4 py-2.5 my-3 text-slate-300 italic bg-brand-500/10 rounded-r-2xl font-sans border-y-0 border-r-0',
      bullet: 'text-brand-400 font-bold',
      num: 'text-brand-400 font-mono font-bold text-xs',
      listText: 'text-slate-200 leading-relaxed',
      tableTh: 'bg-white/10 border-white/15 text-slate-200 text-xs font-mono uppercase tracking-wider',
      tableTd: 'border-white/10 text-slate-200 text-xs',
      tableBorder: 'border-white/10 bg-white/[0.02]',
      hr: 'border-white/10 my-5',
      inlineStrong: 'text-white font-bold',
      inlineEm: 'text-slate-300 italic',
      inlineLink: 'text-brand-400 hover:text-brand-300 underline font-semibold transition-colors',
      badge: 'bg-brand-500/15 border-brand-500/30 text-brand-300',
    }
  }[theme];

  // Group lines to recognize tables
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // 1. Table Detection
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith('|') && rawLines[i].trim().endsWith('|')) {
        tableLines.push(rawLines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0].split('|').slice(1, -1).map(c => c.trim());
        const dataRows = tableLines.slice(2).map(row => row.split('|').slice(1, -1).map(c => c.trim()));

        elements.push(
          <div key={`table-${i}`} className={`my-4 overflow-x-auto rounded-2xl border ${styles.tableBorder} shadow-lg`}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10">
                  {headerRow.map((cell, cIdx) => (
                    <th key={cIdx} className={`px-4 py-3 font-semibold ${styles.tableTh}`}>
                      {renderInline(cell, styles)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className={`px-4 py-2.5 ${styles.tableTd}`}>
                        {renderInline(cell, styles)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 2. Standalone image on line: ![alt](url)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const alt = imgMatch[1];
      const src = imgMatch[2];
      elements.push(
        <figure key={`img-${i}`} className={`my-5 rounded-2xl overflow-hidden border ${styles.tableBorder} bg-slate-950/70 shadow-2xl group`}>
          <div className="relative overflow-hidden bg-black/40 flex items-center justify-center p-2">
            <img
              src={resolveAssetUrl(src)}
              alt={alt || 'Document Photo'}
              loading="lazy"
              className="w-full h-auto max-h-[520px] object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
            />
          </div>
          {alt && (
            <figcaption className="px-4 py-2.5 bg-slate-900/90 border-t border-white/10 text-xs font-mono flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 animate-pulse ${theme === 'red' ? 'bg-red-400' : theme === 'blue' ? 'bg-cyan-400' : theme === 'purple' ? 'bg-purple-400' : 'bg-brand-400'}`} />
              <span className={theme === 'red' ? 'text-rose-200 truncate' : theme === 'blue' ? 'text-cyan-200 truncate' : theme === 'purple' ? 'text-purple-200 truncate' : 'text-slate-300 truncate'}>{alt}</span>
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // 3. Headings
    if (line.startsWith('# ')) {
      elements.push(<h1 key={`h1-${i}`} className={styles.h1}>{line.slice(2)}</h1>);
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={`h2-${i}`} className={styles.h2}>{line.slice(3)}</h2>);
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={`h3-${i}`} className={styles.h3}>{line.slice(4)}</h3>);
      i++;
      continue;
    }

    // 4. Blockquotes
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={`quote-${i}`} className={styles.blockquote}>
          {renderInline(line.slice(2), styles)}
        </blockquote>
      );
      i++;
      continue;
    }

    // 5. Horizontal Rule
    if (trimmed === '---' || trimmed === '***') {
      elements.push(<hr key={`hr-${i}`} className={styles.hr} />);
      i++;
      continue;
    }

    // 6. Bullet Lists
    if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={`bullet-${i}`} className="flex items-start gap-2 py-0.5">
          <span className={`${styles.bullet} mt-1.5 flex-shrink-0 text-xs`}>•</span>
          <span className={styles.listText}>{renderInline(line.replace(/^[•\-\*]\s+/, ''), styles)}</span>
        </div>
      );
      i++;
      continue;
    }

    // 7. Numbered Lists
    if (/^\d+\. /.test(line)) {
      const match = line.match(/^(\d+)\. (.*)/);
      if (match) {
        elements.push(
          <div key={`num-${i}`} className="flex items-start gap-2 py-0.5">
            <span className={`${styles.num} mt-1 flex-shrink-0`}>{match[1]}.</span>
            <span className={styles.listText}>{renderInline(match[2], styles)}</span>
          </div>
        );
        i++;
        continue;
      }
    }

    if (trimmed === '') {
      elements.push(<div key={`blank-${i}`} className="h-1.5" />);
    } else {
      elements.push(
        <p key={`p-${i}`} className={`py-0.5 ${styles.p}`}>
          {renderInline(line, styles)}
        </p>
      );
    }
    i++;
  }

  return (
    <div className={`max-w-none text-sm leading-relaxed space-y-1.5 ${styles.container}`}>
      {elements}
    </div>
  );
};

interface InlineStyles {
  inlineStrong?: string;
  inlineEm?: string;
  inlineLink?: string;
}

const renderInline = (text: string, styles?: InlineStyles) => {
  const parts = text.split(/(!\[.*?\]\(.*?\)|\*\*.*?\*\*|_.*?_|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith('![') && part.endsWith(')')) {
      const imgMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
        return (
          <img
            key={i}
            src={resolveAssetUrl(imgMatch[2])}
            alt={imgMatch[1] || 'Embedded image'}
            className="rounded-xl border border-white/15 my-2 max-h-96 object-contain shadow-lg inline-block"
          />
        );
      }
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className={styles?.inlineStrong || 'text-white font-bold'}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('_') && part.endsWith('_')) {
      return <em key={i} className={styles?.inlineEm || 'text-slate-300 italic'}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('[') && part.endsWith(')')) {
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a
            key={i}
            href={resolveAssetUrl(linkMatch[2])}
            target="_blank"
            rel="noopener noreferrer"
            className={styles?.inlineLink || 'text-brand-400 hover:text-brand-300 underline font-medium'}
          >
            {linkMatch[1]}
          </a>
        );
      }
    }
    return part;
  });
};

// ─── Drag & Drop File Zone ────────────────────────────────────────────────────
interface DropZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  label?: string;
}

const DropZone: React.FC<DropZoneProps> = ({ onFiles, accept = '.pdf,image/*,.ppt,.pptx', label }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  }, [onFiles]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
        isDragging
          ? 'border-brand-400 bg-brand-500/10'
          : 'border-white/15 hover:border-brand-500/50 bg-white/[0.01] hover:bg-white/[0.03]'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            onFiles(Array.from(e.target.files));
            e.target.value = '';
          }
        }}
      />
      <Upload className={`w-5 h-5 mx-auto mb-2 transition-colors ${isDragging ? 'text-brand-400' : 'text-slate-500'}`} />
      <p className="text-xs text-slate-400 font-sans">
        {label || 'Drop PDF, images, or PPT files here'}
      </p>
      <p className="text-[10px] text-slate-600 mt-1 font-mono">or click to browse</p>
    </div>
  );
};

// ─── Autosave Status ──────────────────────────────────────────────────────────
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// ─── Main Component ───────────────────────────────────────────────────────────
export const WeekWorkspace: React.FC<WeekWorkspaceProps> = ({
  initialWeekSlug = 'week-00',
  onBackToPortfolio
}) => {
  const {
    protoSemWeeks,
    isAdminAuthenticated,
    renameProtoSemWeek,
    addDateEntry,
    updateDateEntry,
    deleteDateEntry,
    addAttachmentToEntry,
    deleteAttachmentFromEntry
  } = usePortfolio();

  // Normalize initial slug
  const normalizedInitial = initialWeekSlug === 'week-0' ? 'week-00' : initialWeekSlug;
  const [currentSlug, setCurrentSlug] = useState<string>(normalizedInitial);

  // Active week lookup
  const activeWeekIndex = protoSemWeeks.findIndex(
    (w) => w.slug === currentSlug || w.id === currentSlug || `week-${w.weekNumber}` === currentSlug
  );
  const activeWeek: ProtoSemWeek = activeWeekIndex !== -1 ? protoSemWeeks[activeWeekIndex] : protoSemWeeks[0];

  // ── State ──────────────────────────────────────────────────────────────────

  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Week name editing
  const [editingWeekName, setEditingWeekName] = useState(false);
  const [weekNameDraft, setWeekNameDraft] = useState(activeWeek?.name || '');

  // Add Date Entry modal state
  const [showAddDateModal, setShowAddDateModal] = useState(false);
  const [newEntryDate, setNewEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryNotes, setNewEntryNotes] = useState('');
  const [newEntryStatus, setNewEntryStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED');
  const [newEntryFiles, setNewEntryFiles] = useState<Array<{ type: 'PDF' | 'IMAGE' | 'PPT'; name: string; url: string; size: string }>>([]);

  // Edit Entry state
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editStatus, setEditStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED');
  const [editSaveStatus, setEditSaveStatus] = useState<SaveStatus>('idle');

  // Delete confirmation
  const [confirmDeleteEntryId, setConfirmDeleteEntryId] = useState<string | null>(null);
  const [confirmDeleteAttachment, setConfirmDeleteAttachment] = useState<{ entryId: string; attachmentId: string } | null>(null);

  // Upload progress simulation
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);

  // Sync week name when week changes
  useEffect(() => {
    setWeekNameDraft(activeWeek?.name || '');
    setEditingEntryId(null);
  }, [activeWeek?.id]);

  // Matrix Red Pill vs Blue Pill Choice state for Week 6
  const [week6Pill, setWeek6Pill] = useState<MatrixPillChoice>('all');

  // ── Computed ───────────────────────────────────────────────────────────────
  const numStr = activeWeek.weekNumber < 10 ? `0${activeWeek.weekNumber}` : `${activeWeek.weekNumber}`;
  const weekDisplayName = activeWeek.name || `Week ${numStr}`;
  const isWeek6 = activeWeek.weekNumber === 6 || activeWeek.slug === 'week-06';

  const visibleEntries = (activeWeek.entries || []).filter(
    (entry) => isAdminAuthenticated || entry.status === 'PUBLISHED'
  );
  const sortedEntries = [...visibleEntries].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const displayedEntries = (isWeek6 && week6Pill !== 'all')
    ? sortedEntries.filter((e) => {
        const type = getWeek6EntryType(e);
        if (week6Pill === 'laser') return type === 'laser';
        if (week6Pill === '3d') return type === '3d';
        return true;
      })
    : sortedEntries;

  // Stats for overview
  const totalPDFs = sortedEntries.reduce((s, e) => s + e.attachments.filter(a => a.type === 'PDF').length, 0);
  const totalPPTs = sortedEntries.reduce((s, e) => s + e.attachments.filter(a => a.type === 'PPT').length, 0);
  const totalNotes = sortedEntries.filter(e => e.notes?.trim()).length;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleWeekNav = (dir: 'prev' | 'next') => {
    const idx = dir === 'prev' ? activeWeekIndex - 1 : activeWeekIndex + 1;
    if (idx < 0 || idx >= protoSemWeeks.length) return;
    const w = protoSemWeeks[idx];
    setCurrentSlug(w.slug);
    window.location.hash = `#protosem/${w.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportPDF = async () => {
    try {
      setIsExportingPDF(true);
      await generateWeekPDF({ week: activeWeek, entries: sortedEntries });
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleSaveWeekName = () => {
    renameProtoSemWeek(activeWeek.id, weekNameDraft);
    setEditingWeekName(false);
  };

  // ── File processing helper ─────────────────────────────────────────────────
  const processFiles = (files: File[], onDone: (atts: Array<{ type: 'PDF' | 'IMAGE' | 'PPT'; name: string; url: string; size: string }>) => void) => {
    const results: Array<{ type: 'PDF' | 'IMAGE' | 'PPT'; name: string; url: string; size: string }> = [];
    let pending = files.length;

    // Show uploading state
    setUploadingFiles(files.map(f => f.name));

    files.forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let type: 'PDF' | 'IMAGE' | 'PPT' = 'PDF';
      if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) type = 'IMAGE';
      else if (['ppt', 'pptx'].includes(ext)) type = 'PPT';

      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        if (url) {
          results.push({
            type,
            name: file.name,
            url,
            size: file.size > 1024 * 1024
              ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
              : `${Math.round(file.size / 1024)} KB`
          });
        }
        pending--;
        if (pending === 0) {
          setUploadingFiles([]);
          onDone(results);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // ── Add New Date Entry ─────────────────────────────────────────────────────
  const handleAddEntryFiles = (files: File[]) => {
    processFiles(files, (atts) => {
      setNewEntryFiles(prev => [...prev, ...atts]);
    });
  };

  const handleSaveNewEntry = (status: 'DRAFT' | 'PUBLISHED') => {
    setSaveStatus('saving');
    try {
      const entry = addDateEntry(activeWeek.id, {
        date: newEntryDate,
        title: newEntryTitle.trim(),
        notes: newEntryNotes.trim(),
        status,
        attachments: newEntryFiles.map(f => ({
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: f.type,
          name: f.name,
          url: f.url,
          size: f.size,
          uploadedAt: new Date().toISOString()
        }))
      });

      if (entry) {
        setSaveStatus('saved');
        setShowAddDateModal(false);
        setNewEntryDate(new Date().toISOString().split('T')[0]);
        setNewEntryTitle('');
        setNewEntryNotes('');
        setNewEntryFiles([]);
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch {
      setSaveStatus('error');
    }
  };

  // ── Edit Entry ─────────────────────────────────────────────────────────────
  const startEditEntry = (entry: ProtoSemDateEntry) => {
    setEditingEntryId(entry.id);
    setEditNotes(entry.notes || '');
    setEditTitle(entry.title || '');
    setEditDate(entry.date);
    setEditStatus(entry.status);
    setEditSaveStatus('idle');
  };

  const handleSaveEdit = (status?: 'DRAFT' | 'PUBLISHED') => {
    if (!editingEntryId) return;
    setEditSaveStatus('saving');
    try {
      updateDateEntry(activeWeek.id, editingEntryId, {
        date: editDate,
        title: editTitle.trim(),
        notes: editNotes.trim(),
        status: status ?? editStatus
      });
      setEditSaveStatus('saved');
      setTimeout(() => {
        setEditSaveStatus('idle');
        if (status) setEditingEntryId(null);
      }, 1200);
    } catch {
      setEditSaveStatus('error');
    }
  };

  // Autosave edit notes (debounced)
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleEditNotesChange = (val: string) => {
    setEditNotes(val);
    setEditSaveStatus('saving');
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      if (editingEntryId) {
        try {
          updateDateEntry(activeWeek.id, editingEntryId, { notes: val.trim() });
          setEditSaveStatus('saved');
          setTimeout(() => setEditSaveStatus('idle'), 1500);
        } catch {
          setEditSaveStatus('error');
        }
      }
    }, 1500);
  };

  const handleAddAttachmentToExistingEntry = (entryId: string, files: File[]) => {
    processFiles(files, (atts) => {
      atts.forEach(att => {
        addAttachmentToEntry(activeWeek.id, entryId, {
          type: att.type,
          name: att.name,
          url: att.url,
          size: att.size
        });
      });
    });
  };

  // ── Format display date ────────────────────────────────────────────────────
  const formatDisplayDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // ── Save status indicator ──────────────────────────────────────────────────
  const SaveIndicator = ({ status }: { status: SaveStatus }) => {
    if (status === 'idle') return null;
    return (
      <span className={`flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-lg ${
        status === 'saving' ? 'text-amber-300 bg-amber-500/10' :
        status === 'saved' ? 'text-emerald-300 bg-emerald-500/10' :
        'text-rose-300 bg-rose-500/10'
      }`}>
        {status === 'saving' && <><RefreshCw className="w-3 h-3 animate-spin" /> Saving...</>}
        {status === 'saved' && <><Check className="w-3 h-3" /> Saved ✓</>}
        {status === 'error' && <><AlertTriangle className="w-3 h-3" /> Error</>}
      </span>
    );
  };

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-black text-neutral-200 pb-24 selection:bg-white/15 selection:text-white">

      {/* ── Sticky Navigation Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortfolio}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-brand-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Timeline</span>
            </button>
            <span className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              ProtoSem // <span className="text-white font-semibold">WEEK {numStr}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleWeekNav('prev')}
              disabled={activeWeekIndex <= 0}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <select
              value={activeWeek.slug}
              onChange={(e) => {
                setCurrentSlug(e.target.value);
                window.location.hash = `#protosem/${e.target.value}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-2 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-brand-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer max-w-[160px] sm:max-w-[200px] truncate"
            >
              {protoSemWeeks.map((w) => {
                const wNum = w.weekNumber < 10 ? `0${w.weekNumber}` : `${w.weekNumber}`;
                return (
                  <option key={w.id} value={w.slug}>
                    Week {wNum}{w.name ? `: ${w.name}` : ''}
                  </option>
                );
              })}
            </select>

            <button
              onClick={() => handleWeekNav('next')}
              disabled={activeWeekIndex >= protoSemWeeks.length - 1}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 ml-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingPDF ? 'Generating...' : 'PDF Dossier'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">

        {/* ── Week Banner ────────────────────────────────────────────────────── */}
        <div className="glass-panel-elevated rounded-3xl p-6 sm:p-10 border border-white/15 space-y-5 relative overflow-hidden">
          {/* Glow accent */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono uppercase tracking-widest font-bold">
              <BookOpen className="w-3 h-3" />
              <span>WEEK {numStr} // SPRINT JOURNAL</span>
            </div>

            {isAdminAuthenticated && (
              <div className="flex items-center gap-2">
                <SaveIndicator status={saveStatus} />
                {!showAddDateModal && (
                  <button
                    onClick={() => {
                      setNewEntryDate(new Date().toISOString().split('T')[0]);
                      setNewEntryNotes('');
                      setNewEntryTitle('');
                      setNewEntryFiles([]);
                      setShowAddDateModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all hover:scale-105"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Date Entry</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Week Title (editable for admin) */}
          {isAdminAuthenticated && editingWeekName ? (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={weekNameDraft}
                onChange={(e) => setWeekNameDraft(e.target.value)}
                autoFocus
                placeholder={`Week ${numStr} name...`}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveWeekName(); if (e.key === 'Escape') setEditingWeekName(false); }}
                className="flex-1 text-3xl sm:text-4xl font-display font-extrabold text-white bg-transparent border-b-2 border-brand-500 focus:outline-none pb-1 placeholder:text-slate-600"
              />
              <button onClick={handleSaveWeekName} className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white"><Check className="w-5 h-5" /></button>
              <button onClick={() => setEditingWeekName(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-3 group">
              <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
                {weekDisplayName}
              </h1>
              {isAdminAuthenticated && (
                <button
                  onClick={() => { setWeekNameDraft(activeWeek.name || ''); setEditingWeekName(true); }}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Rename week"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Stats Row */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-white/10">
            {[
              { icon: Calendar, val: sortedEntries.length, label: sortedEntries.length === 1 ? 'Day Entry' : 'Day Entries', color: 'text-brand-300' },
              { icon: FileText, val: totalNotes, label: 'With Notes', color: 'text-cyan-300' },
              { icon: FileText, val: totalPDFs, label: 'Documents', color: 'text-rose-300' },
              { icon: Presentation, val: totalPPTs, label: 'Presentations', color: 'text-amber-300' },
            ].map(({ icon: Icon, val, label, color }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs font-mono">
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <span className="text-white font-bold">{val}</span>
                <span className="text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Add Date Entry Modal (inline, not a floating modal) ───────────── */}
        {isAdminAuthenticated && showAddDateModal && (
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-emerald-500/30 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Add Date Entry
              </h3>
              <button onClick={() => setShowAddDateModal(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Date *</label>
                <input
                  type="date"
                  value={newEntryDate}
                  onChange={(e) => setNewEntryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Headline / Focus (Optional)</label>
                <input
                  type="text"
                  value={newEntryTitle}
                  onChange={(e) => setNewEntryTitle(e.target.value)}
                  placeholder="e.g. Hardware sensor calibration sprint"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Field Notes</label>
              <RichEditor
                value={newEntryNotes}
                onChange={setNewEntryNotes}
                placeholder="Type what happened today... supports **bold**, _italic_, # Headings, • bullets"
                minRows={6}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-3.5 h-3.5" />
                Attachments (PDF, Images, PPT/PPTX)
              </label>
              <DropZone onFiles={handleAddEntryFiles} />

              {/* Upload progress */}
              {uploadingFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {uploadingFiles.map(name => (
                    <span key={name} className="flex items-center gap-1.5 text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg animate-pulse">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                      Loading {name}...
                    </span>
                  ))}
                </div>
              )}

              {newEntryFiles.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-mono text-emerald-300">Staged ({newEntryFiles.length}):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {newEntryFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-[10px] font-bold font-mono text-brand-300 bg-brand-500/15 px-1.5 py-0.5 rounded">{f.type}</span>
                          <span className="text-xs text-white truncate">{f.name}</span>
                          <span className="text-[10px] text-slate-500 flex-shrink-0">{f.size}</span>
                        </div>
                        <button
                          onClick={() => setNewEntryFiles(prev => prev.filter((_, idx) => idx !== i))}
                          className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg flex-shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <select
                  value={newEntryStatus}
                  onChange={(e) => setNewEntryStatus(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="PUBLISHED">PUBLISHED — Visible to Public</option>
                  <option value="DRAFT">DRAFT — Admin Only</option>
                </select>
                <SaveIndicator status={saveStatus} />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddDateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveNewEntry('DRAFT')}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Draft
                </button>
                <button
                  onClick={() => handleSaveNewEntry('PUBLISHED')}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all flex items-center gap-1.5 hover:scale-105"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Publish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Week 6 Morpheus Red Pill vs Blue Pill Choice ─────────────────── */}
        {isWeek6 && (
          <Week6MatrixChoice
            currentChoice={week6Pill}
            onSelectChoice={(choice) => {
              setWeek6Pill(choice);
              setTimeout(() => {
                const el = document.getElementById('week-entries-timeline');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 80);
            }}
          />
        )}

        {/* ── Timeline ────────────────────────────────────────────────────────── */}
        {displayedEntries.length === 0 ? (
          /* Empty State */
          <div className="glass-panel rounded-3xl p-12 sm:p-20 border border-white/10 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-slate-600">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-display font-bold text-white">Week {numStr}</h3>
              {activeWeek.name && <p className="text-sm text-brand-300 font-display">{activeWeek.name}</p>}
            </div>
            <p className="text-sm font-mono text-slate-400 italic">No matching entries found.</p>
            {isWeek6 && week6Pill !== 'all' && (
              <button
                onClick={() => setWeek6Pill('all')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg transition-all"
              >
                Show All Week 6 Entries
              </button>
            )}
            {isAdminAuthenticated && !showAddDateModal && (
              <button
                onClick={() => { setShowAddDateModal(true); setNewEntryNotes(''); setNewEntryTitle(''); setNewEntryFiles([]); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg mt-2 hover:scale-105 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add First Entry
              </button>
            )}
          </div>
        ) : (
          <div id="week-entries-timeline" className="space-y-8 scroll-mt-28">
            {displayedEntries.map((entry, idx) => {
              const pdfs = entry.attachments.filter(a => a.type === 'PDF');
              const ppts = entry.attachments.filter(a => a.type === 'PPT');
              const images = entry.attachments.filter(a => a.type === 'IMAGE');
              const isEditing = isAdminAuthenticated && editingEntryId === entry.id;

              // Week 6 Comical Identification
              const week6Type = isWeek6 ? getWeek6EntryType(entry) : 'other';
              const isLaser = week6Type === 'laser';
              const is3D = week6Type === '3d';
              const isCad = week6Type === 'cad';

              return (
                <div
                  key={entry.id}
                  className={`glass-panel-elevated rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isLaser ? 'border-red-500/40 shadow-xl shadow-red-950/20 bg-gradient-to-b from-red-950/10 to-transparent' :
                    is3D ? 'border-cyan-500/40 shadow-xl shadow-cyan-950/20 bg-gradient-to-b from-cyan-950/10 to-transparent' :
                    isCad ? 'border-purple-500/40 shadow-xl shadow-purple-950/20 bg-gradient-to-b from-purple-950/10 to-transparent' :
                    'border-white/15'
                  }`}
                >

                  {/* Date Strip Header */}
                  <div className={`px-6 sm:px-8 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 ${
                    entry.status === 'DRAFT' ? 'bg-amber-500/5' :
                    isLaser ? 'bg-red-950/30' :
                    is3D ? 'bg-cyan-950/30' :
                    isCad ? 'bg-purple-950/30' : ''
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center font-mono text-xs font-bold ${
                        isLaser ? 'bg-red-500/20 border-red-500/40 text-red-300' :
                        is3D ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' :
                        isCad ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' :
                        'bg-brand-500/20 border-brand-500/30 text-brand-300'
                      }`}>
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <span className={`text-[11px] font-mono uppercase tracking-widest font-bold ${
                          isLaser ? 'text-red-400' :
                          is3D ? 'text-cyan-400' :
                          isCad ? 'text-purple-400' :
                          'text-brand-300'
                        }`}>
                          {formatDisplayDate(entry.date)}
                        </span>
                        {entry.title && (
                          <h3 className={`text-base sm:text-lg font-display font-bold leading-tight mt-0.5 ${
                            isLaser ? 'text-white' :
                            is3D ? 'text-white' :
                            'text-white'
                          }`}>
                            {entry.title}
                          </h3>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status badge */}
                      <span className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border ${
                        entry.status === 'PUBLISHED'
                          ? (isLaser ? 'bg-red-500/15 border-red-500/30 text-red-300' : is3D ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300')
                          : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                      }`}>
                        {entry.status}
                      </span>

                      {/* Admin controls */}
                      {isAdminAuthenticated && (
                        <>
                          {/* Toggle publish/draft */}
                          <button
                            onClick={() => updateDateEntry(activeWeek.id, entry.id, {
                              status: entry.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
                            })}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            title={entry.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                          >
                            {entry.status === 'PUBLISHED' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>

                          {/* Edit toggle */}
                          <button
                            onClick={() => isEditing ? setEditingEntryId(null) : startEditEntry(entry)}
                            className={`p-1.5 rounded-xl transition-colors ${
                              isEditing
                                ? 'text-brand-300 bg-brand-500/20 border border-brand-500/30'
                                : 'text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                            title={isEditing ? 'Close editor' : 'Edit entry'}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setConfirmDeleteEntryId(entry.id)}
                            className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-500/20 transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Entry Body */}
                  <div className="p-6 sm:p-8 space-y-6">

                    {/* EDIT MODE */}
                    {isEditing ? (
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-slate-400 uppercase">Date</label>
                            <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-slate-400 uppercase">Headline</label>
                            <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-mono text-slate-400 uppercase">Field Notes</label>
                            <SaveIndicator status={editSaveStatus} />
                          </div>
                          <RichEditor value={editNotes} onChange={handleEditNotesChange} minRows={7} />
                        </div>

                        {/* Add more files to this entry */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                            <Upload className="w-3 h-3" />
                            Add More Attachments
                          </label>
                          <DropZone onFiles={(files) => handleAddAttachmentToExistingEntry(entry.id, files)} />
                          {uploadingFiles.length > 0 && (
                            <p className="text-[10px] font-mono text-amber-300 animate-pulse">Uploading {uploadingFiles.join(', ')}...</p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                          <button onClick={() => { setEditSaveStatus('idle'); setEditingEntryId(null); }}
                            className="px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-white/5">
                            Close Editor
                          </button>
                          <button onClick={() => handleSaveEdit('DRAFT')}
                            className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 flex items-center gap-1.5 transition-all">
                            <Save className="w-3.5 h-3.5" /> Save Draft
                          </button>
                          <button onClick={() => handleSaveEdit('PUBLISHED')}
                            className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5 transition-all hover:scale-105">
                            <Globe className="w-3.5 h-3.5" /> Save & Publish
                          </button>
                          <SaveIndicator status={editSaveStatus} />
                        </div>
                      </div>
                    ) : (
                      /* VIEW MODE */
                      <>
                        {/* Notes */}
                        {entry.notes && (
                          <div className="space-y-2.5">
                            <h4 className={`text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 font-bold ${
                              isLaser ? 'text-red-400' :
                              is3D ? 'text-cyan-400' :
                              isCad ? 'text-purple-400' :
                              'text-slate-500'
                            }`}>
                              <FileText className={`w-3 h-3 ${isLaser ? 'text-red-400' : is3D ? 'text-cyan-400' : isCad ? 'text-purple-400' : 'text-brand-400'}`} />
                              Sprint Field Notes
                            </h4>
                            <div className={`rounded-2xl border p-5 sm:p-7 ${
                              isLaser ? 'border-red-500/20 bg-red-950/15' :
                              is3D ? 'border-cyan-500/20 bg-cyan-950/15' :
                              isCad ? 'border-purple-500/20 bg-purple-950/15' :
                              'border-white/5 bg-white/[0.02]'
                            }`}>
                              {renderNotes(entry.notes, isLaser ? 'red' : is3D ? 'blue' : isCad ? 'purple' : 'brand')}
                            </div>
                          </div>
                        )}

                        {/* Documents & Source Files (PDF, STL, 3MF, AI, CAD, etc.) */}
                        {pdfs.length > 0 && (
                          <div className="space-y-2.5">
                            <h4 className={`text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 font-bold ${
                              isLaser ? 'text-red-400' :
                              is3D ? 'text-cyan-400' :
                              isCad ? 'text-purple-400' :
                              'text-cyan-400'
                            }`}>
                              <Box className="w-3.5 h-3.5" /> Source Files & Documents ({pdfs.length})
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {pdfs.map(doc => {
                                const isCadFile = /\.(stl|3mf|gcode|ai|dxf|step|stp|obj|cad)$/i.test(doc.name);
                                const isPdf = /\.pdf$/i.test(doc.name);
                                return (
                                  <div key={doc.id}
                                    className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 group ${
                                      isLaser
                                        ? 'border-red-500/30 hover:border-red-400 bg-red-950/20 hover:bg-red-950/40'
                                        : is3D
                                        ? 'border-cyan-500/30 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40'
                                        : isCadFile
                                        ? 'border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/5'
                                        : isPdf
                                        ? 'border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-500/5'
                                        : 'border-white/10 hover:border-brand-500/40 bg-white/[0.02]'
                                    }`}>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                                      isLaser
                                        ? 'bg-red-500/20 border-red-500/40 text-red-300'
                                        : is3D
                                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                                        : isCadFile
                                        ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
                                        : isPdf
                                        ? 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                                        : 'bg-brand-500/20 border-brand-500/30 text-brand-300'
                                    }`}>
                                      {isCadFile ? <Box className="w-4.5 h-4.5" /> : <FileText className="w-4.5 h-4.5" />}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                      <h5 className={`text-xs font-bold text-white truncate transition-colors ${
                                        isLaser ? 'group-hover:text-red-200' : is3D ? 'group-hover:text-cyan-200' : 'group-hover:text-cyan-200'
                                      }`}>
                                        {doc.name}
                                      </h5>
                                      <p className="text-[10px] font-mono text-slate-400">
                                        {isCadFile ? '3D / CAD Model' : isPdf ? 'PDF Document' : 'Project File'}
                                        {doc.size ? ` • ${doc.size}` : ''}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      <a href={resolveAssetUrl(doc.url)} download={doc.name}
                                        className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold border flex items-center gap-1 transition-all ${
                                          isLaser
                                            ? 'bg-red-500/15 hover:bg-red-500/30 border-red-500/40 text-red-200'
                                            : is3D
                                            ? 'bg-cyan-500/15 hover:bg-cyan-500/30 border-cyan-500/40 text-cyan-200'
                                            : 'bg-white/5 hover:bg-cyan-500/20 border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200'
                                        }`}
                                        title={`Download ${doc.name}`}>
                                        <Download className={`w-3.5 h-3.5 ${isLaser ? 'text-red-400' : 'text-cyan-400'}`} />
                                        <span className="hidden sm:inline">Get</span>
                                      </a>
                                      {isAdminAuthenticated && (
                                        <button
                                          onClick={() => setConfirmDeleteAttachment({ entryId: entry.id, attachmentId: doc.id })}
                                          className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-500/20 transition-colors" title="Delete">
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* PPTs */}
                        {ppts.length > 0 && (
                          <div className="space-y-2.5">
                            <h4 className="text-[10px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                              <Presentation className="w-3 h-3" /> Presentations ({ppts.length})
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {ppts.map(ppt => (
                                <div key={ppt.id}
                                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-500/40 transition-all flex items-center gap-3 group">
                                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                                    <Presentation className="w-4.5 h-4.5 text-amber-400" />
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                    <h5 className="text-xs font-bold text-white truncate">{ppt.name}</h5>
                                    <p className="text-[10px] font-mono text-slate-500">PowerPoint{ppt.size ? ` • ${ppt.size}` : ''}</p>
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <a href={resolveAssetUrl(ppt.url)} download={ppt.name}
                                      className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                                      <Download className="w-3.5 h-3.5" />
                                    </a>
                                    {isAdminAuthenticated && (
                                      <button
                                        onClick={() => setConfirmDeleteAttachment({ entryId: entry.id, attachmentId: ppt.id })}
                                        className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-500/20 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Image Attachments Gallery */}
                        {images.length > 0 && !entry.notes && (
                          <div className="space-y-2.5">
                            <h4 className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                              <ImageIcon className="w-3 h-3" /> Evidence & Photos ({images.length})
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {images.map(img => (
                                <div key={img.id} className="rounded-2xl overflow-hidden border border-white/10 bg-slate-900/60 group">
                                  <div className="relative overflow-hidden bg-black/40 flex items-center justify-center p-1">
                                    <img src={resolveAssetUrl(img.url)} alt={img.name} className="w-full h-auto max-h-60 object-contain rounded-xl group-hover:scale-105 transition-transform duration-300" />
                                  </div>
                                  <div className="p-3 bg-slate-950/80 border-t border-white/5 flex items-center justify-between">
                                    <div className="truncate">
                                      <p className="text-xs font-bold text-white truncate">{img.name}</p>
                                      <p className="text-[10px] font-mono text-slate-500">{img.size}</p>
                                    </div>
                                    <a href={resolveAssetUrl(img.url)} download={img.name} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10" title="Download">
                                      <Download className="w-3.5 h-3.5" />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Empty entry body */}
                        {!entry.notes && entry.attachments.length === 0 && (
                          <p className="text-xs font-mono text-slate-600 italic">
                            {isAdminAuthenticated ? 'Click Edit to add notes and attachments.' : 'No content added yet.'}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Mobile Export Button ─────────────────────────────────────────────── */}
        {sortedEntries.length > 0 && (
          <div className="sm:hidden flex justify-center pb-4">
            <button
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-lg transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              {isExportingPDF ? 'Generating...' : 'Export PDF Dossier'}
            </button>
          </div>
        )}

      </main>



      {/* ── Confirm Delete Entry ──────────────────────────────────────────────── */}
      {confirmDeleteEntryId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-sm glass-panel-elevated rounded-3xl p-6 border border-rose-500/40 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Date Entry?</h3>
            </div>
            <p className="text-xs font-mono text-slate-300">
              This will permanently remove this dated entry and all its notes and attachments. This cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setConfirmDeleteEntryId(null)}
                className="flex-1 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10">
                Cancel
              </button>
              <button onClick={() => {
                deleteDateEntry(activeWeek.id, confirmDeleteEntryId);
                setConfirmDeleteEntryId(null);
              }}
                className="flex-1 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-rose-600 hover:bg-rose-500">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Delete Attachment ─────────────────────────────────────────── */}
      {confirmDeleteAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-sm glass-panel-elevated rounded-3xl p-6 border border-rose-500/40 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-400" />
              <h3 className="text-base font-bold text-white">Delete Attachment?</h3>
            </div>
            <p className="text-xs font-mono text-slate-300">
              This will permanently remove this file. Other content in this date entry will not be affected.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setConfirmDeleteAttachment(null)}
                className="flex-1 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10">
                Cancel
              </button>
              <button onClick={() => {
                deleteAttachmentFromEntry(activeWeek.id, confirmDeleteAttachment.entryId, confirmDeleteAttachment.attachmentId);
                setConfirmDeleteAttachment(null);
              }}
                className="flex-1 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-rose-600 hover:bg-rose-500">
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
