import { useEffect, useMemo, useState, type CSSProperties } from "react";

type Particle = {
  id: number;
  char: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  delay: number;
  life: number;
};

type Props = {
  text: string;
  originX: number;
  originY: number;
  onComplete: () => void;
};

function segmentText(text: string): string[] {
  try {
    const seg = new Intl.Segmenter("ja", { granularity: "grapheme" });
    return [...seg.segment(text)].map((s) => s.segment);
  } catch {
    return [...text];
  }
}

export function TextDissolve({ text, originX, originY, onComplete }: Props) {
  const chars = useMemo(() => segmentText(text), [text]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const list: Particle[] = chars.map((char, i) => {
      const angle = (i / Math.max(chars.length, 1)) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 0.6 + Math.random() * 1.2;
      return {
        id: i,
        char,
        x: originX,
        y: originY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed - 0.35,
        delay: i * 22 + Math.random() * 40,
        life: 1400 + Math.random() * 500,
      };
    });
    setParticles(list);
    const maxLife = Math.max(...list.map((p) => p.delay + p.life), 1600);
    const t = window.setTimeout(() => {
      setDone(true);
      onComplete();
    }, maxLife + 120);
    return () => window.clearTimeout(t);
  }, [chars, originX, originY, onComplete]);

  if (done) return null;

  return (
    <div className="text-dissolve-layer" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="text-dissolve-bit"
          style={
            {
              left: p.x,
              top: p.y,
              animationDuration: `${p.life}ms`,
              animationDelay: `${p.delay}ms`,
              "--dx": `${p.dx * 42}px`,
              "--dy": `${p.dy * 42}px`,
            } as CSSProperties
          }
        >
          {p.char}
        </span>
      ))}
    </div>
  );
}
