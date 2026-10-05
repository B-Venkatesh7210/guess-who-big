import { formatScaleRatio } from "@/lib/game/format";
import { guessToSliderPosition, sliderPositionToGuess } from "@/lib/scale/scaleMath";
import { StepButton } from "@/components/ui/Buttons";

const SLIDER_STEPS = 1000;

type ScaleControlsProps = {
  guessCm: number;
  minGuessCm: number;
  maxGuessCm: number;
  ratio: number;
  disabled: boolean;
  onGuessChange: (guessCm: number) => void;
  onStep: (direction: -1 | 1) => void;
};

export function ScaleControls({
  guessCm,
  minGuessCm,
  maxGuessCm,
  ratio,
  disabled,
  onGuessChange,
  onStep,
}: ScaleControlsProps) {
  const position = Math.round(
    guessToSliderPosition(guessCm, minGuessCm, maxGuessCm) * SLIDER_STEPS,
  );

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
          min={0}
          max={SLIDER_STEPS}
          step={1}
          value={position}
          disabled={disabled}
          aria-label="Scale relative to the reference"
          aria-valuetext={`${ratio.toFixed(2)} times the reference`}
          aria-describedby="game-help"
          onChange={(event) =>
            onGuessChange(
              sliderPositionToGuess(
                Number(event.target.value) / SLIDER_STEPS,
                minGuessCm,
                maxGuessCm,
              ),
            )
          }
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
