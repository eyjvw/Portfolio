import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDesktop } from '../../context/DesktopContext';
import { Monogram } from '../ui/Logo';

const BOOT_MS = 1800;

let hasBooted = false;

/**
 * Startup screen. It is server-rendered, so it also covers the page while the
 * JS loads, and its progress bar is pure CSS for the same reason. Shown once per
 * tab session (Layout.astro hides it before the first paint afterwards) and
 * after every reboot.
 */
export const BootScreen: React.FC = () => {
  const { finishBoot } = useDesktop();

  useEffect(() => {
    const root = document.documentElement;
    if (!hasBooted && root.hasAttribute('data-booted')) {
      hasBooted = true;
      finishBoot();
      // Removed on unmount only, so the screen can't flash back in meanwhile.
      return () => root.removeAttribute('data-booted');
    }

    try {
      sessionStorage.setItem('booted', '1');
    } catch {}
    // On first load the bar started with the first paint, before hydration.
    const remaining = hasBooted ? BOOT_MS : Math.max(200, BOOT_MS - performance.now());
    hasBooted = true;

    const timer = setTimeout(finishBoot, remaining);
    window.addEventListener('keydown', finishBoot);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', finishBoot);
    };
  }, [finishBoot]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={finishBoot}
      role="status"
      aria-label="Démarrage"
      className="boot-screen fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-12 bg-black text-white select-none"
    >
      <Monogram size={88} strokeWidth={5} className="text-white/95" />
      <div className="h-[5px] w-[200px] overflow-hidden rounded-full bg-white/20">
        <div className="boot-progress h-full rounded-full bg-white" />
      </div>
    </motion.div>
  );
};
