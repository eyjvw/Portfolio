import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { APPS } from '../../data/portfolio';
import type { AppId } from '../../types/os';
import { useDesktop } from '../../context/DesktopContext';
import { AppIcon } from '../ui/Icons';

interface DockIconItemProps {
  appId: AppId;
  title: string;
  mouseX: MotionValue<number>;
  isOpen: boolean;
  isBouncing: boolean;
  onClick: () => void;
}

const DockIconItem: React.FC<DockIconItemProps> = ({
  appId,
  title,
  mouseX,
  isOpen,
  isBouncing,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val: number) => {
    if (!Number.isFinite(val) || !ref.current) return 1000;
    const bounds = ref.current.getBoundingClientRect();
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [50, 82, 50]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 260, damping: 16 });

  return (
    <div className="relative flex flex-col items-center group select-none">
      {isHovered && (
        <div className="absolute -top-11 px-2.5 py-1 rounded-lg bg-black/85 dark:bg-neutral-850 text-white text-[11px] font-semibold backdrop-blur-md border border-white/15 shadow-xl pointer-events-none whitespace-nowrap z-50 animate-in fade-in zoom-in-95">
          {title}
        </div>
      )}

      <motion.div
        ref={ref}
        data-dock-app={appId}
        style={{ width, height: width }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        className={`cursor-pointer flex items-center justify-center relative origin-bottom will-change-[width,height] ${
          isBouncing ? 'animate-bounce' : ''
        }`}
      >
        <AppIcon appId={appId} className="w-full h-full" />
      </motion.div>
      <div className="h-1.5 flex items-center justify-center mt-1">
        {isOpen && (
          <div className="w-1 h-1 rounded-full bg-slate-800 dark:bg-white/90 shadow-sm" />
        )}
      </div>
    </div>
  );
};

export const Dock: React.FC = () => {
  const { windows, openApp, bouncingAppId } = useDesktop();
  const mouseX = useMotionValue(10000);

  return (
    <nav
      aria-label="macOS Dock"
      className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] pointer-events-auto"
    >
      <div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(10000)}
        className="px-3.5 pt-2 pb-1 rounded-2xl flex items-end gap-2.5 aero-glass"
      >
        {APPS.filter((app) => !app.isHidden).map((app) => (
          <DockIconItem
            key={app.id}
            appId={app.id}
            title={app.title}
            mouseX={mouseX}
            isOpen={!!windows[app.id]?.isOpen}
            isBouncing={bouncingAppId === app.id}
            onClick={() => openApp(app.id)}
          />
        ))}
      </div>
    </nav>
  );
};
