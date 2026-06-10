import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { db, auth } from "./firebase";
import MapView from "./MapView";
import "./App.css";

function App() {
  const [anomalies, setAnomalies] = useState([]);
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "anomalies"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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

  const knownTypes = ["pothole", "fallen-cone", "fallen-barrier", "fallen-pole"];

  const potholes = anomalies.filter(
    (a) => a.anomaly?.toLowerCase() === "pothole"
  ).length;

  const cones = anomalies.filter(
    (a) => a.anomaly?.toLowerCase() === "fallen-cone"
  ).length;

  const barriers = anomalies.filter(
    (a) => a.anomaly?.toLowerCase() === "fallen-barrier"
  ).length;

  const poles = anomalies.filter(
    (a) => a.anomaly?.toLowerCase() === "fallen-pole"
  ).length;

  const others = anomalies.filter(
    (a) => !knownTypes.includes(a.anomaly?.toLowerCase())
  ).length;

  const latest = anomalies[0];

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
          <p className="description">
            Real-time road anomaly detection using YOLO, GPS, Firebase, and live map visualization.
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
            <h3>🚨 Latest Detection</h3>
            <p>
              {latest.anomaly || "Other"} detected at {latest.address || "Unknown location"}
            </p>
          </div>
          <span>{Math.round((latest.confidence || 0) * 100)}%</span>
        </div>
      )}

      <div className="cards">
        <div className="card total">Total<br /><strong>{anomalies.length}</strong></div>
        <div className="card pothole">Potholes<br /><strong>{potholes}</strong></div>
        <div className="card cone">Cones<br /><strong>{cones}</strong></div>
        <div className="card barrier">Barriers<br /><strong>{barriers}</strong></div>
        <div className="card pole">Poles<br /><strong>{poles}</strong></div>
        <div className="card other">Others<br /><strong>{others}</strong></div>
      </div>

      <section className="panel" id="map">
        <div className="section-header">
          <h2>Lebanon Live Map</h2>
          <p>Detected anomalies are shown as live map markers.</p>
        </div>
        <MapView anomalies={anomalies} />
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
                <th>Confidence</th>
                <th>Address</th>
                <th>Latitude</th>
                <th>Longitude</th>
              </tr>
            </thead>

            <tbody>
              {anomalies.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="badge">
                      {knownTypes.includes(item.anomaly?.toLowerCase())
                        ? item.anomaly
                        : "Other"}
                    </span>
                  </td>
                  <td>{Math.round((item.confidence || 0) * 100)}%</td>
                  <td>{item.address}</td>
                  <td>{item.lat}</td>
                  <td>{item.lng}</td>
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