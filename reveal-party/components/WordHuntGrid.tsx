"use client";

import type React from "react";
import { useRef } from "react";

type Cell = { row: number; col: number };

type Props = {
  grid: string[][];
  size: number;
  selected: Cell[] | null;
  foundCells: Set<string>;
  targetCells?: Set<string>;
  onStart: (cell: Cell) => void;
  onMove: (cell: Cell) => void;
  onEnd: () => void;
};

export function WordHuntGrid({
  grid,
  size,
  selected,
  foundCells,
  targetCells,
  onStart,
  onMove,
  onEnd,
}: Props) {
  const selectedSet = new Set((selected ?? []).map((c) => `${c.row}:${c.col}`));
  const draggingRef = useRef(false);

  return (
    <div
      className="grid touch-none select-none gap-1 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      role="grid"
      aria-label="Kelime avı ızgarası"
      onPointerMove={(e) => {
        if (!draggingRef.current) return;
        e.preventDefault();
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const btn = el?.closest?.("button[data-row][data-col]") as
          | HTMLButtonElement
          | null;
        if (!btn) return;
        const row = Number(btn.dataset.row);
        const col = Number(btn.dataset.col);
        if (Number.isFinite(row) && Number.isFinite(col)) onMove({ row, col });
      }}
      onPointerUp={() => {
        draggingRef.current = false;
        onEnd();
      }}
      onPointerCancel={() => {
        draggingRef.current = false;
        onEnd();
      }}
      onPointerLeave={() => {
        draggingRef.current = false;
        onEnd();
      }}
    >
      {Array.from({ length: size * size }, (_, i) => {
        const row = Math.floor(i / size);
        const col = i % size;
        const key = `${row}:${col}`;
        const ch = (grid[row]?.[col] ?? "").toUpperCase();
        const isFound = foundCells.has(key);
        const isTarget = targetCells?.has(key) ?? false;
        const isSelected = selectedSet.has(key);
        const forcedStyle: React.CSSProperties | undefined = isTarget
          ? {
              backgroundColor: "rgb(252 211 77)", // amber-300
              borderColor: "rgb(245 158 11)", // amber-500
              color: "rgb(120 53 15)", // amber-900-ish
            }
          : isFound
            ? {
                backgroundColor: "rgb(186 230 253)", // sky-200
                borderColor: "rgb(56 189 248)", // sky-400
                color: "rgb(12 74 110)", // sky-900-ish
              }
            : undefined;

        return (
          <button
            key={key}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              (e.currentTarget as HTMLButtonElement).setPointerCapture?.(e.pointerId);
              draggingRef.current = true;
              onStart({ row, col });
            }}
            onTouchStart={(e) => e.preventDefault()}
            data-row={row}
            data-col={col}
            style={forcedStyle}
            className={[
              "aspect-square w-full rounded-xl border text-center text-base font-semibold uppercase transition touch-none",
              "border-zinc-200 bg-zinc-50 text-zinc-900 hover:bg-zinc-100",
              "dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
              isTarget
                ? "bg-amber-200 text-amber-950 dark:bg-amber-500/20 dark:text-amber-200"
                : isFound
                  ? "bg-sky-200 text-sky-950 border-sky-300 dark:bg-sky-500/30 dark:text-sky-100 dark:border-sky-400/40"
                  : "",
              isSelected ? "ring-2 ring-sky-300 dark:ring-sky-500" : "",
            ].join(" ")}
            aria-label={`Satır ${row + 1} sütun ${col + 1}`}
          >
            {ch}
          </button>
        );
      })}
    </div>
  );
}

