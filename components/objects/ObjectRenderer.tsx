import { useId } from "react";
import type { ObjectArt } from "@/types/game";

export type SilhouetteVariant = "solid" | "ghost";

const GHOST_STROKE_PX = 1.5;
const GHOST_DASH_PX = 5;
const GHOST_GAP_PX = 4;

type ObjectRendererProps = {
  objectId: string;
  art: ObjectArt;
  variant: SilhouetteVariant;
  /** Rendered px per viewBox unit, so strokes stay the same width at every size. */
  pxPerUnit: number;
};

/**
 * Draws pipeline art from public/objects/<id>.svg. `#art` is the full render and
 * `#silhouette` the outer shape; both inherit fill and stroke through <use>.
 */
export function ObjectRenderer({ objectId, art, variant, pxPerUnit }: ObjectRendererProps) {
  const maskId = `ghost-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const src = `/objects/${objectId}.svg?v=${art.version}`;
  const unit = pxPerUnit > 0 ? 1 / pxPerUnit : 1;
  const { width, height } = art;
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
            <use
              href={`${src}#silhouette`}
              fill="none"
              stroke="white"
              strokeWidth={GHOST_STROKE_PX * 2 * unit}
              strokeDasharray={`${GHOST_DASH_PX * unit} ${GHOST_GAP_PX * unit}`}
              strokeLinejoin="round"
            />
            <use href={`${src}#silhouette`} fill="black" stroke="none" />
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
      <use href={`${src}#art`} fill="currentColor" />
    </svg>
  );
}
