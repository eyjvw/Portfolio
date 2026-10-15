import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from '../ui/Icons';
import { soundEngine } from '../ui/AudioFx';

const GRID = 17;
const TICK_START = 165;
const TICK_MIN = 70;
const STORAGE_KEY = 'sb-snake-highscore';

type Point = { x: number; y: number };
type Direction = 'up' | 'down' | 'left' | 'right';
type Status = 'idle' | 'playing' | 'over';

const VECTORS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

const INITIAL_SNAKE: Point[] = [
  { x: 8, y: 10 },
  { x: 8, y: 11 },
  { x: 8, y: 12 },
];

const randomFood = (snake: Point[]): Point => {
  const free: Point[] = [];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      if (!snake.some((s) => s.x === x && s.y === y)) free.push({ x, y });
    }
  }
  return free[Math.floor(Math.random() * free.length)] ?? { x: 0, y: 0 };
};

export const SnakeApp: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 8, y: 4 });
  const [status, setStatus] = useState<Status>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const direction = useRef<Direction>('up');
  const queued = useRef<Direction[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<Point | null>(null);

  useEffect(() => {
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(stored) && stored > 0) setHighScore(stored);
  }, []);

  const start = useCallback(() => {
    direction.current = 'up';
    queued.current = [];
    setSnake(INITIAL_SNAKE);
    setFood(randomFood(INITIAL_SNAKE));
    setScore(0);
    setStatus('playing');
    soundEngine.playPop();
    boardRef.current?.focus();
  }, []);

  const turn = useCallback((next: Direction) => {
    const last = queued.current[queued.current.length - 1] ?? direction.current;
    if (next === last || next === OPPOSITES[last]) return;
    if (queued.current.length < 2) queued.current.push(next);
  }, []);

  useEffect(() => {
    if (status !== 'playing') return;

    const speed = Math.max(TICK_MIN, TICK_START - score * 4);
    const timer = setInterval(() => {
      setSnake((prev) => {
        const next = queued.current.shift();
        if (next) direction.current = next;

        const vector = VECTORS[direction.current];
        const head = { x: prev[0].x + vector.x, y: prev[0].y + vector.y };

        const hitWall = head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID;
        const hitSelf = prev.some((s, i) => i !== prev.length - 1 && s.x === head.x && s.y === head.y);

        if (hitWall || hitSelf) {
          setStatus('over');
          soundEngine.playMinimize();
          setScore((current) => {
            setHighScore((best) => {
              if (current <= best) return best;
              localStorage.setItem(STORAGE_KEY, String(current));
              return current;
            });
            return current;
          });
          return prev;
        }

        const ate = head.x === food.x && head.y === food.y;
        const body = [head, ...prev];

        if (ate) {
          setScore((s) => s + 1);
          setFood(randomFood(body));
          soundEngine.playClick();
        } else {
          body.pop();
        }

        return body;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [status, score, food]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const moves: Record<string, Direction> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      z: 'up',
      s: 'down',
      q: 'left',
      d: 'right',
      w: 'up',
      a: 'left',
    };
    const move = moves[e.key] ?? moves[e.key.toLowerCase()];

    if (move) {
      e.preventDefault();
      if (status === 'playing') turn(move);
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (status !== 'playing') start();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || status !== 'playing') return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 'right' : 'left');
    else turn(dy > 0 ? 'down' : 'up');
  };

  const cells = Array.from({ length: GRID * GRID }, (_, i) => {
    const x = i % GRID;
    const y = Math.floor(i / GRID);
    const headIndex = snake.findIndex((s) => s.x === x && s.y === y);
    return { x, y, isHead: headIndex === 0, isBody: headIndex > 0, isFood: food.x === x && food.y === y };
  });

  return (
    <div className="flex flex-col h-full bg-slate-50/70 dark:bg-[#1C1C1E]/70 select-none">
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-black/5 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-4 text-xs">
          <span className="font-semibold text-slate-700 dark:text-neutral-200">
            Score <span className="font-mono text-emerald-600 dark:text-emerald-400">{score}</span>
          </span>
          <span className="text-slate-400 dark:text-neutral-500">
            Record <span className="font-mono">{highScore}</span>
          </span>
        </div>
        <button
          onClick={start}
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-200/80 hover:bg-slate-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-200 flex items-center gap-1.5 transition-colors"
        >
          {status === 'idle' ? <Play size={12} /> : <RotateCcw size={12} />}
          {status === 'idle' ? 'Jouer' : 'Rejouer'}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 min-h-0">
        <div
          ref={boardRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="application"
          aria-label="Jeu Snake — flèches ou ZQSD pour diriger"
          className="relative grid aspect-square w-full max-w-[380px] max-h-full gap-px rounded-xl overflow-hidden bg-slate-200/70 dark:bg-neutral-800/60 p-1.5 outline-none ring-offset-2 ring-offset-transparent focus:ring-2 focus:ring-emerald-500/60"
          style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}
        >
          {cells.map((cell) => (
            <div
              key={`${cell.x}-${cell.y}`}
              className={`rounded-[2px] transition-colors duration-75 ${
                cell.isHead
                  ? 'bg-emerald-500 dark:bg-emerald-400'
                  : cell.isBody
                    ? 'bg-emerald-600/70 dark:bg-emerald-500/70'
                    : cell.isFood
                      ? 'bg-rose-500 dark:bg-rose-400 animate-pulse'
                      : 'bg-white/70 dark:bg-neutral-900/50'
              }`}
            />
          ))}

          {status !== 'playing' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 dark:bg-[#1C1C1E]/85 backdrop-blur-sm">
              <p className="text-sm font-semibold text-slate-800 dark:text-neutral-100">
                {status === 'idle' ? 'Snake' : `Perdu — ${score} point${score > 1 ? 's' : ''}`}
              </p>
              {status === 'over' && score > 0 && score >= highScore && (
                <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  Nouveau record
                </p>
              )}
              <button
                onClick={start}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
              >
                {status === 'idle' ? 'Commencer' : 'Rejouer'}
              </button>
              <p className="text-[10px] text-slate-400 dark:text-neutral-500 text-center px-6">
                Flèches ou ZQSD sur ordinateur, balayage au doigt sur mobile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
