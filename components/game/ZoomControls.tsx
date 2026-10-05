import { formatZoom } from "@/lib/game/format";
import { StepButton } from "@/components/ui/Buttons";

type ZoomControlsProps = {
  zoom: number;
  disabled: boolean;
  minZoom: number;
  maxZoom: number;
  onStep: (direction: -1 | 1) => void;
  onReset: () => void;
};

export function ZoomControls({
  zoom,
  disabled,
  minZoom,
  maxZoom,
  onStep,
  onReset,
}: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Viewport zoom">
      <StepButton
        aria-label="Zoom out"
        disabled={disabled || zoom <= minZoom + 0.001}
        onClick={() => onStep(-1)}
      >
        −
      </StepButton>
      <button
        type="button"
        aria-label={`Reset zoom, currently ${formatZoom(zoom)}`}
        disabled={disabled}
        onClick={onReset}
        className="inline-flex h-11 min-w-14 items-center justify-center rounded-[8px] border border-border-subtle px-2 font-mono text-xs tracking-[0.08em] text-text-secondary transition-colors duration-150 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-reference"
      >
        {formatZoom(zoom)}
      </button>
      <StepButton
        aria-label="Zoom in"
        disabled={disabled || zoom >= maxZoom - 0.001}
        onClick={() => onStep(1)}
      >
        +
      </StepButton>
    </div>
  );
}
