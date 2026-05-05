"use client";

import Link from "next/link";
import confetti from "canvas-confetti";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function RevealPage() {
  const [shared, setShared] = useState<"idle" | "copied" | "failed">("idle");
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.origin;
  }, []);

  useEffect(() => {
    // Small, tasteful burst on entry.
    confetti({
      particleCount: 110,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#38BDF8", "#0EA5E9", "#93C5FD", "#FFFFFF"],
    });
  }, []);

  const onShare = useCallback(async () => {
    try {
      const url = shareUrl || window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: "Reveal Party",
          text: "Play the games and see the reveal!",
          url,
        });
        setShared("copied");
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared("copied");
    } catch {
      setShared("failed");
    } finally {
      setTimeout(() => setShared("idle"), 1500);
    }
  }, [shareUrl]);

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div className="bg-gradient-to-br from-sky-200 via-sky-100 to-white px-6 py-10 dark:from-sky-950/60 dark:via-sky-950/20 dark:to-zinc-950">
          <p className="text-sm font-semibold text-sky-900/80 dark:text-sky-100/80">
            Sürpriz
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-sky-950 dark:text-white">
            Erkek!
          </h1>
          <p className="mt-3 max-w-prose text-base leading-7 text-sky-950/70 dark:text-white/70">
            Bizimle kutladığınız için teşekkürler.
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link
              href="/kelime-avi"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
            >
              Kelime Avı
            </Link>
            <Link
              href="/cake"
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
            >
              Pasta oyunu
            </Link>
            <button
              type="button"
              onClick={onShare}
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
            >
              {shared === "copied"
                ? "Kopyalandı!"
                : shared === "failed"
                  ? "Paylaşılamadı"
                  : "Linki paylaş"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

