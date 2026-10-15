import React from 'react';
import type { AppId } from '../../types/os';
import { useDesktop } from '../../context/DesktopContext';
import { AppIcon } from '../ui/Icons';
import { soundEngine } from '../ui/AudioFx';

interface DesktopIconProps {
  appId: AppId;
  title: string;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ appId, title }) => {
  const { openApp, selectedDesktopItem, setSelectedDesktopItem } = useDesktop();
  const isSelected = selectedDesktopItem === appId;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playClick();
    setSelectedDesktopItem(appId);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openApp(appId);
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`w-20 p-2 flex flex-col items-center gap-1.5 rounded-xl cursor-pointer select-none transition-all group ${
        isSelected
          ? 'bg-blue-500/25 ring-1 ring-blue-400/50 backdrop-blur-sm'
          : 'hover:bg-white/10 hover:backdrop-blur-xs'
      }`}
    >
      <AppIcon appId={appId} size={50} className="shadow-md group-hover:scale-105 transition-transform" />
      <span
        className={`text-[11px] font-medium text-center leading-tight line-clamp-2 px-1 rounded text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${
          isSelected ? 'bg-blue-600 rounded px-1' : ''
        }`}
      >
        {title}
      </span>
    </div>
  );
};
