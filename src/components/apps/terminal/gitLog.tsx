import React from 'react';

const REPO = 'eyjvw/Portfolio';
const API_URL = `https://api.github.com/repos/${REPO}/commits?per_page=8`;
const COMMITS_URL = `https://github.com/${REPO}/commits`;

export interface GitCommit {
  sha: string;
  url: string;
  subject: string;
  author: string;
  date: string;
}

interface ApiCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { name: string; date: string } | null;
  };
}

// Module-level so a second `git log` is instant and the 60 req/h anonymous quota is spared.
let cachedCommits: GitCommit[] | null = null;
let pendingCommits: Promise<GitCommit[]> | null = null;

const loadCommits = async (): Promise<GitCommit[]> => {
  let res: Response;
  try {
    res = await fetch(API_URL);
  } catch {
    throw new Error('impossible de joindre GitHub (hors ligne ?)');
  }
  if (res.status === 403 || res.status === 429) {
    throw new Error("limite de requêtes de l'API GitHub atteinte, réessayez dans un moment");
  }
  if (!res.ok) throw new Error(`l'API GitHub a répondu ${res.status}`);

  const data: unknown = await res.json().catch(() => null);
  if (!Array.isArray(data)) throw new Error("réponse inattendue de l'API GitHub");

  return (data as ApiCommit[]).map((c) => ({
    sha: c.sha,
    url: c.html_url,
    subject: c.commit.message.split('\n')[0],
    author: c.commit.author?.name ?? 'inconnu',
    date: c.commit.author?.date ?? '',
  }));
};

export const getCachedCommits = () => cachedCommits;

export const fetchCommits = (): Promise<GitCommit[]> => {
  if (cachedCommits) return Promise.resolve(cachedCommits);
  if (!pendingCommits) {
    pendingCommits = loadCommits()
      .then((commits) => (cachedCommits = commits))
      .finally(() => {
        pendingCommits = null;
      });
  }
  return pendingCommits;
};

const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 86400],
  ['month', 30 * 86400],
  ['week', 7 * 86400],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
];

const formatRelative = (iso: string) => {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  if (Number.isNaN(seconds)) return '';
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return rtf.format(Math.round(seconds), 'second');
};

export const GitLogLoading: React.FC = () => (
  <p className="text-gray-400 text-xs font-mono animate-pulse">
    Récupération des commits depuis github.com/{REPO}...
  </p>
);

export const GitLogOutput: React.FC<{ commits: GitCommit[] }> = ({ commits }) => {
  if (commits.length === 0) {
    return <p className="text-gray-400 text-xs font-mono">Aucun commit pour le moment.</p>;
  }

  return (
    <div className="space-y-0.5 text-xs font-mono text-gray-300">
      {commits.map((c) => (
        <p key={c.sha}>
          <a href={c.url} target="_blank" rel="noreferrer" className="text-yellow-400 hover:underline">
            {c.sha.slice(0, 7)}
          </a>{' '}
          {c.subject}{' '}
          {c.date && <span className="text-gray-500">({formatRelative(c.date)}) </span>}
          <span className="text-cyan-400">&lt;{c.author}&gt;</span>
        </p>
      ))}
    </div>
  );
};

export const GitLogFailure: React.FC<{ message: string }> = ({ message }) => (
  <p className="text-red-400 text-xs font-mono">
    fatal: {message}. Historique complet sur{' '}
    <a href={COMMITS_URL} target="_blank" rel="noreferrer" className="text-cyan-400 underline">
      github.com/{REPO}/commits
    </a>
  </p>
);
