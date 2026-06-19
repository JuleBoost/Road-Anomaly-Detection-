import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  writeBatch,
} from "firebase/firestore";
import { firebaseConfig } from "../src/firebase.js";

const DISTANCE_THRESHOLD_METERS = 10;
const BATCH_OPERATION_LIMIT = 450;
const EXCLUDED_STATUSES = new Set(["Repaired", "Verified", "Rejected"]);
const shouldApply = process.argv.includes("--apply");

function normalizeAnomalyType(anomaly) {
  return anomaly?.toString().trim().toLowerCase().replace(/\s+/g, "-") || "";
}

function resolveDateValue(value) {
  if (!value) {
    return null;
  }

  if (typeof value?.toDate === "function") {
    const parsedTimestamp = value.toDate();
    return Number.isNaN(parsedTimestamp.getTime()) ? null : parsedTimestamp;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function getAnomalyDate(anomaly) {
  return (
    resolveDateValue(anomaly.updated_at) ||
    resolveDateValue(anomaly.last_seen_at) ||
    resolveDateValue(anomaly.timestamp) ||
    resolveDateValue(anomaly.created_at) ||
    resolveDateValue(anomaly.first_seen_at)
  );
}

function calculateDistanceMeters(lat1, lng1, lat2, lng2) {
  const firstLat = Number(lat1);
  const firstLng = Number(lng1);
  const secondLat = Number(lat2);
  const secondLng = Number(lng2);

  if (
    [firstLat, firstLng, secondLat, secondLng].some((value) =>
      Number.isNaN(value)
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusMeters = 6371000;
  const deltaLat = toRadians(secondLat - firstLat);
  const deltaLng = toRadians(secondLng - firstLng);
  const firstLatRadians = toRadians(firstLat);
  const secondLatRadians = toRadians(secondLat);

  const haversine =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(firstLatRadians) *
      Math.cos(secondLatRadians) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const arc = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return earthRadiusMeters * arc;
}

function choosePrimaryRecord(records) {
  return [...records].sort((first, second) => {
    const firstDate = getAnomalyDate(first)?.getTime() || 0;
    const secondDate = getAnomalyDate(second)?.getTime() || 0;

    return firstDate - secondDate;
  })[0];
}

function buildDuplicateGroups(records) {
  const groups = [];
  const consumedIds = new Set();

  records.forEach((record) => {
    if (consumedIds.has(record.id)) {
      return;
    }

    const group = [record];
    consumedIds.add(record.id);

    for (const candidate of records) {
      if (consumedIds.has(candidate.id)) {
        continue;
      }

      if (
        normalizeAnomalyType(candidate.anomaly) !==
        normalizeAnomalyType(record.anomaly)
      ) {
        continue;
      }

      if (
        EXCLUDED_STATUSES.has(record.status || "New") ||
        EXCLUDED_STATUSES.has(candidate.status || "New")
      ) {
        continue;
      }

      const isNearby = group.some(
        (groupedRecord) =>
          calculateDistanceMeters(
            groupedRecord.lat,
            groupedRecord.lng,
            candidate.lat,
            candidate.lng
          ) <= DISTANCE_THRESHOLD_METERS
      );

      if (!isNearby) {
        continue;
      }

      group.push(candidate);
      consumedIds.add(candidate.id);
    }

    if (group.length > 1) {
      groups.push(group);
    }
  });

  return groups;
}

function mergeDuplicateGroup(group) {
  const primary = choosePrimaryRecord(group);
  const latestRecord = [...group].sort((first, second) => {
    const secondDate = getAnomalyDate(second)?.getTime() || 0;
    const firstDate = getAnomalyDate(first)?.getTime() || 0;

    return secondDate - firstDate;
  })[0];
  const earliestFirstSeen = group
    .map((item) => resolveDateValue(item.first_seen_at))
    .filter(Boolean)
    .sort((first, second) => first - second)[0];
  const latestLastSeen = group
    .map((item) => resolveDateValue(item.last_seen_at))
    .filter(Boolean)
    .sort((first, second) => second - first)[0];
  const earliestCreatedAt = group
    .map((item) => resolveDateValue(item.created_at))
    .filter(Boolean)
    .sort((first, second) => first - second)[0];
  const latestUpdatedAt = group
    .map((item) => resolveDateValue(item.updated_at))
    .filter(Boolean)
    .sort((first, second) => second - first)[0];

  return {
    primaryId: primary.id,
    duplicateIds: group.filter((item) => item.id !== primary.id).map((item) => item.id),
    mergedData: {
      anomaly: latestRecord.anomaly || primary.anomaly,
      category: latestRecord.category || primary.category,
      severity: latestRecord.severity || primary.severity,
      status: latestRecord.status || primary.status || "New",
      confidence: Math.max(...group.map((item) => item.confidence || 0)),
      reports_count: group.reduce(
        (sum, item) => sum + (item.reports_count || 1),
        0
      ),
      municipality_id: primary.municipality_id || latestRecord.municipality_id || "unknown",
      municipality_name:
        primary.municipality_name || latestRecord.municipality_name || "Unknown",
      district: primary.district || latestRecord.district || "Unknown",
      governorate: primary.governorate || latestRecord.governorate || "Unknown",
      address: primary.address || latestRecord.address || "",
      lat: primary.lat ?? latestRecord.lat ?? null,
      lng: primary.lng ?? latestRecord.lng ?? null,
      first_seen_at: earliestFirstSeen || primary.first_seen_at || null,
      last_seen_at: latestLastSeen || latestRecord.last_seen_at || new Date(),
      created_at: earliestCreatedAt || primary.created_at || null,
      updated_at: latestUpdatedAt || new Date(),
      timestamp: getAnomalyDate(latestRecord) || primary.timestamp || null,
      repair_note:
        latestRecord.repair_note || primary.repair_note || "",
      repair_photo_url:
        latestRecord.repair_photo_url || primary.repair_photo_url || "",
      repair_date:
        resolveDateValue(latestRecord.repair_date) ||
        resolveDateValue(primary.repair_date) ||
        null,
      repaired_by: latestRecord.repaired_by || primary.repaired_by || "",
    },
  };
}

function sanitizeFirestoreData(data) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
}

async function commitOperations(db, operations) {
  for (let index = 0; index < operations.length; index += BATCH_OPERATION_LIMIT) {
    const batch = writeBatch(db);
    const chunk = operations.slice(index, index + BATCH_OPERATION_LIMIT);

    chunk.forEach((operation) => {
      if (operation.type === "update") {
        batch.update(operation.ref, operation.data);
      }

      if (operation.type === "delete") {
        batch.delete(operation.ref);
      }
    });

    await batch.commit();
  }
}

async function main() {
  const app = initializeApp(firebaseConfig, "duplicate-cleanup");
  const db = getFirestore(app);
  const anomaliesSnapshot = await getDocs(collection(db, "anomalies"));
  const anomalies = anomaliesSnapshot.docs.map((snapshotDoc) => ({
    id: snapshotDoc.id,
    ...snapshotDoc.data(),
  }));
  const scannedDocumentCount = anomalies.length;

  const groupedByType = anomalies.reduce((accumulator, anomaly) => {
    const key = normalizeAnomalyType(anomaly.anomaly);

    if (!accumulator.has(key)) {
      accumulator.set(key, []);
    }

    accumulator.get(key).push(anomaly);
    return accumulator;
  }, new Map());

  const duplicateGroups = [];

  groupedByType.forEach((records) => {
    duplicateGroups.push(...buildDuplicateGroups(records));
  });

  if (duplicateGroups.length === 0) {
    console.log("Documents scanned:", scannedDocumentCount);
    console.log("Duplicates merged:", 0);
    console.log("Final document count:", scannedDocumentCount);
    console.log("No duplicate anomaly groups found.");
    return;
  }

  const merges = duplicateGroups.map(mergeDuplicateGroup);
  const operations = [];
  const duplicatesMergedCount = merges.reduce(
    (sum, merge) => sum + merge.duplicateIds.length,
    0
  );
  const finalDocumentCount = scannedDocumentCount - duplicatesMergedCount;

  merges.forEach((merge) => {
    operations.push({
      type: "update",
      ref: doc(db, "anomalies", merge.primaryId),
      data: sanitizeFirestoreData(merge.mergedData),
    });

    merge.duplicateIds.forEach((duplicateId) => {
      operations.push({
        type: "delete",
        ref: doc(db, "anomalies", duplicateId),
      });
    });
  });

  console.log("Duplicate groups found:", duplicateGroups.length);
  console.log("Documents scanned:", scannedDocumentCount);
  console.log("Duplicates merged:", duplicatesMergedCount);
  console.log("Final document count:", finalDocumentCount);
  console.log(
    "Primary documents to update:",
    merges.length
  );

  merges.slice(0, 10).forEach((merge, index) => {
    console.log(
      `Group ${index + 1}: keep ${merge.primaryId}, remove ${merge.duplicateIds.join(", ")}`
    );
  });

  if (!shouldApply) {
    console.log("");
    console.log("Dry run only. No Firestore changes were made.");
    console.log("Run with --apply to update primary docs and delete duplicates.");
    return;
  }

  await commitOperations(db, operations);

  console.log("Duplicate cleanup applied successfully.");
}

main().catch((error) => {
  console.error("Duplicate cleanup failed:", error);
  process.exitCode = 1;
});
