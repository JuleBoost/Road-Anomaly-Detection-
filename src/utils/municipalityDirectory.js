/**
 * municipalityUtils.js
 *
 * Utility helpers for querying the RoadSense national municipality directory.
 *
 * Usage:
 *   import { findMunicipalityByName, findMunicipalityById, normalizeArabicName }
 *     from '@/utils/municipalityUtils';
 *
 * All search functions are case-insensitive and diacritic-tolerant for Arabic input.
 */

import { municipalityDirectory } from '../data/municipalityDirectory';

// ─────────────────────────────────────────────────────────────────────────────
// Arabic Normalization
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalizes an Arabic string for fuzzy/tolerant comparison.
 *
 * Transformations applied:
 *  1. Strip leading/trailing whitespace
 *  2. Collapse interior whitespace runs to a single space
 *  3. Remove Arabic diacritics (tashkeel / harakat)
 *  4. Normalize Alef variants (أ إ آ ٱ) → ا
 *  5. Normalize Tah Marbuta (ة) → ه
 *  6. Normalize Alef Maqsura (ى) → ي
 *  7. Remove Tatweel (ـ) / kashida
 *
 * @param {string} name - Raw Arabic municipality/district/governorate name
 * @returns {string} Normalized string suitable for comparison
 *
 * @example
 *   normalizeArabicName('النَّبَطِيَّة')  // → 'النبطيه'
 *   normalizeArabicName('  بِيْروت  ')   // → 'بيروت'
 */
export function normalizeArabicName(name) {
  if (!name || typeof name !== 'string') return '';

  return name
    .trim()
    // Collapse interior whitespace
    .replace(/\s+/g, ' ')
    // Remove Arabic diacritics (U+0610–U+061A, U+064B–U+065F, U+0670)
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '')
    // Normalize Alef variants → bare Alef
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Tah Marbuta → Hah
    .replace(/ة/g, 'ه')
    // Normalize Alef Maqsura → Yah
    .replace(/ى/g, 'ي')
    // Remove Tatweel / Kashida
    .replace(/ـ/g, '');
}

// ─────────────────────────────────────────────────────────────────────────────
// ID Generation (mirrors the convention used in municipalityDirectory.js)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts a transliterated English phrase into a directory ID slug.
 * Lowercases, strips non-alphanumeric chars, and collapses spaces to underscores.
 *
 * @param {string} phrase - e.g. "South Lebanon"
 * @returns {string} - e.g. "south_lebanon"
 */
export function toSlug(phrase) {
  return phrase
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s_]/g, '')
    .replace(/\s+/g, '_');
}

/**
 * Builds a stable municipality ID from its three slug components.
 *
 * @param {string} governorateSlug
 * @param {string} districtSlug
 * @param {string} municipalitySlug
 * @returns {string} e.g. "south_tyre_qana"
 */
export function buildMunicipalityId(governorateSlug, districtSlug, municipalitySlug) {
  return `${toSlug(governorateSlug)}_${toSlug(districtSlug)}_${toSlug(municipalitySlug)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Lookup — by ID
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Finds a municipality entry by its stable municipality_id.
 * Lookup is O(1) via a lazily-built index map.
 *
 * @param {string} id - e.g. "nabatieh_bint_jbeil_aitaroun"
 * @returns {object|null} Municipality record or null if not found
 *
 * @example
 *   const m = findMunicipalityById('south_tyre_qana');
 *   // { municipality_id, municipality_name_ar, district_ar, governorate_ar }
 */
export function findMunicipalityById(id) {
  if (!id) return null;
  return _getIdIndex()[id] ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Lookup — by Arabic name
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Finds all municipalities whose Arabic name matches the given query after
 * normalization. Returns an array because the same name can legitimately
 * appear in multiple districts (e.g. "كفر تبنيت" in Nabatieh and Zahrani).
 *
 * @param {string} name - Arabic municipality name (diacritics optional)
 * @returns {object[]} Array of matching municipality records (empty if none)
 *
 * @example
 *   findMunicipalityByName('النبطية');
 *   // [{ municipality_id: 'nabatieh_nabatieh_nabatieh', ... }]
 *
 *   findMunicipalityByName('كفر تبنيت');
 *   // [ { municipality_id: 'nabatieh_nabatieh_kfar_tibnit', ... },
 *   //   { municipality_id: 'south_zahrani_kfar_tebnit', ... } ]
 */
export function findMunicipalityByName(name) {
  if (!name) return [];
  const normalized = normalizeArabicName(name);
  return municipalityDirectory.filter(
    m => normalizeArabicName(m.municipality_name_ar) === normalized
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Lookup — by district
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all municipalities belonging to a given district (caza).
 * Match is performed after Arabic normalization.
 *
 * @param {string} districtAr - Arabic district name, e.g. "بنت جبيل"
 * @returns {object[]} Array of municipality records
 */
export function getMunicipalitiesByDistrict(districtAr) {
  if (!districtAr) return [];
  const normalized = normalizeArabicName(districtAr);
  return municipalityDirectory.filter(
    m => normalizeArabicName(m.district_ar) === normalized
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Lookup — by governorate
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all municipalities belonging to a given governorate.
 * Match is performed after Arabic normalization.
 *
 * @param {string} governorateAr - Arabic governorate name, e.g. "الجنوب"
 * @returns {object[]} Array of municipality records
 */
export function getMunicipalitiesByGovernorate(governorateAr) {
  if (!governorateAr) return [];
  const normalized = normalizeArabicName(governorateAr);
  return municipalityDirectory.filter(
    m => normalizeArabicName(m.governorate_ar) === normalized
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dropdown helpers (for React selects / MUI Autocomplete)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a deduplicated, sorted list of all governorate names in Arabic.
 * Suitable for populating a governorate <Select>.
 *
 * @returns {string[]}
 */
export function getAllGovernorates() {
  return [...new Set(municipalityDirectory.map(m => m.governorate_ar))].sort();
}

/**
 * Returns a deduplicated, sorted list of all district names in Arabic,
 * optionally filtered by governorate.
 *
 * @param {string} [governorateAr] - Optional Arabic governorate filter
 * @returns {string[]}
 */
export function getAllDistricts(governorateAr) {
  const source = governorateAr
    ? getMunicipalitiesByGovernorate(governorateAr)
    : municipalityDirectory;
  return [...new Set(source.map(m => m.district_ar))].sort();
}

/**
 * Returns all municipality records as { value, label } option objects,
 * optionally filtered by district.
 * The `value` field is the stable municipality_id.
 *
 * @param {string} [districtAr] - Optional Arabic district filter
 * @returns {{ value: string, label: string }[]}
 */
export function getMunicipalityOptions(districtAr) {
  const source = districtAr
    ? getMunicipalitiesByDistrict(districtAr)
    : municipalityDirectory;
  return source.map(m => ({
    value: m.municipality_id,
    label: m.municipality_name_ar,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Integrity check (call once at app startup in dev mode)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates the loaded directory for duplicate IDs and missing required fields.
 * Logs warnings to the console — does NOT throw.
 *
 * Call this in your app entry point under an `import.meta.env.DEV` guard:
 *
 *   if (import.meta.env.DEV) validateDirectory();
 *
 * @returns {{ duplicates: string[], missingFields: string[] }}
 */
export function validateDirectory() {
  const seen = new Map();
  const duplicates = [];
  const missingFields = [];
  const requiredFields = [
    'municipality_id',
    'municipality_name_ar',
    'district_ar',
    'governorate_ar',
  ];

  for (const entry of municipalityDirectory) {
    // Check required fields
    for (const field of requiredFields) {
      if (!entry[field] || typeof entry[field] !== 'string' || !entry[field].trim()) {
        missingFields.push(
          `ID "${entry.municipality_id ?? '?'}" is missing or has empty field: "${field}"`
        );
      }
    }

    // Check for duplicate IDs
    if (seen.has(entry.municipality_id)) {
      duplicates.push(entry.municipality_id);
      console.warn(`[RoadSense] Duplicate municipality_id: "${entry.municipality_id}"`);
    } else {
      seen.set(entry.municipality_id, true);
    }
  }

  if (missingFields.length > 0) {
    console.warn('[RoadSense] Municipality directory — missing fields:', missingFields);
  }

  if (duplicates.length === 0 && missingFields.length === 0) {
    console.info(
      `[RoadSense] Municipality directory OK — ${municipalityDirectory.length} entries, no issues.`
    );
  }

  return { duplicates, missingFields };
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal — lazy ID index
// ─────────────────────────────────────────────────────────────────────────────

/** @type {Map<string, object>|null} */
let _idIndex = null;

/**
 * Lazily builds and returns an O(1) lookup map keyed by municipality_id.
 * The map is built once and cached for the lifetime of the module.
 *
 * @returns {Map<string, object>}
 * @private
 */
function _getIdIndex() {
  if (_idIndex === null) {
    _idIndex = new Map(municipalityDirectory.map(m => [m.municipality_id, m]));
  }
  return _idIndex;
}
