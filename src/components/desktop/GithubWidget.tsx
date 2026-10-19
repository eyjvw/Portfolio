import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github } from '../ui/Icons';
import { PERSONAL_INFO } from '../../data/portfolio';

const PROFILE_URL = PERSONAL_INFO.socials.github;
const USERNAME = PROFILE_URL.split('/').filter(Boolean).pop() ?? '';
const API_URL = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;

/** Columns shown, the last one being the current week. */
const WEEKS = 17;

const CELL = 'h-2.5 w-2.5 rounded-[3px]';
const LEVEL_CLASSES = [
  'bg-black/10 dark:bg-white/10',
  'bg-green-300 dark:bg-green-900',
  'bg-green-500 dark:bg-green-700',
  'bg-green-600 dark:bg-green-500',
  'bg-green-800 dark:bg-green-400',
];

interface ApiDay {
  date: string;
  count: number;
  level: number;
}

interface ApiResponse {
  total?: { lastYear?: number };
  contributions?: ApiDay[];
}

/** `null` is an empty slot (before the data starts or after today). */
type Week = ({ level: number; title?: string } | null)[];

interface GithubData {
  total: number;
  weeks: Week[];
}

interface GithubWidgetProps {
  /** Positioning and sizing; the glass card styling stays built in. */
  className?: string;
  delay?: number;
}

const SKELETON: Week[] = Array.from({ length: WEEKS }, () => Array.from({ length: 7 }, () => ({ level: 0 })));

const plural = (count: number) => (count > 1 ? 'contributions' : 'contribution');

const toUtcDate = (date: string) => new Date(`${date}T00:00:00Z`);

/** Lays the (contiguous, date-sorted) days out in Sunday-first week columns. */
function buildWeeks(days: ApiDay[]): Week[] {
  const last = days.length - 1;
  const start = last - toUtcDate(days[last].date).getUTCDay() - (WEEKS - 1) * 7;

  return Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const day = days[start + w * 7 + d];
      if (!day) return null;
      const label = toUtcDate(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', timeZone: 'UTC' });
      const amount = day.count === 0 ? 'Aucune' : day.count.toLocaleString('fr-FR');
      return { level: day.level, title: `${amount} ${plural(day.count)} le ${label}` };
    }),
  );
}

export const GithubWidget: React.FC<GithubWidgetProps> = ({ className = '', delay = 0.4 }) => {
  const [data, setData] = useState<GithubData | 'loading' | 'error'>('loading');

  useEffect(() => {
    const controller = new AbortController();

    const load = () => {
      fetch(API_URL, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json() as Promise<ApiResponse>;
        })
        .then(({ total, contributions }) => {
          if (typeof total?.lastYear !== 'number' || !contributions?.length) throw new Error('Réponse inattendue');
          setData({ total: total.lastYear, weeks: buildWeeks(contributions) });
        })
        .catch(() => {
          if (!controller.signal.aborted) setData('error');
        });
    };

    const hasIdle = 'requestIdleCallback' in window;
    const handle = hasIdle ? window.requestIdleCallback(load) : window.setTimeout(load, 1);

    return () => {
      controller.abort();
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  if (data === 'error') return null;

  const ready = typeof data === 'object';
  const weeks = ready ? data.weeks : SKELETON;

  return (
    <motion.aside
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`aero-glass rounded-2xl p-4 ${className}`}
      aria-label="Activité GitHub"
      aria-busy={!ready}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-black/10 text-slate-800 dark:bg-white/15 dark:text-white/90">
          <Github size={13} />
        </span>
        <h2 className="text-[13px] font-semibold tracking-tight text-slate-900 dark:text-white/95">Activité GitHub</h2>
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noreferrer"
          className="ml-auto truncate text-[10.5px] font-medium tracking-tight text-slate-600 transition-colors duration-200 hover:text-slate-900 dark:text-white/50 dark:hover:text-white/90"
        >
          @{USERNAME}
        </a>
      </div>

      <div className={`flex justify-center gap-[3px] ${ready ? '' : 'animate-pulse'}`}>
        {weeks.map((week, w) => (
          <div key={w} className="flex flex-col gap-[3px]">
            {week.map((day, d) => (
              <div
                key={d}
                className={day ? `${CELL} ${LEVEL_CLASSES[day.level] ?? LEVEL_CLASSES[0]}` : CELL}
                title={day?.title}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-end gap-1 text-[9px] tracking-tight text-slate-500 dark:text-white/40" aria-hidden="true">
        <span className="mr-0.5">Moins</span>
        {LEVEL_CLASSES.map((level) => (
          <span key={level} className={`h-2 w-2 rounded-[2px] ${level}`} />
        ))}
        <span className="ml-0.5">Plus</span>
      </div>

      <p className="mt-2 text-[10px] leading-relaxed tracking-tight text-slate-600 dark:text-white/45">
        {ready ? (
          <>
            <span className="font-semibold text-slate-800 dark:text-white/80">{data.total.toLocaleString('fr-FR')}</span>{' '}
            {plural(data.total)} sur l'année
          </>
        ) : (
          <span className="inline-block h-2 w-32 animate-pulse rounded-full bg-black/10 align-middle dark:bg-white/10" />
        )}
      </p>
    </motion.aside>
  );
};
