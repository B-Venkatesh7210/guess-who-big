type SilhouetteProps = {
  variant: "solid" | "ghost";
};

export function SodaCanSilhouette({ variant }: SilhouetteProps) {
  if (variant === "ghost") {
    return (
      <svg
        viewBox="0 0 66 122"
        className="block h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        >
          <path
            d="M0.75 8 H65.25 V110 Q65.25 121.25 33 121.25 Q0.75 121.25 0.75 110 Z"
            vectorEffect="non-scaling-stroke"
          />
          <ellipse
            cx="33"
            cy="8"
            rx="32.25"
            ry="7.25"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 66 122" className="block h-full w-full" aria-hidden="true">
      <path
        d="M0 8 H66 V110 Q66 122 33 122 Q0 122 0 110 Z"
        fill="currentColor"
      />
      <ellipse cx="33" cy="8" rx="33" ry="8" fill="currentColor" />
      <ellipse
        cx="33"
        cy="8"
        rx="22"
        ry="4.2"
        fill="none"
        stroke="var(--surface)"
        strokeWidth="1.6"
      />
      <path
        d="M28 7.2 h4.2 v-3.4 h2.4 v3.4 H39"
        fill="none"
        stroke="var(--surface)"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M6 22 H60"
        stroke="var(--surface)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
