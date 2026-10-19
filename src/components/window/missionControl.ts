import type { AppId, WindowState } from '../../types/os';

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Offset and scale that move a window from where it sits to its target. */
export interface WindowTransform {
  x: number;
  y: number;
  scale: number;
}

const TOP = 64;
const BOTTOM = 120;
const SIDE = 48;
const GAP = 36;

/**
 * Mission Control: every visible window laid out in a centered grid, in a stable
 * order, scaled down to fit its cell.
 */
export const getMissionControlTransform = (
  windows: Record<AppId, WindowState>,
  appId: AppId,
  viewport: { width: number; height: number }
): WindowTransform | null => {
  const visible = Object.values(windows).filter((w) => w.isOpen && !w.isMinimized);
  const index = visible.findIndex((w) => w.appId === appId);
  if (index === -1) return null;

  const cols = Math.ceil(Math.sqrt(visible.length));
  const rows = Math.ceil(visible.length / cols);
  const cellW = (viewport.width - SIDE * 2 - GAP * (cols - 1)) / cols;
  const cellH = (viewport.height - TOP - BOTTOM - GAP * (rows - 1)) / rows;
  const col = index % cols;
  const row = Math.floor(index / cols);
  // The last row may be incomplete: center it.
  const inRow = row === rows - 1 ? visible.length - cols * (rows - 1) : cols;
  const rowOffset = ((cols - inRow) * (cellW + GAP)) / 2;

  const win = visible[index];
  const centerX = SIDE + rowOffset + col * (cellW + GAP) + cellW / 2;
  const centerY = TOP + row * (cellH + GAP) + cellH / 2;

  return {
    x: centerX - (win.position.x + win.size.width / 2),
    y: centerY - (win.position.y + win.size.height / 2),
    scale: Math.min(cellW / win.size.width, cellH / win.size.height, 0.85),
  };
};
