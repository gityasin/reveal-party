import type { CrosswordPuzzle, Direction, Entry } from "@/lib/crossword/puzzles";

export type FillGrid = string[][]; // "" for empty; size×size

export function createEmptyFill(puzzle: CrosswordPuzzle): FillGrid {
  return Array.from({ length: puzzle.size }, () =>
    Array.from({ length: puzzle.size }, () => ""),
  );
}

export function isBlocked(puzzle: CrosswordPuzzle, row: number, col: number) {
  return puzzle.blocks[row]?.[col] ?? true;
}

export function getEntryCells(entry: Entry): Array<{ row: number; col: number }> {
  const answer = entry.answer.toUpperCase();
  return Array.from({ length: answer.length }, (_, i) => ({
    row: entry.row + (entry.direction === "down" ? i : 0),
    col: entry.col + (entry.direction === "across" ? i : 0),
  }));
}

export function findEntryAtCell(
  puzzle: CrosswordPuzzle,
  row: number,
  col: number,
  direction: Direction,
): Entry | null {
  for (const entry of puzzle.entries) {
    if (entry.direction !== direction) continue;
    for (const cell of getEntryCells(entry)) {
      if (cell.row === row && cell.col === col) return entry;
    }
  }
  return null;
}

export function getKayraEntry(puzzle: CrosswordPuzzle): Entry {
  const found = puzzle.entries.find((e) => e.id === puzzle.kayraEntryId);
  if (!found) throw new Error("Kayra entry not found in puzzle.");
  return found;
}

export function isEntrySolved(args: {
  entry: Entry;
  fill: FillGrid;
}): boolean {
  const { entry, fill } = args;
  const answer = entry.answer.toUpperCase();
  const cells = getEntryCells(entry);

  for (let i = 0; i < cells.length; i += 1) {
    const { row, col } = cells[i]!;
    const ch = (fill[row]?.[col] ?? "").toUpperCase();
    if (!ch || ch !== answer[i]) return false;
  }
  return true;
}

export function nextCellInDirection(args: {
  puzzle: CrosswordPuzzle;
  row: number;
  col: number;
  direction: Direction;
}): { row: number; col: number } | null {
  const { puzzle, row, col, direction } = args;
  const next = {
    row: row + (direction === "down" ? 1 : 0),
    col: col + (direction === "across" ? 1 : 0),
  };
  if (next.row < 0 || next.col < 0) return null;
  if (next.row >= puzzle.size || next.col >= puzzle.size) return null;
  if (isBlocked(puzzle, next.row, next.col)) return null;
  return next;
}

