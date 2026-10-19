import React, { Suspense, useEffect, useRef } from 'react';
import { motion, AnimatePresence, animate, useMotionValue } from 'framer-motion';
import type { TargetAndTransition, Variants } from 'framer-motion';
import type { AppId } from '../../types/os';
import { useDesktop } from '../../context/DesktopContext';
import { WindowControls } from './WindowControls';
import { getMissionControlTransform } from './missionControl';
import type { Rect } from './missionControl';
import { APPS } from '../../data/portfolio';
import { AppSpinner } from '../ui/AppSpinner';

interface WindowFrameProps {
  appId: AppId;
  children: React.ReactNode;
  headerRightContent?: React.ReactNode;
}

const SPRING = { type: 'spring', damping: 26, stiffness: 320 } as const;

/**
 * Genie-like minimize: the window shrinks into its dock icon, narrowing faster
 * than it flattens so it looks sucked in. Also played backwards on restore.
 */
const genieTo = (from: Rect, appId: AppId): TargetAndTransition => {
  const icon = document.querySelector(`[data-dock-app="${appId}"]`);
  if (!icon) return { opacity: 0, scale: 0.6, transition: { duration: 0.2 } };
  const to = icon.getBoundingClientRect();
  return {
    x: to.left + to.width / 2 - (from.left + from.width / 2),
    y: to.top + to.height / 2 - (from.top + from.height / 2),
    scaleX: to.width / from.width,
    scaleY: to.height / from.height,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: [0.6, 0, 0.8, 0.4],
      scaleX: { duration: 0.32, ease: [0.4, 0, 0.6, 1] },
      opacity: { duration: 0.5, ease: [0.9, 0, 1, 0.6] },
    },
  };
};

const VISIBLE: TargetAndTransition = { opacity: 1, scale: 1, scaleX: 1, scaleY: 1, x: 0, y: 0, transition: SPRING };
const CLOSED: TargetAndTransition = { opacity: 0, scale: 0.92, transition: { duration: 0.18 } };

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
    isMissionControl,
    setIsMissionControl,
  } = useDesktop();

  const winState = windows[appId];
  const appDef = APPS.find((a) => a.id === appId);
  const frameRef = useRef<HTMLDivElement>(null);

  // Drags and resizes write straight to the DOM and only reach the context on
  // release: updating it on every pointer move re-rendered the whole desktop.
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const scale = useMotionValue(1);
  const dragStart = useRef<{ mouseX: number; mouseY: number; winX: number; winY: number } | null>(null);
  const resizeStart = useRef<{ mouseX: number; mouseY: number; winW: number; winH: number } | null>(null);
  const resizeSize = useRef<{ width: number; height: number } | null>(null);

  // Remembers whether the window went to the dock, so it comes back out of it.
  const hiddenInDock = useRef(false);
  if (winState?.isMinimized) hiddenInDock.current = true;
  else if (!winState?.isOpen) hiddenInDock.current = false;

  const isActive = activeAppId === appId;
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const isVisible = !!winState && winState.isOpen && !winState.isMinimized;

  const missionTransform =
    isMissionControl && isVisible && !isMobile
      ? getMissionControlTransform(windows, appId, { width: window.innerWidth, height: window.innerHeight })
      : null;

  useEffect(() => {
    const target = missionTransform ?? { x: 0, y: 0, scale: 1 };
    const controls = [
      animate(offsetX, target.x, SPRING),
      animate(offsetY, target.y, SPRING),
      animate(scale, target.scale, SPRING),
    ];
    return () => controls.forEach((c) => c.stop());
  }, [missionTransform?.x, missionTransform?.y, missionTransform?.scale]);

  if (!winState) return null;

  // Clicking inside a window already in front shouldn't touch the context.
  const focus = () => {
    if (!isActive) bringToFront(appId);
  };

  // Resolved when the exit starts: AnimatePresence passes whether it was minimized.
  const variants: Variants = {
    exit: (minimized: boolean) => (minimized ? genieTo(frameRect, appId) : CLOSED),
  };

  const frameRect: Rect = isMobile
    ? { left: 8, top: 38, width: window.innerWidth - 16, height: window.innerHeight - 110 }
    : { left: winState.position.x, top: winState.position.y, width: winState.size.width, height: winState.size.height };

  const handleTitleBarPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (winState.isMaximized || isMissionControl) return;
    if ((e.target as HTMLElement).closest('button')) return;

    focus();
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winX: winState.position.x,
      winY: winState.position.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleTitleBarPointerMove = (e: React.PointerEvent) => {
    const start = dragStart.current;
    if (!start) return;
    const newX = Math.max(0, Math.min(window.innerWidth - 100, start.winX + e.clientX - start.mouseX));
    const newY = Math.max(30, Math.min(window.innerHeight - 80, start.winY + e.clientY - start.mouseY));
    offsetX.set(newX - start.winX);
    offsetY.set(newY - start.winY);
  };

  const handleTitleBarPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    if (!start) return;
    dragStart.current = null;
    // Both land before the next paint, so the window doesn't jump.
    updateWindowPosition(appId, { x: start.winX + offsetX.get(), y: start.winY + offsetY.get() });
    offsetX.set(0);
    offsetY.set(0);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (winState.isMaximized) return;
    e.stopPropagation();
    focus();
    resizeStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winW: winState.size.width,
      winH: winState.size.height,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleResizePointerMove = (e: React.PointerEvent) => {
    const start = resizeStart.current;
    const frame = frameRef.current;
    if (!start || !frame) return;

    const minW = appDef?.minWidth || 400;
    const minH = appDef?.minHeight || 300;
    const width = Math.max(minW, Math.min(window.innerWidth - winState.position.x - 10, start.winW + e.clientX - start.mouseX));
    const height = Math.max(minH, Math.min(window.innerHeight - winState.position.y - 70, start.winH + e.clientY - start.mouseY));

    frame.style.width = `${width}px`;
    frame.style.height = `${height}px`;
    resizeSize.current = { width, height };
  };

  const handleResizePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!resizeStart.current) return;
    resizeStart.current = null;
    if (resizeSize.current) updateWindowSize(appId, resizeSize.current);
    resizeSize.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <AnimatePresence custom={winState.isMinimized}>
      {isVisible && (
        <motion.div
          key={appId}
          ref={frameRef}
          onPointerDown={focus}
          style={{
            position: 'fixed',
            zIndex: winState.zIndex,
            left: frameRect.left,
            top: frameRect.top,
            width: isMobile ? 'calc(100vw - 16px)' : frameRect.width,
            height: isMobile ? 'calc(100vh - 110px)' : frameRect.height,
            x: offsetX,
            y: offsetY,
            scale,
          }}
        >
          <motion.div
            variants={variants}
            initial={hiddenInDock.current ? genieTo(frameRect, appId) : { opacity: 0, scale: 0.94, y: 15 }}
            animate={VISIBLE}
            exit="exit"
            className={`aero-glass w-full h-full flex flex-col rounded-2xl overflow-hidden transition-shadow duration-200 ${
              isActive ? 'shadow-2xl' : ''
            } ${appId === 'terminal' ? 'text-gray-100' : 'text-slate-800 dark:text-slate-100'}`}
          >
            <div
              onPointerDown={handleTitleBarPointerDown}
              onPointerMove={handleTitleBarPointerMove}
              onPointerUp={handleTitleBarPointerUp}
              onPointerCancel={handleTitleBarPointerUp}
              onDoubleClick={() => maximizeApp(appId)}
              className="h-11 px-4 flex items-center justify-between select-none cursor-grab active:cursor-grabbing shrink-0 relative touch-none"
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
              <Suspense fallback={<AppSpinner />}>{children}</Suspense>
            </div>
            {!winState.isMaximized && !isMobile && (
              <div
                onPointerDown={handleResizePointerDown}
                onPointerMove={handleResizePointerMove}
                onPointerUp={handleResizePointerUp}
                onPointerCancel={handleResizePointerUp}
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 z-30 select-none opacity-40 hover:opacity-100 touch-none"
                title="Redimensionner"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M7 1L1 7M7 4L4 7M7 7L7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
            )}
            {isMissionControl && (
              <div
                onPointerDown={(e) => {
                  e.stopPropagation();
                  bringToFront(appId);
                  setIsMissionControl(false);
                }}
                className="absolute inset-0 z-40 rounded-2xl cursor-pointer transition-shadow duration-150 hover:shadow-[inset_0_0_0_3px_rgba(96,165,250,0.9)]"
                title={winState.title}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
