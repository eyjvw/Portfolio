import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useDesktop } from '../../context/DesktopContext';
import { PERSONAL_INFO } from '../../data/portfolio';
import { Github, Mail, FileText } from '../ui/Icons';

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.9'/></svg>\")";

const LockIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

const LinkedinIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="-1 -1 26 26" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.5 0h4.37v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v7.46h-4.56v-6.6c0-1.58-.03-3.6-2.2-3.6-2.2 0-2.53 1.72-2.53 3.49V22H7.72V8z" />
  </svg>
);

const SOCIAL_LINKS = [
  { label: 'GitHub', href: PERSONAL_INFO.socials.github, icon: <Github size={14} /> },
  { label: 'LinkedIn', href: PERSONAL_INFO.socials.linkedin, icon: <LinkedinIcon /> },
  { label: 'Mail', href: PERSONAL_INFO.socials.email, icon: <Mail size={14} /> },
];

const useClock = () => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return { time: '', date: '' };

  const time = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  });
  const date = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Paris',
  });

  return { time, date: date.charAt(0).toUpperCase() + date.slice(1) };
};

const KNOB_SIZE = 56;
const TRACK_PADDING = 4;

const SlideToUnlock: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [maxX, setMaxX] = useState(0);
  const labelOpacity = useTransform(x, [0, Math.max(1, maxX * 0.6)], [1, 0]);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setMaxX(trackRef.current.offsetWidth - KNOB_SIZE - TRACK_PADDING * 2);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const handleDragEnd = () => {
    if (maxX > 0 && x.get() >= maxX * 0.85) {
      animate(x, maxX, { duration: 0.12 });
      onUnlock();
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 32 });
    }
  };

  return (
    <div
      ref={trackRef}
      onClick={(e) => e.stopPropagation()}
      className="relative h-16 w-[min(320px,78vw)] rounded-full bg-white/15 border border-white/30 backdrop-blur-md overflow-hidden"
    >
      <motion.div
        style={{ opacity: labelOpacity }}
        className="lock-shimmer absolute inset-0 flex items-center justify-center pl-14 text-[11px] uppercase tracking-[0.16em] whitespace-nowrap pointer-events-none"
      >
        Glisser pour déverrouiller
      </motion.div>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: maxX }}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ x, width: KNOB_SIZE, height: KNOB_SIZE, top: TRACK_PADDING, left: TRACK_PADDING }}
        role="button"
        aria-label="Glisser pour déverrouiller"
        className="absolute rounded-full bg-white text-neutral-800 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.28)] touch-none cursor-grab active:cursor-grabbing"
      >
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </motion.div>
    </div>
  );
};

interface LockScreenProps {
  isMobile: boolean;
  /** Unlocks straight into the profile window, for visitors in a hurry. */
  onOpenResume: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ isMobile, onOpenResume }) => {
  const { isLocked, unlockScreen, wallpaper, systemState } = useDesktop();
  const { time, date } = useClock();
  const rootRef = useRef<HTMLDivElement>(null);

  const handleUnlock = useCallback(() => {
    if (isLocked) unlockScreen();
  }, [isLocked, unlockScreen]);

  useEffect(() => {
    // Keys belong to the boot screen until it is gone.
    if (!isLocked || systemState !== 'running') return;
    rootRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        unlockScreen();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isLocked, unlockScreen, systemState]);

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          ref={rootRef}
          key="lockscreen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-6%', scale: 1.04, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={isMobile ? undefined : handleUnlock}
          role="dialog"
          aria-modal="true"
          aria-label="Écran de verrouillage"
          tabIndex={-1}
          className={`fixed inset-0 z-[9999] overflow-hidden select-none text-white outline-none isolate ${isMobile ? '' : 'cursor-pointer'}`}
          style={{ background: wallpaper.cssBackground }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/5 to-black/40 pointer-events-none" />
          <div
            className="lock-noise absolute -inset-0.5 pointer-events-none opacity-[0.28] mix-blend-overlay"
            style={{ backgroundImage: NOISE, backgroundSize: '240px 240px' }}
          />

          <div className="relative z-10 flex h-full flex-col items-center px-4 pt-[calc(env(safe-area-inset-top,0px)+48px)] pb-[calc(env(safe-area-inset-bottom,0px)+40px)]">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center [text-shadow:0_2px_24px_rgba(8,30,35,0.35)]"
              aria-hidden="true"
            >
              <div className="text-[15px] font-semibold tracking-[0.01em] text-white/90 min-h-[1.4em]">{date}</div>
              <div className="mt-1 font-semibold tabular-nums leading-[0.9] tracking-[-0.045em] text-white/45 text-[clamp(96px,17vw,200px)] min-h-[0.9em]">
                {time}
              </div>
            </motion.div>

            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              aria-label="Liens rapides"
              className="mt-6 flex flex-wrap justify-center gap-2.5"
            >
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={link.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3.5 py-2 text-[11px] font-semibold tracking-[0.02em] text-white/95 backdrop-blur-md transition hover:bg-white/25 active:scale-[0.92] cursor-pointer"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenResume();
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold tracking-[0.02em] text-neutral-900 shadow-[0_4px_16px_rgba(8,30,35,0.3)] transition hover:bg-white/90 active:scale-[0.92] cursor-pointer"
              >
                <FileText size={14} />
                CV express
              </button>
            </motion.nav>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-auto flex flex-col items-center text-center"
            >
              <div className="h-[88px] w-[88px] overflow-hidden rounded-full border border-white/30 shadow-[0_8px_30px_rgba(8,30,35,0.35)] backdrop-blur-md">
                <img src="/chat.png" alt={PERSONAL_INFO.name} className="h-full w-full object-cover" />
              </div>
              <div className="mt-4 text-[22px] font-semibold tracking-[-0.01em] [text-shadow:0_1px_16px_rgba(8,30,35,0.35)]">
                {PERSONAL_INFO.name}
              </div>
              <div className="mt-1.5 text-[11px] uppercase tracking-[0.22em] text-white/75">
                {PERSONAL_INFO.role}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-[8vh]"
            >
              {isMobile ? (
                <SlideToUnlock onUnlock={unlockScreen} />
              ) : (
                <div className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-white/35 bg-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm">
                  <LockIcon />
                  Cliquer pour déverrouiller
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
