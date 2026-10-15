import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDesktop } from '../../context/DesktopContext';
import { APPS, PROJECTS, PERSONAL_INFO } from '../../data/portfolio';
import { Search, ExternalLink, ArrowRight, Sparkles } from '../ui/Icons';
import { AppIcon } from '../ui/Icons';
import { soundEngine } from '../ui/AudioFx';
import type { AppId } from '../../types/os';

type SearchItem =
  | { type: 'app' | 'project'; id: AppId; title: string; desc: string }
  | { type: 'action'; id: string; title: string; desc: string; action: () => void }
  | { type: 'social'; id: string; title: string; desc: string; url: string };

export const Spotlight: React.FC = () => {
  const {
    isSpotlightOpen,
    setIsSpotlightOpen,
    openApp,
    setIsDarkMode,
    soundEnabled,
    setSoundEnabled,
  } = useDesktop();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSpotlightOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSpotlightOpen]);

  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      const suggestions: SearchItem[] = [
        { type: 'app', id: 'projects', title: 'Projets & Réalisations', desc: 'Application' },
        { type: 'app', id: 'contact', title: 'Me Contacter', desc: 'Application' },
        { type: 'app', id: 'about', title: 'À propos / CV de Samuel', desc: 'Application' },
        { type: 'app', id: 'terminal', title: 'Terminal macOS', desc: 'Application' },
      ];
      return suggestions;
    }

    const items: SearchItem[] = [];

    APPS.forEach((app) => {
      if (app.isHidden) return;
      if (app.title.toLowerCase().includes(q) || app.id.toLowerCase().includes(q)) {
        items.push({
          type: 'app',
          id: app.id,
          title: app.title,
          desc: 'Application Système',
        });
      }
    });

    PROJECTS.forEach((proj) => {
      if (
        proj.title.toLowerCase().includes(q) ||
        proj.description.toLowerCase().includes(q) ||
        proj.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        items.push({
          type: 'project',
          id: 'projects',
          title: proj.title,
          desc: `Projet: ${proj.tags.slice(0, 3).join(', ')}`,
        });
      }
    });

    if ('dark mode'.includes(q) || 'theme'.includes(q) || 'sombre'.includes(q)) {
      items.push({
        type: 'action',
        id: 'theme-dark',
        title: 'Activer le mode sombre',
        desc: 'Action Système',
        action: () => setIsDarkMode(true),
      });
    }
    if ('light mode'.includes(q) || 'clair'.includes(q)) {
      items.push({
        type: 'action',
        id: 'theme-light',
        title: 'Activer le mode clair',
        desc: 'Action Système',
        action: () => setIsDarkMode(false),
      });
    }
    if ('sound'.includes(q) || 'son'.includes(q) || 'audio'.includes(q)) {
      items.push({
        type: 'action',
        id: 'sound-toggle',
        title: soundEnabled ? 'Couper les sons' : 'Activer les sons',
        desc: 'Action Système',
        action: () => setSoundEnabled((prev) => !prev),
      });
    }

    if ('github'.includes(q)) {
      items.push({
        type: 'social',
        id: 'github',
        title: 'GitHub de Samuel Bonneau',
        desc: 'Lien externe',
        url: PERSONAL_INFO.socials.github,
      });
    }
    if ('linkedin'.includes(q)) {
      items.push({
        type: 'social',
        id: 'linkedin',
        title: 'LinkedIn de Samuel Bonneau',
        desc: 'Lien externe',
        url: PERSONAL_INFO.socials.linkedin,
      });
    }

    return items;
  }, [query, setIsDarkMode, setSoundEnabled, soundEnabled]);

  const handleSelect = (item: SearchItem) => {
    soundEngine.playClick();
    if (item.type === 'app' || item.type === 'project') {
      openApp(item.id);
    } else if (item.type === 'action' && item.action) {
      item.action();
    } else if (item.type === 'social' && item.url) {
      window.open(item.url, '_blank');
    }
    setIsSpotlightOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleSelect(searchResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsSpotlightOpen(false);
    }
  };

  if (!isSpotlightOpen) return null;

  return (
    <div
      onClick={() => setIsSpotlightOpen(false)}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-4 animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl aero-glass-strong rounded-2xl overflow-hidden"
      >
        <div className="flex items-center px-4 py-3.5 border-b border-black/5 dark:border-white/10 gap-3">
          <Search size={20} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher dans le portfolio (apps, projets, CV, commandes)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-slate-800 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-black/5 dark:bg-white/10 rounded text-slate-400">
            ESC
          </kbd>
        </div>
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {searchResults.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Aucun résultat trouvé pour "{query}"
            </div>
          ) : (
            searchResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-200/50 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.type === 'app' ? (
                      <AppIcon appId={item.id} size={28} />
                    ) : (
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-white/20' : 'bg-slate-200 dark:bg-neutral-800'
                        }`}
                      >
                        <Sparkles size={14} className={isSelected ? 'text-white' : 'text-blue-500'} />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold">{item.title}</p>
                      <p
                        className={`text-[10px] ${
                          isSelected ? 'text-white/80' : 'text-slate-400 dark:text-neutral-400'
                        }`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={14} className={`opacity-60 ${isSelected ? 'translate-x-0.5' : ''}`} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
