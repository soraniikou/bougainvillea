import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MorningBougainvilleaReveal } from "./components/MorningBougainvilleaReveal";
import { MorningParticles } from "./components/MorningParticles";
import { PetalRain } from "./components/PetalRain";
import { SunriseSequence } from "./components/SunriseSequence";
import { SwipeWindow } from "./components/SwipeWindow";
import { TextDissolve } from "./components/TextDissolve";
import { useVoice } from "./hooks/useVoice";
import "./App.css";

type Phase = "write" | "dissolve" | "voice" | "window" | "voice-select" | "sunrise" | "morning";

const SUNRISE_MS = 45_000;
const WINDOW_EXIT_MS = 300;

const EMOTION_BUTTONS = [
  { file: "fuan",     label: "不安がある" },
  { file: "iya",      label: "イヤな事あったら" },
  { file: "kibun",    label: "気分を聴いて" },
  { file: "mederu",   label: "愛でたい" },
  { file: "nigate",   label: "苦手がある" },
  { file: "wasurete", label: "忘れたい" },
  { file: "dream",    label: "夢がある" },
] as const;

export default function App() {
  const [phase, setPhase] = useState<Phase>("write");
  const [worry, setWorry] = useState("");
  const [dissolveText, setDissolveText] = useState<string | null>(null);
  const [dissolveOrigin, setDissolveOrigin] = useState({ x: 0, y: 0 });
  const [openProgress, setOpenProgress] = useState(0);
  const [showSunrise, setShowSunrise] = useState(false);
  const [sunriseWithVoice, setSunriseWithVoice] = useState(false);
  const [windowClosing, setWindowClosing] = useState(false);
  const [morningRevealKey, setMorningRevealKey] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const windowExitTimerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { play, playing, usedFallback } = useVoice();

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

  useEffect(() => {
    return () => {
      if (windowExitTimerRef.current != null) {
        window.clearTimeout(windowExitTimerRef.current);
      }
    };
  }, []);

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
　const goWindow = useCallback(() => {
    if (windowExitTimerRef.current != null) {
      window.clearTimeout(windowExitTimerRef.current);
      windowExitTimerRef.current = null;
    }
    setOpenProgress(0);
    setWindowClosing(false);
    setSunriseWithVoice(false);
    setPhase("window");
  }, []);

  const onDissolveComplete = useCallback(() => {
    setDissolveText(null);
    goWindow();
  }, [goWindow]);

  const onWindowOpened = useCallback(() => {
    setOpenProgress(1);
    setWindowClosing(true);
    if (windowExitTimerRef.current != null) {
      window.clearTimeout(windowExitTimerRef.current);
    }
    windowExitTimerRef.current = window.setTimeout(() => {
      windowExitTimerRef.current = null;
      setPhase("voice-select");
      setWindowClosing(false);
    }, WINDOW_EXIT_MS);
  }, []);

  const chooseEmotion = useCallback((file: string) => {
    setSelectedEmotion(file);
    // 音声を再生
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(`/audio/${file}.wav`);
    audioRef.current = audio;
    audio.play().catch(() => {});
    // 音声終了後 or 3秒後にsunriseへ
    const go = () => {
      setSunriseWithVoice(true);
      setPhase("sunrise");
      setShowSunrise(true);
    };
    audio.addEventListener("ended", go, { once: true });
    window.setTimeout(go, 8_000); // 最大8秒待つ
  }, []);

  return (
    <div className={`app ${phase === "morning" ? "app--morning" : ""}`}>
      <div className="app__bg app__bg--night" aria-hidden />
      <div className="app__bg app__bg--morning" style={{ opacity: morningMix }} aria-hidden />

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
              placeholder="不安なことを書いて"
              value={worry}
              onChange={(e) => setWorry(e.target.value)}
              maxLength={400}
            />
            <button type="submit" className="night-write__submit">
              預ける
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
          <div className={`window-phase-exit-wrap ${windowClosing ? "window-phase-exit-wrap--out" : ""}`}>
            <div className="window-stack">
              <SwipeWindow
                openProgress={openProgress}
                onProgressChange={setOpenProgress}
                onOpened={onWindowOpened}
              />
            </div>
          </div>
        )}
      </main>

      {phase === "voice-select" && (
        <div className="voice-select-screen" role="dialog" aria-labelledby="voice-select-heading">
          <h2 id="voice-select-heading" className="voice-select-screen__heading">
            今の気持ちに近いものを
          </h2>
          <div className="voice-select-screen__grid">
            {EMOTION_BUTTONS.map(({ file, label }) => (
              <button
                key={file}
                type="button"
                className={`voice-select-screen__btn ${selectedEmotion === file ? "voice-select-screen__btn--selected" : ""}`}
                onClick={() => chooseEmotion(file)}
                disabled={selectedEmotion !== null}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {dissolveText && (
        <TextDissolve
          text={dissolveText}
          originX={dissolveOrigin.x}
          originY={dissolveOrigin.y}
          onComplete={onDissolveComplete}
        />
      )}

      {showSunrise && (
        <div className="sunrise-sequence-fade">
          <SunriseSequence onSkip={completeSunriseToMorning} withVoice={sunriseWithVoice} />
        </div>
      )}
      {phase === "morning" && (
  <>
    <MorningBougainvilleaReveal key={morningRevealKey} />
    <div className="morning-back-buttons">
      <button
        type="button"
        className="morning-back-btn"
        onClick={() => {
          setPhase("voice-select");
          setShowSunrise(false);
          setSelectedEmotion(null);
        }}
      >
        また選ぶ
      </button>
      <button
        type="button"
        className="morning-back-btn"
        onClick={() => {
          setPhase("write");
          setWorry("");
          setSelectedEmotion(null);
          setShowSunrise(false);
        }}
      >
        最初から
      </button>
    </div>
  </>
)}
      <MorningParticles visible={phase === "morning"} />
      <PetalRain active={phase === "morning"} />
    </div>
  );
}
