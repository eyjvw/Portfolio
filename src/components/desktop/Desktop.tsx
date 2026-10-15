import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DesktopProvider, useDesktop } from '../../context/DesktopContext';
import { Wallpaper } from './Wallpaper';
import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { DesktopIcon } from './DesktopIcon';
import { StackWidget } from './StackWidget';
import { Spotlight } from './Spotlight';
import { ControlCenter } from './ControlCenter';
import { ContextMenu } from './ContextMenu';
import { WindowFrame } from '../window/WindowFrame';
import { LockScreen } from './LockScreen';
import { Notification } from './Notification';

import { IOSHomeScreen } from '../ios/IOSHomeScreen';
import { IOSAppContainer } from '../ios/IOSAppContainer';

import { FinderApp } from '../apps/FinderApp';
import { ProjectsApp } from '../apps/ProjectsApp';
import { ContactApp } from '../apps/ContactApp';
import { TerminalApp } from '../apps/TerminalApp';
import { AboutApp } from '../apps/AboutApp';
import { SettingsApp } from '../apps/SettingsApp';
import { SnakeApp } from '../apps/SnakeApp';
import { AssistantApp } from '../apps/AssistantApp';

import type { AppId } from '../../types/os';
import { Sparkles } from '../ui/Icons';

const WELCOME_NOTIFICATION = {
  icon: <Sparkles size={20} />,
  title: 'Bienvenue sur le portfolio !',
  message: 'Explorez les projets, ouvrez le Terminal ou écrivez-moi via l’app Contact.',
};

const DesktopInner: React.FC = () => {
  const { setSelectedDesktopItem, isLocked } = useDesktop();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(false);
  const hasUnlockedOnce = useRef(false);
  const dismissWelcome = useCallback(() => setShowWelcomeNotification(false), []);
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
    if (isLocked || hasUnlockedOnce.current) return;
    hasUnlockedOnce.current = true;
    // Wait for the lock screen to finish fading out so the entrance is visible.
    const timer = setTimeout(() => setShowWelcomeNotification(true), 600);
    return () => clearTimeout(timer);
  }, [isLocked]);

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
    switch (appId) {
      case 'finder':
        return <FinderApp />;
      case 'projects':
        return <ProjectsApp />;
      case 'contact':
        return <ContactApp />;
      case 'terminal':
        return <TerminalApp />;
      case 'about':
        return <AboutApp />;
      case 'settings':
        return <SettingsApp />;
      case 'snake':
        return <SnakeApp />;
      case 'assistant':
        return <AssistantApp />;
      default:
        return <ProjectsApp />;
    }
  };

  return (
    <div
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      className="relative w-screen h-screen overflow-hidden select-none font-sans"
    >
      <LockScreen isMobile={isMobile} />

      <Wallpaper />
      {isMobile ? (
        <div className="relative w-full h-full flex flex-col z-20">
          <IOSHomeScreen
            onOpenApp={(appId) => setActiveMobileApp(appId)}
            notification={showWelcomeNotification ? WELCOME_NOTIFICATION : null}
            onDismissNotification={dismissWelcome}
          />
          {activeMobileApp && (
            <IOSAppContainer
              appId={activeMobileApp}
              onClose={() => setActiveMobileApp(null)}
            >
              {renderAppContent(activeMobileApp)}
            </IOSAppContainer>
          )}
        </div>
      ) : (
        <>
          <MenuBar />
          <StackWidget className="absolute top-14 right-5 z-10 hidden w-64 lg:block" />
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
          <Notification open={showWelcomeNotification} onClose={dismissWelcome} {...WELCOME_NOTIFICATION} />

          <section aria-label="Active Windows" className="pointer-events-none [&>*]:pointer-events-auto">
            <WindowFrame appId="finder">
              <FinderApp />
            </WindowFrame>
            <WindowFrame appId="projects">
              <ProjectsApp />
            </WindowFrame>
            <WindowFrame appId="contact">
              <ContactApp />
            </WindowFrame>
            <WindowFrame appId="terminal">
              <TerminalApp />
            </WindowFrame>
            <WindowFrame appId="about">
              <AboutApp />
            </WindowFrame>
            <WindowFrame appId="settings">
              <SettingsApp />
            </WindowFrame>
            <WindowFrame appId="snake">
              <SnakeApp />
            </WindowFrame>
            <WindowFrame appId="assistant">
              <AssistantApp />
            </WindowFrame>
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
