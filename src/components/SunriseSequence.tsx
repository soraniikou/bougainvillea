import type { CSSProperties } from "react";

const STARS = [
  { left: "14%", top: "16%" },
  { left: "72%", top: "11%" },
  { left: "46%", top: "24%" },
  { left: "86%", top: "34%" },
  { left: "27%", top: "41%" },
];

const PETALS = 14;

type Props = { onSkip: () => void; withVoice?: boolean };

export function SunriseSequence({ onSkip, withVoice = false }: Props) {
  return (
    <>
      <div
        className={`sunrise-sequence ${withVoice ? "sunrise-sequence--with-voice" : ""}`}
        aria-hidden
        data-with-voice={withVoice ? "true" : "false"}
      >
        <div className="sunrise-sequence__layer sunrise-sequence__layer--night" />
        <div className="sunrise-sequence__layer sunrise-sequence__layer--dawn" />
        <div className="sunrise-sequence__layer sunrise-sequence__layer--day" />
        <div className="sunrise-sequence__stars">
          {STARS.map((pos, i) => (
            <span
              key={i}
              className="sunrise-star"
              style={
                {
                  left: pos.left,
                  top: pos.top,
                  "--tw-delay": `${i * 0.45}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div className="sunrise-sequence__petals">
          {Array.from({ length: PETALS }, (_, i) => (
            <span
              key={i}
              className="sunrise-petal"
              style={
                {
                  left: `${(i * 7.3) % 96}%`,
                  "--petal-stagger": `${i * 0.55}s`,
                  "--petal-drift": `${(i % 5) * 14 - 28}px`,
                  "--petal-dur": `${12 + (i % 4)}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>
      <button type="button" className="sunrise-skip" onClick={onSkip}>
        skip →
      </button>
    </>
  );
}
