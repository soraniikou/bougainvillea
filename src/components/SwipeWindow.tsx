import { useCallback, useRef, useState } from "react";

const MAX_SHIFT = 132;

type Props = {
  openProgress: number;
  onProgressChange: (p: number) => void;
  onOpened: () => void;
  disabled?: boolean;
};

export function SwipeWindow({ openProgress, onProgressChange, onOpened, disabled }: Props) {
  const startX = useRef<number | null>(null);
  const lastProgress = useRef(0);
  const openedEmitted = useRef(false);
  const [dragging, setDragging] = useState(false);

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
      onProgressChange(p);
      if (p >= 0.94) emitOpened();
    },
    [disabled, emitOpened, onProgressChange]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    openedEmitted.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    startX.current = e.clientX;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || disabled) return;
    applyClientX(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const lp = lastProgress.current;
    setDragging(false);
    startX.current = null;
    if (lp >= 0.94) {
      emitOpened();
    } else if (lp < 0.85) {
      onProgressChange(0);
    }
    lastProgress.current = 0;
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
