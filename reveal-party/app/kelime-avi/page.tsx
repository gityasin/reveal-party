"use client";

import confetti from "canvas-confetti";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { WordHuntGrid } from "@/components/WordHuntGrid";
import { normalizeWord, readWordFromGrid } from "@/lib/wordhunt/engine";
import { WORDHUNT_TR_NAMES_12 } from "@/lib/wordhunt/puzzle";
import { sfxFound, sfxInvalid, sfxTap, sfxWin } from "@/lib/sfx";

type Cell = { row: number; col: number };

export default function WordHuntPage() {
  const puzzle = WORDHUNT_TR_NAMES_12;
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<Cell[] | null>(null);
  const [found, setFound] = useState<Set<string>>(() => new Set());
  const [targetCells, setTargetCells] = useState<Set<string>>(() => new Set());
  const [foundWords, setFoundWords] = useState<Set<string>>(() => new Set());
  const [lastMessage, setLastMessage] = useState<string>("");
  const [showName, setShowName] = useState(false);

  const visibleWords = useMemo(
    () => puzzle.wordsVisible.map(normalizeWord),
    [puzzle.wordsVisible],
  );
  const hiddenTarget = normalizeWord(puzzle.hiddenTarget);

  useEffect(() => {
    // Prevent page scroll while dragging on mobile.
    if (!dragging) return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevTouchAction = body.style.touchAction;
    body.style.overflow = "hidden";
    body.style.touchAction = "none";
    return () => {
      body.style.overflow = prevOverflow;
      body.style.touchAction = prevTouchAction;
    };
  }, [dragging]);

  const isNeighbor = (a: Cell, b: Cell) =>
    Math.abs(a.row - b.row) <= 1 &&
    Math.abs(a.col - b.col) <= 1 &&
    !(a.row === b.row && a.col === b.col);

  const finishSelection = (cells: Cell[] | null) => {
    setDragging(false);
    if (!cells || cells.length < 2) return;

    const w = normalizeWord(readWordFromGrid({ grid: puzzle.grid, cells }));
    const rev = normalizeWord(w.split("").reverse().join(""));

    const matched = visibleWords.find((vw) => vw === w || vw === rev) ?? null;
    const isTarget = w === hiddenTarget || rev === hiddenTarget;

    if (!matched && !isTarget) {
      sfxInvalid();
      setLastMessage("Olmadı, tekrar dene.");
      setSelected(null);
      return;
    }

    if (matched) sfxFound();

    setFound((prev) => {
      const next = new Set(prev);
      for (const c of cells) next.add(`${c.row}:${c.col}`);
      return next;
    });

    if (matched) {
      setFoundWords((prev) => new Set(prev).add(matched));
      setLastMessage(`Buldun: ${matched}`);
    }

    if (isTarget) {
      sfxWin();
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.7 },
        colors: ["#38BDF8", "#0EA5E9", "#93C5FD", "#FFFFFF"],
      });
      setTargetCells(() => {
        const next = new Set<string>();
        for (const c of cells) next.add(`${c.row}:${c.col}`);
        return next;
      });
      setShowName(true);
      setLastMessage("Tebrikler, ismi buldun!");
    }

    setTimeout(() => setSelected(null), 250);
  };

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-10">
      <div className="w-full max-w-5xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Kelime Avı</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              İsimleri seçerek bebeğin ismini bulun.
            </p>
          </div>
          <Link
            href="/cake"
            className="rounded-full border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
          >
            Pasta
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <div className="order-2 lg:order-1">
            <div className="mt-4 rounded-2xl border border-zinc-200 p-4 text-sm dark:border-white/10">
              <p className="font-semibold">Durum</p>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                {lastMessage || "Bir harfe dokun, sonra ikinci harfi seç."}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-white/10 dark:bg-white/5">
              <p className="font-semibold">Bulunan</p>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                {foundWords.size} / {visibleWords.length}
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="mx-auto w-full max-w-[520px]">
            <WordHuntGrid
              grid={puzzle.grid}
              size={puzzle.size}
              selected={selected}
              foundCells={found}
              targetCells={targetCells}
              onStart={(cell) => {
                if (showName) return;
                sfxTap();
                setDragging(true);
                setSelected([cell]);
              }}
              onMove={(cell) => {
                if (!dragging) return;
                setSelected((prev) => {
                  const current = prev ?? [];
                  const last = current[current.length - 1];
                  if (!last) return [cell];
                  if (last.row === cell.row && last.col === cell.col) return current;

                  // backtrack one step
                  if (current.length >= 2) {
                    const before = current[current.length - 2]!;
                    if (before.row === cell.row && before.col === cell.col) {
                      return current.slice(0, -1);
                    }
                  }

                  if (!isNeighbor(last, cell)) return current;
                  // avoid loops
                  if (current.some((c) => c.row === cell.row && c.col === cell.col)) return current;
                  return [...current, cell];
                });
              }}
              onEnd={() => {
                setSelected((prev) => {
                  finishSelection(prev);
                  return prev;
                });
              }}
            />
            </div>
          </div>
        </div>
      </div>

      {showName ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowName(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-zinc-950"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              Tebrikler, ismi buldun!
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">Kayra</p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowName(false)}
                className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

