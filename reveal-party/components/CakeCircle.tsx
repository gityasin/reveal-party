"use client";

import type { CakeSlice } from "@/lib/cake";

type Props = {
  slices: CakeSlice[];
  revealed: boolean[];
  disabled?: boolean;
  onReveal: (index: number) => void;
};

function wedgePath(args: { cx: number; cy: number; r: number; a0: number; a1: number }) {
  const { cx, cy, r, a0, a1 } = args;
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const largeArc = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1} Z`;
}

export function CakeCircle({ slices, revealed, disabled, onReveal }: Props) {
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const r = 160;
  const sliceCount = 9;
  const start = -Math.PI / 2; // top
  const step = (Math.PI * 2) / sliceCount;

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full select-none"
        role="img"
        aria-label="Pasta"
      >
        <defs>
          <radialGradient id="cakeSponge" cx="30%" cy="25%" r="85%">
            <stop offset="0%" stopColor="#FFE8B6" />
            <stop offset="55%" stopColor="#F6C26B" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>
          <radialGradient id="cakeFrosting" cx="35%" cy="25%" r="80%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="55%" stopColor="#F8FAFC" stopOpacity="0.97" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.97" />
          </radialGradient>
          <linearGradient id="cakeSide" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F6C26B" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#D97706" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#92400E" stopOpacity="0.35" />
          </linearGradient>
          <pattern id="crumbDots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1" fill="rgba(120,53,15,0.35)" />
          </pattern>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="rgba(0,0,0,0.15)" />
          </filter>
          <filter id="biteShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.2" floodColor="rgba(0,0,0,0.28)" />
          </filter>

          {Array.from({ length: sliceCount }, (_, i) => {
            const a0 = start + i * step;
            const a1 = a0 + step;
            const mid = (a0 + a1) / 2;
            const biteCx = cx + (r * 0.83) * Math.cos(mid);
            const biteCy = cy + (r * 0.83) * Math.sin(mid);
            return (
              <mask key={i} id={`biteMask-${i}`}>
                <rect x="0" y="0" width={size} height={size} fill="white" />
                <circle cx={biteCx} cy={biteCy} r="22" fill="black" />
              </mask>
            );
          })}
        </defs>

        {/* Decorative layers (must NOT block pointer events) */}
        <g style={{ pointerEvents: "none" }}>
          {/* Removed plate/side ellipses to avoid "ears" on the sides */}

          {/* Top sponge */}
          <circle cx={cx} cy={cy} r={r} fill="url(#cakeSponge)" />
          <circle cx={cx} cy={cy} r={r} fill="url(#crumbDots)" opacity="0.22" />

          {/* Frosting top */}
          <circle cx={cx} cy={cy} r={r * 0.92} fill="url(#cakeFrosting)" opacity="0.98" />
          <circle cx={cx} cy={cy} r={r * 0.86} fill="rgba(255,255,255,0.10)" opacity="0.35" />

          {/* Subtle frosting rim */}
          <circle
            cx={cx}
            cy={cy}
            r={r * 0.92}
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="3"
            opacity="0.25"
          />

          {/* Slice boundaries */}
          {Array.from({ length: sliceCount }, (_, i) => {
            const a = start + i * step;
            const x = cx + r * Math.cos(a);
            const y = cy + r * Math.sin(a);
            const innerR = 10; // don't draw into the center
            const x0 = cx + innerR * Math.cos(a);
            const y0 = cy + innerR * Math.sin(a);
            return (
              <line
                key={i}
                x1={x0}
                y1={y0}
                x2={x}
                y2={y}
                stroke="rgba(0,0,0,0.12)"
                strokeWidth="2"
              />
            );
          })}

          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(0,0,0,0.16)"
            strokeWidth="2"
            opacity="0.45"
          />
          <circle
            cx={cx}
            cy={cy}
            r={r * 0.92}
            fill="none"
            stroke="rgba(0,0,0,0.10)"
            strokeWidth="2"
            opacity="0.35"
          />
        </g>

        {/* Interactive slices */}
        {Array.from({ length: sliceCount }, (_, i) => {
          const a0 = start + i * step;
          const a1 = a0 + step;
          const path = wedgePath({ cx, cy, r, a0, a1 });
          const isRevealed = revealed[i] ?? false;
          const isDisabled = disabled || isRevealed;

          const mid = (a0 + a1) / 2;
          const biteCx = cx + (r * 0.965) * Math.cos(mid);
          const biteCy = cy + (r * 0.965) * Math.sin(mid);
          const biteR = 18;

          const fillColor = slices[i]?.color === "blue" ? "#38BDF8" : "#EC4899";

          return (
            <g key={i}>
              {isRevealed ? (
                <>
                  {/* Color only inside the bite area, clipped to this wedge */}
                  <defs>
                    <clipPath id={`wedgeClip-${i}`}>
                      <path d={path} />
                    </clipPath>
                  </defs>
                  <circle
                    cx={biteCx}
                    cy={biteCy}
                    r={biteR}
                    fill={fillColor}
                    clipPath={`url(#wedgeClip-${i})`}
                    filter="url(#biteShadow)"
                    opacity="0.98"
                    style={{ pointerEvents: "none" }}
                  />
                  {/* Inner shadow */}
                  <circle
                    cx={biteCx}
                    cy={biteCy}
                    r={biteR + 2}
                    fill="rgba(0,0,0,0)"
                    stroke="rgba(0,0,0,0.22)"
                    strokeWidth="2"
                    clipPath={`url(#wedgeClip-${i})`}
                    opacity="0.25"
                    style={{ pointerEvents: "none" }}
                  />
                </>
              ) : (
                <path
                  d={path}
                  fill="rgba(255,255,255,0)"
                  style={{ transition: "fill 200ms ease", pointerEvents: "none" }}
                />
              )}

              {/* Hit-area LAST so it always receives pointer events */}
              <path
                d={path}
                fill="rgba(0,0,0,0.001)"
                onPointerDown={(e) => {
                  e.preventDefault();
                  if (isDisabled) return;
                  onReveal(i);
                }}
                style={{ cursor: isDisabled ? "default" : "pointer", pointerEvents: "all" }}
              />
            </g>
          );
        })}
      </svg>

      <p className="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Dilimlere dokun ve bir parça al.
      </p>
    </div>
  );
}

