import type { AppId } from '../../../types/os';

export const OPENABLE_APPS: AppId[] = ['projects', 'contact', 'about', 'settings', 'finder', 'assistant'];

// The easter eggs (snake, rm) stay out on purpose: they have to be found.
const COMMANDS = [
  'help',
  'about',
  'whoami',
  'bio',
  'skills',
  'projects',
  'ls',
  'contact',
  'email',
  'open',
  'fetch',
  'neofetch',
  'matrix',
  'theme',
  'date',
  'clear',
  'sudo',
  'git',
];

const ARGUMENTS: Record<string, readonly string[]> = {
  open: OPENABLE_APPS,
  theme: ['dark', 'light'],
  git: ['log'],
};

const TAKES_ARGS = new Set(['open', 'theme', 'git', 'sudo']);

export type Completion = { kind: 'replace'; value: string } | { kind: 'list'; candidates: string[] };

const commonPrefix = (words: string[]) =>
  words.reduce((prefix, word) => {
    let i = 0;
    while (i < prefix.length && prefix[i] === word[i]) i++;
    return prefix.slice(0, i);
  });

// Completes the command name, or its first argument once a space has been typed.
export const complete = (line: string): Completion | null => {
  const match = /^\s*(\S*)(?:\s+(\S*))?$/.exec(line);
  if (!match) return null;

  const [, command, arg] = match;
  const completingArg = arg !== undefined;
  const word = (completingArg ? arg : command).toLowerCase();
  const options = completingArg ? ARGUMENTS[command.toLowerCase()] : COMMANDS;
  if (!options) return null;

  const candidates = options.filter((option) => option.startsWith(word));
  if (candidates.length === 0) return null;

  const build = (completed: string) => (completingArg ? `${command.toLowerCase()} ${completed}` : completed);

  if (candidates.length === 1) {
    const [only] = candidates;
    return { kind: 'replace', value: !completingArg && TAKES_ARGS.has(only) ? `${only} ` : build(only) };
  }

  const prefix = commonPrefix(candidates);
  if (prefix.length > word.length) return { kind: 'replace', value: build(prefix) };
  return { kind: 'list', candidates };
};
