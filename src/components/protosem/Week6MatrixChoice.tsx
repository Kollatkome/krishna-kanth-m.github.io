import React, { useState } from 'react';
import { Flame, Layers, Sparkles, Zap, Cpu, Check } from 'lucide-react';

export type MatrixPillChoice = 'all' | 'laser' | '3d';

interface Week6MatrixChoiceProps {
  currentChoice: MatrixPillChoice;
  onSelectChoice: (choice: MatrixPillChoice) => void;
  laserEntryRef?: React.RefObject<HTMLDivElement>;
  threeDEntryRef?: React.RefObject<HTMLDivElement>;
}

// ── Web Audio API Synthesizers for Comical Sound FX ─────────────────────────────
const playSoundFX = (type: 'red' | 'blue' | 'glitch') => {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'red') {
      // Sci-fi Laser Pew-Pew Sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'blue') {
      // 8-bit Robotic Extruder 3D Print Chime
      const freqs = [261.63, 329.63, 392.00, 523.25];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.06 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.12);
      });
    } else {
      // Cyberpunk Glitch Burst
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.05);
      osc.frequency.setValueAtTime(220, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    }
  } catch {
    // AudioContext blocked or not supported - silently ignore
  }
};

export const Week6MatrixChoice: React.FC<Week6MatrixChoiceProps> = ({
  currentChoice,
  onSelectChoice,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleChoose = (choice: MatrixPillChoice) => {
    if (soundEnabled) {
      if (choice === 'laser') playSoundFX('red');
      else if (choice === '3d') playSoundFX('blue');
      else playSoundFX('glitch');
    }
    onSelectChoice(choice);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-b from-slate-950/90 via-black to-slate-950/90 p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Background Matrix Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      
      {/* Dynamic Glow Aura */}
      <div className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
        currentChoice === 'laser' ? 'bg-red-600/25' :
        currentChoice === '3d' ? 'bg-cyan-600/25' :
        'bg-purple-600/20'
      }`} />
      <div className={`absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
        currentChoice === 'laser' ? 'bg-orange-600/20' :
        currentChoice === '3d' ? 'bg-blue-600/25' :
        'bg-pink-600/20'
      }`} />

      {/* Header Badge & Sound Toggle */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold tracking-wider uppercase transition-colors duration-500 ${
          currentChoice === 'laser'
            ? 'bg-red-500/10 border-red-500/30 text-red-300'
            : currentChoice === '3d'
            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
            : 'bg-purple-500/10 border-purple-500/30 text-purple-300'
        }`}>
          <Sparkles className={`w-3.5 h-3.5 animate-spin ${
            currentChoice === 'laser' ? 'text-red-400' : currentChoice === '3d' ? 'text-cyan-400' : 'text-purple-400'
          }`} style={{ animationDuration: '4s' }} />
          <span>FABRICATION MATRIX // MORPHEUS PROTOCOL</span>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-[11px] font-mono px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-1.5"
          title="Toggle Comical Sound Effects"
        >
          <span>{soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF'}</span>
        </button>
      </div>

      {/* Morpheus Speech Bubble */}
      <div className="relative z-10 p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black border border-white/20 flex items-center justify-center text-xl shadow-lg flex-shrink-0">
            🕶️
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">
                Morpheus of Digital Fabrication
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                Forge Lab Simulation
              </span>
            </div>
            
            {currentChoice === 'laser' ? (
              <p className="text-sm font-sans text-red-200 leading-relaxed animate-fadeIn">
                <strong className="text-red-400 font-bold">🔴 You took the Red Pill.</strong> Welcome to the <em>Subtractive Reality</em>. There is no spoon... because the <strong>HW Junction 150W CO₂ Laser</strong> just vaporized it into a 50×50mm transparent acrylic Autobot badge at 100 mm/s! Don&apos;t forget your safety goggles, Neo.
              </p>
            ) : currentChoice === '3d' ? (
              <p className="text-sm font-sans text-cyan-200 leading-relaxed animate-fadeIn">
                <strong className="text-cyan-400 font-bold">🔵 You took the Blue Pill.</strong> Welcome to the <em>Additive Matrix</em>. The nozzle is heating to <strong>220°C</strong>. Watch closely as the <strong>Bambu Lab H2S</strong> lays down molten White PLA layer-by-layer at 0.20mm precision until a foldable phone stand materializes out of thin air!
              </p>
            ) : (
              <p className="text-sm font-sans text-slate-300 leading-relaxed animate-fadeIn">
                &ldquo;This is your last chance. After this, there is no turning back. You take the <span className="text-cyan-400 font-semibold">Blue Pill</span> — the story ends, you wake up in your bed and believe whatever you want about 0.2mm layer heights and Bambu Studio slicers. You take the <span className="text-red-400 font-semibold">Red Pill</span> — you stay in Forge Lab, and I show you how deep the 150W laser cuts through 2mm acrylic.&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>

      {/* The Two Giant Interactive Pills */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* 🔴 RED PILL: LASER CUTTING */}
        <button
          type="button"
          onClick={() => handleChoose('laser')}
          className={`relative text-left p-6 rounded-3xl border transition-all duration-300 transform group hover:-translate-y-1 overflow-hidden ${
            currentChoice === 'laser'
              ? 'bg-gradient-to-br from-red-950/80 via-red-900/40 to-black border-red-500 shadow-2xl shadow-red-500/30 ring-2 ring-red-500/50'
              : 'bg-white/[0.02] hover:bg-red-950/30 border-red-500/30 hover:border-red-400'
          }`}
        >
          {/* Subtle Pill Glow */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-red-500/20 rounded-full blur-2xl group-hover:bg-red-500/40 transition-all" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-xs font-bold uppercase tracking-wider shadow-inner">
                <span className="text-base">💊</span>
                <span>THE RED PILL</span>
              </div>
              {currentChoice === 'laser' && (
                <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-red-300 bg-red-500/20 px-2.5 py-1 rounded-full border border-red-500/40 animate-pulse">
                  <Check className="w-3 h-3" /> ACTIVE REALITY
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white group-hover:text-red-300 transition-colors flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-400" />
                Subtractive Laser Reality
              </h3>
              <p className="text-xs font-mono text-red-300/80">
                HW Junction 150W CO₂ Laser • RDWorks V8 • Acrylic Vaporization
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Choose the photon beam! Excises 2mm transparent PMMA acrylic with high-pressure air assist and rasters the Transformers Autobot emblem with mirror-polished edges.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span className="px-2 py-1 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300">
                ⚡ 100 mm/s Vector Cut
              </span>
              <span className="px-2 py-1 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300">
                📦 krishnakanth.ai (55 KB)
              </span>
            </div>

            <div className="pt-1 flex items-center gap-2 text-xs font-mono font-bold text-red-400 group-hover:translate-x-1 transition-transform">
              <span>{currentChoice === 'laser' ? 'Currently viewing Laser Dossier' : 'Take Red Pill & Jump to Laser →'}</span>
            </div>
          </div>
        </button>

        {/* 🔵 BLUE PILL: 3D PRINTING */}
        <button
          type="button"
          onClick={() => handleChoose('3d')}
          className={`relative text-left p-6 rounded-3xl border transition-all duration-300 transform group hover:-translate-y-1 overflow-hidden ${
            currentChoice === '3d'
              ? 'bg-gradient-to-br from-cyan-950/80 via-blue-900/40 to-black border-cyan-400 shadow-2xl shadow-cyan-500/30 ring-2 ring-cyan-400/50'
              : 'bg-white/[0.02] hover:bg-cyan-950/30 border-cyan-500/30 hover:border-cyan-400'
          }`}
        >
          {/* Subtle Pill Glow */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-500/40 transition-all" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider shadow-inner">
                <span className="text-base">💊</span>
                <span>THE BLUE PILL</span>
              </div>
              {currentChoice === '3d' && (
                <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2.5 py-1 rounded-full border border-cyan-500/40 animate-pulse">
                  <Check className="w-3 h-3" /> ACTIVE REALITY
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Additive 3D Matrix
              </h3>
              <p className="text-xs font-mono text-cyan-300/80">
                Bambu Lab H2S FDM • Bambu Studio • Molten PLA Extrusion
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Choose the layer-by-layer world! Extrudes 220°C thermoplastic into an interlocking, foldable & adjustable smartphone stand with 0.20mm standard slice thickness.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span className="px-2 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-300">
                🧬 220°C Nozzle / 55°C Bed
              </span>
              <span className="px-2 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-300">
                📦 STL (2.1 MB) & 3MF (2.5 MB)
              </span>
            </div>

            <div className="pt-1 flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>{currentChoice === '3d' ? 'Currently viewing 3D Print Dossier' : 'Take Blue Pill & Jump to 3D Print →'}</span>
            </div>
          </div>
        </button>

      </div>

      {/* 🟣 RESET / OVERCLOCK THE MATRIX (SHOW ALL) */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>Can&apos;t decide? Take both and bridge the fabrication continuum.</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleChoose('all')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              currentChoice === 'all'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 ring-2 ring-purple-400/40'
                : 'bg-white/5 hover:bg-white/10 text-purple-300 border border-purple-500/30'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-purple-300" />
            <span>🟣 Glitch Reality (Show Both + Fusion 360)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
