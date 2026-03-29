type Props = {
  /** 0 = night shadow, 1 = morning bloom */
  bloom: number;
  className?: string;
};

export function BougainvilleaVines({ bloom, className }: Props) {
  const shadow = 0.28 + bloom * 0.72;
  const pink = bloom;
  const fillMain = `color-mix(in srgb, var(--bougainvillea-deep) ${pink * 100}%, rgba(20, 28, 48, ${shadow}) ${(1 - pink) * 100}%)`;
  const fillSoft = `color-mix(in srgb, var(--bougainvillea) ${pink * 100}%, rgba(30, 40, 62, ${shadow * 0.85}) ${(1 - pink) * 100}%)`;

  return (
    <svg
      className={className}
      viewBox="0 0 320 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M160 400 C 120 360 100 300 110 240 C 95 200 85 150 100 110 C 115 70 145 40 160 20"
        stroke={fillMain}
        strokeWidth="3"
        strokeLinecap="round"
        opacity={0.35 + bloom * 0.45}
      />
      <path
        d="M165 395 C 200 340 215 280 205 220 C 225 175 230 120 210 85 C 195 55 175 35 165 25"
        stroke={fillSoft}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity={0.3 + bloom * 0.5}
      />
      <path
        d="M90 320 Q 70 260 95 200 Q 75 150 105 100"
        stroke={fillMain}
        strokeWidth="2"
        strokeLinecap="round"
        opacity={0.25 + bloom * 0.45}
      />
      <path
        d="M230 310 Q 255 250 228 195 Q 248 140 218 95"
        stroke={fillSoft}
        strokeWidth="2"
        strokeLinecap="round"
        opacity={0.22 + bloom * 0.48}
      />
      <ellipse cx="118" cy="168" rx="14" ry="10" fill={fillSoft} opacity={0.2 + bloom * 0.65} transform="rotate(-28 118 168)" />
      <ellipse cx="205" cy="152" rx="16" ry="11" fill={fillMain} opacity={0.18 + bloom * 0.7} transform="rotate(22 205 152)" />
      <ellipse cx="152" cy="98" rx="13" ry="9" fill={fillSoft} opacity={0.15 + bloom * 0.72} transform="rotate(-8 152 98)" />
      <ellipse cx="175" cy="210" rx="12" ry="8" fill={fillMain} opacity={0.12 + bloom * 0.68} transform="rotate(35 175 210)" />
      <ellipse cx="95" cy="245" rx="11" ry="7" fill={fillSoft} opacity={0.1 + bloom * 0.6} transform="rotate(-40 95 245)" />
    </svg>
  );
}
