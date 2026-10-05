type SilhouetteProps = {
  variant: "solid" | "ghost";
};

export function BasketballSilhouette({ variant }: SilhouetteProps) {
  if (variant === "ghost") {
    return (
      <svg
        viewBox="0 0 100 100"
        className="block h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="48.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.8"
        >
          <path d="M50 6 V94" />
          <path d="M8 50 H92" />
          <path d="M20 24 C36 34 64 34 80 24" />
          <path d="M20 76 C36 66 64 66 80 76" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className="block h-full w-full"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="50" fill="currentColor" />
      <g
        fill="none"
        stroke="var(--surface)"
        strokeWidth="2.2"
        strokeLinecap="round"
      >
        <path d="M50 4 V96" />
        <path d="M6 50 H94" />
        <path d="M18 22 C36 34 64 34 82 22" />
        <path d="M18 78 C36 66 64 66 82 78" />
      </g>
    </svg>
  );
}
