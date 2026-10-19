import React, { useState, useRef, useEffect } from 'react';
import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES } from '../../data/portfolio';
import { useDesktop } from '../../context/DesktopContext';
import { isAppId } from '../../types/os';
import { soundEngine } from '../ui/AudioFx';
import { MatrixRain } from './terminal/MatrixRain';
import { OPENABLE_APPS, complete } from './terminal/completion';
import { GitLogFailure, GitLogLoading, GitLogOutput, fetchCommits, getCachedCommits } from './terminal/gitLog';

interface HistoryEntry {
  id: number;
  // null for the welcome banner, which has no prompt line.
  command: string | null;
  output: React.ReactNode;
}

const RM_RF_ROOT = ['sudo rm -rf /', 'sudo rm -rf /*', 'rm -rf /', 'rm -rf /*', 'sudo rm -rf --no-preserve-root /'];
const RM_RF_PATHS = [
  '/System/Library/CoreServices',
  '/System/Library/Frameworks',
  '/Applications/Safari.app',
  '/Applications/Xcode.app',
  '/usr/bin',
  '/usr/lib',
  '/bin/zsh',
  '/private/var/db',
  '/Library/Fonts',
  '/Users/sbonneau/Documents',
  '/Users/sbonneau/portfolio/node_modules',
  '/Users/sbonneau/portfolio/src',
];
// Paths plus the final kernel line, one every 115 ms: about 1.5 s in all.
const RM_RF_LINES = RM_RF_PATHS.length + 1;
const RM_RF_STEP_MS = 115;
const RM_RF_PANIC_DELAY_MS = 600;

const renderRmRf = (count: number) => (
  <div className="space-y-0.5 text-xs font-mono">
    {RM_RF_PATHS.slice(0, count).map((path) => (
      <p key={path}>
        <span className="text-red-400">rm: suppression de</span> <span className="text-gray-400">{path}...</span>
      </p>
    ))}
    {count >= RM_RF_LINES && (
      <p className="text-red-500 font-bold">rm: /System/Library/Kernels/kernel: Operation not permitted... ah si.</p>
    )}
  </div>
);

export const TerminalApp: React.FC = () => {
  const { openApp, setIsDarkMode, triggerKernelPanic } = useDesktop();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 0,
      command: null,
      output: (
        <div className="space-y-1 text-xs">
          <p className="text-emerald-400 font-bold">
            ⚡ Bienvenue sur le Terminal macOS de {PERSONAL_INFO.name} !
          </p>
          <p className="text-gray-400">
            Tapez <span className="text-amber-300 font-mono">help</span> pour voir la liste des
            commandes disponibles ou <span className="text-amber-300 font-mono">fetch</span> pour
            les informations système.
          </p>
        </div>
      ),
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [isMatrixActive, setIsMatrixActive] = useState<boolean>(false);
  const [isBusy, setIsBusy] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(1);
  const isMountedRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isMatrixActive]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
    };
  }, []);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const pushEntry = (command: string, output: React.ReactNode) => {
    const id = nextIdRef.current++;
    setHistory((prev) => [...prev, { id, command, output }]);
    return id;
  };

  const updateEntry = (id: number, output: React.ReactNode) => {
    setHistory((prev) => prev.map((entry) => (entry.id === id ? { ...entry, output } : entry)));
  };

  const schedule = (fn: () => void, delay: number) => {
    timersRef.current.push(window.setTimeout(fn, delay));
  };

  const runGitLog = (command: string) => {
    const cached = getCachedCommits();
    if (cached) {
      pushEntry(command, <GitLogOutput commits={cached} />);
      return;
    }

    const id = pushEntry(command, <GitLogLoading />);
    fetchCommits()
      .then((commits) => <GitLogOutput commits={commits} />)
      .catch((err: unknown) => <GitLogFailure message={err instanceof Error ? err.message : String(err)} />)
      .then((output) => {
        if (isMountedRef.current) updateEntry(id, output);
      });
  };

  const runRmRf = (command: string) => {
    setIsBusy(true);
    const id = pushEntry(command, renderRmRf(1));
    for (let count = 2; count <= RM_RF_LINES; count++) {
      schedule(() => updateEntry(id, renderRmRf(count)), (count - 1) * RM_RF_STEP_MS);
    }
    schedule(() => {
      setIsBusy(false);
      triggerKernelPanic();
    }, (RM_RF_LINES - 1) * RM_RF_STEP_MS + RM_RF_PANIC_DELAY_MS);
  };

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    soundEngine.playClick();
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);
    setInput('');

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (RM_RF_ROOT.includes(parts.join(' ').toLowerCase())) {
      runRmRf(trimmed);
      return;
    }

    let output: React.ReactNode = null;

    switch (command) {
      case 'help':
        output = (
          <div className="space-y-1 text-xs text-gray-300">
            <p className="text-emerald-400 font-semibold mb-1">Commandes disponibles :</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 font-mono">
              <div>
                <span className="text-amber-300">about</span> : Profil & bio
              </div>
              <div>
                <span className="text-amber-300">skills</span> : Compétences techniques
              </div>
              <div>
                <span className="text-amber-300">projects</span> : Liste des projets
              </div>
              <div>
                <span className="text-amber-300">contact</span> : Coordonnées & réseaux
              </div>
              <div>
                <span className="text-amber-300">open &lt;app&gt;</span> : Ouvre une app (projects, contact, etc.)
              </div>
              <div>
                <span className="text-amber-300">fetch</span> : Specs système (Neofetch)
              </div>
              <div>
                <span className="text-amber-300">matrix</span> : Pluie digitale Matrix
              </div>
              <div>
                <span className="text-amber-300">theme &lt;dark|light&gt;</span> : Change le thème
              </div>
              <div>
                <span className="text-amber-300">git log</span> : Derniers commits du portfolio
              </div>
              <div>
                <span className="text-amber-300">date</span> : Date et heure
              </div>
              <div>
                <span className="text-amber-300">clear</span> : Effacer l'écran
              </div>
            </div>
            <p className="text-gray-400 pt-1">
              💡 <span className="text-amber-300 font-mono">Tab</span> complète les commandes,{' '}
              <span className="text-amber-300 font-mono">↑ ↓</span> parcourent l'historique.
            </p>
          </div>
        );
        break;

      case 'about':
      case 'whoami':
      case 'bio':
        output = (
          <div className="space-y-1.5 text-xs text-gray-300">
            <p className="font-bold text-white text-sm">{PERSONAL_INFO.name}</p>
            <p className="text-cyan-400">{PERSONAL_INFO.role}</p>
            <p className="text-gray-300 max-w-xl">{PERSONAL_INFO.bio}</p>
            <p className="text-gray-400">📍 {PERSONAL_INFO.location}</p>
            <p className="text-emerald-400 font-semibold">✨ {PERSONAL_INFO.availabilityText}</p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-2 text-xs">
            {SKILL_CATEGORIES.map((cat, i) => (
              <div key={i}>
                <p className="text-amber-400 font-semibold">{cat.name} :</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {cat.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-gray-800 text-gray-200 font-mono text-[11px] border border-gray-700"
                    >
                      {s.name}
                      {s.level !== undefined && <span className="text-emerald-400"> ({s.level}%)</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
        break;

      case 'projects':
      case 'ls':
        output = (
          <div className="space-y-1.5 text-xs">
            <p className="text-emerald-400 font-semibold">Projets récents ({PROJECTS.length}) :</p>
            <div className="space-y-1 font-mono">
              {PROJECTS.map((p) => (
                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-gray-300 bg-gray-800/40 p-1.5 rounded">
                  <div>
                    <span className="text-cyan-400 font-bold">{p.title}</span>
                    <span className="text-gray-500 ml-2">[{p.category}]</span>
                  </div>
                  <div className="text-gray-400 text-[11px]">
                    {p.tags.slice(0, 3).join(', ')}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-400 mt-2">
              💡 Utilisez <span className="text-amber-300 font-mono">open projects</span> pour explorer le Finder graphique.
            </p>
          </div>
        );
        break;

      case 'contact':
      case 'email':
        output = (
          <div className="space-y-1 text-xs text-gray-300 font-mono">
            <p>
              📧 <span className="text-white">Email:</span>{' '}
              <a href={PERSONAL_INFO.socials.email} className="text-cyan-400 underline">
                {PERSONAL_INFO.email}
              </a>
            </p>
            <p>
              🐙 <span className="text-white">GitHub:</span>{' '}
              <a href={PERSONAL_INFO.socials.github} target="_blank" rel="noreferrer" className="text-cyan-400 underline">
                {PERSONAL_INFO.socials.github}
              </a>
            </p>
            <p>
              💼 <span className="text-white">LinkedIn:</span>{' '}
              <a href={PERSONAL_INFO.socials.linkedin} target="_blank" rel="noreferrer" className="text-cyan-400 underline">
                {PERSONAL_INFO.socials.linkedin}
              </a>
            </p>
          </div>
        );
        break;

      case 'open':
        if (args.length === 0) {
          output = <p className="text-red-400 text-xs font-mono">Usage: open &lt;app_name&gt; (ex: open projects, open contact, open about)</p>;
        } else {
          const targetApp = args[0].toLowerCase();
          if (isAppId(targetApp) && OPENABLE_APPS.includes(targetApp)) {
            openApp(targetApp);
            output = <p className="text-emerald-400 text-xs font-mono">Ouverture de l'application '{targetApp}'...</p>;
          } else {
            output = <p className="text-red-400 text-xs font-mono">Application inconnue : '{targetApp}'. Essayez : {OPENABLE_APPS.join(', ')}</p>;
          }
        }
        break;

      case 'snake':
        openApp('snake');
        output = <p className="text-emerald-400 text-xs font-mono">🐍 Easter egg trouvé ! Lancement de Snake...</p>;
        break;

      case 'fetch':
      case 'neofetch':
        output = (
          <div className="flex flex-col sm:flex-row gap-4 text-xs font-mono text-gray-300 py-1">
            <pre className="text-cyan-400 leading-tight font-bold shrink-0">
{`                    'c.
                 ,xNMM.
               .OMMMMo
               OMMM0,
     .;loddo:' loolloddol;.
   cKMMMMMMMMMMNWMMMMMMMMMM0:
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.
 XMMMMMMMMMMMMMMMMMMMMMMMX.
;MMMMMMMMMMMMMMMMMMMMMMMM:
:MMMMMMMMMMMMMMMMMMMMMMMM:
.MMMMMMMMMMMMMMMMMMMMMMMX.
 kMMMMMMMMMMMMMMMMMMMMMMWd.
  'XMMMMMMMMMMMMMMMMMMMMk.
    'xXWMMMMMMMMMMMMKx'
        ':ldkOOkdl;'`}
            </pre>
            <div className="space-y-0.5">
              <p className="text-emerald-400 font-bold">{PERSONAL_INFO.shortName}@macbook-pro</p>
              <p className="text-gray-500">----------------------</p>
              <p><span className="text-amber-300 font-semibold">OS:</span> macOS Sonoma (Portfolio Edition)</p>
              <p><span className="text-amber-300 font-semibold">Host:</span> MacBook Pro (M3 Max / Web Edition)</p>
              <p><span className="text-amber-300 font-semibold">Kernel:</span> Astro 7 + React 19 + Bun</p>
              <p><span className="text-amber-300 font-semibold">Uptime:</span> 100% Up & Running</p>
              <p><span className="text-amber-300 font-semibold">Shell:</span> zsh 5.9 (x86_64-apple-darwin23.0)</p>
              <p><span className="text-amber-300 font-semibold">Tech Stack:</span> {PERSONAL_INFO.stats.favoriteStack}</p>
              <p><span className="text-amber-300 font-semibold">Memory:</span> 64 GB Unified RAM</p>
              <div className="flex gap-1.5 pt-2">
                <span className="w-3 h-3 bg-black rounded-sm inline-block" />
                <span className="w-3 h-3 bg-red-500 rounded-sm inline-block" />
                <span className="w-3 h-3 bg-green-500 rounded-sm inline-block" />
                <span className="w-3 h-3 bg-yellow-500 rounded-sm inline-block" />
                <span className="w-3 h-3 bg-blue-500 rounded-sm inline-block" />
                <span className="w-3 h-3 bg-magenta-500 rounded-sm inline-block" />
                <span className="w-3 h-3 bg-cyan-500 rounded-sm inline-block" />
                <span className="w-3 h-3 bg-white rounded-sm inline-block" />
              </div>
            </div>
          </div>
        );
        break;

      case 'matrix':
        setIsMatrixActive(true);
        output = <p className="text-emerald-400 text-xs font-mono">Démarrage du protocole Matrix... (Cliquez ou appuyez sur une touche pour quitter)</p>;
        break;

      case 'theme':
        if (args[0] === 'dark') {
          setIsDarkMode(true);
          output = <p className="text-emerald-400 text-xs font-mono">Thème sombre activé.</p>;
        } else if (args[0] === 'light') {
          setIsDarkMode(false);
          output = <p className="text-emerald-400 text-xs font-mono">Thème clair activé.</p>;
        } else {
          output = <p className="text-yellow-400 text-xs font-mono">Usage: theme dark | theme light</p>;
        }
        break;

      case 'date':
        output = <p className="text-gray-300 text-xs font-mono">{new Date().toString()}</p>;
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'git':
        if (args[0] === 'log' && (args.length === 1 || (args.length === 2 && args[1] === '--oneline'))) {
          runGitLog(trimmed);
          return;
        }
        output = <p className="text-yellow-400 text-xs font-mono">usage: git log</p>;
        break;

      case 'sudo':
        output = (
          <p className="text-red-400 text-xs font-mono">
            ⚠️ Permission denied: l'utilisateur visiteur n'a pas les droits root sur ce portfolio ! 😄
          </p>
        );
        break;

      default:
        output = (
          <p className="text-red-400 text-xs font-mono">
            zsh: commande non trouvée : <span className="text-white">{trimmed}</span>. Tapez{' '}
            <span className="text-amber-300 underline">help</span> pour voir les commandes disponibles.
          </p>
        );
        break;
    }

    pushEntry(trimmed, output);
  };

  const handleTab = () => {
    const completion = complete(input);
    if (!completion) return;

    if (completion.kind === 'replace') {
      setInput(completion.value);
      return;
    }

    // Nothing left to complete: list the candidates under the typed line, like zsh.
    pushEntry(
      input,
      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs font-mono text-gray-300">
        {completion.candidates.map((candidate) => (
          <span key={candidate}>{candidate}</span>
        ))}
      </div>,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isMatrixActive) {
      // Swallow the key so it doesn't end up typed in the prompt.
      e.preventDefault();
      setIsMatrixActive(false);
      return;
    }

    if (isBusy) {
      if (e.key === 'Tab') e.preventDefault();
      return;
    }

    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTab();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIdx === -1 ? commandHistory.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInput(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < commandHistory.length) {
          setHistoryIdx(nextIdx);
          setInput(commandHistory[nextIdx]);
        } else {
          setHistoryIdx(-1);
          setInput('');
        }
      }
    }
  };

  return (
    // The rain sits outside the scrolling area so it always covers the visible part.
    <div onClick={handleContainerClick} className="flex-1 min-h-0 relative flex flex-col">
      {isMatrixActive && <MatrixRain onExit={() => setIsMatrixActive(false)} />}

      <div className="flex-1 bg-[#141418] text-gray-200 font-mono p-4 overflow-y-auto select-text cursor-text">
        <div className="space-y-3">
          {history.map((entry) => (
            <div key={entry.id} className="space-y-1">
              {entry.command !== null && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-400 font-bold">sbonneau@macbook-pro</span>
                  <span className="text-cyan-400 font-bold">~ %</span>
                  <span className="text-white font-medium">{entry.command}</span>
                </div>
              )}
              <div className="pl-0">{entry.output}</div>
            </div>
          ))}

          <div className="flex items-center gap-2 text-xs pt-1">
            <span className="text-emerald-400 font-bold">sbonneau@macbook-pro</span>
            <span className="text-cyan-400 font-bold">~ %</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              readOnly={isBusy}
              className={`flex-1 bg-transparent text-white focus:outline-none font-mono ${isBusy ? 'caret-transparent' : 'caret-emerald-400'}`}
              autoFocus
              spellCheck={false}
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};
