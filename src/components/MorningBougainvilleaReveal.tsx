/** 朝：ブーゲンビリア写真を全画面背景に、白オーバーレイ＋3秒フェードで表示 */
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
      <p className="morning-bougainvillea-reveal__caption">不安は生きている証拠</p>
    </div>
  );
}
