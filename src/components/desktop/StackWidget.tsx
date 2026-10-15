import React from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { STACK_TOOLS } from '../../data/portfolio';
import type { StackTool } from '../../types/os';

/** Gap between tiles, in rem (matches `gap-2.5`). */
const TILE_GAP_REM = 0.625;

interface StackWidgetProps {
  tools?: StackTool[];
  title?: string;
  caption?: string | null;
  /** Tiles per row; an incomplete last row is centered. */
  columns?: 3 | 4 | 5;
  /** Positioning and sizing; the glass card styling stays built in. */
  className?: string;
  delay?: number;
}

export const StackWidget: React.FC<StackWidgetProps> = ({
  tools = STACK_TOOLS,
  title = 'Stack & outils',
  caption = "Conçu avec l'IA, designé sur Figma, livré en TypeScript.",
  columns = 3,
  className = '',
  delay = 0.3,
}) => {
  return (
    <motion.aside
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`aero-glass rounded-2xl p-4 ${className}`}
      aria-label={title}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-black/10 text-slate-800 dark:bg-white/15 dark:text-white/90">
          <Layers size={13} />
        </span>
        <h2 className="text-[13px] font-semibold tracking-tight text-slate-900 dark:text-white/95">{title}</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-2.5">
        {tools.map((tool) => (
          <div
            key={tool.name}
            className="group flex min-w-0 flex-col items-center gap-1.5 rounded-xl border border-black/10 bg-white/30 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-black/20 hover:bg-white/50 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/25 dark:hover:bg-white/10"
            style={{ width: `calc((100% - ${(columns - 1) * TILE_GAP_REM}rem) / ${columns})` }}
            title={tool.name}
          >
            <img
              src={tool.src ?? `https://cdn.simpleicons.org/${tool.slug}/ffffff`}
              alt={tool.name}
              loading="lazy"
              className="h-6 w-6 opacity-85 invert dark:invert-0 transition-opacity duration-200 group-hover:opacity-100"
            />
            <span className="w-full truncate px-1 text-center text-[9.5px] font-medium tracking-tight text-slate-700 transition-colors duration-200 group-hover:text-slate-900 dark:text-white/70 dark:group-hover:text-white/95">
              {tool.name}
            </span>
          </div>
        ))}
      </div>

      {caption && (
        <p className="mt-3 text-[10px] leading-relaxed tracking-tight text-slate-600 dark:text-white/45">{caption}</p>
      )}
    </motion.aside>
  );
};
