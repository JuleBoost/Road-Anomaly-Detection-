import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "./supabaseClient";
import { findMunicipalityById } from "./utils/municipalityDirectory";
import MapView from "./MapView";
import "./App.css";

const ROAD_DAMAGE_TYPES = ["pothole"];
const ROAD_SAFETY_OBJECT_TYPES = [
  "fallen-cone",
  "fallen-barrier",
  "fallen-pole",
];
const TRAFFIC_INFRASTRUCTURE_TYPES = ["damaged-traffic-sign"];
const CLEANLINESS_TYPES = ["litter", "bin-full"];
const ACCEPTED_ANOMALY_TYPES = [
  "pothole",
  "fallen-barrier",
  "fallen-cone",
  "fallen-pole",
  "damaged-traffic-sign",
  "litter",
  "bin-full",
];
const EXCLUDED_ANOMALY_TYPES = [
  "damagedstreetlight",
  "fadedroadmarking",
  "fadedmarking",
  "whitemarking",
  "whitemarkings",
  "roadmarking",
];
const STATUS_OPTIONS = [
  "New",
  "Under Review",
  "Assigned",
  "Repaired",
  "Rejected",
];
const CATEGORY_CHART_COLORS = ["#ef4444", "#f97316", "#eab308", "#60a5fa"];
const ANOMALIES_PAGE_SIZE = 10;
const UNKNOWN_ANOMALY_LABEL = "Unknown Anomaly";
const UNCLASSIFIED_CATEGORY = "Unclassified";
const OPEN_ISSUE_STATUSES = ["New", "Under Review", "Assigned"];
const REPAIRED_ISSUE_STATUSES = ["Repaired"];
const DETECTION_DISPLAY_TIME_ZONE = "UTC";
const STATUS_WORKFLOW_OPTIONS = {
  New: ["New", "Under Review"],
  "Under Review": ["Under Review", "Assigned", "Rejected"],
  Assigned: ["Assigned", "Repaired"],
  Repaired: ["Repaired"],
  Rejected: ["Rejected"],
};
const STATUS_PRIORITY = {
  New: 0,
  "Under Review": 1,
  Assigned: 2,
  Repaired: 3,
  Rejected: 4,
};
const UNKNOWN_LOCATION_DETAILS = {
  municipality_name: "Unknown",
  district: "Unknown",
  governorate: "Unknown",
};

function normalizeUserRole(role) {
  if (role === "municipality") {
    return "municipality_manager";
  }

  return role || "public_viewer";
}

function canSeeAllAnomalies(userProfile) {
  if (!userProfile) {
    return true;
  }

  return normalizeUserRole(userProfile?.role) === "admin";
}

function canUpdateStatus(userProfile) {
  return ["admin", "municipality_manager"].includes(
    normalizeUserRole(userProfile?.role)
  );
}

function canUploadEvidence(userProfile) {
  return ["admin", "municipality_manager"].includes(
    normalizeUserRole(userProfile?.role)
  );
}

function canExportReports(userProfile) {
  return ["admin", "municipality_manager"].includes(
    normalizeUserRole(userProfile?.role)
  );
}

function isViewerRole(userProfile) {
  return ["public_viewer", "municipality_viewer"].includes(
    normalizeUserRole(userProfile?.role)
  );
}

function isPublicViewer(userProfile) {
  return normalizeUserRole(userProfile?.role) === "public_viewer";
}

function getRoleBadgeLabel(userProfile) {
  if (!userProfile) {
    return "Public Viewer";
  }

  const normalizedRole = normalizeUserRole(userProfile?.role);

  if (normalizedRole === "admin") {
    return "Super Admin";
  }

  if (normalizedRole === "municipality_manager") {
    return "Municipality Manager";
  }

  return "Municipality Viewer";
}

function getMunicipalityDetails(municipalityId) {
  if (!municipalityId || municipalityId === "unknown") {
    return UNKNOWN_LOCATION_DETAILS;
  }

  const municipalityEntry = findMunicipalityById(municipalityId);

  if (!municipalityEntry) {
    return UNKNOWN_LOCATION_DETAILS;
  }

  return {
    municipality_name: municipalityEntry.municipality_name_ar,
    district: municipalityEntry.district_ar,
    governorate: municipalityEntry.governorate_ar,
  };
}

function resolveDateValue(value) {
  if (!value) {
    return null;
  }

  if (typeof value?.toDate === "function") {
    const timestampDate = value.toDate();

    return Number.isNaN(timestampDate.getTime()) ? null : timestampDate;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const parsedDate = new Date(value);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function getAnomalyDate(anomaly) {
  return (
    resolveDateValue(anomaly?.timestamp) ||
    resolveDateValue(anomaly?.first_seen_at) ||
    resolveDateValue(anomaly?.updated_at) ||
    resolveDateValue(anomaly?.created_at) ||
    resolveDateValue(anomaly?.last_seen_at)
  );
}

function formatCreatedDate(timestamp) {
  return formatDetectionDateTime(timestamp);
}

function formatDetectionDateTime(value) {
  const parsedDate = resolveDateValue(value);

  if (parsedDate === null) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: DETECTION_DISPLAY_TIME_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(parsedDate);
}

function getDetectionDateTime(anomaly) {
  return (
    resolveDateValue(anomaly?.timestamp) ||
    resolveDateValue(anomaly?.first_seen_at) ||
    resolveDateValue(anomaly?.updated_at)
  );
}

function getDetectionSearchValues(anomaly) {
  const detectionDate = getDetectionDateTime(anomaly);

  if (!detectionDate) {
    return [];
  }

  return [
    formatDetectionDateTime(detectionDate),
    new Intl.DateTimeFormat("en-CA", {
      timeZone: DETECTION_DISPLAY_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(detectionDate),
    new Intl.DateTimeFormat("en-GB", {
      timeZone: DETECTION_DISPLAY_TIME_ZONE,
      day: "2-digit",
      month: "short",
    }).format(detectionDate),
    new Intl.DateTimeFormat("en-US", {
      timeZone: DETECTION_DISPLAY_TIME_ZONE,
      month: "short",
      day: "2-digit",
    }).format(detectionDate),
    new Intl.DateTimeFormat("en-GB", {
      timeZone: DETECTION_DISPLAY_TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(detectionDate),
    new Intl.DateTimeFormat("en-GB", {
      timeZone: DETECTION_DISPLAY_TIME_ZONE,
      year: "numeric",
    }).format(detectionDate),
  ];
}

function getFilterBoundaryDate(value, endOfDay = false) {
  if (!value) {
    return null;
  }

  const boundary = endOfDay
    ? new Date(`${value}T23:59:59.999`)
    : new Date(`${value}T00:00:00.000`);

  return Number.isNaN(boundary.getTime()) ? null : boundary;
}

function compareAnomaliesByDetectionDate(first, second) {
  const secondDetectionTime = getDetectionDateTime(second)?.getTime() || 0;
  const firstDetectionTime = getDetectionDateTime(first)?.getTime() || 0;

  if (secondDetectionTime !== firstDetectionTime) {
    return secondDetectionTime - firstDetectionTime;
  }

  const secondUpdatedTime = resolveDateValue(second?.updated_at)?.getTime() || 0;
  const firstUpdatedTime = resolveDateValue(first?.updated_at)?.getTime() || 0;

  return secondUpdatedTime - firstUpdatedTime;
}

function getShortAddress(address) {
  if (!address) {
    return "Unknown location";
  }

  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 3) {
    return `${parts[parts.length - 3]}, ${parts[parts.length - 2]}`;
  }

  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
  }

  return parts[0] || address;
}

function getCoordinateValues(item) {
  const latitude = Number(item?.lat);
  const longitude = Number(item?.lng);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}

function getGoogleMapsUrl(item) {
  const coordinates = getCoordinateValues(item);

  if (!coordinates) {
    return null;
  }

  return `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`;
}

function getLocationLabel(address) {
  return address?.trim() ? address : "Unknown location";
}

function toDateInputValue(value) {
  if (!value) {
    return "";
  }

  const parsedDate =
    typeof value?.toDate === "function"
      ? value.toDate()
      : value instanceof Date
        ? value
        : new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
}

function getCategory(anomaly) {
  const normalizedAnomaly = normalizeAnomalyTypeForLabel(anomaly);

  if (ROAD_DAMAGE_TYPES.includes(normalizedAnomaly)) {
    return "Road Damage";
  }

  if (ROAD_SAFETY_OBJECT_TYPES.includes(normalizedAnomaly)) {
    return "Road Safety Objects";
  }

  if (TRAFFIC_INFRASTRUCTURE_TYPES.includes(normalizedAnomaly)) {
    return "Traffic Infrastructure";
  }

  if (CLEANLINESS_TYPES.includes(normalizedAnomaly)) {
    return "Cleanliness";
  }

  return UNCLASSIFIED_CATEGORY;
}

function getSeverity(anomaly) {
  const normalizedAnomaly = normalizeAnomalyTypeForLabel(anomaly);

  if (
    [
      "pothole",
      "fallen-barrier",
      "fallen-pole",
      "bin-full",
    ].includes(normalizedAnomaly)
  ) {
    return "High";
  }

  if (
    [
      "fallen-cone",
      "damaged-traffic-sign",
      "litter",
    ].includes(normalizedAnomaly)
  ) {
    return "Medium";
  }

  return "Low";
}

function normalizeAnomalyType(anomaly) {
  return anomaly?.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, "") || "";
}

function normalizeAnomalyTypeForLabel(anomaly) {
  return (
    anomaly?.toString().trim().toLowerCase().replace(/[\s_]+/g, "-") || ""
  );
}

function getSafeEvidenceFileName(fileName) {
  return fileName?.replace(/[^\w.-]/g, "_") || "repair-photo";
}

function isExcludedAnomalyType(anomaly) {
  return EXCLUDED_ANOMALY_TYPES.includes(normalizeAnomalyType(anomaly));
}

function isAcceptedAnomalyType(anomaly) {
  return ACCEPTED_ANOMALY_TYPES.includes(normalizeAnomalyTypeForLabel(anomaly));
}

function formatAnomalyLabel(anomaly) {
  const normalizedAnomaly = normalizeAnomalyTypeForLabel(anomaly);

  if (!normalizedAnomaly) {
    return UNKNOWN_ANOMALY_LABEL;
  }

  return normalizedAnomaly
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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

function normalizeAddressValue(address) {
  const normalized = address?.toString().trim().toLowerCase() || "";
  if (normalized === "unknown" || normalized === "unknown location") {
    return "";
  }
  return normalized;
}

function isSameVisibleIssue(firstItem, secondItem) {
  if (
    normalizeAnomalyType(firstItem.anomaly) !==
    normalizeAnomalyType(secondItem.anomaly)
  ) {
    return false;
  }

  const firstLat = Number(firstItem.lat);
  const firstLng = Number(firstItem.lng);
  const secondLat = Number(secondItem.lat);
  const secondLng = Number(secondItem.lng);
  const firstHasCoords =
    Number.isFinite(firstLat) && Number.isFinite(firstLng);
  const secondHasCoords =
    Number.isFinite(secondLat) && Number.isFinite(secondLng);

  if (
    firstHasCoords &&
    secondHasCoords &&
    calculateDistanceMeters(firstLat, firstLng, secondLat, secondLng) <= 10
  ) {
    return true;
  }

  const firstAddress = normalizeAddressValue(firstItem.address);
  const secondAddress = normalizeAddressValue(secondItem.address);

  if (firstAddress && secondAddress && firstAddress === secondAddress) {
    return true;
  }

  return false;
}

function normalizeCategoryValue(category, anomaly) {
  if (!category || category === "Other") {
    return getCategory(anomaly);
  }

  return category;
}

function normalizeStatusValue(status) {
  if (status === "Verified") {
    return "Repaired";
  }

  return STATUS_OPTIONS.includes(status) ? status : "New";
}

function getAllowedStatusOptions(status) {
  const normalizedStatus = normalizeStatusValue(status);

  return STATUS_WORKFLOW_OPTIONS[normalizedStatus] || STATUS_WORKFLOW_OPTIONS.New;
}

function getStatusClassName(status) {
  return `status-pill status-${normalizeStatusValue(status)
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
}

function hasRepairEvidence(item) {
  return Boolean(
    item?.repair_note ||
      item?.repair_date ||
      item?.repaired_by ||
      item?.repair_photo_url
  );
}

function getHigherPriorityStatus(firstStatus, secondStatus) {
  const normalizedFirst = normalizeStatusValue(firstStatus);
  const normalizedSecond = normalizeStatusValue(secondStatus);

  return STATUS_PRIORITY[normalizedSecond] > STATUS_PRIORITY[normalizedFirst]
    ? normalizedSecond
    : normalizedFirst;
}

function normalizeAnomalyRecord(record) {
  const anomaly = formatAnomalyLabel(record.anomaly || UNKNOWN_ANOMALY_LABEL);
  const municipalityId = record.municipality_id || "unknown";
  const municipalityDetails = getMunicipalityDetails(municipalityId);

  return {
    ...record,
    anomaly,
    municipality_id: municipalityId,
    category: normalizeCategoryValue(record.category, anomaly),
    severity: record.severity || getSeverity(anomaly),
    status: normalizeStatusValue(record.status),
    reports_count: record.reports_count || 1,
    municipality_name:
      record.municipality_name || municipalityDetails.municipality_name,
    district: record.district || municipalityDetails.district,
    governorate: record.governorate || municipalityDetails.governorate,
    repair_note: record.repair_note || "",
    repair_photo_url: record.repair_photo_url || "",
    repair_date: record.repair_date || null,
    repaired_by: record.repaired_by || "",
  };
}

function aggregateVisibleIssues(items) {
  return items.reduce((aggregatedItems, item) => {
    const existingIndex = aggregatedItems.findIndex((currentItem) =>
      isSameVisibleIssue(currentItem, item)
    );

    if (existingIndex === -1) {
      aggregatedItems.push({ ...item });
      return aggregatedItems;
    }

    const existingItem = aggregatedItems[existingIndex];
    const currentDate = getAnomalyDate(item)?.getTime() || 0;
    const existingDate = getAnomalyDate(existingItem)?.getTime() || 0;
    const latestItem = currentDate >= existingDate ? item : existingItem;
    const mergedStatus = getHigherPriorityStatus(
      existingItem.status,
      item.status
    );

    aggregatedItems[existingIndex] = {
      ...existingItem,
      ...latestItem,
      status: mergedStatus,
      reports_count: (existingItem.reports_count || 1) + (item.reports_count || 1),
      confidence: Math.max(existingItem.confidence || 0, item.confidence || 0),
      first_seen_at:
        resolveDateValue(existingItem.first_seen_at) &&
        resolveDateValue(item.first_seen_at)
          ? resolveDateValue(existingItem.first_seen_at) <=
            resolveDateValue(item.first_seen_at)
            ? existingItem.first_seen_at
            : item.first_seen_at
          : existingItem.first_seen_at || item.first_seen_at || null,
      last_seen_at:
        resolveDateValue(existingItem.last_seen_at) &&
        resolveDateValue(item.last_seen_at)
          ? resolveDateValue(existingItem.last_seen_at) >=
            resolveDateValue(item.last_seen_at)
            ? existingItem.last_seen_at
            : item.last_seen_at
          : existingItem.last_seen_at || item.last_seen_at || null,
      repair_note: latestItem.repair_note || existingItem.repair_note || "",
      repair_photo_url:
        latestItem.repair_photo_url || existingItem.repair_photo_url || "",
      repair_date: latestItem.repair_date || existingItem.repair_date || null,
      repaired_by: latestItem.repaired_by || existingItem.repaired_by || "",
    };

    return aggregatedItems;
  }, []).sort((first, second) => {
    return compareAnomaliesByDetectionDate(first, second);
  });
}

function App() {
  const [anomalies, setAnomalies] = useState([]);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loadingAnomalies, setLoadingAnomalies] = useState(false);
  const [anomaliesOffset, setAnomaliesOffset] = useState(0);
  const [hasMoreAnomalies, setHasMoreAnomalies] = useState(true);
  const [exportLoading, setExportLoading] = useState(null);
  const [repairEvidenceTarget, setRepairEvidenceTarget] = useState(null);
  const [viewEvidenceTarget, setViewEvidenceTarget] = useState(null);
  const [repairNote, setRepairNote] = useState("");
  const [repairDate, setRepairDate] = useState("");
  const [repairedBy, setRepairedBy] = useState("");
  const [repairPhotoFile, setRepairPhotoFile] = useState(null);
  const [repairEvidenceLoading, setRepairEvidenceLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      setUser(session?.user ?? null);
      setUserProfile(null);
      setLoadingProfile(Boolean(session?.user));
      setAnomalies([]);
      setAnomaliesOffset(0);
      setHasMoreAnomalies(true);
      setAuthInitialized(true);
    };

    initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      setUser(session?.user ?? null);
      setUserProfile(null);
      setLoadingProfile(Boolean(session?.user));
      setAnomalies([]);
      setAnomaliesOffset(0);
      setHasMoreAnomalies(true);
      setAuthInitialized(true);
      setShowLoginForm(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      setProfileError("");
      setLoadingProfile(false);
      return;
    }

    const loadUserProfile = async () => {
      setLoadingProfile(true);
      setProfileError("");

      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            setUserProfile(null);
            setProfileError(
              "Your account is not assigned to any municipality. Please contact the administrator."
            );
            return;
          }

          throw error;
        }

        if (!profileData) {
          setUserProfile(null);
          setProfileError(
            "Your account is not assigned to any municipality. Please contact the administrator."
          );
          return;
        }

        const normalizedRole = normalizeUserRole(profileData.role);
        const municipalityId = profileData?.municipality_id || "";

        if (normalizedRole === "admin") {
          setUserProfile({
            ...profileData,
            role: "admin",
          });
          return;
        }

        if (
          normalizedRole === "municipality_manager" ||
          normalizedRole === "municipality_viewer"
        ) {
          if (!municipalityId) {
            setUserProfile(null);
            setProfileError(
              "Your account is not assigned to any municipality. Please contact the administrator."
            );
            return;
          }

          setUserProfile({
            ...profileData,
            role: normalizedRole,
            municipality_id: municipalityId,
          });
          return;
        }

        setUserProfile(null);
        setProfileError(
          "Your account role is invalid. Please contact the administrator."
        );
      } catch (error) {
        console.error("[RoadSense] User profile load failed:", error);
        setUserProfile(null);
        setProfileError(
          "Failed to load your municipality access. Please contact the administrator."
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [user]);

  useEffect(() => {
    if (!authInitialized || (user && loadingProfile)) {
      return;
    }

    fetchAnomalies({ reset: true });
  }, [authInitialized, user, userProfile, loadingProfile, profileError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        throw error;
      }
      setShowLoginForm(false);
    } catch (error) {
      setLoginError("Wrong email or password");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAnomalies([]);
    setAnomaliesOffset(0);
    setHasMoreAnomalies(true);
    setUserProfile(null);
    setProfileError("");
    setLoadingProfile(false);
    setLoadingAnomalies(false);
    setShowLoginForm(false);
  };

  const fetchAnomalies = async ({ reset = false } = {}) => {
    if (!reset && !hasMoreAnomalies) {
      return;
    }

    setLoadingAnomalies(true);

    try {
      const hasAuthenticatedMunicipalityScope =
        user && userProfile && !profileError && !canSeeAllAnomalies(userProfile);

      if (hasAuthenticatedMunicipalityScope && !userProfile?.municipality_id) {
        setHasMoreAnomalies(false);
        return;
      }

      const offset = reset ? 0 : anomaliesOffset;
      let query = supabase.from("anomalies").select("*");

      if (!hasAuthenticatedMunicipalityScope) {
        query = query.order("timestamp", { ascending: false });
      } else {
        query = query
          .eq("municipality_id", userProfile.municipality_id)
          .order("timestamp", { ascending: false });
      }

      const { data, error } = await query.range(
        offset,
        offset + ANOMALIES_PAGE_SIZE - 1
      );

      if (error) {
        throw error;
      }

      const normalizedData = (data || []).map((record) =>
        normalizeAnomalyRecord({
          ...record,
        })
      );

      setAnomaliesOffset(offset + normalizedData.length);
      setHasMoreAnomalies(normalizedData.length === ANOMALIES_PAGE_SIZE);
      setAnomalies((current) => {
        const mergedRecords = reset ? normalizedData : [...current, ...normalizedData];
        const uniqueRecords = Array.from(
          new Map(mergedRecords.map((item) => [item.id, item])).values()
        );

        return uniqueRecords.sort(compareAnomaliesByDetectionDate);
      });
    } catch (error) {
      console.error("[RoadSense] Anomalies load failed:", error);
    } finally {
      setLoadingAnomalies(false);
    }
  };

  const updateAnomalyStatus = async (anomalyId, newStatus) => {
    if (!canUpdateStatus(userProfile)) {
      alert("You do not have permission to update status");
      return;
    }

    const currentAnomaly = anomalies.find((item) => item.id === anomalyId);
    const currentStatus = normalizeStatusValue(currentAnomaly?.status);
    const normalizedNewStatus = normalizeStatusValue(newStatus);
    const allowedStatuses = getAllowedStatusOptions(currentStatus);

    if (!allowedStatuses.includes(normalizedNewStatus)) {
      alert("Invalid status transition");
      return;
    }

    try {
      console.log("[RoadSense] Status update starting:", {
        anomalyId,
        newStatus: normalizedNewStatus,
      });
      const nextUpdatedAt = new Date().toISOString();
      const { error } = await supabase
        .from("anomalies")
        .update({
          status: normalizedNewStatus,
          updated_at: nextUpdatedAt,
        })
        .eq("id", anomalyId);

      if (error) {
        throw error;
      }

      setAnomalies((current) =>
        current.map((item) =>
          item.id === anomalyId
            ? {
                ...item,
                status: normalizedNewStatus,
                updated_at: nextUpdatedAt,
              }
            : item
        )
      );
      console.log("[RoadSense] Status update succeeded:", {
        anomalyId,
        newStatus: normalizedNewStatus,
      });
    } catch (error) {
      console.error("[RoadSense] Status update failed:", {
        status: normalizedNewStatus,
        anomalyId,
        error,
      });
      alert("Failed to update status");
    }
  };

  const openRepairEvidenceModal = (item) => {
    if (!canUploadEvidence(userProfile)) {
      return;
    }

    setRepairEvidenceTarget(item);
    setRepairNote(item.repair_note || "");
    setRepairDate(toDateInputValue(item.repair_date));
    setRepairedBy(item.repaired_by || "");
    setRepairPhotoFile(null);
  };

  const closeRepairEvidenceModal = () => {
    setRepairEvidenceTarget(null);
    setRepairNote("");
    setRepairDate("");
    setRepairedBy("");
    setRepairPhotoFile(null);
    setRepairEvidenceLoading(false);
  };

  const handleSaveRepairEvidence = async () => {
    if (!repairEvidenceTarget) {
      return;
    }

    if (!canUploadEvidence(userProfile)) {
      alert("You do not have permission to upload repair evidence");
      return;
    }

    setRepairEvidenceLoading(true);

    try {
      let repairPhotoUrl = repairEvidenceTarget.repair_photo_url || "";
      const nextRepairDate = repairDate
        ? new Date(repairDate).toISOString()
        : new Date().toISOString();
      const nextRepairedBy = repairedBy || user?.email || "Unknown";
      const nextUpdatedAt = new Date().toISOString();
      const repairEvidenceAddedAt = new Date().toISOString();

      if (repairPhotoFile) {
        const filePath = `${repairEvidenceTarget.id}/${Date.now()}-${getSafeEvidenceFileName(
          repairPhotoFile.name
        )}`;
        const { error: uploadError } = await supabase.storage
          .from("repair-evidence")
          .upload(filePath, repairPhotoFile, {
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("repair-evidence")
          .getPublicUrl(filePath);

        repairPhotoUrl = publicUrlData?.publicUrl || "";
      }

      const { error } = await supabase
        .from("anomalies")
        .update({
          repair_note: repairNote,
          repair_photo_url: repairPhotoUrl,
          repair_date: nextRepairDate,
          repaired_by: nextRepairedBy,
          repair_evidence_added_at: repairEvidenceAddedAt,
          updated_at: nextUpdatedAt,
        })
        .eq("id", repairEvidenceTarget.id);

      if (error) {
        throw error;
      }

      setAnomalies((current) =>
        current.map((item) =>
          item.id === repairEvidenceTarget.id
            ? {
                ...item,
                repair_note: repairNote,
                repair_photo_url: repairPhotoUrl,
                repair_date: nextRepairDate,
                repaired_by: nextRepairedBy,
                repair_evidence_added_at: repairEvidenceAddedAt,
                updated_at: nextUpdatedAt,
              }
            : item
        )
      );

      if (viewEvidenceTarget?.id === repairEvidenceTarget.id) {
        setViewEvidenceTarget((current) =>
          current
            ? {
                ...current,
                repair_note: repairNote,
                repair_photo_url: repairPhotoUrl,
                repair_date: nextRepairDate,
                repaired_by: nextRepairedBy,
                repair_evidence_added_at: repairEvidenceAddedAt,
                updated_at: nextUpdatedAt,
              }
            : current
        );
      }

      closeRepairEvidenceModal();
    } catch (error) {
      console.error("[RoadSense] Repair evidence save failed:", error);
      alert("Failed to save repair evidence");
      setRepairEvidenceLoading(false);
    }
  };
  const effectiveUserProfile = profileError ? null : userProfile;
  const showPublicAuthNotice = Boolean(user && profileError);

  const visibleAnomalies =
    canSeeAllAnomalies(effectiveUserProfile)
      ? anomalies
      : anomalies.filter(
          (item) => item.municipality_id === effectiveUserProfile?.municipality_id
        );
  const supportedVisibleAnomalies = visibleAnomalies.filter(
    (item) => !isExcludedAnomalyType(item.anomaly)
  );
  const aggregatedVisibleAnomalies = aggregateVisibleIssues(supportedVisibleAnomalies);
  const displayAnomalies = aggregatedVisibleAnomalies.filter(
    (item) => item.category !== UNCLASSIFIED_CATEGORY
  );

  const normalizedSearchText = searchText.trim().toLowerCase();
  const fromDateBoundary = getFilterBoundaryDate(fromDate, false);
  const toDateBoundary = getFilterBoundaryDate(toDate, true);
  const filteredAnomalies = displayAnomalies.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSeverity =
      selectedSeverity === "All" || item.severity === selectedSeverity;
    const matchesStatus =
      selectedStatus === "All" || item.status === selectedStatus;
    const detectionDate = getDetectionDateTime(item);
    const matchesFromDate =
      fromDateBoundary === null ||
      (detectionDate !== null && detectionDate >= fromDateBoundary);
    const matchesToDate =
      toDateBoundary === null ||
      (detectionDate !== null && detectionDate <= toDateBoundary);
    const matchesSearch =
      normalizedSearchText === "" ||
      [
        item.anomaly,
        item.address,
        item.municipality_id,
        item.municipality_name,
        item.district,
        item.governorate,
        ...getDetectionSearchValues(item),
      ]
        .filter(Boolean)
        .some((value) =>
          value.toString().toLowerCase().includes(normalizedSearchText)
        );

    return (
      matchesCategory &&
      matchesSeverity &&
      matchesStatus &&
      matchesFromDate &&
      matchesToDate &&
      matchesSearch
    );
  });
  const liveMapAnomalies = filteredAnomalies.filter((item) =>
    OPEN_ISSUE_STATUSES.includes(normalizeStatusValue(item.status))
  );
  const portalLabel =
    !effectiveUserProfile
      ? "Public Road Monitoring View"
      : canSeeAllAnomalies(effectiveUserProfile)
      ? "Super Admin View"
      : `Municipality Portal: ${effectiveUserProfile?.municipality_id || "Unassigned"}`;
  const roleBadgeLabel = getRoleBadgeLabel(effectiveUserProfile);

  const openIssuesCount = filteredAnomalies.filter((a) =>
    OPEN_ISSUE_STATUSES.includes(normalizeStatusValue(a.status))
  ).length;
  const repairedIssuesCount = filteredAnomalies.filter((a) =>
    REPAIRED_ISSUE_STATUSES.includes(normalizeStatusValue(a.status))
  ).length;
  const highSeverityCount = filteredAnomalies.filter(
    (a) => a.severity === "High"
  ).length;
  const totalReportsCount = filteredAnomalies.reduce(
    (sum, item) => sum + (item.reports_count || 1),
    0
  );
  const repairedReportsCount = filteredAnomalies.reduce(
    (sum, item) =>
      REPAIRED_ISSUE_STATUSES.includes(normalizeStatusValue(item.status))
        ? sum + (item.reports_count || 1)
        : sum,
    0
  );
  const repairProgress =
    totalReportsCount === 0
      ? 0
      : Math.round((repairedReportsCount / totalReportsCount) * 100);
  const mostReportedAnomaly = filteredAnomalies.reduce(
    (highest, item) =>
      (item.reports_count || 1) > (highest?.reports_count || 0)
        ? item
        : highest,
    null
  );
  const categoryChartData = [
    "Road Damage",
    "Road Safety Objects",
    "Traffic Infrastructure",
    "Cleanliness",
  ]
    .map((category) => ({
      name: category,
      value: filteredAnomalies.filter((item) => item.category === category).length,
    }))
    .filter((item) => item.value > 0);
  const statusChartData = STATUS_OPTIONS.map((status) => ({
    name: status,
    value: filteredAnomalies.filter(
      (item) => normalizeStatusValue(item.status) === status
    ).length,
  }));
  const exportRows = filteredAnomalies.map((item) => ({
    anomaly: item.anomaly || UNKNOWN_ANOMALY_LABEL,
    category: item.category,
    severity: item.severity,
    status: item.status,
    municipality: item.municipality_name || "Unknown",
    district: item.district || "Unknown",
    governorate: item.governorate || "Unknown",
    confidence: `${Math.round((item.confidence || 0) * 100)}%`,
    reportsCount: item.reports_count || 1,
    address: item.address || "Unknown location",
    latitude: item.lat ?? "Unknown",
    longitude: item.lng ?? "Unknown",
    detectionDateTime: formatDetectionDateTime(getDetectionDateTime(item)),
    createdDate: formatCreatedDate(getAnomalyDate(item)),
    repairEvidence: item.repair_note
      ? `Note: ${item.repair_note}`
      : item.repair_photo_url
        ? "Photo evidence attached"
        : "No evidence",
    repairDate: formatCreatedDate(item.repair_date),
    repairedBy: item.repaired_by || "Unknown",
  }));
  const evidenceSummaryCount = filteredAnomalies.filter(
    (item) => item.repair_note || item.repair_photo_url || item.repaired_by
  ).length;
  const latest = filteredAnomalies[0];

  const handleExportCsv = async () => {
    setExportLoading("csv");

    try {
      const headers = [
        "Anomaly",
        "Category",
        "Severity",
        "Status",
        "Municipality",
        "District",
        "Governorate",
        "Confidence",
        "Reports Count",
        "Address",
        "Latitude",
        "Longitude",
        "Detection Date & Time",
        "Created Date",
        "Repair Evidence",
        "Repair Date",
        "Repaired By",
      ];
      const csvRows = exportRows.map((row) =>
        [
          row.anomaly,
          row.category,
          row.severity,
          row.status,
          row.municipality,
          row.district,
          row.governorate,
          row.confidence,
          row.reportsCount,
          row.address,
          row.latitude,
          row.longitude,
          row.detectionDateTime,
          row.createdDate,
          row.repairEvidence,
          row.repairDate,
          row.repairedBy,
        ]
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(",")
      );
      const csvContent = [headers.join(","), ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "roadsense-municipality-report.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setExportLoading(null);
    }
  };

  const handleExportPdf = async () => {
    setExportLoading("pdf");

    try {
      const pdf = new jsPDF({ orientation: "landscape" });
      const reportDate = formatDetectionDateTime(new Date());
      const municipalityLabel =
        canSeeAllAnomalies(effectiveUserProfile)
          ? "All Visible Municipalities"
          : effectiveUserProfile?.municipality_id || "Unknown Municipality";

      pdf.setFontSize(18);
      pdf.text("RoadSense Municipality Report", 14, 18);
      pdf.setFontSize(11);
      pdf.text(`Report Date: ${reportDate}`, 14, 28);
      pdf.text(`Municipality Name: ${municipalityLabel}`, 14, 35);
      pdf.text(`Total Issues: ${filteredAnomalies.length}`, 14, 42);
      pdf.text(`Open Issues: ${openIssuesCount}`, 14, 49);
      pdf.text(`Repaired Issues: ${repairedIssuesCount}`, 14, 56);
      pdf.text(`Evidence Records: ${evidenceSummaryCount}`, 14, 63);

      autoTable(pdf, {
        startY: 70,
        head: [
          [
            "Anomaly",
            "Category",
            "Severity",
            "Status",
            "Municipality",
            "District",
            "Governorate",
            "Confidence",
            "Reports Count",
            "Address",
            "Latitude",
            "Longitude",
            "Detection Date & Time",
            "Created Date",
            "Repair Evidence",
            "Repair Date",
            "Repaired By",
          ],
        ],
        body: exportRows.map((row) => [
          row.anomaly,
          row.category,
          row.severity,
          row.status,
          row.municipality,
          row.district,
          row.governorate,
          row.confidence,
          row.reportsCount,
          row.address,
          row.latitude,
          row.longitude,
          row.detectionDateTime,
          row.createdDate,
          row.repairEvidence,
          row.repairDate,
          row.repairedBy,
        ]),
        styles: {
          fontSize: 7,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [29, 78, 216],
        },
      });

      pdf.save("roadsense-municipality-report.pdf");
    } finally {
      setExportLoading(null);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <span className="logo-dot"></span>
          <h2>RoadSense</h2>
        </div>

        <div className="nav-links">
          <a href="#dashboard">Dashboard</a>
          <a href="#map">Map</a>
          <a href="#table">Anomalies</a>
          <span className="nav-role-badge">{roleBadgeLabel}</span>
          {user ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button
              className="logout-btn"
              onClick={() => {
                setLoginError("");
                setShowLoginForm(true);
              }}
            >
              Admin / Municipality Login
            </button>
          )}
        </div>
      </nav>

      {loadingProfile && user && (
        <div className="panel">
          <div className="section-header">
            <h2>Loading Access</h2>
            <p>Checking municipality access for authenticated tools.</p>
          </div>
        </div>
      )}

      {showPublicAuthNotice && (
        <div className="panel">
          <div className="section-header">
            <h2>Authenticated Tools Unavailable</h2>
            <p>{profileError}</p>
          </div>
        </div>
      )}

      <section className="hero" id="dashboard">
        <div>
          <p className="subtitle">Road Anomaly Detection System</p>
          <h1>Smart Road Monitoring Dashboard</h1>
          <p className="description">{portalLabel}</p>
          <p className="description">
            Real-time road anomaly detection using YOLO, GPS, and live map
            visualization.
          </p>
        </div>

        <div className="status-box">
          <span>System Status</span>
          <strong>LIVE</strong>
        </div>
      </section>

      {latest && (
        <div className="latest-alert">
          <div>
            <h3>Latest Detection</h3>
            <p>
              {latest.anomaly || UNKNOWN_ANOMALY_LABEL} detected at{" "}
              {latest.address || "Unknown location"}
            </p>
            <p>Reported {latest.reports_count || 1} times</p>
          </div>
          <span>{Math.round((latest.confidence || 0) * 100)}%</span>
        </div>
      )}

      <div className="cards">
        <div className="card total">
          Open Issues
          <br />
          <strong>{openIssuesCount}</strong>
        </div>
        <div className="card road-damage">
          Repaired Issues
          <br />
          <strong>{repairedIssuesCount}</strong>
        </div>
        <div className="card safety-objects">
          High Severity
          <br />
          <strong>{highSeverityCount}</strong>
        </div>
        <div className="card traffic-infrastructure">
          Total Reports
          <br />
          <strong>{totalReportsCount}</strong>
        </div>
        <div className="card high-severity">
          Repair Progress %
          <br />
          <strong>{repairProgress}%</strong>
        </div>
        <div className="card most-reported">
          Most Reported
          <br />
          <strong>{mostReportedAnomaly?.anomaly || "N/A"}</strong>
        </div>
      </div>

      <section className="panel charts-panel">
        <div className="section-header">
          <h2>Analytics Overview</h2>
          <p>Live category and workflow insights for the current filtered view.</p>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Category Distribution</h3>
              <p>Issue categories in the current dashboard scope.</p>
            </div>
            <div className="chart-wrapper">
              {categoryChartData.length === 0 ? (
                <div className="chart-empty-state">No category data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={categoryChartData.length > 1}
                      labelLine={categoryChartData.length > 1}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={CATEGORY_CHART_COLORS[index % CATEGORY_CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Status Distribution</h3>
              <p>Workflow stages for visible anomalies.</p>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData}>
                  <XAxis
                    dataKey="name"
                    stroke="#cbd5e1"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis stroke="#cbd5e1" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section className="panel filters-panel">
        <div className="section-header section-header-actions">
          <div>
            <h2>Dashboard Filters</h2>
            <p>
              Showing {filteredAnomalies.length} of {displayAnomalies.length} reports
            </p>
          </div>
          <button
            className="refresh-btn"
            onClick={() => fetchAnomalies({ reset: true })}
            disabled={loadingAnomalies}
          >
            {loadingAnomalies ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        <div className="filters-grid">
          <label className="filter-field">
            <span>Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Road Safety Objects">Road Safety Objects</option>
              <option value="Traffic Infrastructure">Traffic Infrastructure</option>
              <option value="Cleanliness">Cleanliness</option>
            </select>
          </label>

          <label className="filter-field">
            <span>Severity</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>

          <label className="filter-field">
            <span>Status</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field filter-search">
            <span>Search</span>
            <input
              type="text"
              placeholder="Search anomaly, address, municipality, or date/time"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </label>

          <label className="filter-field">
            <span>From Date</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </label>

          <label className="filter-field">
            <span>To Date</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="panel export-panel">
        <div className="section-header">
          <h2>Report Export</h2>
          <p>Export the currently filtered anomaly list as CSV or PDF.</p>
        </div>

        {canExportReports(effectiveUserProfile) && (
        <div className="export-actions">
          <button
            className="export-btn"
            onClick={handleExportCsv}
            disabled={exportLoading !== null || filteredAnomalies.length === 0}
          >
            {exportLoading === "csv" ? "Generating CSV..." : "Export CSV"}
          </button>
          <button
            className="export-btn secondary"
            onClick={handleExportPdf}
            disabled={exportLoading !== null || filteredAnomalies.length === 0}
          >
            {exportLoading === "pdf" ? "Generating PDF..." : "Export PDF"}
          </button>
        </div>
      )}
      </section>

      <section className="panel" id="map">
        <div className="section-header">
          <h2>Lebanon Live Map</h2>
          <p>Detected anomalies are shown as live map markers for active issues only.</p>
        </div>
        <MapView anomalies={liveMapAnomalies} />
      </section>

      <section className="panel" id="table">
        <div className="section-header">
          <h2>Anomalies Table</h2>
          <p>All detections stored in the anomaly database.</p>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Anomaly</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Municipality</th>
                <th>District</th>
                <th>Governorate</th>
                <th>Reports Count</th>
                <th>Confidence</th>
                <th>Detection Date &amp; Time</th>
                <th>Address</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Evidence</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredAnomalies.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="badge">
                      {item.anomaly || UNKNOWN_ANOMALY_LABEL}
                    </span>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.severity}</td>
                  <td>
                    <span className={getStatusClassName(item.status)}>
                      {normalizeStatusValue(item.status)}
                    </span>
                  </td>
                  <td>{item.municipality_name || "Unknown"}</td>
                  <td>{item.district || "Unknown"}</td>
                  <td>{item.governorate || "Unknown"}</td>
                  <td>{item.reports_count || 1}</td>
                  <td>{Math.round((item.confidence || 0) * 100)}%</td>
                  <td>{formatDetectionDateTime(getDetectionDateTime(item))}</td>
                  <td>
                    {(() => {
                      const mapsUrl = getGoogleMapsUrl(item);
                      const locationLabel = getLocationLabel(item.address);

                      return (
                        <div className="address-cell">
                          {mapsUrl ? (
                            <a
                              className="address-link"
                              href={mapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              title={locationLabel}
                            >
                              {getShortAddress(locationLabel)}
                            </a>
                          ) : (
                            <span
                              className="address-link address-link-disabled"
                              title={locationLabel}
                            >
                              {getShortAddress(locationLabel)}
                            </span>
                          )}
                          {mapsUrl ? (
                            <a
                              className="maps-btn"
                              href={mapsUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open in Maps
                            </a>
                          ) : (
                            <span className="maps-btn maps-btn-disabled">
                              Location unavailable
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td>{item.lat}</td>
                  <td>{item.lng}</td>
                  <td>
                    <div className="evidence-actions">
                      {hasRepairEvidence(item) ? (
                        isPublicViewer(effectiveUserProfile) ? (
                          <span className="evidence-empty">Evidence available</span>
                        ) : (
                          <button
                            className="evidence-btn"
                            onClick={() => setViewEvidenceTarget(item)}
                          >
                            View Evidence
                          </button>
                        )
                      ) : canUploadEvidence(effectiveUserProfile) &&
                        normalizeStatusValue(item.status) === "Repaired" ? (
                          <button
                            className="evidence-btn secondary"
                            onClick={() => openRepairEvidenceModal(item)}
                          >
                            Add Repair Evidence
                          </button>
                        ) : (
                        <span className="evidence-empty">No evidence</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {canUpdateStatus(effectiveUserProfile) ? (
                      <select
                        className="table-status-select"
                        value={normalizeStatusValue(item.status)}
                        onChange={async (e) => {
                          await updateAnomalyStatus(item.id, e.target.value);

                          if (
                            e.target.value === "Repaired" &&
                            canUploadEvidence(effectiveUserProfile)
                          ) {
                            openRepairEvidenceModal({
                              ...item,
                              status: "Repaired",
                            });
                          }
                        }}
                      >
                        {getAllowedStatusOptions(item.status).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      isViewerRole(effectiveUserProfile) ? (
                        <span className={getStatusClassName(item.status)}>
                          {normalizeStatusValue(item.status)}
                        </span>
                      ) : (
                        <span className="action-disabled">Read Only</span>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {hasMoreAnomalies && (
          <div className="show-more-wrap">
            <button
              type="button"
              className="show-more-btn"
              onClick={() => fetchAnomalies({ reset: false })}
              disabled={loadingAnomalies}
            >
              {loadingAnomalies ? "Loading..." : "Show More"}
            </button>
          </div>
        )}
      </section>

      {repairEvidenceTarget && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Add Repair Evidence</h3>
              <button
                className="modal-close"
                onClick={closeRepairEvidenceModal}
                disabled={repairEvidenceLoading}
              >
                Close
              </button>
            </div>

            <div className="modal-body">
              <label className="filter-field">
                <span>Repair Note</span>
                <textarea
                  className="modal-textarea"
                  value={repairNote}
                  onChange={(e) => setRepairNote(e.target.value)}
                  placeholder="Describe the repair work completed"
                />
              </label>

              <label className="filter-field">
                <span>Repair Date</span>
                <input
                  type="date"
                  value={repairDate}
                  onChange={(e) => setRepairDate(e.target.value)}
                />
              </label>

              <label className="filter-field">
                <span>Repaired By</span>
                <input
                  type="text"
                  value={repairedBy}
                  onChange={(e) => setRepairedBy(e.target.value)}
                  placeholder="Municipality team / contractor"
                />
              </label>

              <label className="filter-field">
                <span>Repair Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setRepairPhotoFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <div className="modal-actions">
              <button
                className="export-btn"
                onClick={handleSaveRepairEvidence}
                disabled={repairEvidenceLoading}
              >
                {repairEvidenceLoading ? "Saving..." : "Save Evidence"}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewEvidenceTarget && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Repair Evidence</h3>
              <button
                className="modal-close"
                onClick={() => setViewEvidenceTarget(null)}
              >
                Close
              </button>
            </div>

            <div className="modal-body">
              {viewEvidenceTarget.repair_photo_url ? (
                <img
                  className="evidence-image"
                  src={viewEvidenceTarget.repair_photo_url}
                  alt="Repair evidence"
                />
              ) : (
                <p className="evidence-empty">No repair photo uploaded.</p>
              )}
              <p><strong>Repair Note:</strong> {viewEvidenceTarget.repair_note || "None"}</p>
              <p><strong>Repair Date:</strong> {formatCreatedDate(viewEvidenceTarget.repair_date)}</p>
              <p><strong>Repaired By:</strong> {viewEvidenceTarget.repaired_by || "Unknown"}</p>
            </div>
          </div>
        </div>
      )}

      {showLoginForm && !user && (
        <div className="modal-backdrop">
          <form className="login-card" onSubmit={handleLogin}>
            <div className="login-logo">
              <span className="logo-dot"></span>
              <h1>RoadSense</h1>
            </div>

            <p className="login-subtitle">Admin Dashboard Login</p>

            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />

            {loginError && <p className="login-error">{loginError}</p>}

            <div className="modal-actions">
              <button
                type="button"
                className="export-btn secondary"
                onClick={() => setShowLoginForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="export-btn">
                Login
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
