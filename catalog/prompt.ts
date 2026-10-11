import type { CatalogEntry } from "./types";

/** The one prompt template every object render is generated from. */
export function artPrompt(entry: CatalogEntry): string {
  const { art, category } = entry;
  const view =
    art.view === "side"
      ? `seen in exact side profile facing ${art.facing ?? "right"}`
      : "seen straight-on from the front";

  const grounding =
    category === "astronomical"
      ? "floating in empty space, the entire body visible"
      : category === "landscape"
        ? "rising from a flat base line along the bottom, with no surrounding terrain, sky, clouds, trees or buildings"
        : category === "buildings" || category === "monuments"
          ? "standing on an invisible flat ground line, with no surrounding buildings, trees, people, vehicles or terrain"
          : "resting on an invisible flat ground line";

  return [
    `Studio render of ${art.subject}, ${view}.`,
    "Use the reference image only for shape, proportions and details; ignore its background, colours, lighting, text, people and camera angle.",
    "Style: one uniform matte light-grey clay material like an unpainted high-detail 3D model, fully desaturated, no colour anywhere. Show form and fine surface detail through soft shading only, no outlines.",
    "Lighting: a single soft key light from the top-left, gentle ambient fill, smooth form shading.",
    `Camera: orthographic, no perspective distortion, the whole subject visible and centred with about 8% margin on every side, ${grounding}.`,
    "Background: perfectly flat solid pure chroma green (#00FF00), no gradient, no floor, no ground shadow, no reflections, no text, no logos.",
  ].join(" ");
}
