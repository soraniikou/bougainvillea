type Props = { visible: boolean };

export function VerticalBookmark({ visible }: Props) {
  return (
    <div className={`comfort-line ${visible ? "comfort-line--on" : ""}`} aria-hidden>
      <span className="comfort-line__text">だいじょうぶだよ</span>
    </div>
  );
}
