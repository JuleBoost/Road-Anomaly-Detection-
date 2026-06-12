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
import { db, auth } from "./firebase";
import MapView from "./MapView";
import "./App.css";

const ROAD_DAMAGE_TYPES = ["pothole", "crack", "faded-marking"];
const ROAD_SAFETY_OBJECT_TYPES = [
  "fallen-cone",
  "fallen-barrier",
  "fallen-pole",
  "road-debris",
];
const TRAFFIC_INFRASTRUCTURE_TYPES = [
  "damaged-traffic-sign",
  "fallen-traffic-sign",
  "missing-sign-text",
  "street-light-off",
];

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
      "road-debris",
      "fallen-traffic-sign",
      "street-light-off",
    ].includes(normalizedAnomaly)
  ) {
    return "High";
  }

  if (
    [
      "crack",
      "faded-marking",
      "fallen-cone",
      "damaged-traffic-sign",
      "missing-sign-text",
    ].includes(normalizedAnomaly)
  ) {
    return "Medium";
  }

  return "Low";
}

function normalizeAnomalyRecord(record) {
  const anomaly = record.anomaly || "Other";

  return {
    ...record,
    anomaly,
    category: record.category || getCategory(anomaly),
    severity: record.severity || getSeverity(anomaly),
    status: record.status || "New",
    reports_count: record.reports_count || 1,
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
      [item.anomaly, item.address, item.municipality_id]
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

  const roadDamageCount = filteredAnomalies.filter(
    (a) => a.category === "Road Damage"
  ).length;
  const safetyObjectsCount = filteredAnomalies.filter(
    (a) => a.category === "Road Safety Objects"
  ).length;
  const trafficInfrastructureCount = filteredAnomalies.filter(
    (a) => a.category === "Traffic Infrastructure"
  ).length;
  const highSeverityCount = filteredAnomalies.filter(
    (a) => a.severity === "High"
  ).length;
  const othersCount = filteredAnomalies.filter(
    (a) => a.category === "Other"
  ).length;

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
          Total Reports
          <br />
          <strong>{filteredAnomalies.length}</strong>
        </div>
        <div className="card road-damage">
          Road Damage
          <br />
          <strong>{roadDamageCount}</strong>
        </div>
        <div className="card safety-objects">
          Safety Objects
          <br />
          <strong>{safetyObjectsCount}</strong>
        </div>
        <div className="card traffic-infrastructure">
          Traffic Infrastructure
          <br />
          <strong>{trafficInfrastructureCount}</strong>
        </div>
        <div className="card high-severity">
          High Severity
          <br />
          <strong>{highSeverityCount}</strong>
        </div>
        <div className="card other">
          Others
          <br />
          <strong>{othersCount}</strong>
        </div>
      </div>

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
              <option value="New">New</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="Repaired">Repaired</option>
              <option value="Verified">Verified</option>
              <option value="Duplicate">Duplicate</option>
              <option value="Rejected">Rejected</option>
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
                      <option value="New">New</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Repaired">Repaired</option>
                      <option value="Verified">Verified</option>
                      <option value="Duplicate">Duplicate</option>
                      <option value="Rejected">Rejected</option>
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
