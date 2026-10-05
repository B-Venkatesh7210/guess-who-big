import type { ReactNode } from "react";

export interface SilhouetteArt {
  /** Filled shapes. Their union is the silhouette. Must not set fill or stroke. */
  shapes: ReactNode;
  /** Thin interior lines drawn in the surface color on the solid variant. */
  details?: ReactNode;
}

/** Drawn in the viewBox units declared in data/silhouettes.ts. */
export const silhouetteArt: Record<string, SilhouetteArt> = {
  "golf-ball": {
    shapes: <circle cx="50" cy="50" r="50" />,
    details: (
      <>
        <circle cx="34" cy="30" r="4" />
        <circle cx="56" cy="24" r="4" />
        <circle cx="72" cy="40" r="4" />
        <circle cx="44" cy="50" r="4" />
        <circle cx="64" cy="62" r="4" />
        <circle cx="32" cy="68" r="4" />
        <circle cx="52" cy="78" r="4" />
      </>
    ),
  },
  battery: {
    shapes: (
      <>
        <rect x="0" y="6" width="29" height="94" rx="3" />
        <rect x="9.5" y="0" width="10" height="8" rx="1.5" />
      </>
    ),
    details: <path d="M3 30 H26" />,
  },
  "tennis-ball": {
    shapes: <circle cx="50" cy="50" r="50" />,
    details: (
      <>
        <path d="M14 16 C40 36 40 64 14 84" />
        <path d="M86 16 C60 36 60 64 86 84" />
      </>
    ),
  },
  mug: {
    shapes: (
      <>
        <path d="M0 0 H80 V83 Q80 95 68 95 H12 Q0 95 0 83 Z" />
        <path
          fillRule="evenodd"
          d="M76 20 H92 Q108 20 108 40 V55 Q108 75 92 75 H76 Z M80 32 V63 H90 Q96 63 96 53 V42 Q96 32 90 32 Z"
        />
      </>
    ),
    details: <path d="M6 9 H74" />,
  },
  "soda-can": {
    shapes: (
      <>
        <path d="M0 8 H66 V110 Q66 122 33 122 Q0 122 0 110 Z" />
        <ellipse cx="33" cy="8" rx="33" ry="8" />
      </>
    ),
    details: (
      <>
        <ellipse cx="33" cy="8" rx="22" ry="4.2" />
        <path d="M28 7.2 h4.2 v-3.4 h2.4 v3.4 H39" />
        <path d="M6 22 H60" />
      </>
    ),
  },
  smartphone: {
    shapes: <rect x="0" y="0" width="72" height="147" rx="10" />,
    details: (
      <>
        <rect x="5" y="5" width="62" height="137" rx="6" />
        <circle cx="36" cy="11" r="2" />
      </>
    ),
  },
  pencil: {
    shapes: (
      <>
        <path d="M4 0 L8 28 V178 H0 V28 Z" />
        <rect x="0" y="176" width="8" height="14" rx="1.5" />
      </>
    ),
    details: (
      <>
        <path d="M0 28 H8" />
        <path d="M0 176 H8" />
      </>
    ),
  },
  basketball: {
    shapes: <circle cx="50" cy="50" r="50" />,
    details: (
      <>
        <path d="M50 4 V96" />
        <path d="M6 50 H94" />
        <path d="M18 22 C36 34 64 34 82 22" />
        <path d="M18 78 C36 66 64 66 82 78" />
      </>
    ),
  },
  cat: {
    shapes: (
      <>
        <ellipse cx="80" cy="54" rx="50" ry="24" />
        <rect x="38" y="58" width="10" height="62" rx="4" />
        <rect x="52" y="58" width="10" height="62" rx="4" />
        <rect x="100" y="58" width="10" height="62" rx="4" />
        <rect x="114" y="58" width="10" height="62" rx="4" />
        <circle cx="130" cy="32" r="18" />
        <path d="M115 24 L118 2 L130 15 Z" />
        <path d="M131 14 L144 2 L146 24 Z" />
        <path d="M32 52 C10 50 4 30 10 12 C12 7 19 8 18 14 C13 28 18 40 34 42 Z" />
      </>
    ),
    details: <circle cx="137" cy="30" r="2" />,
  },
  "wine-bottle": {
    shapes: (
      <path d="M26 0 H50 V95 C50 120 76 125 76 160 V292 Q76 300 68 300 H8 Q0 300 0 292 V160 C0 125 26 120 26 95 Z" />
    ),
    details: (
      <>
        <rect x="8" y="185" width="60" height="70" rx="2" />
        <path d="M26 22 H50" />
      </>
    ),
  },
  "traffic-cone": {
    shapes: (
      <>
        <path d="M15.5 0 H22.5 L33 66 H5 Z" />
        <rect x="0" y="65" width="38" height="6" rx="1" />
      </>
    ),
    details: (
      <>
        <path d="M11.5 24 H26.5" />
        <path d="M9 40 H29" />
      </>
    ),
  },
  guitar: {
    shapes: (
      <>
        <path d="M15 0 H25 L24 10 H16 Z" />
        <rect x="17" y="8" width="6" height="40" />
        <circle cx="20" cy="58" r="15" />
        <circle cx="20" cy="82" r="20" />
      </>
    ),
    details: (
      <>
        <circle cx="20" cy="66" r="5" />
        <path d="M14 88 H26" />
      </>
    ),
  },
  horse: {
    shapes: (
      <>
        <ellipse cx="120" cy="96" rx="76" ry="36" />
        <rect x="60" y="110" width="14" height="110" rx="5" />
        <rect x="80" y="110" width="14" height="110" rx="5" />
        <rect x="156" y="110" width="14" height="110" rx="5" />
        <rect x="176" y="110" width="14" height="110" rx="5" />
        <path d="M168 80 L198 20 L222 26 L198 104 Z" />
        <path d="M196 12 L234 38 Q242 46 234 53 L224 57 L190 34 Z" />
        <path d="M198 16 L201 2 L210 15 Z" />
        <path d="M48 82 C30 92 26 122 30 152 L39 152 C38 124 44 102 56 94 Z" />
      </>
    ),
    details: <circle cx="214" cy="34" r="2.5" />,
  },
  adult: {
    shapes: (
      <>
        <circle cx="26" cy="12" r="12" />
        <rect x="21" y="20" width="10" height="10" />
        <path d="M9 34 Q9 27 16 27 H36 Q43 27 43 34 V96 H9 Z" />
        <rect x="0" y="30" width="8" height="64" rx="4" />
        <rect x="44" y="30" width="8" height="64" rx="4" />
        <rect x="10" y="90" width="14" height="80" rx="4" />
        <rect x="28" y="90" width="14" height="80" rx="4" />
      </>
    ),
  },
  fridge: {
    shapes: <rect x="0" y="0" width="70" height="178" rx="4" />,
    details: (
      <>
        <path d="M0 64 H70" />
        <path d="M9 28 V50" />
        <path d="M9 76 V112" />
      </>
    ),
  },
  door: {
    shapes: (
      <>
        <path d="M0 0 H92 V208 H87 V5 H5 V208 H0 Z" />
        <rect x="8" y="5" width="76" height="203" />
      </>
    ),
    details: (
      <>
        <rect x="16" y="20" width="52" height="72" />
        <rect x="16" y="116" width="52" height="78" />
        <circle cx="76" cy="108" r="2.5" />
      </>
    ),
  },
  elephant: {
    shapes: (
      <>
        <ellipse cx="240" cy="122" rx="150" ry="92" />
        <rect x="120" y="170" width="52" height="160" rx="12" />
        <rect x="186" y="170" width="52" height="160" rx="12" />
        <rect x="292" y="170" width="52" height="160" rx="12" />
        <rect x="352" y="170" width="52" height="160" rx="12" />
        <circle cx="388" cy="112" r="64" />
        <path d="M430 122 C468 156 470 226 462 330 L444 330 C450 236 444 176 412 152 Z" />
        <path d="M92 110 C80 132 80 162 84 196 L92 196 C90 164 92 138 100 122 Z" />
      </>
    ),
    details: (
      <>
        <path d="M352 62 C330 74 326 150 350 176 C378 182 392 150 388 112 C386 82 370 62 352 62 Z" />
        <path d="M426 150 C440 174 458 178 472 170" />
        <circle cx="414" cy="98" r="3" />
      </>
    ),
  },
  car: {
    shapes: (
      <>
        <path d="M2 82 Q4 60 30 56 L120 50 L165 14 Q172 8 185 8 H300 Q315 8 325 18 L360 52 L420 58 Q446 62 448 82 V108 Q448 116 440 116 H10 Q2 116 2 108 Z" />
        <circle cx="95" cy="115" r="30" />
        <circle cx="355" cy="115" r="30" />
      </>
    ),
    details: (
      <>
        <path d="M134 52 L172 20 H245 V52 Z" />
        <path d="M258 52 V20 H305 L338 52 Z" />
        <circle cx="95" cy="115" r="10" />
        <circle cx="355" cy="115" r="10" />
      </>
    ),
  },
  giraffe: {
    shapes: (
      <>
        <ellipse cx="140" cy="262" rx="86" ry="46" />
        <rect x="70" y="280" width="15" height="220" rx="5" />
        <rect x="92" y="280" width="15" height="220" rx="5" />
        <rect x="180" y="280" width="15" height="220" rx="5" />
        <rect x="202" y="280" width="15" height="220" rx="5" />
        <path d="M178 250 L214 58 L246 64 L224 270 Z" />
        <path d="M208 38 L264 62 Q274 70 264 78 L252 81 L203 64 Z" />
        <rect x="214" y="0" width="6" height="40" rx="3" />
        <rect x="226" y="4" width="6" height="38" rx="3" />
        <path d="M58 250 C48 282 46 322 50 352 L57 352 C55 322 57 286 67 262 Z" />
      </>
    ),
    details: <circle cx="242" cy="60" r="3" />,
  },
  bus: {
    shapes: (
      <>
        <rect x="0" y="0" width="1200" height="252" rx="24" />
        <circle cx="230" cy="250" r="50" />
        <circle cx="960" cy="250" r="50" />
      </>
    ),
    details: (
      <>
        <rect x="40" y="36" width="1120" height="88" rx="8" />
        <path d="M190 36 V124 M340 36 V124 M490 36 V124 M640 36 V124 M790 36 V124 M940 36 V124 M1090 36 V124" />
        <circle cx="230" cy="250" r="18" />
        <circle cx="960" cy="250" r="18" />
      </>
    ),
  },
  whale: {
    shapes: (
      <path d="M0 300 C0 170 250 110 650 110 C1150 110 1650 190 2050 255 L2170 270 C2230 210 2300 170 2400 140 C2340 230 2320 260 2320 290 C2320 320 2340 350 2400 420 C2300 400 2230 360 2170 320 L2050 335 C1650 390 1150 420 650 420 C250 420 0 400 0 300 Z" />
    ),
    details: (
      <>
        <path d="M40 300 C200 332 420 334 600 318" />
        <circle cx="520" cy="270" r="9" />
      </>
    ),
  },
  airliner: {
    shapes: (
      <>
        <path d="M0 890 C0 760 180 700 420 700 H3350 L3950 740 V800 L3600 1000 Q3560 1040 3480 1040 H420 C180 1040 0 1000 0 890 Z" />
        <path d="M3300 720 L3650 60 H3850 L3800 760 Z" />
        <ellipse cx="1750" cy="1090" rx="230" ry="95" />
        <rect x="480" y="1020" width="30" height="140" />
        <rect x="1930" y="1020" width="40" height="130" />
        <circle cx="495" cy="1200" r="55" />
        <circle cx="1895" cy="1200" r="55" />
        <circle cx="2005" cy="1200" r="55" />
      </>
    ),
    details: (
      <>
        <path d="M170 800 L300 776" />
        <path d="M520 840 H3150" />
        <path d="M1400 960 L2500 930" />
      </>
    ),
  },
};
