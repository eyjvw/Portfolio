import React, { useEffect, useRef } from 'react';

// Half-width katakana, digits and a few symbols, drawn mirrored like in the film.
const GLYPHS = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789Z:."=*+-<>¦';
const CELL = 16;
// The rain advances at a fixed 30 ticks/s whatever the screen refresh rate:
// it keeps the film's slightly choppy look and halves the work on 60 Hz+ screens.
const STEP_MS = 1000 / 30;
// Below ~0.08 the fade never reaches pure black and leaves grey ghosts.
const FADE = 'rgba(0, 0, 0, 0.08)';
const HEAD = '#e4ffe9';

interface Drop {
  y: number;
  row: number;
  speed: number;
  color: string;
}

const randomGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

const createDrop = (y: number): Drop => {
  const speed = 0.4 + Math.random() * 0.6;
  // Slow columns are dimmer, which gives the rain some depth for free.
  return { y, row: Math.floor(y), speed, color: `hsl(135, 100%, ${Math.round(28 + speed * 22)}%)` };
};

interface MatrixRainProps {
  onExit: () => void;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let drops: Drop[] = [];
    let frame = 0;
    let last = 0;

    const drawGlyph = (x: number, row: number, color: string) => {
      ctx.fillStyle = color;
      ctx.setTransform(-dpr, 0, 0, dpr, (x + CELL) * dpr, 0);
      ctx.fillText(randomGlyph(), 0, row * CELL);
    };

    const tick = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = FADE;
      ctx.fillRect(0, 0, width, height);

      drops.forEach((drop, i) => {
        drop.y += drop.speed;
        const row = Math.floor(drop.y);
        if (row === drop.row) return;

        const x = i * CELL;
        // The previous head turns into a regular trail glyph.
        if (drop.row >= 0) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.fillStyle = '#000';
          ctx.fillRect(x, drop.row * CELL, CELL, CELL);
          drawGlyph(x, drop.row, drop.color);
        }
        drawGlyph(x, row, HEAD);
        drop.row = row;

        if (row * CELL > height && Math.random() > 0.975) {
          drops[i] = createDrop(-Math.random() * 20);
        }
      });
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      // Small tolerance so a 60 Hz screen ticks every 2nd frame, not every 3rd.
      if (now - last < STEP_MS - 2) return;
      last = now;
      tick();
    };

    const resize = (w: number, h: number) => {
      width = w;
      height = h;
      // Resizing the canvas wipes it and resets the context state.
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${CELL}px ui-monospace, "MS Gothic", monospace`;
      ctx.textBaseline = 'top';

      const rows = Math.ceil(h / CELL);
      drops = Array.from({ length: Math.ceil(w / CELL) }, (_, i) => drops[i] ?? createDrop(-Math.random() * rows));

      // No animation for visitors who asked for less motion: a single still frame.
      if (reducedMotion) {
        for (let n = 0; n < rows * 2; n++) tick();
      }
    };

    const observer = new ResizeObserver(([entry]) => {
      resize(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(canvas);
    if (!reducedMotion) frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div onClick={onExit} className="absolute inset-0 z-20 bg-black cursor-pointer">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full" />
      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-black/70 text-[11px] text-emerald-400/80 font-mono pointer-events-none">
        Wake up, Neo... (cliquez ou appuyez sur une touche pour quitter)
      </p>
    </div>
  );
};
