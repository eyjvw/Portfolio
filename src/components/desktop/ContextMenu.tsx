import React from 'react';
import { useDesktop } from '../../context/DesktopContext';
import {
  Terminal,
  Palette,
  RotateCcw,
  Sparkles,
  Info,
} from '../ui/Icons';
import { soundEngine } from '../ui/AudioFx';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose }) => {
  const { openApp, setIsSpotlightOpen } = useDesktop();

  const menuWidth = 200;
  const menuHeight = 220;
  const adjustedX = Math.min(x, window.innerWidth - menuWidth - 10);
  const adjustedY = Math.min(y, window.innerHeight - menuHeight - 10);

  return (
    <div
      onClick={onClose}
      onContextMenu={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="fixed inset-0 z-50 pointer-events-auto"
    >
      <div
        style={{ left: adjustedX, top: adjustedY }}
        onClick={(e) => e.stopPropagation()}
        className="absolute w-48 py-1.5 rounded-xl aero-glass-strong text-xs text-slate-800 dark:text-neutral-200 z-50 animate-in fade-in zoom-in-95"
      >
        <button
          onClick={() => {
            soundEngine.playClick();
            openApp('projects');
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
        >
          <Sparkles size={14} /> Explorer les projets
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            openApp('terminal');
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
        >
          <Terminal size={14} /> Ouvrir le Terminal
        </button>
        <div className="h-px bg-black/10 dark:bg-white/10 my-1" />
        <button
          onClick={() => {
            soundEngine.playClick();
            openApp('settings');
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
        >
          <Palette size={14} /> Changer de fond d'écran
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            openApp('about');
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
        >
          <Info size={14} /> À propos de l'auteur
        </button>
      </div>
    </div>
  );
};
