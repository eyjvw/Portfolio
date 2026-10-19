import React, { useState, useEffect } from 'react';
import { useDesktop } from '../../context/DesktopContext';
import { APPS, PERSONAL_INFO } from '../../data/portfolio';
import {
  Search,
  Sliders,
  Wifi,
  Battery,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles,
  LayoutGrid,
} from '../ui/Icons';
import { soundEngine } from '../ui/AudioFx';

export const MenuBar: React.FC = () => {
  const {
    activeAppId,
    openApp,
    isSpotlightOpen,
    setIsSpotlightOpen,
    isControlCenterOpen,
    setIsControlCenterOpen,
    isAppleMenuOpen,
    setIsAppleMenuOpen,
    isDarkMode,
    soundEnabled,
    lockScreen,
    reboot,
    setIsMissionControl,
  } = useDesktop();

  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);

      const days = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
      const months = [
        'janv.',
        'févr.',
        'mars',
        'avr.',
        'mai',
        'juin',
        'juil.',
        'août',
        'sept.',
        'oct.',
        'nov.',
        'déc.',
      ];
      setDateStr(`${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeApp = APPS.find((a) => a.id === activeAppId);
  const appTitle = activeApp ? activeApp.title : 'Finder';

  return (
    <header
      className="fixed top-0 left-0 right-0 h-7 px-3.5 z-40 flex items-center justify-between text-xs select-none aero-glass !border-0 !border-b text-slate-800 dark:text-neutral-200 border-white/20 dark:border-white/10 shadow-sm"
      role="banner"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsAppleMenuOpen((prev) => !prev);
              setIsControlCenterOpen(false);
            }}
            className="group flex items-center transition-transform duration-200 hover:scale-110 active:scale-95 px-1 py-0.5 rounded-full focus:outline-none"
            title="Menu Samuel Bonneau"
            aria-label="Menu Samuel Bonneau"
          >
            <img
              src="/chat.png"
              alt={PERSONAL_INFO.name}
              className="h-[19px] w-[19px] rounded-full object-cover ring-1 ring-white/50 shadow-[0_1px_5px_rgba(0,0,0,0.45)] transition-shadow duration-200 group-hover:ring-white/80 group-hover:shadow-[0_0_8px_rgba(255,255,255,0.35)]"
            />
          </button>
          {isAppleMenuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-7 w-56 py-1.5 rounded-xl aero-glass-strong text-xs z-50 animate-in fade-in slide-in-from-top-1"
            >
              <button
                onClick={() => {
                  openApp('about');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-blue-500 hover:text-white transition-colors"
              >
                À propos de {PERSONAL_INFO.name}
              </button>
              <div className="h-px bg-black/10 dark:bg-white/10 my-1" />
              <button
                onClick={() => {
                  openApp('settings');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-blue-500 hover:text-white transition-colors"
              >
                Réglages Système...
              </button>
              <button
                onClick={() => {
                  openApp('terminal');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-blue-500 hover:text-white transition-colors"
              >
                Ouvrir le Terminal
              </button>
              <div className="h-px bg-black/10 dark:bg-white/10 my-1" />
              <button
                onClick={() => {
                  soundEngine.playClick();
                  lockScreen();
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-blue-500 hover:text-white transition-colors"
              >
                Verrouiller l'écran
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  reboot();
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-blue-500 hover:text-white transition-colors"
              >
                Redémarrer le portfolio...
              </button>
            </div>
          )}
        </div>
        <span className="text-xs leading-none font-bold tracking-tight text-slate-900 dark:text-white">
          {appTitle}
        </span>
        <div className="hidden md:flex items-center gap-3.5 text-xs leading-none text-slate-700 dark:text-neutral-300 font-medium">
          <button
            onClick={() => openApp('projects')}
            className="hover:text-blue-500 transition-colors"
          >
            Fichier
          </button>
          <button
            onClick={() => openApp('about')}
            className="hover:text-blue-500 transition-colors"
          >
            Édition
          </button>
          <button
            onClick={() => setIsSpotlightOpen(true)}
            className="hover:text-blue-500 transition-colors"
          >
            Présentation
          </button>
          <button
            onClick={() => openApp('contact')}
            className="hover:text-blue-500 transition-colors"
          >
            Aide
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span
          className="text-slate-600 dark:text-neutral-400"
          title={soundEnabled ? 'Effets sonores activés' : 'Effets sonores désactivés'}
        >
          {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
        </span>
        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 dark:text-neutral-300">
          <span>100%</span>
          <Battery size={15} className="text-emerald-500" />
        </div>
        <span className="text-slate-600 dark:text-neutral-300">
          <Wifi size={13} />
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            soundEngine.playClick();
            setIsMissionControl((prev) => !prev);
          }}
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          title="Mission Control (F3 ou Ctrl+↑)"
          aria-label="Mission Control"
        >
          <LayoutGrid size={13} />
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            setIsSpotlightOpen((prev) => !prev);
            setIsControlCenterOpen(false);
          }}
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          title="Recherche Spotlight (⌘K)"
        >
          <Search size={13} />
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            setIsControlCenterOpen((prev) => !prev);
            setIsAppleMenuOpen(false);
          }}
          className={`p-1 rounded transition-colors ${
            isControlCenterOpen
              ? 'bg-blue-500 text-white'
              : 'hover:bg-black/10 dark:hover:bg-white/10'
          }`}
          title="Centre de contrôle"
        >
          <Sliders size={13} />
        </button>
        <div
          className="font-medium text-xs tracking-tight hover:opacity-80 cursor-pointer flex items-center gap-1.5"
          title={new Date().toLocaleDateString('fr-FR')}
        >
          <span className="hidden sm:inline text-[11px] text-slate-600 dark:text-neutral-300">
            {dateStr}
          </span>
          <span className="font-semibold">{timeStr}</span>
        </div>
      </div>
    </header>
  );
};
