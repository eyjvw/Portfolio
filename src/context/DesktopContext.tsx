import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { AppId, DayPhase, SystemState, WindowState, WallpaperTheme } from '../types/os';
import { APPS, WALLPAPERS } from '../data/portfolio';
import { soundEngine } from '../components/ui/AudioFx';

interface DesktopContextType {
  windows: Record<AppId, WindowState>;
  activeAppId: AppId | null;
  openApp: (appId: AppId) => void;
  closeApp: (appId: AppId) => void;
  minimizeApp: (appId: AppId) => void;
  maximizeApp: (appId: AppId) => void;
  bringToFront: (appId: AppId) => void;
  updateWindowPosition: (appId: AppId, pos: { x: number; y: number }) => void;
  updateWindowSize: (appId: AppId, size: { width: number; height: number }) => void;
  wallpaper: WallpaperTheme;
  setWallpaper: (wp: WallpaperTheme) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
  isSpotlightOpen: boolean;
  setIsSpotlightOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isControlCenterOpen: boolean;
  setIsControlCenterOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  isAppleMenuOpen: boolean;
  setIsAppleMenuOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  selectedDesktopItem: string | null;
  setSelectedDesktopItem: (val: string | null) => void;
  bouncingAppId: AppId | null;
  isLocked: boolean;
  lockScreen: () => void;
  unlockScreen: () => void;
  isMissionControl: boolean;
  setIsMissionControl: (val: boolean | ((prev: boolean) => boolean)) => void;
  systemState: SystemState;
  finishBoot: () => void;
  reboot: () => void;
  triggerKernelPanic: () => void;
}

const DesktopContext = createContext<DesktopContextType | null>(null);

const getDayPhase = (hour: number): DayPhase => {
  if (hour >= 6 && hour < 9) return 'dawn';
  if (hour >= 9 && hour < 18) return 'day';
  if (hour >= 18 && hour < 21) return 'dusk';
  return 'night';
};

const DEFAULT_WINDOWS = (): Record<AppId, WindowState> => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  const result: Partial<Record<AppId, WindowState>> = {};

  APPS.forEach((app, index) => {
    const width = isMobile ? screenWidth - 24 : Math.min(app.defaultWidth, screenWidth - 60);
    const height = isMobile ? screenHeight - 120 : Math.min(app.defaultHeight, screenHeight - 140);

    const offsetX = Math.max(20, (screenWidth - width) / 2 + (index % 4) * 20 - 30);
    const offsetY = Math.max(45, (screenHeight - height) / 2 + (index % 4) * 20 - 50);

    result[app.id] = {
      id: app.id,
      appId: app.id,
      title: app.title,
      isOpen: false,
      isMinimized: false,
      isMaximized: isMobile,
      zIndex: 1,
      position: { x: offsetX, y: offsetY },
      size: { width, height },
    };
  });

  return result as Record<AppId, WindowState>;
};

export const DesktopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<Record<AppId, WindowState>>(DEFAULT_WINDOWS);
  const [activeAppId, setActiveAppId] = useState<AppId | null>(null);
  const [highestZ, setHighestZ] = useState<number>(10);
  const [wallpaperTheme, setWallpaperState] = useState<WallpaperTheme>(WALLPAPERS[0]);
  // Starts on 'day' so the server render and hydration agree; corrected on mount.
  const [dayPhase, setDayPhase] = useState<DayPhase>('day');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState<boolean>(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState<boolean>(false);
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState<boolean>(false);
  const [selectedDesktopItem, setSelectedDesktopItem] = useState<string | null>(null);
  const [bouncingAppId, setBouncingAppId] = useState<AppId | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isMissionControl, setIsMissionControl] = useState<boolean>(false);
  const [systemState, setSystemState] = useState<SystemState>('booting');

  const lockScreen = useCallback(() => {
    setIsAppleMenuOpen(false);
    setIsControlCenterOpen(false);
    setIsSpotlightOpen(false);
    setIsLocked(true);
  }, []);

  const unlockScreen = useCallback(() => {
    setIsLocked(false);
    soundEngine.playStartupChime();
  }, []);

  const finishBoot = useCallback(() => setSystemState('running'), []);

  const triggerKernelPanic = useCallback(() => setSystemState('panic'), []);

  const reboot = useCallback(() => {
    setIsAppleMenuOpen(false);
    setIsControlCenterOpen(false);
    setIsSpotlightOpen(false);
    setIsMissionControl(false);
    setWindows((prev) => {
      const next = { ...prev };
      APPS.forEach((app) => {
        next[app.id] = { ...next[app.id], isOpen: false, isMinimized: false };
      });
      return next;
    });
    setActiveAppId(null);
    setIsLocked(true);
    setSystemState('booting');
  }, []);

  useEffect(() => {
    soundEngine.enabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const update = () => setDayPhase(getDayPhase(new Date().getHours()));
    update();
    const interval = setInterval(update, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const wallpaper = useMemo(
    () =>
      wallpaperTheme.timeOfDay
        ? { ...wallpaperTheme, cssBackground: wallpaperTheme.timeOfDay[dayPhase] }
        : wallpaperTheme,
    [wallpaperTheme, dayPhase]
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 768;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      setWindows((prev) => {
        const next = { ...prev };
        APPS.forEach((app, index) => {
          if (!next[app.id]) return;
          const currentWin = next[app.id];
          if (currentWin.isMaximized) {
            next[app.id] = {
              ...currentWin,
              position: { x: 0, y: 32 },
              size: { width: screenWidth, height: screenHeight - 32 - 76 },
            };
          } else {
            const width = isMobile ? screenWidth - 16 : Math.min(app.defaultWidth, screenWidth - 40);
            const height = isMobile ? screenHeight - 110 : Math.min(app.defaultHeight, screenHeight - 130);
            const offsetX = isMobile ? 8 : Math.max(20, (screenWidth - width) / 2 + (index % 4) * 20 - 30);
            const offsetY = isMobile ? 36 : Math.max(45, (screenHeight - height) / 2 + (index % 4) * 20 - 50);

            next[app.id] = {
              ...currentWin,
              position: { x: offsetX, y: offsetY },
              size: { width, height },
            };
          }
        });
        return next;
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const bringToFront = useCallback(
    (appId: AppId) => {
      setHighestZ((prev) => {
        const nextZ = prev + 1;
        setWindows((prevWindows) => {
          if (!prevWindows[appId]) return prevWindows;
          return {
            ...prevWindows,
            [appId]: {
              ...prevWindows[appId],
              isMinimized: false,
              zIndex: nextZ,
            },
          };
        });
        return nextZ;
      });
      setActiveAppId(appId);
    },
    []
  );

  const openApp = useCallback(
    (appId: AppId) => {
      setBouncingAppId(appId);
      setTimeout(() => setBouncingAppId(null), 1000);

      soundEngine.playPop();

      setWindows((prev) => {
        const win = prev[appId];
        if (!win) return prev;
        return {
          ...prev,
          [appId]: {
            ...win,
            isOpen: true,
            isMinimized: false,
          },
        };
      });

      bringToFront(appId);
      setIsSpotlightOpen(false);
    },
    [bringToFront]
  );

  const closeApp = useCallback((appId: AppId) => {
    soundEngine.playMinimize();
    setWindows((prev) => {
      const win = prev[appId];
      if (!win) return prev;
      return {
        ...prev,
        [appId]: {
          ...win,
          isOpen: false,
          isMinimized: false,
        },
      };
    });

    setActiveAppId((prev) => (prev === appId ? null : prev));
  }, []);

  const minimizeApp = useCallback((appId: AppId) => {
    soundEngine.playMinimize();
    setWindows((prev) => {
      const win = prev[appId];
      if (!win) return prev;
      return {
        ...prev,
        [appId]: {
          ...win,
          isMinimized: true,
        },
      };
    });
    setActiveAppId((prev) => (prev === appId ? null : prev));
  }, []);

  const maximizeApp = useCallback((appId: AppId) => {
    soundEngine.playClick();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    setWindows((prev) => {
      const win = prev[appId];
      if (!win) return prev;

      if (!win.isMaximized) {
        return {
          ...prev,
          [appId]: {
            ...win,
            isMaximized: true,
            preMaximizeState: {
              position: { ...win.position },
              size: { ...win.size },
            },
            position: { x: 0, y: 32 },
            size: { width: screenWidth, height: screenHeight - 32 - 76 },
          },
        };
      } else {
        const pre = win.preMaximizeState || {
          position: { x: 100, y: 100 },
          size: { width: 800, height: 500 },
        };
        return {
          ...prev,
          [appId]: {
            ...win,
            isMaximized: false,
            position: pre.position,
            size: pre.size,
          },
        };
      }
    });
  }, []);

  const updateWindowPosition = useCallback((appId: AppId, pos: { x: number; y: number }) => {
    setWindows((prev) => {
      const win = prev[appId];
      if (!win) return prev;
      return {
        ...prev,
        [appId]: {
          ...win,
          position: pos,
        },
      };
    });
  }, []);

  const updateWindowSize = useCallback((appId: AppId, size: { width: number; height: number }) => {
    setWindows((prev) => {
      const win = prev[appId];
      if (!win) return prev;
      return {
        ...prev,
        [appId]: {
          ...win,
          size,
        },
      };
    });
  }, []);

  const setWallpaper = useCallback((wp: WallpaperTheme) => {
    soundEngine.playClick();
    setWallpaperState(wp);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === ' ')) {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
      // F3 and Ctrl+↑ are the macOS shortcuts for Mission Control.
      if (e.key === 'F3' || (e.ctrlKey && e.key === 'ArrowUp')) {
        e.preventDefault();
        setIsMissionControl((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSpotlightOpen(false);
        setIsControlCenterOpen(false);
        setIsAppleMenuOpen(false);
        setIsMissionControl(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Memoized so consumers only re-render when something they use changed
  // (callbacks are stable, so in practice only the state values matter).
  const value = useMemo<DesktopContextType>(
    () => ({
      windows,
      activeAppId,
      openApp,
      closeApp,
      minimizeApp,
      maximizeApp,
      bringToFront,
      updateWindowPosition,
      updateWindowSize,
      wallpaper,
      setWallpaper,
      isDarkMode,
      setIsDarkMode,
      soundEnabled,
      setSoundEnabled,
      isSpotlightOpen,
      setIsSpotlightOpen,
      isControlCenterOpen,
      setIsControlCenterOpen,
      isAppleMenuOpen,
      setIsAppleMenuOpen,
      selectedDesktopItem,
      setSelectedDesktopItem,
      bouncingAppId,
      isLocked,
      lockScreen,
      unlockScreen,
      isMissionControl,
      setIsMissionControl,
      systemState,
      finishBoot,
      reboot,
      triggerKernelPanic,
    }),
    [
      windows, activeAppId, openApp, closeApp, minimizeApp, maximizeApp, bringToFront,
      updateWindowPosition, updateWindowSize, wallpaper, setWallpaper, isDarkMode,
      setIsDarkMode, soundEnabled, setSoundEnabled, isSpotlightOpen, setIsSpotlightOpen,
      isControlCenterOpen, setIsControlCenterOpen, isAppleMenuOpen, setIsAppleMenuOpen,
      selectedDesktopItem, setSelectedDesktopItem, bouncingAppId, isLocked, lockScreen,
      unlockScreen, isMissionControl, setIsMissionControl, systemState, finishBoot, reboot,
      triggerKernelPanic,
    ]
  );

  return (
    <DesktopContext.Provider value={value}>
      {children}
    </DesktopContext.Provider>
  );
};

export const useDesktop = () => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktop must be used within a DesktopProvider');
  }
  return context;
};
