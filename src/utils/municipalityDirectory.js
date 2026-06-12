import { municipalityDirectory } from "../data/municipalityDirectory";

export function normalizeArabicName(name) {
  return (name || "")
    .trim()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[ؤئ]/g, "ء")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/\s+/g, " ");
}

export function findMunicipalityByName(name) {
  const normalizedName = normalizeArabicName(name);

  if (!normalizedName) {
    return null;
  }

  return (
    municipalityDirectory.find(
      (entry) =>
        normalizeArabicName(entry.municipality_name_ar) === normalizedName
    ) || null
  );
}

export function findMunicipalityById(id) {
  if (!id) {
    return null;
  }

  return (
    municipalityDirectory.find((entry) => entry.municipality_id === id) || null
  );
}
