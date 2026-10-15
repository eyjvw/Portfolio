import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppId } from '../../types/os';
import { useDesktop } from '../../context/DesktopContext';
import { WindowControls } from './WindowControls';
import { APPS } from '../../data/portfolio';

interface WindowFrameProps {
  appId: AppId;
  children: React.ReactNode;
  headerRightContent?: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  appId,
  children,
  headerRightContent,
}) => {
  const {
    windows,
    activeAppId,
    bringToFront,
    updateWindowPosition,
    updateWindowSize,
    maximizeApp,
  } = useDesktop();

  const winState = windows[appId];
  const appDef = APPS.find((a) => a.id === appId);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartPos = useRef<{ mouseX: number; mouseY: number; winX: number; winY: number }>({
    mouseX: 0,
    mouseY: 0,
    winX: 0,
    winY: 0,
  });
  const resizeStartPos = useRef<{ mouseX: number; mouseY: number; winW: number; winH: number }>({
    mouseX: 0,
    mouseY: 0,
    winW: 0,
    winH: 0,
  });

  const isActive = activeAppId === appId;

  const handleTitleBarPointerDown = (e: React.PointerEvent) => {
    if (winState.isMaximized) return;

    if ((e.target as HTMLElement).closest('button')) return;

    bringToFront(appId);
    setIsDragging(true);
    dragStartPos.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winX: winState.position.x,
      winY: winState.position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleTitleBarPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartPos.current.mouseX;
    const deltaY = e.clientY - dragStartPos.current.mouseY;

    const newX = Math.max(0, Math.min(window.innerWidth - 100, dragStartPos.current.winX + deltaX));
    const newY = Math.max(30, Math.min(window.innerHeight - 80, dragStartPos.current.winY + deltaY));

    updateWindowPosition(appId, { x: newX, y: newY });
  };

  const handleTitleBarPointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handleResizePointerDown = (e: React.PointerEvent) => {
    if (winState.isMaximized) return;
    e.stopPropagation();
    bringToFront(appId);
    setIsResizing(true);
    resizeStartPos.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winW: winState.size.width,
      winH: winState.size.height,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizePointerMove = (e: React.PointerEvent) => {
    if (!isResizing) return;
    const deltaX = e.clientX - resizeStartPos.current.mouseX;
    const deltaY = e.clientY - resizeStartPos.current.mouseY;

    const minW = appDef?.minWidth || 400;
    const minH = appDef?.minHeight || 300;

    const newW = Math.max(minW, Math.min(window.innerWidth - winState.position.x - 10, resizeStartPos.current.winW + deltaX));
    const newH = Math.max(minH, Math.min(window.innerHeight - winState.position.y - 70, resizeStartPos.current.winH + deltaY));

    updateWindowSize(appId, { width: newW, height: newH });
  };

  const handleResizePointerUp = (e: React.PointerEvent) => {
    if (isResizing) {
      setIsResizing(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  if (!winState || !winState.isOpen || winState.isMinimized) {
    return null;
  }

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  return (
    <AnimatePresence>
      <motion.div
        key={appId}
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        onPointerDown={() => bringToFront(appId)}
        style={{
          position: 'fixed',
          zIndex: winState.zIndex,
          left: isMobile ? 8 : winState.position.x,
          top: isMobile ? 38 : winState.position.y,
          width: isMobile ? 'calc(100vw - 16px)' : winState.size.width,
          height: isMobile ? 'calc(100vh - 110px)' : winState.size.height,
        }}
        className={`aero-glass flex flex-col rounded-2xl overflow-hidden transition-[opacity,box-shadow] duration-200 ${
          isActive ? 'shadow-2xl' : 'opacity-90'
        } ${appId === 'terminal' ? 'text-gray-100' : 'text-slate-800 dark:text-slate-100'}`}
      >
        <div
          onPointerDown={handleTitleBarPointerDown}
          onPointerMove={handleTitleBarPointerMove}
          onPointerUp={handleTitleBarPointerUp}
          onDoubleClick={() => maximizeApp(appId)}
          className="h-11 px-4 flex items-center justify-between select-none cursor-grab active:cursor-grabbing shrink-0 relative"
        >
          <div className="flex items-center z-10">
            <WindowControls appId={appId} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-20">
            <span
              className={`text-xs font-semibold tracking-wide truncate ${
                isActive
                  ? 'text-slate-900 dark:text-white [text-shadow:0_0_10px_rgba(255,255,255,0.6)] dark:[text-shadow:0_1px_8px_rgba(0,0,0,0.5)]'
                  : 'text-slate-600 dark:text-white/55'
              }`}
            >
              {winState.title}
            </span>
          </div>
          <div className="flex items-center gap-2 z-10">{headerRightContent}</div>
        </div>
        <div
          className={`flex-1 overflow-hidden relative flex flex-col mx-1.5 mb-1.5 rounded-xl border shadow-[0_1px_4px_rgba(0,0,0,0.2)] ${
            appId === 'terminal'
              ? 'bg-[#1e1e24]/95 border-black/40'
              : 'bg-white/90 dark:bg-[#1C1C1E]/90 border-black/10 dark:border-white/10'
          }`}
        >
          {children}
        </div>
        {!winState.isMaximized && !isMobile && (
          <div
            onPointerDown={handleResizePointerDown}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 z-30 select-none opacity-40 hover:opacity-100"
            title="Redimensionner"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M7 1L1 7M7 4L4 7M7 7L7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
