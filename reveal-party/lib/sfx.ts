let audioCtx: AudioContext | null = null;

function ctx() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function beep(args: { freq: number; ms: number; gain?: number; type?: OscillatorType }) {
  const c = ctx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = args.type ?? "sine";
  o.frequency.value = args.freq;
  g.gain.value = args.gain ?? 0.05;
  o.connect(g);
  g.connect(c.destination);
  const now = c.currentTime;
  o.start(now);
  o.stop(now + args.ms / 1000);
}

export function sfxTap() {
  beep({ freq: 520, ms: 35, gain: 0.035, type: "triangle" });
}

export function sfxFound() {
  beep({ freq: 660, ms: 70, gain: 0.045, type: "sine" });
  setTimeout(() => beep({ freq: 880, ms: 80, gain: 0.05, type: "sine" }), 60);
}

export function sfxWin() {
  beep({ freq: 523.25, ms: 100, gain: 0.05, type: "sine" }); // C5
  setTimeout(() => beep({ freq: 659.25, ms: 120, gain: 0.05, type: "sine" }), 90); // E5
  setTimeout(() => beep({ freq: 783.99, ms: 140, gain: 0.055, type: "sine" }), 200); // G5
}

export function sfxInvalid() {
  beep({ freq: 220, ms: 90, gain: 0.05, type: "sawtooth" });
  setTimeout(() => beep({ freq: 160, ms: 110, gain: 0.05, type: "sawtooth" }), 70);
}

