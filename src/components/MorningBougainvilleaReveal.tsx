/** 朝：中央に紫寄りのブーゲンビリア写真を約20秒かけて淡く浮かび上がらせる（親に key を付けて再入場時にアニメをやり直す） */
export function MorningBougainvilleaReveal() {
  return (
    <div className="morning-bougainvillea-reveal" aria-hidden>
      <img
        src="/bu.png"
        alt=""
        className="morning-bougainvillea-reveal__img"
        width={680}
        height={680}
        decoding="async"
      />
    </div>
  );
}
