import { useState } from "react";

const MESSAGES = [
  "息を、ゆっくり吐いてみて",
  "今日はここまででいい",
  "涙も、光のかたち",
  "あなたはひとりじゃない",
  "小さな一歩でいい",
  "朝はいつも新しい",
  "やわらかな風が吹いてる",
  "心は波のように揺れるだけ",
  "休んでいい時間もある",
  "そのままで価値がある",
  "光は差し込んでくる",
];

type Props = { visible: boolean };

export function MorningParticles({ visible }: Props) {
  const [active, setActive] = useState<number | null>(null);

  if (!visible) return null;

  return (
    <>
      <div className="morning-particles" aria-hidden>
        {MESSAGES.map((_, i) => {
          const top = 12 + (i * 7.3) % 76;
          const left = 8 + (i * 13.1) % 84;
          const delay = i * 0.35;
          return (
            <button
              type="button"
              key={i}
              className="morning-particles__dot"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                animationDelay: `${delay}s`,
              }}
              onClick={() => setActive(i)}
              aria-label={`光 ${i + 1}`}
            />
          );
        })}
      </div>
      {active !== null && (
        <div className="morning-particles__toast" role="status">
          <p>{MESSAGES[active]}</p>
          <button type="button" className="morning-particles__close" onClick={() => setActive(null)}>
            とじる
          </button>
        </div>
      )}
    </>
  );
}
