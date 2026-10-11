import type { PointerEvent, Ref } from "react";
import { measurementLabel } from "@/data/objects";
import { formatLength } from "@/lib/game/format";
import { silhouetteBox, type StageLayout } from "@/lib/scale/stageLayout";
import type { GamePhase, ScaleObjectDefinition } from "@/types/game";
import { MeasurementGrid } from "./MeasurementGrid";
import { ResizeHandle } from "./ResizeHandle";
import { RevealMarkers } from "./RevealMarkers";
import { ScaleObject } from "./ScaleObject";
import { useRevealMotion } from "./useRevealMotion";
import { ZoomControls } from "./ZoomControls";

type GameStageProps = {
  stageRef: Ref<HTMLElement>;
  roundKey: string;
  phase: GamePhase;
  reducedMotion: boolean;
  dragging: boolean;
  reference: ScaleObjectDefinition;
  target: ScaleObjectDefinition;
  layout: StageLayout;
  referenceRenderedPx: number;
  guessRenderedPx: number;
  correctRenderedPx: number;
  lockedRenderedPx: number | null;
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
  roundKey,
  phase,
  reducedMotion,
  dragging,
  reference,
  target,
  layout,
  referenceRenderedPx,
  guessRenderedPx,
  correctRenderedPx,
  lockedRenderedPx,
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
  const ghostBox = lockedRenderedPx != null ? silhouetteBox(target.art, lockedRenderedPx) : null;
  const actualBox = silhouetteBox(target.art, correctRenderedPx);

  const slotStyle = (width: number) => ({ width, flex: "none" as const });

  return (
    <section
      ref={stageRef}
      tabIndex={-1}
      data-phase={phase}
      className={`overflow-hidden rounded-[16px] border border-border-subtle bg-surface outline-none ${dragging ? "select-none" : ""}`}
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

      <div className="relative mt-3" style={{ height: layout.fieldHeight }}>
        <MeasurementGrid />
        <div
          className="absolute inset-0 flex justify-evenly"
          style={{ paddingInline: layout.sidePadding }}
        >
          <div
            className="relative flex h-full items-end justify-center"
            style={slotStyle(layout.referenceSlotWidth)}
          >
            {ready ? (
              <div data-object="reference" className="relative z-10">
                <ScaleObject
                  object={reference}
                  measuredPx={referenceRenderedPx}
                  tone="reference"
                  label={`${reference.name}, reference`}
                />
              </div>
            ) : null}
          </div>

          <div
            className="relative flex h-full items-end justify-center"
            style={slotStyle(layout.targetSlotWidth)}
          >
            {ready ? (
              <>
                {showGhost && lockedRenderedPx != null ? (
                  <div
                    data-object="ghost"
                    className="pointer-events-none absolute bottom-0 left-1/2 z-20 -translate-x-1/2"
                  >
                    <ScaleObject
                      key={roundKey}
                      object={target}
                      measuredPx={lockedRenderedPx}
                      tone="target"
                      variant="ghost"
                      label=""
                    />
                  </div>
                ) : null}
                <div data-object="target" className="relative z-10">
                  <ScaleObject
                    object={target}
                    measuredPx={solidPx}
                    tone="target"
                    animate={animateSize}
                    label={`${target.name}, your object`}
                  />
                  {controlsEnabled ? (
                    <ResizeHandle
                      label={`Drag up or down to resize the ${target.name.toLowerCase()}`}
                      onPointerDown={onResizePointerDown}
                      onPointerMove={onResizePointerMove}
                      onPointerUp={onResizePointerUp}
                      onPointerCancel={onResizePointerUp}
                    />
                  ) : null}
                </div>
                {showGhost && ghostBox ? (
                  <RevealMarkers
                    sideRoom={layout.targetSideRoom}
                    guessPx={ghostBox.height}
                    guessWidth={ghostBox.width}
                    actualPx={actualBox.height}
                    actualWidth={actualBox.width}
                    showActual={showActualMeasurement}
                  />
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className="flex justify-evenly gap-3 py-4"
        style={{ paddingInline: layout.sidePadding }}
      >
        <div style={slotStyle(layout.referenceSlotWidth)} className="min-w-0">
          <ObjectCaption
            kicker="REFERENCE"
            kickerClassName="text-reference"
            name={reference.name}
            detail={`${measurementLabel(reference.measurementType)} · ${formatLength(reference.realSizeCm)}`}
          />
        </div>
        <div style={slotStyle(layout.targetSlotWidth)} className="min-w-0">
          <ObjectCaption
            kicker="YOUR OBJECT"
            kickerClassName="text-target"
            name={target.name}
            detail={
              showActualMeasurement
                ? `${measurementLabel(target.measurementType)} · ${formatLength(target.realSizeCm)}`
                : measurementLabel(target.measurementType)
            }
          />
        </div>
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
      <span className="text-base font-medium leading-5 text-text-primary">{name}</span>
      <span className="font-mono text-xs text-text-secondary">{detail}</span>
    </div>
  );
}
