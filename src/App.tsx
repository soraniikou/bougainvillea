import { useCallback, useEffect, useMemo, useState } from "react";
import { BougainvilleaVines } from "./components/BougainvilleaVines";
import { MorningBougainvilleaReveal } from "./components/MorningBougainvilleaReveal";
import { MorningParticles } from "./components/MorningParticles";
import { PetalRain } from "./components/PetalRain";
import { SunriseSequence } from "./components/SunriseSequence";
import { SwipeWindow } from "./components/SwipeWindow";
import { TextDissolve } from "./components/TextDissolve";
import { VerticalBookmark } from "./components/VerticalBookmark";
import { useVoice } from "./hooks/useVoice";
import "./App.css";

type Phase = "write" | "dissolve" | "voice" | "window" | "sunrise" | "morning";

const SUNRISE_MS = 45_000;

export default function App() {
  const [phase, setPhase] = useState<Phase>("write");
  const [worry, setWorry] = useState("");
  const [dissolveText, setDissolveText] = useState<string | null>(null);
  const [dissolveOrigin, setDissolveOrigin] = useState({ x: 0, y: 0 });
  const [openProgress, setOpenProgress] = useState(0);
  const [showSunrise, setShowSunrise] = useState(false);
  const [morningRevealKey, setMorningRevealKey] = useState(0);
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

  const completeSunriseToMorning = useCallback(() => {
    setShowSunrise(false);
    setMorningRevealKey((k) => k + 1);
    setPhase("morning");
  }, []);

  useEffect(() => {
    if (!showSunrise) return;
    const t = window.setTimeout(completeSunriseToMorning, SUNRISE_MS);
    return () => window.clearTimeout(t);
  }, [showSunrise, completeSunriseToMorning]);

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
    setPhase("sunrise");
    setShowSunrise(true);
  }, []);

  return (
    <div className={`app ${phase === "morning" ? "app--morning" : ""}`}>
      <div className="app__bg app__bg--night" aria-hidden />
      <div className="app__bg app__bg--morning" style={{ opacity: morningMix }} aria-hidden />

      {phase !== "morning" && phase !== "sunrise" && <BougainvilleaVines bloom={bloom} className="app__vines" />}

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
              {playing ? "stop" : "listen"}
            </button>
            {usedFallback && (
              <p className="voice-card__note">
                <code>public/audio/core.mp3</code> を置くと本番の声が鳴ります。
              </p>
            )}
            <button type="button" className="voice-card__next" onClick={goWindow}>
              open the window
            </button>
          </section>
        )}

        {phase === "window" && (
          <div className="window-stack">
            <SwipeWindow
              openProgress={openProgress}
              onProgressChange={setOpenProgress}
              onOpened={onWindowOpened}
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

      {showSunrise && <SunriseSequence onSkip={completeSunriseToMorning} />}
      {phase === "morning" && <MorningBougainvilleaReveal key={morningRevealKey} />}
      <MorningParticles visible={phase === "morning"} />
      <PetalRain active={phase === "morning"} />
      <VerticalBookmark visible={phase === "morning"} />
    </div>
  );
}
