import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DesktopProvider, useDesktop } from '../../context/DesktopContext';
import { Wallpaper } from './Wallpaper';
import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { DesktopIcon } from './DesktopIcon';
import { StackWidget } from './StackWidget';
import { GithubWidget } from './GithubWidget';
import { Spotlight } from './Spotlight';
import { ControlCenter } from './ControlCenter';
import { ContextMenu } from './ContextMenu';
import { WindowFrame } from '../window/WindowFrame';
import { LockScreen } from './LockScreen';
import { Notification } from './Notification';
import { BootScreen } from './BootScreen';
import { KernelPanic } from './KernelPanic';

import { IOSHomeScreen } from '../ios/IOSHomeScreen';
import { IOSAppContainer } from '../ios/IOSAppContainer';

import type { IslandNotification } from '../ios/DynamicIsland';
import { AppSpinner } from '../ui/AppSpinner';

import { APP_IDS } from '../../types/os';
import type { AppId } from '../../types/os';
import { Sparkles, RotateCcw } from '../ui/Icons';
import { watchFrameRate } from '../../lib/performance';

// Each app is its own chunk, fetched when first opened (and preloaded once the
// desktop is idle), which keeps the initial bundle down to the shell.
const APP_LOADERS: Record<AppId, () => Promise<{ default: React.ComponentType }>> = {
  finder: () => import('../apps/FinderApp').then((m) => ({ default: m.FinderApp })),
  projects: () => import('../apps/ProjectsApp').then((m) => ({ default: m.ProjectsApp })),
  contact: () => import('../apps/ContactApp').then((m) => ({ default: m.ContactApp })),
  terminal: () => import('../apps/TerminalApp').then((m) => ({ default: m.TerminalApp })),
  about: () => import('../apps/AboutApp').then((m) => ({ default: m.AboutApp })),
  settings: () => import('../apps/SettingsApp').then((m) => ({ default: m.SettingsApp })),
  snake: () => import('../apps/SnakeApp').then((m) => ({ default: m.SnakeApp })),
  assistant: () => import('../apps/AssistantApp').then((m) => ({ default: m.AssistantApp })),
};

const APP_COMPONENTS = Object.fromEntries(
  APP_IDS.map((id) => [id, lazy(APP_LOADERS[id])])
) as Record<AppId, React.LazyExoticComponent<React.ComponentType>>;

const WELCOME_NOTIFICATION: IslandNotification = {
  icon: <Sparkles size={20} />,
  title: 'Bienvenue sur le portfolio !',
  message: 'Explorez les projets, ouvrez le Terminal ou écrivez-moi via l’app Contact.',
};

const PANIC_NOTIFICATION: IslandNotification = {
  icon: <RotateCcw size={20} />,
  title: 'Votre ordinateur a redémarré',
  message: 'Un problème est survenu. Évitez les sudo rm -rf / à l’avenir 😉',
};

const DesktopInner: React.FC = () => {
  const {
    windows,
    openApp,
    setSelectedDesktopItem,
    isLocked,
    unlockScreen,
    systemState,
    isMissionControl,
    setIsMissionControl,
  } = useDesktop();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [notification, setNotification] = useState({ content: WELCOME_NOTIFICATION, open: false });
  const hasUnlockedOnce = useRef(false);
  const hasPanicked = useRef(false);
  const dismissNotification = useCallback(() => setNotification((prev) => ({ ...prev, open: false })), []);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileApp, setActiveMobileApp] = useState<AppId | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    if (systemState === 'panic') hasPanicked.current = true;
  }, [systemState]);

  useEffect(() => {
    if (isLocked) return;
    const isFirstUnlock = !hasUnlockedOnce.current;
    if (!isFirstUnlock && !hasPanicked.current) return;
    hasUnlockedOnce.current = true;
    const content = hasPanicked.current ? PANIC_NOTIFICATION : WELCOME_NOTIFICATION;
    hasPanicked.current = false;

    // Wait for the lock screen to finish fading out so the entrance is visible.
    const timer = setTimeout(() => {
      setNotification({ content, open: true });
      // Recruiters land straight on the profile instead of hunting for it.
      if (isFirstUnlock && !isMobile) openApp('about');
    }, 600);
    const idle = 'requestIdleCallback' in window ? requestIdleCallback : (cb: () => void) => setTimeout(cb, 2000);
    idle(() => Object.values(APP_LOADERS).forEach((load) => load()));
    const stopWatching = watchFrameRate();
    return () => {
      clearTimeout(timer);
      stopWatching();
    };
  }, [isLocked]);

  const openResume = useCallback(() => {
    unlockScreen();
    if (isMobile) setActiveMobileApp('about');
    else openApp('about');
  }, [isMobile, unlockScreen, openApp]);

  const handleDesktopClick = () => {
    setSelectedDesktopItem(null);
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isMobile) {
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const renderAppContent = (appId: AppId) => {
    const App = APP_COMPONENTS[appId] ?? APP_COMPONENTS.projects;
    return <App />;
  };

  const hasVisibleWindows = Object.values(windows).some((w) => w.isOpen && !w.isMinimized);

  return (
    <div
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      className="relative w-screen h-screen overflow-hidden select-none font-sans"
    >
      <AnimatePresence>{systemState === 'booting' && <BootScreen key="boot" />}</AnimatePresence>
      <AnimatePresence>{systemState === 'panic' && <KernelPanic key="panic" />}</AnimatePresence>
      <LockScreen isMobile={isMobile} onOpenResume={openResume} />

      <Wallpaper />
      {isMobile ? (
        <div className="relative w-full h-full flex flex-col z-20">
          <IOSHomeScreen
            onOpenApp={(appId) => setActiveMobileApp(appId)}
            notification={notification.open ? notification.content : null}
            onDismissNotification={dismissNotification}
          />
          {activeMobileApp && (
            <IOSAppContainer
              appId={activeMobileApp}
              onClose={() => setActiveMobileApp(null)}
            >
              <Suspense fallback={<AppSpinner />}>{renderAppContent(activeMobileApp)}</Suspense>
            </IOSAppContainer>
          )}
        </div>
      ) : (
        <>
          <MenuBar />
          <div className="absolute top-14 right-5 z-10 hidden w-64 flex-col gap-3 lg:flex">
            <StackWidget />
            <GithubWidget />
          </div>
          <main
            className="absolute top-10 left-4 z-10 grid grid-flow-col grid-rows-6 gap-3 items-start p-2"
            role="region"
            aria-label="Desktop icons"
          >
            <DesktopIcon appId="projects" title="Projets" />
            <DesktopIcon appId="about" title="Profil / CV" />
            <DesktopIcon appId="contact" title="Contact" />
            <DesktopIcon appId="terminal" title="Terminal" />
          </main>
          <Notification open={notification.open} onClose={dismissNotification} {...notification.content} />

          <AnimatePresence>
            {isMissionControl && (
              <motion.div
                key="mission-control"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMissionControl(false);
                }}
                className="fixed inset-0 z-10 bg-black/35 backdrop-blur-sm flex items-center justify-center"
                aria-label="Mission Control"
              >
                {!hasVisibleWindows && <p className="text-sm font-medium text-white/70">Aucune fenêtre ouverte</p>}
              </motion.div>
            )}
          </AnimatePresence>

          <section aria-label="Active Windows" className="pointer-events-none [&>*]:pointer-events-auto">
            {APP_IDS.map((appId) => (
              <WindowFrame key={appId} appId={appId}>
                {renderAppContent(appId)}
              </WindowFrame>
            ))}
          </section>
          <Dock />
          <Spotlight />
          <ControlCenter />
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              onClose={() => setContextMenu(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export const Desktop: React.FC = () => {
  return (
    <DesktopProvider>
      <DesktopInner />
    </DesktopProvider>
  );
};
export default Desktop;
