import { ObjectRenderer } from "@/components/objects/ObjectRenderer";
import { getSilhouetteGeometry } from "@/data/silhouettes";
import { silhouetteBox } from "@/lib/scale/stageLayout";

const REVEAL_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

type ScaleObjectProps = {
  svgKey: string;
  /** Rendered px of the object's measured dimension, from the scale engine. */
  measuredPx: number;
  tone: "reference" | "target";
  variant?: "solid" | "ghost";
  animate?: boolean;
  label: string;
};

export function ScaleObject({
  svgKey,
  measuredPx,
  tone,
  variant = "solid",
  animate = false,
  label,
}: ScaleObjectProps) {
  const box = silhouetteBox(getSilhouetteGeometry(svgKey), measuredPx);
  const color =
    variant === "ghost"
      ? "var(--text-primary)"
      : tone === "reference"
        ? "var(--reference)"
        : "var(--target)";

  return (
    <div
      className="relative shrink-0"
      style={{
        height: box.height,
        width: box.width,
        color,
        opacity: variant === "ghost" ? 0.85 : 1,
        transition: animate
          ? `height 600ms ${REVEAL_EASE}, width 600ms ${REVEAL_EASE}`
          : "none",
      }}
    >
      {variant === "solid" ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-1 left-1/2 h-1.5 w-[68%] -translate-x-1/2 rounded-[8px] opacity-30 blur-[5px]"
          style={{ background: "currentColor" }}
        />
      ) : null}
      <ObjectRenderer svgKey={svgKey} variant={variant} pxPerUnit={box.pxPerUnit} />
      {label ? <span className="sr-only">{label}</span> : null}
    </div>
  );
}
