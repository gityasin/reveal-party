"use client";

import Link from "next/link";
import confetti from "canvas-confetti";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { CakeCircle } from "@/components/CakeCircle";
import { countRevealedColors, createCakeSlices } from "@/lib/cake";

export default function CakePage() {
  const router = useRouter();
  const slices = useMemo(() => createCakeSlices(), []);
  const [revealed, setRevealed] = useState<boolean[]>(() =>
    Array.from({ length: 9 }, () => false),
  );

  const counts = countRevealedColors({ slices, revealed });
  const wonByBlue = counts.blue >= 5;
  const finished = wonByBlue || counts.revealedTotal === 9;
  const didAutoReveal = useRef(false);

  useEffect(() => {
    if (!wonByBlue) return;
    if (didAutoReveal.current) return;
    didAutoReveal.current = true;

    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#38BDF8", "#0EA5E9", "#93C5FD", "#FFFFFF"],
    });
    setTimeout(() => router.push("/reveal?kaynak=pasta"), 700);
  }, [router, wonByBlue]);

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Pasta Oyunu</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Dilimlere dokun. Sürpriz hazır olduğunda otomatik açılacak.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
          >
            Başla
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-zinc-50 p-4 text-sm dark:bg-white/5">
          <div className="rounded-xl bg-white px-3 py-2 text-center shadow-sm dark:bg-zinc-950">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Mavi
            </div>
            <div className="mt-0.5 text-lg font-semibold text-sky-600">
              {counts.blue}
            </div>
          </div>
          <div className="rounded-xl bg-white px-3 py-2 text-center shadow-sm dark:bg-zinc-950">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Pembe
            </div>
            <div className="mt-0.5 text-lg font-semibold text-fuchsia-500">
              {counts.pink}
            </div>
          </div>
          <div className="rounded-xl bg-white px-3 py-2 text-center shadow-sm dark:bg-zinc-950">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Kesilen
            </div>
            <div className="mt-0.5 text-lg font-semibold">{counts.revealedTotal}/9</div>
          </div>
        </div>

        <div className="mt-6">
          <CakeCircle
            slices={slices}
            revealed={revealed}
            disabled={finished}
            onReveal={(index) => {
              setRevealed((prev) => {
                if (prev[index]) return prev;
                const next = [...prev];
                next[index] = true;
                return next;
              });
            }}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() =>
              (() => {
                didAutoReveal.current = false;
                setRevealed(Array.from({ length: 9 }, () => false));
              })()
            }
            className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
          >
            Sıfırla
          </button>

          <Link
            href="/kelime-avi"
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Kelime Avı →
          </Link>
        </div>

        {finished ? (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 text-sm dark:border-white/10 dark:bg-zinc-950">
            <p className="font-semibold tracking-tight">
              {wonByBlue
                ? "Sürpriz hazır!"
                : "Tüm dilimler kesildi."}
            </p>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              {wonByBlue
                ? "Sürpriz birazdan açılıyor..."
                : "Kelime Avı’na geçebilirsin."}
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}

