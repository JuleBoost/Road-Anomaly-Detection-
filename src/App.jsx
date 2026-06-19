import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
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
import { db, auth, storage } from "./firebase";
import { findMunicipalityById } from "./utils/municipalityDirectory";
import MapView from "./MapView";
import "./App.css";

const ROAD_DAMAGE_TYPES = ["pothole", "faded-marking"];
const ROAD_SAFETY_OBJECT_TYPES = [
  "fallen-cone",
  "fallen-barrier",
  "fallen-pole",
];
const TRAFFIC_INFRASTRUCTURE_TYPES = [
  "damaged-traffic-sign",
  "damaged-street-light",
];
const STATUS_OPTIONS = [
  "New",
  "Under Review",
  "Assigned",
  "Repaired",
  "Verified",
  "Duplicate",
  "Rejected",
];
const ACTION_STATUS_OPTIONS = [
  "New",
  "Under Review",
  "Assigned",
  "Repaired",
  "Verified",
  "Rejected",
];
const CATEGORY_CHART_COLORS = ["#ef4444", "#f97316", "#eab308", "#60a5fa"];
const ANOMALIES_PAGE_SIZE = 10;
const UNKNOWN_ANOMALY_LABEL = "Unknown Anomaly";
const UNCLASSIFIED_CATEGORY = "Unclassified";
const UNKNOWN_LOCATION_DETAILS = {
  municipality_name: "Unknown",
  district: "Unknown",
  governorate: "Unknown",
};

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
    resolveDateValue(anomaly?.created_at) ||
    resolveDateValue(anomaly?.first_seen_at) ||
    resolveDateValue(anomaly?.last_seen_at)
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

function formatCreatedDate(timestamp) {
  const parsedDate = resolveDateValue(timestamp);

  return parsedDate === null
    ? "Unknown"
    : parsedDate.toLocaleString();
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
  const normalizedAnomaly = anomaly?.toLowerCase?.() ?? "";

  if (ROAD_DAMAGE_TYPES.includes(normalizedAnomaly)) {
    return "Road Damage";
  }

  if (ROAD_SAFETY_OBJECT_TYPES.includes(normalizedAnomaly)) {
    return "Road Safety Objects";
  }

  if (TRAFFIC_INFRASTRUCTURE_TYPES.includes(normalizedAnomaly)) {
    return "Traffic Infrastructure";
  }

  return UNCLASSIFIED_CATEGORY;
}

function getSeverity(anomaly) {
  const normalizedAnomaly = anomaly?.toLowerCase?.() ?? "";

  if (
    [
      "pothole",
      "fallen-barrier",
      "fallen-pole",
      "damaged-street-light",
    ].includes(normalizedAnomaly)
  ) {
    return "High";
  }

  if (
    [
      "faded-marking",
      "fallen-cone",
      "damaged-traffic-sign",
    ].includes(normalizedAnomaly)
  ) {
    return "Medium";
  }

  return "Low";
}

function normalizeCategoryValue(category, anomaly) {
  if (!category || category === "Other") {
    return getCategory(anomaly);
  }

  return category;
}

function normalizeAnomalyRecord(record) {
  const anomaly = record.anomaly || UNKNOWN_ANOMALY_LABEL;
  const municipalityId = record.municipality_id || "unknown";
  const municipalityDetails = getMunicipalityDetails(municipalityId);

  return {
    ...record,
    anomaly,
    municipality_id: municipalityId,
    category: normalizeCategoryValue(record.category, anomaly),
    severity: record.severity || getSeverity(anomaly),
    status: record.status || "New",
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

function dedupeAnomaliesForDisplay(items) {
  return items.reduce((dedupedItems, item) => {
    const existingIndex = dedupedItems.findIndex((currentItem) => {
      if (currentItem.anomaly !== item.anomaly) {
        return false;
      }

      return (
        calculateDistanceMeters(
          currentItem.lat,
          currentItem.lng,
          item.lat,
          item.lng
        ) <= 10
      );
    });

    if (existingIndex === -1) {
      dedupedItems.push(item);
      return dedupedItems;
    }

    const existingItem = dedupedItems[existingIndex];

    dedupedItems[existingIndex] = {
      ...existingItem,
      reports_count:
        (existingItem.reports_count || 1) + (item.reports_count || 1),
      confidence: Math.max(existingItem.confidence || 0, item.confidence || 0),
      repair_note: existingItem.repair_note || item.repair_note || "",
      repair_photo_url:
        existingItem.repair_photo_url || item.repair_photo_url || "",
      repair_date: existingItem.repair_date || item.repair_date || null,
      repaired_by: existingItem.repaired_by || item.repaired_by || "",
    };

    return dedupedItems;
  }, []);
}

function App() {
  const [anomalies, setAnomalies] = useState([]);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [loadingAnomalies, setLoadingAnomalies] = useState(false);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
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

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserProfile(null);
      setLoadingProfile(Boolean(currentUser));
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      setLoadingProfile(false);
      return;
    }

    const loadUserProfile = async () => {
      setLoadingProfile(true);

      try {
        const userProfileRef = doc(db, "users", user.uid);
        const userProfileSnapshot = await getDoc(userProfileRef);

        if (userProfileSnapshot.exists()) {
          setUserProfile(userProfileSnapshot.data());
        } else {
          setUserProfile({ role: "municipality", municipality_id: "" });
        }
      } catch (error) {
        setUserProfile({ role: "municipality", municipality_id: "" });
      } finally {
        setLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetchAnomalies({ reset: true });
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error) {
      setLoginError("Wrong email or password");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setAnomalies([]);
    setLastVisibleDoc(null);
    setHasMoreAnomalies(true);
    setUserProfile(null);
    setLoadingProfile(false);
    setLoadingAnomalies(false);
  };

  const fetchAnomalies = async ({ reset = false } = {}) => {
    if (!user) {
      return;
    }

    if (!reset && (!hasMoreAnomalies || lastVisibleDoc === null)) {
      return;
    }

    setLoadingAnomalies(true);

    try {
      const queryConstraints = [
        orderBy("timestamp", "desc"),
        limit(ANOMALIES_PAGE_SIZE),
      ];

      if (!reset && lastVisibleDoc) {
        queryConstraints.splice(1, 0, startAfter(lastVisibleDoc));
      }

      const snapshot = await getDocs(
        query(collection(db, "anomalies"), ...queryConstraints)
      );

      const data = snapshot.docs.map((doc) =>
        normalizeAnomalyRecord({
          id: doc.id,
          ...doc.data(),
        })
      );

      setLastVisibleDoc(snapshot.docs.at(-1) || null);
      setHasMoreAnomalies(snapshot.docs.length === ANOMALIES_PAGE_SIZE);
      setAnomalies((current) => {
        const mergedRecords = reset ? data : [...current, ...data];
        const uniqueRecords = Array.from(
          new Map(mergedRecords.map((item) => [item.id, item])).values()
        );

        return uniqueRecords.sort((first, second) => {
          const firstTimestamp = getAnomalyDate(first)?.getTime() || 0;
          const secondTimestamp = getAnomalyDate(second)?.getTime() || 0;

          return secondTimestamp - firstTimestamp;
        });
      });
    } finally {
      setLoadingAnomalies(false);
    }
  };

  const updateAnomalyStatus = async (anomalyId, newStatus) => {
    try {
      console.log("[RoadSense] Status update starting:", {
        anomalyId,
        newStatus,
      });
      const anomalyRef = doc(db, "anomalies", anomalyId);
      await updateDoc(anomalyRef, {
        status: newStatus,
        updated_at: new Date(),
      });
      setAnomalies((current) =>
        current.map((item) =>
          item.id === anomalyId
            ? {
                ...item,
                status: newStatus,
                updated_at: new Date(),
              }
            : item
        )
      );
      console.log("[RoadSense] Status update succeeded:", {
        anomalyId,
        newStatus,
      });
    } catch (error) {
      console.error("[RoadSense] Status update failed:", {
        anomalyId,
        newStatus,
        error,
      });
      alert("Failed to update status");
    }
  };

  const openRepairEvidenceModal = (item) => {
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

    setRepairEvidenceLoading(true);

    try {
      let repairPhotoUrl = repairEvidenceTarget.repair_photo_url || "";

      if (repairPhotoFile) {
        const storageRef = ref(
          storage,
          `repair-evidence/${repairEvidenceTarget.id}/${Date.now()}-${repairPhotoFile.name}`
        );
        await uploadBytes(storageRef, repairPhotoFile);
        repairPhotoUrl = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, "anomalies", repairEvidenceTarget.id), {
        repair_note: repairNote,
        repair_photo_url: repairPhotoUrl,
        repair_date: repairDate ? new Date(repairDate) : new Date(),
        repaired_by: repairedBy || user?.email || "Unknown",
        updated_at: new Date(),
      });

      closeRepairEvidenceModal();
    } catch (error) {
      alert("Failed to save repair evidence");
      setRepairEvidenceLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="login-page">
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

          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  if (loadingProfile) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <span className="logo-dot"></span>
            <h1>RoadSense</h1>
          </div>
          <p className="login-subtitle">Loading municipality access...</p>
        </div>
      </div>
    );
  }

  const visibleAnomalies =
    userProfile?.role === "municipality"
      ? anomalies.filter(
          (item) => item.municipality_id === userProfile.municipality_id
        )
      : anomalies;
  const dedupedVisibleAnomalies = dedupeAnomaliesForDisplay(visibleAnomalies);
  const displayAnomalies = dedupedVisibleAnomalies.filter(
    (item) => item.category !== UNCLASSIFIED_CATEGORY
  );

  const normalizedSearchText = searchText.trim().toLowerCase();
  const filteredAnomalies = displayAnomalies.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSeverity =
      selectedSeverity === "All" || item.severity === selectedSeverity;
    const matchesStatus =
      selectedStatus === "All" || item.status === selectedStatus;
    const matchesSearch =
      normalizedSearchText === "" ||
      [
        item.anomaly,
        item.address,
        item.municipality_id,
        item.municipality_name,
        item.district,
        item.governorate,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toString().toLowerCase().includes(normalizedSearchText)
        );

    return (
      matchesCategory && matchesSeverity && matchesStatus && matchesSearch
    );
  });
  const portalLabel =
    userProfile?.role === "municipality"
      ? `Municipality Portal: ${userProfile.municipality_id || "Unassigned"}`
      : "Super Admin View";

  const openIssuesCount = filteredAnomalies.filter(
    (a) => a.status !== "Repaired" && a.status !== "Rejected"
  ).length;
  const repairedIssuesCount = filteredAnomalies.filter(
    (a) => a.status === "Repaired"
  ).length;
  const highSeverityCount = filteredAnomalies.filter(
    (a) => a.severity === "High"
  ).length;
  const totalReportsCount = filteredAnomalies.reduce(
    (sum, item) => sum + (item.reports_count || 1),
    0
  );
  const repairProgress =
    filteredAnomalies.length === 0
      ? 0
      : Math.round((repairedIssuesCount / filteredAnomalies.length) * 100);
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
  ]
    .map((category) => ({
      name: category,
      value: filteredAnomalies.filter((item) => item.category === category).length,
    }))
    .filter((item) => item.value > 0);
  const statusChartData = STATUS_OPTIONS.map((status) => ({
    name: status,
    value: filteredAnomalies.filter((item) => item.status === status).length,
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
        "Created Date",
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
          row.createdDate,
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
      const reportDate = new Date().toLocaleString();
      const municipalityLabel =
        userProfile?.role === "municipality"
          ? userProfile.municipality_id || "Unknown Municipality"
          : "All Visible Municipalities";

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
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <section className="hero" id="dashboard">
        <div>
          <p className="subtitle">Road Anomaly Detection System</p>
          <h1>Smart Road Monitoring Dashboard</h1>
          <p className="description">{portalLabel}</p>
          <p className="description">
            Real-time road anomaly detection using YOLO, GPS, Firebase, and
            live map visualization.
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
              placeholder="Search anomaly, address, or municipality"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="panel export-panel">
        <div className="section-header">
          <h2>Report Export</h2>
          <p>Export the currently filtered anomaly list as CSV or PDF.</p>
        </div>

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
      </section>

      <section className="panel" id="map">
        <div className="section-header">
          <h2>Lebanon Live Map</h2>
          <p>Detected anomalies are shown as live map markers.</p>
        </div>
        <MapView anomalies={filteredAnomalies} />
      </section>

      <section className="panel" id="table">
        <div className="section-header">
          <h2>Anomalies Table</h2>
          <p>All detections stored in Firebase Firestore.</p>
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
                  <td>{item.status}</td>
                  <td>{item.municipality_name || "Unknown"}</td>
                  <td>{item.district || "Unknown"}</td>
                  <td>{item.governorate || "Unknown"}</td>
                  <td>{item.reports_count || 1}</td>
                  <td>{Math.round((item.confidence || 0) * 100)}%</td>
                  <td>
                    <div className="address-cell">
                      <a
                        className="address-link"
                        href={`https://www.google.com/maps?q=${item.lat},${item.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        title={item.address || "Unknown location"}
                      >
                        {getShortAddress(item.address)}
                      </a>
                      <a
                        className="maps-btn"
                        href={`https://www.google.com/maps?q=${item.lat},${item.lng}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open in Maps
                      </a>
                    </div>
                  </td>
                  <td>{item.lat}</td>
                  <td>{item.lng}</td>
                  <td>
                    <div className="evidence-actions">
                      {(item.repair_photo_url || item.repair_note || item.repaired_by) && (
                        <button
                          className="evidence-btn"
                          onClick={() => setViewEvidenceTarget(item)}
                        >
                          View Evidence
                        </button>
                      )}
                      {userProfile?.role === "municipality" &&
                        item.status === "Repaired" &&
                        !(item.repair_photo_url || item.repair_note || item.repaired_by) && (
                          <button
                            className="evidence-btn secondary"
                            onClick={() => openRepairEvidenceModal(item)}
                          >
                            Add Repair Evidence
                          </button>
                        )}
                      {!(
                        (item.repair_photo_url || item.repair_note || item.repaired_by) ||
                        (userProfile?.role === "municipality" &&
                          item.status === "Repaired")
                      ) && <span className="evidence-empty">No evidence</span>}
                    </div>
                  </td>
                  <td>
                    <select
                      className="table-status-select"
                      value={item.status || "New"}
                      onChange={async (e) => {
                        await updateAnomalyStatus(item.id, e.target.value);

                        if (
                          e.target.value === "Repaired" &&
                          userProfile?.role === "municipality"
                        ) {
                          openRepairEvidenceModal({
                            ...item,
                            status: "Repaired",
                          });
                        }
                      }}
                    >
                      {ACTION_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
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
    </div>
  );
}

export default App;
