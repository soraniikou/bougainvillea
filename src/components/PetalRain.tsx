import type { CSSProperties } from "react";

type Props = { active: boolean };

const COUNT = 18;

export function PetalRain({ active }: Props) {
  if (!active) return null;
  return (
    <div className="petal-rain" aria-hidden>
      {Array.from({ length: COUNT }, (_, i) => (
        <span
          key={i}
          className="petal-rain__petal"
          style={
            {
              left: `${(i * 5.7) % 100}%`,
              animationDelay: `${i * 0.28}s`,
              animationDuration: `${7 + (i % 5)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
