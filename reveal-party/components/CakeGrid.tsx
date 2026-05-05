"use client";

import type { CakeSlice } from "@/lib/cake";

type Props = {
  slices: CakeSlice[];
  revealed: boolean[];
  onReveal: (index: number) => void;
  disabled?: boolean;
};

export function CakeGrid({ slices, revealed, onReveal, disabled }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {slices.map((slice, idx) => {
        const isRevealed = revealed[idx] ?? false;
        const isDisabled = disabled || isRevealed;

        const face = (
          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            {/* sponge */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-200 to-amber-100 dark:from-amber-900/40 dark:to-amber-950/10" />
            {/* crumb dots */}
            <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_6px_6px,rgba(120,53,15,0.35)_1px,transparent_1px)] [background-size:14px_14px]" />

            {/* frosting cap */}
            <div className="absolute left-0 right-0 top-0 h-[44%] bg-gradient-to-b from-white to-zinc-50 dark:from-white/20 dark:to-white/5" />
            <div className="absolute left-0 right-0 top-[38%] h-2 bg-gradient-to-r from-white/0 via-white/70 to-white/0 dark:via-white/10" />

            {/* sprinkles */}
            <div className="absolute left-3 top-3 h-2 w-2 rotate-12 rounded-sm bg-fuchsia-400/80" />
            <div className="absolute left-8 top-6 h-2 w-2 -rotate-12 rounded-sm bg-sky-400/80" />
            <div className="absolute right-6 top-5 h-2 w-2 rotate-6 rounded-sm bg-emerald-400/70" />
            <div className="absolute right-3 top-9 h-2 w-2 -rotate-6 rounded-sm bg-amber-400/80" />

            {/* reveal overlay */}
            {isRevealed ? (
              <div
                className={[
                  "absolute inset-0 flex items-center justify-center",
                  slice.color === "blue"
                    ? "bg-sky-500/85"
                    : "bg-fuchsia-500/75",
                ].join(" ")}
              >
                <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-tight text-white backdrop-blur-sm">
                  {slice.color === "blue" ? "MAVİ" : "PEMBE"}
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-end justify-center pb-2">
                <div className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-zinc-800 shadow-sm dark:bg-black/20 dark:text-white">
                  Dilimi kes
                </div>
              </div>
            )}
          </div>
        );

        return (
          <button
            key={idx}
            type="button"
            disabled={isDisabled}
            aria-label={`Cake slice ${idx + 1}`}
            onClick={() => onReveal(idx)}
            className={[
              "aspect-square w-full rounded-2xl border border-zinc-200 p-2 text-left shadow-sm transition",
              "hover:-translate-y-0.5 hover:shadow-md",
              "disabled:cursor-not-allowed disabled:opacity-90 disabled:hover:translate-y-0 disabled:hover:shadow-sm",
              "dark:border-white/10",
            ].join(" ")}
          >
            {face}
          </button>
        );
      })}
    </div>
  );
}

