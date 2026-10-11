import type { ArtSpec, CatalogEntry } from "./types";

const FACT_SHEET = "https://nssdc.gsfc.nasa.gov/planetary/factsheet/";
const KM = 100_000;

function sphere(subject: string, referenceQuery: string): ArtSpec {
  return {
    subject,
    view: "front",
    aspectRatio: "1:1",
    referenceQuery,
    axis: "vertical",
    relight: "sphere",
    relightStrength: 0.7,
    shadeBlur: 3,
  };
}

export const astronomical: CatalogEntry[] = [
  {
    id: "pluto",
    name: "Pluto",
    category: "astronomical",
    measurementType: "diameter",
    realSizeCm: 2376 * KM,
    fact: "Pluto is 2,376 km across, smaller than Earth's Moon.",
    sizeSource: FACT_SHEET,
    familiarity: 3,
    art: sphere(
      "the dwarf planet Pluto as a full sphere, with the smooth heart-shaped Tombaugh Regio plain, craters and rugged highlands as surface relief",
      "Pluto New Horizons",
    ),
  },
  {
    id: "moon",
    name: "The Moon",
    category: "astronomical",
    measurementType: "diameter",
    realSizeCm: 3475 * KM,
    fact: "The Moon is 3,475 km across, a little over a quarter of Earth's diameter.",
    sizeSource: FACT_SHEET,
    familiarity: 2,
    art: sphere(
      "the full Moon as a sphere, with its dark maria, bright highlands and craters such as Tycho with its rays as surface relief",
      "full Moon",
    ),
  },
  {
    id: "mercury",
    name: "Mercury",
    category: "astronomical",
    measurementType: "diameter",
    realSizeCm: 4879 * KM,
    fact: "Mercury is 4,879 km across, only about 40% wider than the Moon.",
    sizeSource: FACT_SHEET,
    familiarity: 3,
    art: sphere(
      "the planet Mercury as a full sphere, densely covered in overlapping impact craters and long scarps as surface relief",
      "Mercury planet MESSENGER",
    ),
  },
  {
    id: "mars",
    name: "Mars",
    category: "astronomical",
    measurementType: "diameter",
    realSizeCm: 6792 * KM,
    fact: "Mars is 6,792 km across, about half the width of Earth.",
    sizeSource: FACT_SHEET,
    familiarity: 2,
    art: sphere(
      "the planet Mars as a full sphere, with the Valles Marineris canyon system, large volcanoes, craters and a polar ice cap as surface relief",
      "Mars Valles Marineris globe",
    ),
  },
  {
    id: "venus",
    name: "Venus",
    category: "astronomical",
    measurementType: "diameter",
    realSizeCm: 12104 * KM,
    fact: "Venus is 12,104 km across, almost Earth's twin in size.",
    sizeSource: FACT_SHEET,
    familiarity: 3,
    art: sphere(
      "the planet Venus as a full sphere, with soft swirling cloud bands as gentle surface relief",
      "Venus planet",
    ),
  },
  {
    id: "earth",
    name: "Earth",
    category: "astronomical",
    measurementType: "diameter",
    realSizeCm: 12756 * KM,
    fact: "Earth is 12,756 km across at the equator.",
    sizeSource: FACT_SHEET,
    familiarity: 2,
    art: sphere(
      "planet Earth as a full sphere showing Africa and Europe, continents slightly raised from the smooth oceans, wispy cloud swirls as subtle relief",
      "Blue Marble Earth",
    ),
  },
  {
    id: "neptune",
    name: "Neptune",
    category: "astronomical",
    measurementType: "diameter",
    realSizeCm: 49528 * KM,
    fact: "Neptune is 49,528 km across, nearly four Earths wide.",
    sizeSource: FACT_SHEET,
    familiarity: 3,
    art: sphere(
      "the planet Neptune as a full sphere, with faint latitudinal cloud bands and a large dark storm spot as gentle surface relief",
      "Neptune Voyager 2",
    ),
  },
  {
    id: "uranus",
    name: "Uranus",
    category: "astronomical",
    measurementType: "diameter",
    realSizeCm: 51118 * KM,
    fact: "Uranus is 51,118 km across and rotates tipped over on its side.",
    sizeSource: FACT_SHEET,
    familiarity: 3,
    art: sphere(
      "the planet Uranus as a full sphere, almost featureless with very faint banding as gentle surface relief",
      "Uranus planet",
    ),
  },
  {
    id: "saturn",
    name: "Saturn",
    category: "astronomical",
    measurementType: "diameter",
    realSizeCm: 120536 * KM,
    fact: "Saturn is 120,536 km across at the equator, and its main rings span roughly 270,000 km.",
    approximationLabel: "Planet only, without rings",
    sizeSource: FACT_SHEET,
    familiarity: 2,
    art: {
      subject:
        "the planet Saturn as a full sphere with cloud bands, surrounded by its broad flat ring system tilted only about 15 degrees from edge-on, with the Cassini division visible",
      view: "front",
      aspectRatio: "16:9",
      referenceQuery: "Saturn Cassini rings",
      axis: "vertical",
      shadeBlur: 3,
    },
  },
  {
    id: "jupiter",
    name: "Jupiter",
    category: "astronomical",
    measurementType: "diameter",
    realSizeCm: 142984 * KM,
    fact: "Jupiter is 142,984 km across at the equator, about 11 Earths wide.",
    sizeSource: FACT_SHEET,
    familiarity: 2,
    art: sphere(
      "the planet Jupiter as a full sphere, with strong horizontal cloud belts and zones, turbulent eddies and the Great Red Spot as surface relief",
      "Jupiter Cassini",
    ),
  },
];
