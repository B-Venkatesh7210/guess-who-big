type MarkerKind = "guess" | "actual";
type LabelPosition = "center" | "above" | "below";

const LABEL_TEXT: Record<MarkerKind, string> = {
  guess: "YOUR GUESS",
  actual: "ACTUAL",
};

/** Approximate rendered label widths at 10px Geist Mono with tracking. */
const LABEL_WIDTH_PX: Record<MarkerKind, number> = { guess: 80, actual: 50 };
const TICK_PX = 12;
const TICK_GAP_PX = 4;
const COLLISION_PX = 18;

type RevealMarkersProps = {
  columnWidth: number;
  guessPx: number;
  guessWidth: number;
  actualPx: number;
  actualWidth: number;
  showActual: boolean;
};

function fitsBeside(
  columnWidth: number,
  objectWidth: number,
  kind: MarkerKind,
): boolean {
  const room = columnWidth / 2 - objectWidth / 2;
  return room >= TICK_GAP_PX + TICK_PX + 6 + LABEL_WIDTH_PX[kind] + 8;
}

export function RevealMarkers({
  columnWidth,
  guessPx,
  guessWidth,
  actualPx,
  actualWidth,
  showActual,
}: RevealMarkersProps) {
  const widest = showActual ? Math.max(guessWidth, actualWidth) : guessWidth;
  const guessBeside = fitsBeside(columnWidth, widest, "guess");
  const actualBeside = fitsBeside(columnWidth, widest, "actual");

  let guessPosition: LabelPosition = guessBeside ? "center" : "above";
  let actualPosition: LabelPosition = actualBeside ? "center" : "above";

  if (showActual && Math.abs(guessPx - actualPx) < COLLISION_PX) {
    if (guessPx >= actualPx) {
      guessPosition = "above";
      actualPosition = "below";
    } else {
      actualPosition = "above";
      guessPosition = "below";
    }
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-30" aria-hidden="true">
      <Marker
        kind="guess"
        px={guessPx}
        objectWidth={guessWidth}
        columnEdgeWidth={widest}
        beside={guessBeside}
        position={guessPosition}
      />
      {showActual ? (
        <Marker
          kind="actual"
          px={actualPx}
          objectWidth={actualWidth}
          columnEdgeWidth={widest}
          beside={actualBeside}
          position={actualPosition}
        />
      ) : null}
    </div>
  );
}

function Marker({
  kind,
  px,
  objectWidth,
  columnEdgeWidth,
  beside,
  position,
}: {
  kind: MarkerKind;
  px: number;
  objectWidth: number;
  columnEdgeWidth: number;
  beside: boolean;
  position: LabelPosition;
}) {
  const colorClass = kind === "guess" ? "text-text-primary" : "text-target";
  const lineClass = kind === "guess" ? "border-dashed" : "border-solid";
  const shiftClass =
    position === "above"
      ? "-translate-y-[calc(100%+4px)]"
      : position === "below"
        ? "translate-y-1"
        : "-translate-y-1/2";
  const labelClass =
    "whitespace-nowrap font-mono text-[10px] leading-none tracking-[0.14em]";

  if (beside) {
    const lineWidth = (columnEdgeWidth - objectWidth) / 2 + TICK_PX;
    return (
      <div
        data-marker={kind}
        className={`marker-in absolute ${colorClass}`}
        style={{
          bottom: px,
          left: `calc(50% + ${objectWidth / 2 + TICK_GAP_PX}px)`,
        }}
      >
        <span
          className={`absolute left-0 top-0 border-t border-current ${lineClass}`}
          style={{ width: lineWidth }}
        />
        <span
          className={`absolute top-0 ${shiftClass} ${labelClass}`}
          style={{ left: lineWidth + 6 }}
        >
          {LABEL_TEXT[kind]}
        </span>
      </div>
    );
  }

  return (
    <div
      data-marker={kind}
      className={`marker-in absolute left-1/2 ${colorClass}`}
      style={{ bottom: px }}
    >
      <span
        className={`absolute left-1/2 top-0 -translate-x-1/2 rounded-[4px] bg-background px-1.5 py-1 ${shiftClass} ${labelClass}`}
      >
        {LABEL_TEXT[kind]}
      </span>
    </div>
  );
}
