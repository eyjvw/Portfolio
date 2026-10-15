import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from '../ui/Icons';

interface NotificationProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  icon: React.ReactNode;
  /** Time before auto-dismiss, in milliseconds. Hovering pauses the countdown. */
  duration?: number;
}

/**
 * Calls `onClose` once `duration` ms of visible time have passed. While
 * `paused` is true the countdown stops and resumes where it left off.
 */
export const useAutoDismiss = (open: boolean, duration: number, paused: boolean, onClose: () => void) => {
  const remaining = useRef(duration);
  const startedAt = useRef(0);

  useEffect(() => {
    if (open) remaining.current = duration;
  }, [open, duration]);

  useEffect(() => {
    if (!open || paused) return;
    startedAt.current = Date.now();
    const timer = setTimeout(onClose, remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [open, paused, onClose]);
};

export const Notification: React.FC<NotificationProps> = ({
  open,
  onClose,
  title,
  message,
  icon,
  duration = 5000,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  useAutoDismiss(open, duration, isPaused, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          role="status"
          aria-live="polite"
          aria-label={title}
          initial={{ opacity: 0, y: -24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          onClick={onClose}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="fixed top-10 left-0 right-0 mx-auto z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl aero-glass-strong cursor-pointer"
        >
          <div className="flex items-start gap-3 p-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
              {icon}
            </div>
            <div className="flex-1 pr-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-neutral-100">{title}</span>
                <span className="text-[10px] text-slate-400">À l'instant</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-neutral-300 mt-1 leading-snug">{message}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Fermer la notification"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={13} />
            </button>
          </div>
          <div
            className="h-0.5 bg-gradient-to-r from-sky-400 to-emerald-400 origin-left"
            style={{
              animation: `notification-countdown ${duration}ms linear forwards`,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          />
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
