import { BasketballSilhouette } from "./silhouettes/BasketballSilhouette";
import { SodaCanSilhouette } from "./silhouettes/SodaCanSilhouette";

export type SilhouetteVariant = "solid" | "ghost";

const silhouetteAspect: Record<string, number> = {
  basketball: 1,
  "soda-can": 66 / 122,
};

export function silhouetteAspectFor(svgKey: string): number {
  return silhouetteAspect[svgKey] ?? 1;
}

export function ObjectRenderer({
  svgKey,
  variant,
}: {
  svgKey: string;
  variant: SilhouetteVariant;
}) {
  if (svgKey === "basketball") {
    return <BasketballSilhouette variant={variant} />;
  }
  if (svgKey === "soda-can") {
    return <SodaCanSilhouette variant={variant} />;
  }
  return null;
}
