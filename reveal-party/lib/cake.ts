export type CakeColor = "blue" | "pink";

export type CakeSlice = {
  color: CakeColor;
};

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createCakeSlices(options?: {
  blueCount?: number;
  pinkCount?: number;
  rng?: () => number;
}): CakeSlice[] {
  const blueCount = options?.blueCount ?? 5;
  const pinkCount = options?.pinkCount ?? 4;
  const rng = options?.rng ?? Math.random;

  if (blueCount < 0 || pinkCount < 0) {
    throw new Error("Counts must be non-negative.");
  }
  if (blueCount + pinkCount !== 9) {
    throw new Error("Cake must have exactly 9 slices.");
  }

  const slices: CakeSlice[] = [
    ...Array.from({ length: blueCount }, () => ({ color: "blue" as const })),
    ...Array.from({ length: pinkCount }, () => ({ color: "pink" as const })),
  ];
  return shuffle(slices, rng);
}

export function countRevealedColors(args: {
  slices: CakeSlice[];
  revealed: boolean[];
}): { blue: number; pink: number; revealedTotal: number } {
  const { slices, revealed } = args;
  let blue = 0;
  let pink = 0;
  let revealedTotal = 0;

  for (let i = 0; i < slices.length; i += 1) {
    if (!revealed[i]) continue;
    revealedTotal += 1;
    if (slices[i]?.color === "blue") blue += 1;
    else pink += 1;
  }

  return { blue, pink, revealedTotal };
}

