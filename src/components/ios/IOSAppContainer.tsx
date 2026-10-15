import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from '../ui/Icons';
import type { AppId } from '../../types/os';
import { APPS } from '../../data/portfolio';
import { soundEngine } from '../ui/AudioFx';

interface IOSAppContainerProps {
  appId: AppId;
  onClose: () => void;
  children: React.ReactNode;
}

export const IOSAppContainer: React.FC<IOSAppContainerProps> = ({ appId, onClose, children }) => {
  const app = APPS.find((a) => a.id === appId);

  const handleBack = () => {
    soundEngine.playMinimize();
    onClose();
  };

  return (
    <motion.div
      key={appId}
      initial={{ y: '100%', scale: 0.96 }}
      animate={{ y: 0, scale: 1 }}
      exit={{ y: '100%', scale: 0.96 }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="fixed inset-0 z-50 flex flex-col bg-slate-100 dark:bg-[#121214] text-slate-800 dark:text-neutral-100 select-text overflow-hidden"
    >
      <div className="h-12 px-4 pt-1 flex items-center justify-between border-b border-black/5 dark:border-white/10 aero-glass-strong !border-x-0 !border-t-0 shrink-0 select-none z-10">
        <button
          onClick={handleBack}
          className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400 text-sm font-semibold active:opacity-60 transition-opacity"
        >
          <ChevronLeft size={20} className="-ml-1" />
          <span>Accueil</span>
        </button>
        <span className="font-bold text-sm text-slate-800 dark:text-neutral-100 truncate max-w-[180px]">
          {app?.title || 'Application'}
        </span>
        <div className="w-14" />
      </div>
      <div className="flex-1 overflow-hidden relative flex flex-col">{children}</div>
      <div
        onClick={handleBack}
        className="h-6 pb-2 pt-1 flex items-center justify-center bg-white/60 dark:bg-[#1C1C1E]/60 backdrop-blur-md cursor-pointer active:opacity-50 shrink-0"
      >
        <div className="w-32 h-1 bg-slate-400/80 dark:bg-white/40 rounded-full" />
      </div>
    </motion.div>
  );
};
