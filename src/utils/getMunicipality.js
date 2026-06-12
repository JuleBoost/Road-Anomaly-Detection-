import { booleanPointInPolygon, point, polygon } from "@turf/turf";
import { municipalities } from "../data/municipalities";

export function getMunicipality(lat, lng) {
  const anomalyPoint = point([lng, lat]);

  for (const municipality of municipalities) {
    const municipalityPolygon = polygon([municipality.polygon]);

    if (booleanPointInPolygon(anomalyPoint, municipalityPolygon)) {
      return municipality.id;
    }
  }

  return "unknown";
}
