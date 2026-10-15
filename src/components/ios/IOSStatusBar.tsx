import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from '../ui/Icons';
import { DynamicIsland, type IslandNotification } from './DynamicIsland';

interface IOSStatusBarProps {
  notification?: IslandNotification | null;
  onDismissNotification?: () => void;
}

export const IOSStatusBar: React.FC<IOSStatusBarProps> = ({ notification, onDismissNotification }) => {
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-11 px-6 flex items-center justify-between text-white text-xs font-semibold select-none z-50 shrink-0">
      <span className="font-semibold tracking-tight text-sm drop-shadow">{timeStr}</span>
      <DynamicIsland notification={notification} onDismiss={onDismissNotification} />
      <div className="flex items-center gap-2 text-white drop-shadow">
        <span className="text-[11px] font-mono">5G</span>
        <Wifi size={14} />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-mono">100%</span>
          <Battery size={15} className="text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
