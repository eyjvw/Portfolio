import React from 'react';
import { IOSStatusBar } from './IOSStatusBar';
import { APPS, PERSONAL_INFO } from '../../data/portfolio';
import { AppIcon } from '../ui/Icons';
import type { AppId } from '../../types/os';
import { soundEngine } from '../ui/AudioFx';
import { StackWidget } from '../desktop/StackWidget';
import type { IslandNotification } from './DynamicIsland';

interface IOSHomeScreenProps {
  onOpenApp: (appId: AppId) => void;
  notification?: IslandNotification | null;
  onDismissNotification?: () => void;
}

export const IOSHomeScreen: React.FC<IOSHomeScreenProps> = ({ onOpenApp, notification, onDismissNotification }) => {
  const dockAppIds: AppId[] = ['projects', 'contact', 'terminal', 'about'];
  const gridApps = APPS.filter((a) => !dockAppIds.includes(a.id));
  const dockApps = dockAppIds.map((id) => APPS.find((a) => a.id === id)!).filter(Boolean);

  const handleAppClick = (appId: AppId) => {
    soundEngine.playPop();
    onOpenApp(appId);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-y-auto pb-4 select-none relative z-10">
      <div className="space-y-4">
        <IOSStatusBar notification={notification} onDismissNotification={onDismissNotification} />
        <div className="px-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div
            onClick={() => handleAppClick('about')}
            className="p-4 rounded-3xl aero-glass-strong flex items-center gap-3.5 cursor-pointer active:scale-98 transition-transform"
          >
            <img
              src="/chat.png"
              alt={PERSONAL_INFO.name}
              className="w-14 h-14 rounded-2xl object-cover shadow-md shrink-0"
            />
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {PERSONAL_INFO.name}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              </div>
              <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 truncate">
                {PERSONAL_INFO.role}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-neutral-400 truncate mt-0.5">
                📍 {PERSONAL_INFO.location}
              </p>
            </div>
          </div>
          <StackWidget columns={5} caption={null} delay={0.15} className="sm:col-span-2 rounded-3xl" />
        </div>
        <div className="px-6 pt-3 grid grid-cols-4 gap-y-5 gap-x-4">
          {APPS.filter((app) => !app.isHidden).map((app) => (
            <div
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform"
            >
              <AppIcon appId={app.id} size={58} className="shadow-lg" />
              <span className="text-[11px] font-medium text-white text-center leading-tight truncate w-full drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                {app.title}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 pt-4 pb-1">
        <div className="p-3 rounded-[32px] aero-glass flex items-center justify-around">
          {dockApps.map((app) => (
            <div
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className="cursor-pointer active:scale-90 transition-transform"
            >
              <AppIcon appId={app.id} size={56} className="shadow-md" />
            </div>
          ))}
        </div>
        <div className="w-36 h-1 bg-white/50 rounded-full mx-auto mt-4" />
      </div>
    </div>
  );
};
