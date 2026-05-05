import { describe, expect, it } from "vitest";

import { createEmptyFill, getKayraEntry, isEntrySolved } from "@/lib/crossword/engine";
import { PUZZLE_TR_NAMES_9X9 } from "@/lib/crossword/puzzles";

describe("crossword engine", () => {
  it("detects Kayra completion", () => {
    const puzzle = PUZZLE_TR_NAMES_9X9;
    const fill = createEmptyFill(puzzle);
    const kayra = getKayraEntry(puzzle);

    // Fill Kayra correctly.
    const answer = kayra.answer.toUpperCase();
    for (let i = 0; i < answer.length; i += 1) {
      const row = kayra.row;
      const col = kayra.col + i;
      fill[row]![col] = answer[i]!;
    }

    expect(isEntrySolved({ entry: kayra, fill })).toBe(true);
  });
});

