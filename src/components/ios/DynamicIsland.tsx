import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoDismiss } from '../desktop/Notification';

export interface IslandNotification {
  title: string;
  message: string;
  icon: React.ReactNode;
}

interface DynamicIslandProps {
  /** When set, the island expands to show it, then shrinks back. */
  notification?: IslandNotification | null;
  onDismiss?: () => void;
  /** Time before the island shrinks back, in milliseconds. Holding a finger on it pauses the countdown. */
  duration?: number;
}

const SPRING = { type: 'spring', stiffness: 420, damping: 34 } as const;
const noop = () => {};

export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  notification = null,
  onDismiss = noop,
  duration = 5000,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const isExpanded = notification !== null;
  useAutoDismiss(isExpanded, duration, isPaused, onDismiss);

  return (
    <div className="absolute inset-x-0 top-2.5 z-50 flex justify-center pointer-events-none">
      <motion.div
        layout
        transition={SPRING}
        onClick={isExpanded ? onDismiss : undefined}
        onPointerDown={() => setIsPaused(true)}
        onPointerUp={() => setIsPaused(false)}
        onPointerLeave={() => setIsPaused(false)}
        role={isExpanded ? 'status' : undefined}
        aria-live="polite"
        style={{ borderRadius: isExpanded ? 28 : 999 }}
        className={`pointer-events-auto overflow-hidden bg-black text-white border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.45)] ${
          isExpanded ? 'w-[min(22rem,calc(100vw-1.5rem))] cursor-pointer' : 'h-6'
        }`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {isExpanded ? (
            <motion.div
              key="expanded"
              layout="position"
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)', transition: { delay: 0.12, duration: 0.25 } }}
              exit={{ opacity: 0, filter: 'blur(4px)', transition: { duration: 0.12 } }}
              className="flex items-center gap-3 p-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center shrink-0">
                {notification.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold truncate">{notification.title}</span>
                  <span className="text-[10px] text-white/45 shrink-0">À l'instant</span>
                </div>
                <p className="text-[11px] text-white/70 leading-snug mt-0.5">{notification.message}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="compact"
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.1 } }}
              exit={{ opacity: 0, transition: { duration: 0.08 } }}
              className="h-6 px-3 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-medium text-white/90">Disponible</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
