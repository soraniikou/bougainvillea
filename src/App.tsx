import { useCallback, useMemo, useState } from "react";
import { BougainvilleaVines } from "./components/BougainvilleaVines";
import { MorningParticles } from "./components/MorningParticles";
import { PetalRain } from "./components/PetalRain";
import { SwipeWindow } from "./components/SwipeWindow";
import { TextDissolve } from "./components/TextDissolve";
import { VerticalBookmark } from "./components/VerticalBookmark";
import { useVoice } from "./hooks/useVoice";
import "./App.css";

type Phase = "write" | "dissolve" | "voice" | "window" | "morning";

export default function App() {
  const [phase, setPhase] = useState<Phase>("write");
  const [worry, setWorry] = useState("");
  const [dissolveText, setDissolveText] = useState<string | null>(null);
  const [dissolveOrigin, setDissolveOrigin] = useState({ x: 0, y: 0 });
  const [openProgress, setOpenProgress] = useState(0);
  const { play, playing, usedFallback } = useVoice();

  const bloom = useMemo(() => {
    if (phase === "morning") return 1;
    if (phase === "window") return openProgress;
    return 0;
  }, [phase, openProgress]);

  const morningMix = useMemo(() => {
    if (phase === "morning") return 1;
    if (phase === "window") return Math.min(1, openProgress * 1.05);
    return 0;
  }, [phase, openProgress]);

  const submitWorry = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const el = document.getElementById("worry-field");
      const rect = el?.getBoundingClientRect();
      setDissolveOrigin({
        x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
        y: rect ? rect.top + rect.height / 2 : window.innerHeight * 0.42,
      });
      setDissolveText(worry.trim() || "…");
      setPhase("dissolve");
    },
    [worry]
  );

  const onDissolveComplete = useCallback(() => {
    setDissolveText(null);
    setPhase("voice");
  }, []);

  const goWindow = useCallback(() => {
    setOpenProgress(0);
    setPhase("window");
  }, []);

  const onWindowOpened = useCallback(() => {
    setOpenProgress(1);
    setPhase("morning");
  }, []);

  return (
    <div className={`app ${phase === "morning" ? "app--morning" : ""}`}>
      <div className="app__bg app__bg--night" aria-hidden />
      <div className="app__bg app__bg--morning" style={{ opacity: morningMix }} aria-hidden />

      <BougainvilleaVines bloom={bloom} className="app__vines" />

      <main className="app__main">
        {phase === "write" && (
          <form className="night-write" onSubmit={submitWorry}>
            <h1 className="night-write__title">
              <img src="/bu.png" alt="" className="night-write__logo" width={56} height={56} decoding="async" />
              <span className="night-write__title-text">Bougainvillea</span>
            </h1>
            <textarea
              id="worry-field"
              className="night-write__area"
              rows={5}
              placeholder="Let the dream easter eat my nightmare"
              value={worry}
              onChange={(e) => setWorry(e.target.value)}
              maxLength={400}
            />
            <button type="submit" className="night-write__submit">
              entrust
            </button>
          </form>
        )}

        {phase === "voice" && (
          <section className="voice-card" aria-labelledby="voice-line">
            <p id="voice-line" className="voice-card__line">
              不安は、生きているからだよ
            </p>
            <button
              type="button"
              className={`voice-card__play ${playing ? "voice-card__play--on" : ""}`}
              onClick={() => play()}
              aria-pressed={playing}
            >
              {playing ? "とめる" : "きく"}
            </button>
            {usedFallback && (
              <p className="voice-card__note">
                <code>public/audio/core.mp3</code> を置くと本番の声が鳴ります。
              </p>
            )}
            <button type="button" className="voice-card__next" onClick={goWindow}>
              窓を開ける
            </button>
          </section>
        )}

        {(phase === "window" || phase === "morning") && (
          <div className="window-stack">
            <SwipeWindow
              openProgress={phase === "morning" ? 1 : openProgress}
              onProgressChange={setOpenProgress}
              onOpened={onWindowOpened}
              disabled={phase === "morning"}
            />
          </div>
        )}
      </main>

      {dissolveText && (
        <TextDissolve
          text={dissolveText}
          originX={dissolveOrigin.x}
          originY={dissolveOrigin.y}
          onComplete={onDissolveComplete}
        />
      )}

      <MorningParticles visible={phase === "morning"} />
      <PetalRain active={phase === "morning"} />
      <VerticalBookmark visible={phase === "morning"} />
    </div>
  );
}
