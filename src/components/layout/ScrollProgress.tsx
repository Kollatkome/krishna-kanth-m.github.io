import React, { useEffect, useState } from 'react';

const chapters = [
  { id: 'hero', number: '01', title: 'INTRO' },
  { id: 'about', number: '02', title: 'EXPLORE' },
  { id: 'skills', number: '03', title: 'SKILLS' },
  { id: 'projects', number: '04', title: 'BUILD' },
  { id: 'experience', number: '05', title: 'CAREER' },
  { id: 'education', number: '06', title: 'STUDY' },
  { id: 'protosem', number: '07', title: 'JOURNEY' },
  { id: 'evidence', number: '08', title: 'EVIDENCE' },
  { id: 'achievements', number: '09', title: 'HONORS' },
  { id: 'resume', number: '10', title: 'RESUME' },
  { id: 'contact', number: '11', title: 'CONNECT' }
];

export const ScrollProgress: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState(chapters[0]);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollPercent(Math.min(100, Math.max(0, progress)));

      // Detect active chapter based on scroll position
      const scrollY = window.scrollY + 200;
      for (let i = chapters.length - 1; i >= 0; i--) {
        const el = document.getElementById(chapters[i].id);
        if (el && el.offsetTop <= scrollY) {
          setActiveChapter(chapters[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ── Top Progress Bar (above navbar) ── */}
      <div
        aria-label="Page scroll progress"
        className="fixed top-0 left-0 right-0 z-[60] hidden xl:flex items-center gap-3 px-6 py-1.5 bg-black/40 backdrop-blur-md border-b border-white/5"
      >
        {/* Chapter label */}
        <span className="text-[10px] font-mono tracking-widest text-brand-300 font-bold whitespace-nowrap">
          {activeChapter.number} / 11 &nbsp;
          <span className="text-white font-display font-bold tracking-wider">{activeChapter.title}</span>
        </span>

        {/* Progress rail */}
        <div className="flex-1 h-0.5 bg-slate-800/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-violet via-brand-500 to-brand-cyan rounded-full transition-all duration-150"
            style={{ width: `${scrollPercent}%` }}
          />
        </div>

        {/* Percent */}
        <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{Math.round(scrollPercent)}%</span>
      </div>

      {/* ── Right-side Chapter Dots (unchanged) ── */}
      <aside
        aria-label="Story chapter progression"
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-1.5 select-none pointer-events-auto"
      >
        <nav aria-label="Chapter quick navigation" className="flex flex-col gap-1.5">
          {chapters.map((ch) => (
            <a
              key={ch.id}
              href={`#${ch.id}`}
              aria-label={`Jump to ${ch.number} ${ch.title}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeChapter.id === ch.id
                  ? 'bg-brand-cyan scale-125 shadow-[0_0_8px_#06b6d4]'
                  : 'bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};
