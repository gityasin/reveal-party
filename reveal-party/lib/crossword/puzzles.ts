export type Direction = "across" | "down";

export type Entry = {
  id: string;
  direction: Direction;
  row: number;
  col: number;
  answer: string; // uppercase A-Z
  clue: string;
};

export type CrosswordPuzzle = {
  id: string;
  title: string;
  size: number; // square grid
  blocks: boolean[][]; // true means black square
  solution: (string | null)[][]; // null for blocks
  entries: Entry[];
  kayraEntryId: string;
};

function emptyGrid<T>(size: number, fill: T): T[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => fill));
}

function placeAnswer(grid: (string | null)[][], entry: Entry) {
  const answer = entry.answer.toUpperCase();
  for (let i = 0; i < answer.length; i += 1) {
    const r = entry.row + (entry.direction === "down" ? i : 0);
    const c = entry.col + (entry.direction === "across" ? i : 0);
    grid[r]![c] = answer[i]!;
  }
}

export const PUZZLE_TR_NAMES_9X9: CrosswordPuzzle = (() => {
  const size = 9;
  const blocks = emptyGrid(size, true);
  const solution: (string | null)[][] = emptyGrid(size, null);

  const entries: Entry[] = [
    {
      id: "A1",
      direction: "across",
      row: 1,
      col: 2,
      answer: "KAYRA",
      clue: "Doğru bebek ismi (5)",
    },
    {
      id: "D1",
      direction: "down",
      row: 1,
      col: 3,
      answer: "ARDA",
      clue: "Popüler erkek ismi (4)",
    },
    {
      id: "A2",
      direction: "across",
      row: 2,
      col: 3,
      answer: "RANA",
      clue: "Kısa ve yaygın bir isim (4)",
    },
  ];

  // Place entries and open those cells (blocks=false)
  for (const entry of entries) {
    const answer = entry.answer.toUpperCase();
    for (let i = 0; i < answer.length; i += 1) {
      const r = entry.row + (entry.direction === "down" ? i : 0);
      const c = entry.col + (entry.direction === "across" ? i : 0);
      blocks[r]![c] = false;
    }
    placeAnswer(solution, entry);
  }

  return {
    id: "tr-names-9x9-v1",
    title: "Türkçe İsimler (9×9)",
    size,
    blocks,
    solution,
    entries,
    kayraEntryId: "A1",
  };
})();

