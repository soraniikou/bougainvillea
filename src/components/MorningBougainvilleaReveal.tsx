/** 朝：/bu.png 全画面＋白オーバーレイ、中央に2行のメッセージ */
export function MorningBougainvilleaReveal() {
  return (
    <div className="morning-bougainvillea-reveal">
      <img
        src="/bu.png"
        alt=""
        className="morning-bougainvillea-reveal__img"
        decoding="async"
      />
      <div className="morning-bougainvillea-reveal__overlay" aria-hidden />
      <div className="morning-bougainvillea-reveal__captions">
        <p className="morning-bougainvillea-reveal__line1">だいじょうぶだよ</p>
        <p className="morning-bougainvillea-reveal__line2">不安があるのは、生きている証拠</p>
      </div>
    </div>
  );
}
