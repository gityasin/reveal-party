export type DirectionStep = { dr: number; dc: number };

const STEPS: DirectionStep[] = [
  { dr: -1, dc: -1 },
  { dr: -1, dc: 0 },
  { dr: -1, dc: 1 },
  { dr: 0, dc: -1 },
  { dr: 0, dc: 1 },
  { dr: 1, dc: -1 },
  { dr: 1, dc: 0 },
  { dr: 1, dc: 1 },
];

export function normalizeWord(w: string) {
  const s = (w ?? "").trim();
  // Turkish-aware uppercasing for i/ı/İ/I plus other letters.
  return s
    .replace(/i/g, "İ")
    .replace(/ı/g, "I")
    .toLocaleUpperCase("tr-TR");
}

export function lineCells(args: {
  from: { row: number; col: number };
  to: { row: number; col: number };
}): Array<{ row: number; col: number }> | null {
  const { from, to } = args;
  const dr = to.row - from.row;
  const dc = to.col - from.col;
  if (dr === 0 && dc === 0) return [{ row: from.row, col: from.col }];

  const step: DirectionStep | null = (() => {
    for (const s of STEPS) {
      if (s.dr === 0 && s.dc === 0) continue;
      // must be collinear
      if (s.dr === 0 && dr !== 0) continue;
      if (s.dc === 0 && dc !== 0) continue;
      if (s.dr !== 0 && s.dc !== 0) {
        if (Math.abs(dr) !== Math.abs(dc)) continue;
      }

      // same direction sign
      if (s.dr !== 0 && Math.sign(dr) !== Math.sign(s.dr)) continue;
      if (s.dc !== 0 && Math.sign(dc) !== Math.sign(s.dc)) continue;
      return s;
    }
    return null;
  })();
  if (!step) return null;

  const len = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
  const cells: Array<{ row: number; col: number }> = [];
  for (let i = 0; i < len; i += 1) {
    cells.push({ row: from.row + step.dr * i, col: from.col + step.dc * i });
  }
  return cells;
}

export function readWordFromGrid(args: {
  grid: string[][];
  cells: Array<{ row: number; col: number }>;
}): string {
  const { grid, cells } = args;
  return cells
    .map(({ row, col }) => normalizeWord(grid[row]?.[col] ?? ""))
    .join("");
}

