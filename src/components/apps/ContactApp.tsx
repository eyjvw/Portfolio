import React, { useState } from 'react';
import { PERSONAL_INFO } from '../../data/portfolio';
import {
  Mail,
  Send,
  Copy,
  Check,
  Github,
  Globe,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from '../ui/Icons';
import { soundEngine } from '../ui/AudioFx';

export const ContactApp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isCopied, setIsCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    soundEngine.playClick();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // No backend yet: hand the message to the visitor's mail client, pre-filled.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const subject = formData.subject.trim() || `Prise de contact de ${formData.name}`;
    const body = `${formData.message}\n\n--\n${formData.name}\n${formData.email}`;
    window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    soundEngine.playSuccess();
    setIsSent(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSent(false);
  };

  return (
    <div className="flex h-full bg-slate-50/80 dark:bg-[#1C1C1E]/80 select-text overflow-hidden">
      <div className="w-64 border-r border-black/5 dark:border-white/10 bg-slate-100/50 dark:bg-[#1E1E22]/50 p-4 flex flex-col justify-between shrink-0 hidden sm:flex">
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
              Disponibilité
            </span>
            <div className="mt-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
              <span className="relative flex h-2.5 w-2.5 mt-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Open to Work
                </p>
                <p className="text-[11px] text-emerald-600/90 dark:text-emerald-400/80 mt-0.5 leading-snug">
                  {PERSONAL_INFO.availabilityText}
                </p>
              </div>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
              Canaux Directs
            </span>
            <div className="mt-2 space-y-1">
              <a
                href={PERSONAL_INFO.socials.github}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-neutral-300 hover:bg-slate-200/60 dark:hover:bg-neutral-800/60 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Github size={15} />
                  <span>GitHub</span>
                </div>
                <ExternalLink size={12} className="text-slate-400" />
              </a>
              <a
                href={PERSONAL_INFO.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-neutral-300 hover:bg-slate-200/60 dark:hover:bg-neutral-800/60 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Globe size={15} className="text-blue-500" />
                  <span>LinkedIn</span>
                </div>
                <ExternalLink size={12} className="text-slate-400" />
              </a>
            </div>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/70 dark:bg-neutral-800/70 border border-black/5 dark:border-white/10 shadow-sm">
          <p className="text-[10px] font-semibold text-slate-400 dark:text-neutral-400 uppercase">
            Adresse E-mail
          </p>
          <p className="text-xs font-mono text-slate-800 dark:text-neutral-200 truncate mt-0.5">
            {PERSONAL_INFO.email}
          </p>
          <button
            onClick={handleCopyEmail}
            className="mt-2 w-full py-1.5 px-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-slate-700 dark:text-neutral-200 flex items-center justify-center gap-1.5 transition-all"
          >
            {isCopied ? (
              <>
                <Check size={13} className="text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copié !</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copier l'adresse</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        {isSent ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-neutral-100">
              Votre messagerie s'est ouverte
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2 max-w-sm">
              Le message est prêt : il ne reste qu'à cliquer sur Envoyer. Si rien ne s'est ouvert,
              écrivez-moi directement à {PERSONAL_INFO.email}.
            </p>
            <button
              onClick={resetForm}
              className="mt-6 px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all"
            >
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-neutral-100 flex items-center gap-2">
                  <Mail size={18} className="text-emerald-500" />
                  Nouveau Message
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                  Une opportunité, un projet ou juste pour échanger ? Écrivez-moi !
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 mb-1">
                    Votre Nom & Prénom
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white/70 dark:bg-neutral-800/70 border border-black/10 dark:border-white/10 focus:border-emerald-500 focus:outline-none transition-all text-slate-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 mb-1">
                    Votre E-mail
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jean.dupont@entreprise.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white/70 dark:bg-neutral-800/70 border border-black/10 dark:border-white/10 focus:border-emerald-500 focus:outline-none transition-all text-slate-800 dark:text-neutral-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  required
                  placeholder="Proposition d’alternance ou de stage / Projet / Prise de contact..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white/70 dark:bg-neutral-800/70 border border-black/10 dark:border-white/10 focus:border-emerald-500 focus:outline-none transition-all text-slate-800 dark:text-neutral-100"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Bonjour Samuel, j'ai vu votre portfolio et j'aimerais discuter d'un projet..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full flex-1 px-3 py-2 text-xs rounded-lg bg-white/70 dark:bg-neutral-800/70 border border-black/10 dark:border-white/10 focus:border-emerald-500 focus:outline-none transition-all text-slate-800 dark:text-neutral-100 resize-none"
                ></textarea>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                🔒 Vos coordonnées restent strictement confidentielles.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
              >
                <Send size={14} /> Envoyer le message
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
