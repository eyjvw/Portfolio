import React, { useState } from 'react';
import { WALLPAPERS, PERSONAL_INFO } from '../../data/portfolio';
import { useDesktop } from '../../context/DesktopContext';
import {
  Palette,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Monitor,
  Sparkles,
  Check,
  RotateCcw,
  Gauge,
} from '../ui/Icons';
import { soundEngine } from '../ui/AudioFx';
import { getPerfMode, isLite, setPerfMode } from '../../lib/performance';
import type { PerfMode } from '../../lib/performance';

const PERF_OPTIONS: { mode: PerfMode; label: string }[] = [
  { mode: 'auto', label: 'Auto' },
  { mode: 'lite', label: 'Économie' },
  { mode: 'full', label: 'Maximum' },
];

export const SettingsApp: React.FC = () => {
  const {
    wallpaper,
    setWallpaper,
    isDarkMode,
    setIsDarkMode,
    soundEnabled,
    setSoundEnabled,
  } = useDesktop();

  const [activeSection, setActiveSection] = useState<'wallpaper' | 'appearance' | 'about'>('wallpaper');
  const [perfMode, setPerfModeState] = useState<PerfMode>(getPerfMode);
  const [liteActive, setLiteActive] = useState(isLite);

  return (
    <div className="flex h-full bg-slate-50/80 dark:bg-[#1C1C1E]/80 select-text overflow-hidden">
      <div className="w-52 border-r border-black/5 dark:border-white/10 bg-slate-100/50 dark:bg-[#1E1E22]/50 p-3 flex flex-col gap-1 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 px-2 py-1">
          Paramètres
        </span>
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveSection('wallpaper');
          }}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeSection === 'wallpaper'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-200/60 dark:hover:bg-neutral-800/60'
          }`}
        >
          <Palette size={14} /> Fond d'écran
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveSection('appearance');
          }}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeSection === 'appearance'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-200/60 dark:hover:bg-neutral-800/60'
          }`}
        >
          <Sun size={14} /> Apparence & Sons
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveSection('about');
          }}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeSection === 'about'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-200/60 dark:hover:bg-neutral-800/60'
          }`}
        >
          <Monitor size={14} /> À propos de ce Mac
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {activeSection === 'wallpaper' && (
          <div className="space-y-4 max-w-xl">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-100">
                Fonds d'écran dynamiques
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Sélectionnez l'ambiance visuelle de votre bureau macOS.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {WALLPAPERS.map((wp) => {
                const isSelected = wallpaper.id === wp.id;
                return (
                  <div
                    key={wp.id}
                    onClick={() => setWallpaper(wp)}
                    className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all p-1 ${
                      isSelected
                        ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20'
                        : 'border-transparent hover:border-black/20 dark:hover:border-white/20'
                    }`}
                  >
                    <div
                      className="h-24 w-full rounded-lg relative overflow-hidden flex items-center justify-center shadow-inner"
                      style={{ background: wp.cssBackground }}
                    >
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-center mt-1.5 text-slate-700 dark:text-neutral-200 truncate">
                      {wp.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === 'appearance' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-100">
                Apparence du système
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Choisissez le mode d'affichage de l'interface.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => {
                  soundEngine.playClick();
                  setIsDarkMode(false);
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 bg-white text-slate-800 ${
                  !isDarkMode
                    ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'border-black/10 hover:border-black/30'
                }`}
              >
                <Sun size={24} className="text-amber-500" />
                <span className="text-xs font-semibold">Mode Clair</span>
              </div>
              <div
                onClick={() => {
                  soundEngine.playClick();
                  setIsDarkMode(true);
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 bg-neutral-900 text-white ${
                  isDarkMode
                    ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <Moon size={24} className="text-sky-400" />
                <span className="text-xs font-semibold">Mode Sombre</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/70 dark:bg-[#252529]/70 border border-black/5 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 size={20} className="text-blue-500" />
                ) : (
                  <VolumeX size={20} className="text-slate-400" />
                )}
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-neutral-200">
                    Effets sonores de l'interface
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                    Sons de clics, ouverture de fenêtres et notifications synthétisés par Web Audio API.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  if (next) soundEngine.playPop();
                }}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                  soundEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-neutral-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white/70 dark:bg-[#252529]/70 border border-black/5 dark:border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Gauge size={20} className={liteActive ? 'text-amber-500' : 'text-blue-500'} />
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-neutral-200">Effets visuels</p>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                    {liteActive
                      ? 'Économie : transparence floutée désactivée pour rester fluide.'
                      : 'Transparence et flou complets. Auto passe en économie si la machine rame.'}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 rounded-lg bg-slate-200/70 dark:bg-neutral-800 p-0.5">
                {PERF_OPTIONS.map(({ mode, label }) => (
                  <button
                    key={mode}
                    onClick={() => {
                      soundEngine.playClick();
                      setPerfMode(mode);
                      setPerfModeState(mode);
                      setLiteActive(isLite());
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      perfMode === mode
                        ? 'bg-white dark:bg-neutral-600 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="space-y-5 max-w-xl">
            <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#252529]/70 border border-black/5 dark:border-white/10 flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-neutral-100">
                  macOS Portfolio Sonoma
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Version 15.4 (Édition Interactive Web)
                </p>
              </div>
              <div className="w-full border-t border-black/5 dark:border-white/10 pt-4 space-y-2 text-xs text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Développeur :</span>
                  <span className="font-semibold text-slate-800 dark:text-neutral-200">
                    {PERSONAL_INFO.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Moteur Web :</span>
                  <span className="font-semibold text-slate-800 dark:text-neutral-200">
                    Astro v5 + React 19 + Tailwind v4 + Bun
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Architecture :</span>
                  <span className="font-semibold text-slate-800 dark:text-neutral-200">
                    Multi-Window Canvas & Dynamic Islands
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
