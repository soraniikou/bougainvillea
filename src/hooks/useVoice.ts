import { useCallback, useRef, useState } from "react";

const CORE_VOICE = "/audio/core.mp3";

function playPlaceholderTone() {
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 392;
  gain.gain.value = 0.0001;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.4);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
  osc.start(now);
  osc.stop(now + 2.3);
  ctx.resume().catch(() => {});
}

export function useVoice() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackOnce = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  const runFallback = useCallback(() => {
    if (fallbackOnce.current) return;
    fallbackOnce.current = true;
    setUsedFallback(true);
    setPlaying(true);
    playPlaceholderTone();
    window.setTimeout(() => setPlaying(false), 2300);
  }, []);

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (playing) {
      stop();
      return;
    }
    let a = audioRef.current;
    if (!a) {
      a = new Audio(CORE_VOICE);
      audioRef.current = a;
      a.addEventListener("ended", () => setPlaying(false));
      a.addEventListener("error", () => runFallback());
    }
    a.currentTime = 0;
    setPlaying(true);
    const p = a.play();
    if (p) {
      p.catch(() => runFallback());
    }
  }, [playing, runFallback, stop]);

  return { play, stop, playing, usedFallback };
}
