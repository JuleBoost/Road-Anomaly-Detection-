import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
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
import { db, auth } from "./firebase";
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
const CATEGORY_CHART_COLORS = ["#ef4444", "#f97316", "#eab308", "#60a5fa"];
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

function formatCreatedDate(timestamp) {
  if (!timestamp) {
    return "Unknown";
  }

  if (typeof timestamp?.toDate === "function") {
    return timestamp.toDate().toLocaleString();
  }

  if (timestamp instanceof Date) {
    return timestamp.toLocaleString();
  }

  const parsedDate = new Date(timestamp);

  return Number.isNaN(parsedDate.getTime())
    ? "Unknown"
    : parsedDate.toLocaleString();
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

  return "Other";
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

function normalizeAnomalyRecord(record) {
  const anomaly = record.anomaly || "Other";
  const municipalityDetails = getMunicipalityDetails(record.municipality_id);

  return {
    ...record,
    anomaly,
    category: record.category || getCategory(anomaly),
    severity: record.severity || getSeverity(anomaly),
    status: record.status || "New",
    reports_count: record.reports_count || 1,
    municipality_name:
      record.municipality_name || municipalityDetails.municipality_name,
    district: record.district || municipalityDetails.district,
    governorate: record.governorate || municipalityDetails.governorate,
  };
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
  const [exportLoading, setExportLoading] = useState(null);
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

    const q = query(collection(db, "anomalies"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) =>
        normalizeAnomalyRecord({
          id: doc.id,
          ...doc.data(),
        })
      );
      setAnomalies(data);
    });

    return () => unsubscribe();
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
    setUserProfile(null);
    setLoadingProfile(false);
  };

  const updateAnomalyStatus = async (anomalyId, newStatus) => {
    try {
      const anomalyRef = doc(db, "anomalies", anomalyId);
      await updateDoc(anomalyRef, {
        status: newStatus,
        updated_at: new Date(),
      });
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const exportRows = filteredAnomalies.map((item) => ({
    anomaly: item.anomaly || "Other",
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
    createdDate: formatCreatedDate(item.timestamp || item.first_seen_at),
  }));

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

      autoTable(pdf, {
        startY: 64,
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
        ]),
        styles: {
          fontSize: 8,
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

  const normalizedSearchText = searchText.trim().toLowerCase();
  const filteredAnomalies = visibleAnomalies.filter((item) => {
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
    "Other",
  ].map((category) => ({
    name: category,
    value: filteredAnomalies.filter((item) => item.category === category).length,
  }));
  const statusChartData = STATUS_OPTIONS.map((status) => ({
    name: status,
    value: filteredAnomalies.filter((item) => item.status === status).length,
  }));
  const latest = filteredAnomalies[0];

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
              {latest.anomaly || "Other"} detected at{" "}
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
        <div className="card other">
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
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
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
        <div className="section-header">
          <h2>Dashboard Filters</h2>
          <p>
            Showing {filteredAnomalies.length} of {visibleAnomalies.length} reports
          </p>
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
              <option value="Other">Other</option>
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
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredAnomalies.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="badge">{item.anomaly || "Other"}</span>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.severity}</td>
                  <td>{item.status}</td>
                  <td>{item.municipality_name || "Unknown"}</td>
                  <td>{item.district || "Unknown"}</td>
                  <td>{item.governorate || "Unknown"}</td>
                  <td>{item.reports_count || 1}</td>
                  <td>{Math.round((item.confidence || 0) * 100)}%</td>
                  <td>{item.address || "Unknown location"}</td>
                  <td>{item.lat}</td>
                  <td>{item.lng}</td>
                  <td>
                    <select
                      className="table-status-select"
                      value={item.status}
                      onChange={(e) =>
                        updateAnomalyStatus(item.id, e.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map((status) => (
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
      </section>
    </div>
  );
}

export default App;
