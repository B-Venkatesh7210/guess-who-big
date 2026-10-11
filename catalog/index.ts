import { astronomical } from "./astronomical";
import { dinosaurs } from "./dinosaurs";
import { everyday } from "./everyday";
import { landscape } from "./landscape";
import { living } from "./living";
import { structures } from "./structures";
import type { CatalogEntry } from "./types";
import { vehicles } from "./vehicles";

/** Every object in the game, smallest to largest. Source of truth for data and art. */
export const catalog: readonly CatalogEntry[] = [
  ...everyday,
  ...living,
  ...dinosaurs,
  ...vehicles,
  ...structures,
  ...landscape,
  ...astronomical,
].sort((a, b) => a.realSizeCm - b.realSizeCm);

export function findEntry(id: string): CatalogEntry {
  const entry = catalog.find((candidate) => candidate.id === id);
  if (!entry) throw new Error(`Unknown catalog entry: ${id}`);
  return entry;
}

/** Objects within this size factor of each other can be paired in a round. */
export const PARTNER_RATIO = 3;
export const MIN_PARTNERS = 2;

export function partnersOf(entry: CatalogEntry, entries: readonly CatalogEntry[]) {
  return entries.filter((other) => {
    if (other.id === entry.id) return false;
    const ratio = other.realSizeCm / entry.realSizeCm;
    return ratio <= PARTNER_RATIO && ratio >= 1 / PARTNER_RATIO;
  });
}

export function validateCatalog(entries: readonly CatalogEntry[]): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  for (const entry of entries) {
    const where = entry.id || "(missing id)";
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(entry.id)) problems.push(`${where}: id must be kebab-case`);
    if (ids.has(entry.id)) problems.push(`${where}: duplicate id`);
    ids.add(entry.id);
    if (!(entry.realSizeCm > 0) || !Number.isFinite(entry.realSizeCm)) {
      problems.push(`${where}: realSizeCm must be a positive number`);
    }
    if (!entry.name.trim()) problems.push(`${where}: missing name`);
    if (!entry.fact.trim()) problems.push(`${where}: missing fact`);
    if (!/^https?:\/\//.test(entry.sizeSource)) problems.push(`${where}: sizeSource must be a URL`);
    if (!entry.art.subject.trim()) problems.push(`${where}: missing art subject`);
    if (!entry.art.referenceQuery.trim()) problems.push(`${where}: missing reference query`);
    if (entry.art.view === "side" && !entry.art.facing) problems.push(`${where}: side views need facing`);
    const ratio = entry.art.extentRatio ?? 1;
    if (!(ratio > 0 && ratio <= 1)) problems.push(`${where}: extentRatio must be in (0, 1]`);
    if (partnersOf(entry, entries).length < MIN_PARTNERS) {
      problems.push(`${where}: fewer than ${MIN_PARTNERS} size partners within ${PARTNER_RATIO}x`);
    }
  }
  return problems;
}
