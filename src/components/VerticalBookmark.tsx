type Props = { visible: boolean };

export function VerticalBookmark({ visible }: Props) {
  return (
    <div className={`vertical-bookmark ${visible ? "vertical-bookmark--on" : ""}`} aria-hidden>
      <span className="vertical-bookmark__text">だいじょうぶだよ</span>
    </div>
  );
}
