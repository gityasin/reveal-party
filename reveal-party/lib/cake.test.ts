import { describe, expect, it } from "vitest";

import { countRevealedColors, createCakeSlices } from "@/lib/cake";

describe("cake", () => {
  it("always creates 9 slices with 5 blue and 4 pink", () => {
    const slices = createCakeSlices();
    expect(slices).toHaveLength(9);
    const blue = slices.filter((s) => s.color === "blue").length;
    const pink = slices.filter((s) => s.color === "pink").length;
    expect(blue).toBe(5);
    expect(pink).toBe(4);
  });

  it("counts revealed colors correctly", () => {
    const slices = [
      { color: "blue" as const },
      { color: "pink" as const },
      { color: "blue" as const },
      { color: "pink" as const },
      { color: "blue" as const },
      { color: "pink" as const },
      { color: "blue" as const },
      { color: "pink" as const },
      { color: "blue" as const },
    ];
    const revealed = [true, false, true, false, false, true, false, false, true];
    expect(countRevealedColors({ slices, revealed })).toEqual({
      blue: 3,
      pink: 1,
      revealedTotal: 4,
    });
  });
});

