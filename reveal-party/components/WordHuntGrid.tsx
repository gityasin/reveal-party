"use client";

type Cell = { row: number; col: number };

type Props = {
  grid: string[][];
  size: number;
  selected: Cell[] | null;
  foundCells: Set<string>;
  onStart: (cell: Cell) => void;
  onMove: (cell: Cell) => void;
  onEnd: () => void;
};

export function WordHuntGrid({ grid, size, selected, foundCells, onStart, onMove, onEnd }: Props) {
  const selectedSet = new Set((selected ?? []).map((c) => `${c.row}:${c.col}`));

  return (
    <div
      className="grid gap-1 rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-950"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      role="grid"
      aria-label="Kelime avı ızgarası"
      onPointerUp={() => onEnd()}
      onPointerCancel={() => onEnd()}
      onPointerLeave={() => onEnd()}
    >
      {Array.from({ length: size * size }, (_, i) => {
        const row = Math.floor(i / size);
        const col = i % size;
        const key = `${row}:${col}`;
        const ch = (grid[row]?.[col] ?? "").toUpperCase();
        const isFound = foundCells.has(key);
        const isSelected = selectedSet.has(key);

        return (
          <button
            key={key}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              (e.currentTarget as HTMLButtonElement).setPointerCapture?.(e.pointerId);
              onStart({ row, col });
            }}
            onPointerEnter={() => onMove({ row, col })}
            className={[
              "aspect-square w-full rounded-xl border text-center text-sm font-semibold uppercase transition",
              "border-zinc-200 bg-zinc-50 text-zinc-900 hover:bg-zinc-100",
              "dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
              isFound ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-200" : "",
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

