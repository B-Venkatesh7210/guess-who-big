import type { PointerEvent, RefObject } from "react";
import { measurementLabel } from "@/data/objects";
import { formatCentimeters } from "@/lib/game/format";
import type { GamePhase, ScaleObjectDefinition } from "@/types/game";
import { MeasurementGrid } from "./MeasurementGrid";
import { ResizeHandle } from "./ResizeHandle";
import { ScaleObject } from "./ScaleObject";
import { useRevealMotion } from "./useRevealMotion";
import { ZoomControls } from "./ZoomControls";

type GameStageProps = {
  stageRef: RefObject<HTMLDivElement | null>;
  phase: GamePhase;
  reducedMotion: boolean;
  dragging: boolean;
  reference: ScaleObjectDefinition;
  target: ScaleObjectDefinition;
  referenceRenderedPx: number;
  guessRenderedPx: number;
  correctRenderedPx: number;
  lockedRenderedPx: number | null;
  fieldHeight: number;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  controlsEnabled: boolean;
  onZoomStep: (direction: -1 | 1) => void;
  onZoomReset: () => void;
  onResizePointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onResizePointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  onResizePointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
};

export function GameStage({
  stageRef,
  phase,
  reducedMotion,
  dragging,
  reference,
  target,
  referenceRenderedPx,
  guessRenderedPx,
  correctRenderedPx,
  lockedRenderedPx,
  fieldHeight,
  zoom,
  minZoom,
  maxZoom,
  controlsEnabled,
  onZoomStep,
  onZoomReset,
  onResizePointerDown,
  onResizePointerMove,
  onResizePointerUp,
}: GameStageProps) {
  const { showCorrectSize, animateSize } = useRevealMotion(phase, reducedMotion);
  const solidPx = showCorrectSize ? correctRenderedPx : guessRenderedPx;
  const showGhost =
    (phase === "revealing" || phase === "result") && lockedRenderedPx != null;
  const showActualMeasurement = phase === "result";
  const ready = referenceRenderedPx > 0;

  return (
    <section
      ref={stageRef}
      data-phase={phase}
      className={`overflow-hidden rounded-[16px] border border-border-subtle bg-surface ${dragging ? "select-none" : ""}`}
      aria-label="Scale comparison"
    >
      <div className="flex justify-end px-3 pt-3">
        <ZoomControls
          zoom={zoom}
          disabled={!controlsEnabled}
          minZoom={minZoom}
          maxZoom={maxZoom}
          onStep={onZoomStep}
          onReset={onZoomReset}
        />
      </div>

      <div className="relative mt-3" style={{ height: fieldHeight }}>
        <MeasurementGrid />
        <div className="absolute inset-0 flex">
          <div className="relative flex h-full w-1/2 items-end justify-center">
            {ready ? (
              <div data-object="reference" className="relative z-10">
                <ScaleObject
                  svgKey={reference.svgKey}
                  renderedPx={referenceRenderedPx}
                  tone="reference"
                  label={`${reference.name}, reference`}
                />
              </div>
            ) : null}
          </div>

          <div className="relative flex h-full w-1/2 items-end justify-center">
            {ready ? (
              <>
                {showGhost ? (
                  <div
                    data-object="ghost"
                    className="pointer-events-none absolute bottom-0 left-1/2 z-20 -translate-x-1/2"
                  >
                    <ScaleObject
                      svgKey={target.svgKey}
                      renderedPx={lockedRenderedPx}
                      tone="target"
                      variant="ghost"
                      label=""
                    />
                  </div>
                ) : null}
                <div data-object="target" className="relative z-10">
                  <ScaleObject
                    svgKey={target.svgKey}
                    renderedPx={solidPx}
                    tone="target"
                    animate={animateSize}
                    label={`${target.name}, your object`}
                  />
                  {controlsEnabled ? (
                    <ResizeHandle
                      onPointerDown={onResizePointerDown}
                      onPointerMove={onResizePointerMove}
                      onPointerUp={onResizePointerUp}
                      onPointerCancel={onResizePointerUp}
                    />
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-3 py-4">
        <ObjectCaption
          kicker="REFERENCE"
          kickerClassName="text-reference"
          name={reference.name}
          detail={`${measurementLabel(reference.measurementType)} · ${formatCentimeters(reference.realSizeCm)}`}
        />
        <ObjectCaption
          kicker="YOUR OBJECT"
          kickerClassName="text-target"
          name={target.name}
          detail={
            showActualMeasurement
              ? `${measurementLabel(target.measurementType)} · ${formatCentimeters(target.realSizeCm)}`
              : measurementLabel(target.measurementType)
          }
        />
      </div>
    </section>
  );
}

function ObjectCaption({
  kicker,
  kickerClassName,
  name,
  detail,
}: {
  kicker: string;
  kickerClassName: string;
  name: string;
  detail: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1 text-center">
      <span className={`font-mono text-[11px] tracking-[0.16em] ${kickerClassName}`}>
        {kicker}
      </span>
      <span className="text-base font-medium text-text-primary">{name}</span>
      <span className="font-mono text-xs text-text-secondary">{detail}</span>
    </div>
  );
}
