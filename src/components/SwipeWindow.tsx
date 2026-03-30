import { useCallback, useRef } from "react";

const MAX_SHIFT = 132;
/** これ未満で離すと窓が閉じる。移動イベントが少ない端末向けに 0.94 より緩め。 */
const OPEN_THRESHOLD = 0.85;
const SNAP_BACK_BELOW = 0.85;

type Props = {
  openProgress: number;
  onProgressChange: (p: number) => void;
  onOpened: () => void;
  disabled?: boolean;
};

export function SwipeWindow({ openProgress, onProgressChange, onOpened, disabled }: Props) {
  const startX = useRef<number | null>(null);
  const lastProgress = useRef(0);
  const maxProgress = useRef(0);
  const openedEmitted = useRef(false);

  const emitOpened = useCallback(() => {
    if (openedEmitted.current) return;
    openedEmitted.current = true;
    onProgressChange(1);
    onOpened();
  }, [onOpened, onProgressChange]);

  const applyClientX = useCallback(
    (clientX: number) => {
      if (disabled || startX.current == null) return;
      const delta = Math.max(0, clientX - startX.current);
      const p = Math.min(1, delta / MAX_SHIFT);
      lastProgress.current = p;
      maxProgress.current = Math.max(maxProgress.current, p);
      onProgressChange(p);
      if (p >= OPEN_THRESHOLD) emitOpened();
    },
    [disabled, emitOpened, onProgressChange]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    openedEmitted.current = false;
    maxProgress.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startX.current = e.clientX;
  };

  /** dragging の state は使わない（初回 pointermove がレンダー前に落ちて無視されるのを防ぐ） */
  const onPointerMove = (e: React.PointerEvent) => {
    if (disabled || startX.current == null) return;
    applyClientX(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const lp = lastProgress.current;
    const peak = maxProgress.current;
    startX.current = null;
    if (peak >= OPEN_THRESHOLD || lp >= OPEN_THRESHOLD) {
      emitOpened();
    } else if (lp < SNAP_BACK_BELOW) {
      onProgressChange(0);
    }
    lastProgress.current = 0;
    maxProgress.current = 0;
  };

  const shift = openProgress * MAX_SHIFT;

  return (
    <div
      className={`swipe-window ${disabled ? "swipe-window--locked" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="swipe-window__frame">
        <div className="swipe-window__pane swipe-window__pane--left" />
        <div
          className="swipe-window__pane swipe-window__pane--right"
          style={{ transform: `translateX(${shift}px)` }}
        />
        <div className="swipe-window__mullion" />
      </div>
      {!disabled && <p className="swipe-window__hint">窓を右へそっとスワイプ</p>}
    </div>
  );
}
