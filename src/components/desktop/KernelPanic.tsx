import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDesktop } from '../../context/DesktopContext';
import { Power } from '../ui/Icons';

const MESSAGES = [
  {
    lang: 'fr',
    text: 'Vous devez redémarrer l’ordinateur. Maintenez le bouton de démarrage enfoncé pendant plusieurs secondes ou appuyez sur le bouton de réinitialisation.',
  },
  {
    lang: 'en',
    text: 'You need to restart your computer. Hold down the Power button for several seconds or press the Restart button.',
  },
  {
    lang: 'de',
    text: 'Sie müssen Ihren Computer neu starten. Halten Sie dazu die Einschalttaste einige Sekunden gedrückt oder drücken Sie die Neustart-Taste.',
  },
  {
    lang: 'ja',
    text: 'コンピュータを再起動する必要があります。パワーボタンを数秒間押し続けるか、リセットボタンを押してください。',
  },
];

/** The classic Mac OS X kernel panic: a grey curtain falls, then a reboot. */
export const KernelPanic: React.FC = () => {
  const { reboot } = useDesktop();

  useEffect(() => {
    const timer = setTimeout(reboot, 8000);
    // Armed late so the keystroke that ran the command doesn't dismiss it.
    const armTimer = setTimeout(() => {
      window.addEventListener('keydown', reboot);
      window.addEventListener('click', reboot);
    }, 1500);
    return () => {
      clearTimeout(timer);
      clearTimeout(armTimer);
      window.removeEventListener('keydown', reboot);
      window.removeEventListener('click', reboot);
    };
  }, [reboot]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[10001] select-none cursor-default"
      role="alertdialog"
      aria-label="Erreur système"
    >
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: 'linear' }}
        className="absolute inset-0 bg-[#1a1a1a]/80"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center p-4"
      >
        <div className="max-w-[440px] rounded-xl bg-black/80 px-8 py-7 text-center text-white/90 shadow-2xl ring-1 ring-white/10">
          <Power size={64} strokeWidth={1.25} className="mx-auto mb-6 text-white/85" />
          <div className="space-y-3 text-[12.5px] leading-snug">
            {MESSAGES.map((m) => (
              <p key={m.lang} lang={m.lang}>
                {m.text}
              </p>
            ))}
          </div>
          <p className="mt-6 text-[11px] text-white/40">Cliquez ou appuyez sur une touche pour redémarrer</p>
        </div>
      </motion.div>
    </motion.div>
  );
};
