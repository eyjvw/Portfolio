import React from 'react';
import { useDesktop } from '../../context/DesktopContext';
import { WALLPAPERS } from '../../data/portfolio';
import {
  Wifi,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Sliders,
  Palette,
  Sparkles,
  Monitor,
} from '../ui/Icons';
import { soundEngine } from '../ui/AudioFx';

export const ControlCenter: React.FC = () => {
  const {
    isControlCenterOpen,
    setIsControlCenterOpen,
    isDarkMode,
    setIsDarkMode,
    soundEnabled,
    setSoundEnabled,
    wallpaper,
    setWallpaper,
    openApp,
  } = useDesktop();

  if (!isControlCenterOpen) return null;

  return (
    <div
      onClick={() => setIsControlCenterOpen(false)}
      className="fixed inset-0 z-50 pointer-events-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-8 right-3 w-80 p-3 rounded-2xl aero-glass-strong space-y-3 text-slate-800 dark:text-neutral-100 animate-in fade-in slide-in-from-top-2"
      >
        <div className="grid grid-cols-2 gap-2">
          <div
            onClick={() => {
              soundEngine.playClick();
              setIsDarkMode((prev) => !prev);
            }}
            className="p-3 rounded-xl bg-white/60 dark:bg-neutral-800/60 border border-black/5 dark:border-white/5 flex items-center gap-3 cursor-pointer hover:bg-white/90 dark:hover:bg-neutral-800/90 transition-all"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-teal-600 text-white' : 'bg-amber-500 text-white'
              }`}
            >
              {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
            </div>
            <div>
              <p className="text-xs font-semibold">Thème</p>
              <p className="text-[10px] text-slate-500 dark:text-neutral-400">
                {isDarkMode ? 'Sombre' : 'Clair'}
              </p>
            </div>
          </div>
          <div
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) soundEngine.playPop();
            }}
            className="p-3 rounded-xl bg-white/60 dark:bg-neutral-800/60 border border-black/5 dark:border-white/5 flex items-center gap-3 cursor-pointer hover:bg-white/90 dark:hover:bg-neutral-800/90 transition-all"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                soundEnabled ? 'bg-blue-600 text-white' : 'bg-slate-400 text-white'
              }`}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </div>
            <div>
              <p className="text-xs font-semibold">Audio Fx</p>
              <p className="text-[10px] text-slate-500 dark:text-neutral-400">
                {soundEnabled ? 'Activé' : 'Muet'}
              </p>
            </div>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/60 dark:bg-neutral-800/60 border border-black/5 dark:border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <Palette size={13} className="text-blue-500" /> Fond d'écran
            </span>
            <button
              onClick={() => {
                openApp('settings');
                setIsControlCenterOpen(false);
              }}
              className="text-[10px] text-blue-500 hover:underline"
            >
              Plus...
            </button>
          </div>
          <div className="flex gap-2">
            {WALLPAPERS.slice(0, 4).map((wp) => (
              <button
                key={wp.id}
                onClick={() => setWallpaper(wp)}
                style={{ background: wp.cssBackground }}
                className={`flex-1 h-8 rounded-lg border-2 transition-all ${
                  wallpaper.id === wp.id
                    ? 'border-blue-500 ring-2 ring-blue-500/20 scale-105'
                    : 'border-transparent hover:scale-102'
                }`}
                title={wp.name}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              openApp('projects');
              setIsControlCenterOpen(false);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-white/60 dark:bg-neutral-800/60 hover:bg-blue-600 hover:text-white border border-black/5 dark:border-white/5 text-xs font-medium text-center transition-colors"
          >
            📂 Projets
          </button>
          <button
            onClick={() => {
              openApp('contact');
              setIsControlCenterOpen(false);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-white/60 dark:bg-neutral-800/60 hover:bg-emerald-600 hover:text-white border border-black/5 dark:border-white/5 text-xs font-medium text-center transition-colors"
          >
            ✉️ Contact
          </button>
        </div>
      </div>
    </div>
  );
};
