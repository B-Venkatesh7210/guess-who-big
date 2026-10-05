import type { PointerEvent } from "react";

type ResizeHandleProps = {
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLButtonElement>) => void;
};

export function ResizeHandle({
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: ResizeHandleProps) {
  return (
    <button
      type="button"
      aria-label="Drag up or down to resize the soda can"
      className="absolute left-1/2 top-0 z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-[calc(100%+8px)] cursor-ns-resize touch-none items-center justify-center rounded-[8px] border border-border bg-surface-2 text-target focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-reference"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <span className="flex flex-col items-center gap-1" aria-hidden="true">
        <span className="block h-0 w-0 border-x-4 border-b-[5px] border-x-transparent border-b-current" />
        <span className="block h-1 w-5 rounded-[2px] bg-current" />
        <span className="block h-0 w-0 border-x-4 border-t-[5px] border-x-transparent border-t-current" />
      </span>
    </button>
  );
}
