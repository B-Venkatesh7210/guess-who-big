import { formatScaleRatio } from "@/lib/game/format";
import { StepButton } from "@/components/ui/Buttons";
import { MAX_SCALE_RATIO, MIN_SCALE_RATIO } from "@/lib/game/gameEngine";

type ScaleControlsProps = {
  ratio: number;
  disabled: boolean;
  onRatioChange: (ratio: number) => void;
  onStep: (direction: -1 | 1) => void;
};

export function ScaleControls({
  ratio,
  disabled,
  onRatioChange,
  onStep,
}: ScaleControlsProps) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-[11px] tracking-[0.16em] text-text-muted">
          YOUR SCALE
        </span>
        <span className="font-mono text-base text-target">
          {formatScaleRatio(ratio)}
          <span className="ml-2 text-sm text-text-secondary">reference</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <StepButton
          aria-label="Decrease scale by 2 percent"
          disabled={disabled}
          onClick={() => onStep(-1)}
        >
          −
        </StepButton>
        <input
          className="scale-slider min-w-0 flex-1"
          type="range"
          min={MIN_SCALE_RATIO}
          max={MAX_SCALE_RATIO}
          step={0.001}
          value={ratio}
          disabled={disabled}
          aria-label="Scale relative to the reference"
          aria-valuemin={MIN_SCALE_RATIO}
          aria-valuemax={MAX_SCALE_RATIO}
          aria-valuenow={Number(ratio.toFixed(3))}
          aria-valuetext={`${ratio.toFixed(2)} times the reference`}
          aria-describedby="game-help"
          onChange={(event) => onRatioChange(Number(event.target.value))}
        />
        <StepButton
          aria-label="Increase scale by 2 percent"
          disabled={disabled}
          onClick={() => onStep(1)}
        >
          +
        </StepButton>
      </div>
    </div>
  );
}
