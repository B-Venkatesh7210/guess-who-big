import { useId } from "react";
import { getSilhouetteGeometry } from "@/data/silhouettes";
import { silhouetteArt } from "./silhouetteArt";

export type SilhouetteVariant = "solid" | "ghost";

const DETAIL_STROKE_PX = 1.75;
const GHOST_STROKE_PX = 1.5;
const GHOST_DASH_PX = 5;
const GHOST_GAP_PX = 4;

type ObjectRendererProps = {
  svgKey: string;
  variant: SilhouetteVariant;
  /** Rendered px per viewBox unit, so strokes stay the same width at every size. */
  pxPerUnit: number;
};

export function ObjectRenderer({ svgKey, variant, pxPerUnit }: ObjectRendererProps) {
  const geometry = getSilhouetteGeometry(svgKey);
  const art = silhouetteArt[svgKey];
  const maskId = `ghost-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  if (!art) return null;

  const unit = pxPerUnit > 0 ? 1 / pxPerUnit : 1;
  const { width, height } = geometry;
  const viewBox = `0 0 ${width} ${height}`;

  if (variant === "ghost") {
    const pad = Math.max(width, height) * 0.1;
    // The outer half of a doubled stroke survives the fill cutout, leaving only the union outline.
    return (
      <svg viewBox={viewBox} className="block h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={-pad}
            y={-pad}
            width={width + pad * 2}
            height={height + pad * 2}
          >
            <g
              fill="none"
              stroke="white"
              strokeWidth={GHOST_STROKE_PX * 2 * unit}
              strokeDasharray={`${GHOST_DASH_PX * unit} ${GHOST_GAP_PX * unit}`}
              strokeLinejoin="round"
            >
              {art.shapes}
            </g>
            <g fill="black" stroke="none">
              {art.shapes}
            </g>
          </mask>
        </defs>
        <rect
          x={-pad}
          y={-pad}
          width={width + pad * 2}
          height={height + pad * 2}
          fill="currentColor"
          mask={`url(#${maskId})`}
        />
      </svg>
    );
  }

  return (
    <svg viewBox={viewBox} className="block h-full w-full" aria-hidden="true">
      <g fill="currentColor">{art.shapes}</g>
      {art.details ? (
        <g
          fill="none"
          stroke="var(--surface)"
          strokeWidth={DETAIL_STROKE_PX * unit}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {art.details}
        </g>
      ) : null}
    </svg>
  );
}
