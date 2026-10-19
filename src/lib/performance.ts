// Lite mode: on weak machines the translucent blur is swapped for solid glass
// (see `.lite` in global.css). The inline script in Layout.astro applies the same
// rules before the first paint; keep both in sync.

export type PerfMode = 'auto' | 'lite' | 'full';

const MODE_KEY = 'perf-mode';
const DETECTED_KEY = 'perf-detected-lite';

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
};

const isWeakHardware = () => {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.hardwareConcurrency || 8) <= 2 || (nav.deviceMemory || 8) <= 4;
};

const setLite = (on: boolean) => document.documentElement.classList.toggle('lite', on);

export const isLite = () => document.documentElement.classList.contains('lite');

export const getPerfMode = (): PerfMode => {
  const mode = read(MODE_KEY);
  return mode === 'lite' || mode === 'full' ? mode : 'auto';
};

export const setPerfMode = (mode: PerfMode) => {
  write(MODE_KEY, mode === 'auto' ? null : mode);
  // Back to auto starts the detection over.
  if (mode === 'auto') write(DETECTED_KEY, null);
  setLite(mode === 'lite' || (mode === 'auto' && isWeakHardware()));
};

/**
 * In auto mode, watches the frame rate for a while and switches to lite mode
 * (remembered for later visits) when the machine keeps dropping frames.
 * Returns a function that stops watching.
 */
export const watchFrameRate = (durationMs = 60_000): (() => void) => {
  if (getPerfMode() !== 'auto' || isLite()) return () => {};

  const stopAt = performance.now() + durationMs;
  let frame = 0;
  let last = 0;
  let frames = 0;
  let elapsed = 0;
  let slowSeconds = 0;

  const tick = (now: number) => {
    const delta = last ? now - last : 0;
    last = now;
    // Long gaps mean a hidden tab or an idle page, not a slow GPU.
    if (delta > 0 && delta < 250) {
      frames++;
      elapsed += delta;
    }
    if (elapsed >= 1000) {
      if ((frames * 1000) / elapsed < 35 && ++slowSeconds >= 2) {
        setLite(true);
        write(DETECTED_KEY, '1');
        return;
      }
      frames = 0;
      elapsed = 0;
    }
    if (now < stopAt) frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
};
