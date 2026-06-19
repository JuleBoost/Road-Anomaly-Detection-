import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  writeBatch,
} from "firebase/firestore";
import { firebaseConfig } from "../src/firebase.js";

const BATCH_OPERATION_LIMIT = 450;
const shouldApply = process.argv.includes("--apply");

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

function getBestTimestamp(record) {
  return (
    resolveDateValue(record.timestamp) ||
    resolveDateValue(record.last_seen_at) ||
    resolveDateValue(record.updated_at) ||
    resolveDateValue(record.created_at) ||
    resolveDateValue(record.first_seen_at)
  );
}

async function commitOperations(db, operations) {
  for (let index = 0; index < operations.length; index += BATCH_OPERATION_LIMIT) {
    const batch = writeBatch(db);
    const chunk = operations.slice(index, index + BATCH_OPERATION_LIMIT);

    chunk.forEach((operation) => {
      batch.update(operation.ref, operation.data);
    });

    await batch.commit();
  }
}

async function main() {
  const app = initializeApp(firebaseConfig, "timestamp-backfill");
  const db = getFirestore(app);
  const snapshot = await getDocs(collection(db, "anomalies"));
  const anomalies = snapshot.docs.map((snapshotDoc) => ({
    id: snapshotDoc.id,
    ...snapshotDoc.data(),
  }));

  const operations = anomalies
    .filter((item) => !item.timestamp)
    .map((item) => {
      const bestTimestamp = getBestTimestamp(item);

      if (!bestTimestamp) {
        return null;
      }

      return {
        ref: doc(db, "anomalies", item.id),
        data: {
          timestamp: bestTimestamp,
          updated_at: resolveDateValue(item.updated_at) || bestTimestamp,
        },
      };
    })
    .filter(Boolean);

  console.log("Documents scanned:", anomalies.length);
  console.log("Missing timestamp docs:", operations.length);

  if (!shouldApply) {
    console.log("Dry run only. No Firestore changes were made.");
    console.log("Run with --apply to write missing timestamps.");
    return;
  }

  await commitOperations(db, operations);
  console.log("Timestamp backfill applied successfully.");
}

main().catch((error) => {
  console.error("Timestamp backfill failed:", error);
  process.exitCode = 1;
});
