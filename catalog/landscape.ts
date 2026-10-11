import type { CatalogEntry } from "./types";

const mountainArt = {
  view: "front",
  aspectRatio: "16:9",
  axis: "vertical",
} as const;

export const landscape: CatalogEntry[] = [
  {
    id: "table-mountain",
    name: "Table Mountain",
    category: "landscape",
    measurementType: "elevation",
    realSizeCm: 108500,
    fact: "Table Mountain rises straight out of Cape Town to 1,085 m above sea level, with a flat top about 3 km wide.",
    approximationLabel: "Summit elevation",
    sizeSource: "https://en.wikipedia.org/wiki/Table_Mountain",
    familiarity: 3,
    art: {
      ...mountainArt,
      subject:
        "Table Mountain in Cape Town as an isolated landform: long flat-topped plateau with steep sandstone cliffs, eroded gullies, sloping foothills",
      referenceQuery: "Table Mountain Cape Town",
    },
  },
  {
    id: "mount-fuji",
    name: "Mount Fuji",
    category: "landscape",
    measurementType: "elevation",
    realSizeCm: 377600,
    fact: "Mount Fuji is Japan's highest mountain at 3,776 m, an almost perfectly symmetrical volcanic cone.",
    approximationLabel: "Summit elevation",
    sizeSource: "https://en.wikipedia.org/wiki/Mount_Fuji",
    familiarity: 2,
    art: {
      ...mountainArt,
      subject:
        "Mount Fuji as an isolated landform: broad symmetrical volcanic cone with a flattened crater rim, radial gullies, snow cap as subtle relief",
      referenceQuery: "Mount Fuji",
    },
  },
  {
    id: "matterhorn",
    name: "Matterhorn",
    category: "landscape",
    measurementType: "elevation",
    realSizeCm: 447800,
    fact: "The Matterhorn's pyramid-shaped summit stands 4,478 m above sea level on the Swiss–Italian border.",
    approximationLabel: "Summit elevation",
    sizeSource: "https://en.wikipedia.org/wiki/Matterhorn",
    familiarity: 3,
    art: {
      ...mountainArt,
      subject:
        "the Matterhorn as an isolated landform: steep pyramidal horn peak with sharp ridges and rocky faces, rising from lower alpine slopes",
      referenceQuery: "Matterhorn",
    },
  },
  {
    id: "kilimanjaro",
    name: "Mount Kilimanjaro",
    category: "landscape",
    measurementType: "elevation",
    realSizeCm: 589500,
    fact: "Kilimanjaro is Africa's highest mountain at 5,895 m, a dormant volcano that stands on its own above the plains.",
    approximationLabel: "Summit elevation",
    sizeSource: "https://en.wikipedia.org/wiki/Mount_Kilimanjaro",
    familiarity: 3,
    art: {
      ...mountainArt,
      subject:
        "Mount Kilimanjaro as an isolated landform: very broad volcanic massif with the flat-topped Kibo summit, a jagged secondary peak to one side, long gentle slopes",
      referenceQuery: "Mount Kilimanjaro",
    },
  },
  {
    id: "mount-everest",
    name: "Mount Everest",
    category: "landscape",
    measurementType: "elevation",
    realSizeCm: 884900,
    fact: "Mount Everest's summit is 8,849 m above sea level, the highest point on Earth.",
    approximationLabel: "Summit elevation",
    sizeSource: "https://en.wikipedia.org/wiki/Mount_Everest",
    familiarity: 2,
    art: {
      ...mountainArt,
      subject:
        "Mount Everest as an isolated landform: tall pyramidal summit with sharp ridges, rocky faces and snowfields, flanked by lower shoulders",
      referenceQuery: "Mount Everest",
    },
  },
];
