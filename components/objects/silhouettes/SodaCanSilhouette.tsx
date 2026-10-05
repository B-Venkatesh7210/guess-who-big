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
        <path
          d="M1.2 8 H64.8 V110 Q64.8 120.6 33 120.6 Q1.2 120.6 1.2 110 Z"
          fill="none"
          stroke="var(--background)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <ellipse
          cx="33"
          cy="8"
          rx="31.8"
          ry="7.2"
          fill="none"
          stroke="var(--background)"
          strokeWidth="4"
        />
        <path
          d="M1.2 8 H64.8 V110 Q64.8 120.6 33 120.6 Q1.2 120.6 1.2 110 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <ellipse
          cx="33"
          cy="8"
          rx="31.8"
          ry="7.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          opacity="0.9"
        />
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
