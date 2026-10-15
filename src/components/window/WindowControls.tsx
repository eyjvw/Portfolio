import React, { useState } from 'react';
import { X, Minus, Maximize2 } from '../ui/Icons';
import type { AppId } from '../../types/os';
import { useDesktop } from '../../context/DesktopContext';

interface WindowControlsProps {
  appId: AppId;
}

export const WindowControls: React.FC<WindowControlsProps> = ({ appId }) => {
  const { closeApp, minimizeApp, maximizeApp } = useDesktop();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-2 group px-1 py-1 cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="group"
      aria-label="Window management controls"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          closeApp(appId);
        }}
        className="w-3 h-3 cursor-default rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center transition-all duration-150 active:brightness-75 focus:outline-none"
        title="Fermer"
        aria-label="Fermer la fenêtre"
      >
        {isHovered && <X size={8} className="text-[#4D0000] stroke-[2.5]" />}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          minimizeApp(appId);
        }}
        className="w-3 h-3 cursor-default rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center transition-all duration-150 active:brightness-75 focus:outline-none"
        title="Réduire"
        aria-label="Réduire la fenêtre"
      >
        {isHovered && <Minus size={8} className="text-[#593B00] stroke-[3]" />}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          maximizeApp(appId);
        }}
        className="w-3 h-3 cursor-default rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center transition-all duration-150 active:brightness-75 focus:outline-none"
        title="Plein écran"
        aria-label="Agrandir la fenêtre"
      >
        {isHovered && <Maximize2 size={8} className="text-[#004A06] stroke-[2.5]" />}
      </button>
    </div>
  );
};
