"use client";

import { useEffect, useMemo, useRef } from "react";

import type { CrosswordPuzzle, Direction } from "@/lib/crossword/puzzles";
import { isBlocked } from "@/lib/crossword/engine";

type Props = {
  puzzle: CrosswordPuzzle;
  fill: string[][];
  active: { row: number; col: number } | null;
  direction: Direction;
  onActiveChange: (pos: { row: number; col: number }, direction?: Direction) => void;
  onType: (pos: { row: number; col: number }, value: string) => void;
  onBackspace: (pos: { row: number; col: number }) => void;
};

export function CrosswordGrid({
  puzzle,
  fill,
  active,
  direction,
  onActiveChange,
  onType,
  onBackspace,
}: Props) {
  const refs = useRef<Map<string, HTMLInputElement>>(new Map());

  const cells = useMemo(() => {
    const a: Array<{ row: number; col: number; blocked: boolean }> = [];
    for (let row = 0; row < puzzle.size; row += 1) {
      for (let col = 0; col < puzzle.size; col += 1) {
        a.push({ row, col, blocked: isBlocked(puzzle, row, col) });
      }
    }
    return a;
  }, [puzzle]);

  useEffect(() => {
    if (!active) return;
    const key = `${active.row}:${active.col}`;
    refs.current.get(key)?.focus();
  }, [active]);

  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))`,
      }}
      role="grid"
      aria-label="Crossword grid"
    >
      {cells.map(({ row, col, blocked }) => {
        const key = `${row}:${col}`;
        const isActive = active?.row === row && active?.col === col;
        const value = (fill[row]?.[col] ?? "").toUpperCase();

        if (blocked) {
          return (
            <div
              key={key}
              className="aspect-square rounded-[6px] bg-zinc-900/90 dark:bg-white/10"
              aria-hidden="true"
            />
          );
        }

        return (
          <input
            key={key}
            ref={(el) => {
              if (!el) refs.current.delete(key);
              else refs.current.set(key, el);
            }}
            value={value}
            inputMode="text"
            autoCapitalize="characters"
            maxLength={1}
            aria-label={`Row ${row + 1} column ${col + 1}`}
            className={[
              "aspect-square w-full rounded-[10px] border text-center text-base font-semibold uppercase shadow-sm outline-none transition",
              "border-zinc-200 bg-white text-zinc-950 focus:border-sky-400 focus:ring-4 focus:ring-sky-200/40",
              "dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:focus:border-sky-300 dark:focus:ring-sky-500/20",
              isActive ? "ring-2 ring-sky-300/40 dark:ring-sky-500/30" : "",
            ].join(" ")}
            onFocus={() => onActiveChange({ row, col })}
            onMouseDown={(e) => {
              // Allow clicking the already-focused cell to toggle direction.
              if (isActive) {
                e.preventDefault();
                onActiveChange({ row, col }, direction === "across" ? "down" : "across");
              }
            }}
            onChange={(e) => {
              const ch = (e.target.value ?? "").slice(-1);
              onType({ row, col }, ch);
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace") {
                e.preventDefault();
                onBackspace({ row, col });
              }
              if (e.key === "Enter") {
                e.preventDefault();
                onActiveChange(
                  { row, col },
                  direction === "across" ? "down" : "across",
                );
              }
              if (e.key.startsWith("Arrow")) {
                e.preventDefault();
                const step =
                  e.key === "ArrowUp"
                    ? { dr: -1, dc: 0 }
                    : e.key === "ArrowDown"
                      ? { dr: 1, dc: 0 }
                      : e.key === "ArrowLeft"
                        ? { dr: 0, dc: -1 }
                        : { dr: 0, dc: 1 };
                const nr = row + step.dr;
                const nc = col + step.dc;
                if (
                  nr >= 0 &&
                  nc >= 0 &&
                  nr < puzzle.size &&
                  nc < puzzle.size &&
                  !isBlocked(puzzle, nr, nc)
                ) {
                  onActiveChange({ row: nr, col: nc });
                }
              }
            }}
          />
        );
      })}
    </div>
  );
}

