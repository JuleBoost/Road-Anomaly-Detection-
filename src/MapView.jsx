import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const STATUS_MARKER_CLASS_NAMES = {
  New: "pin-new",
  "Under Review": "pin-under-review",
  Assigned: "pin-assigned",
  Repaired: "pin-repaired",
  Rejected: "pin-rejected",
};

const ACTIVE_LEGEND_ITEMS = [
  { label: "New", className: "pin-new" },
  { label: "Under Review", className: "pin-under-review" },
  { label: "Assigned", className: "pin-assigned" },
];

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

function normalizeStatusValue(status) {
  if (status === "Verified") {
    return "Repaired";
  }

  return STATUS_MARKER_CLASS_NAMES[status] ? status : "New";
}

function getMarkerIcon(status) {
  const normalizedStatus = normalizeStatusValue(status);
  const markerClassName = STATUS_MARKER_CLASS_NAMES[normalizedStatus];

  return L.divIcon({
    className: "custom-map-pin-wrapper",
    html: `
      <span class="custom-map-pin-shadow"></span>
      <span class="custom-map-pin ${markerClassName}"></span>
    `,
    iconSize: [28, 40],
    iconAnchor: [14, 36],
    popupAnchor: [0, -32],
  });
}

function MapView({ anomalies }) {
  const validAnomalies = anomalies.filter((item) => getCoordinateValues(item));

  return (
    <div className="map-shell">
      <div className="map-legend" aria-label="Active map legend">
        <h3>Active Issues</h3>
        {ACTIVE_LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="map-legend-item">
            <span className="map-legend-pin">
              <span className={`custom-map-pin ${item.className}`}></span>
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <MapContainer
        center={[33.8938, 35.5018]}
        zoom={10}
        style={{ height: "420px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validAnomalies.map((item) => {
          const coordinates = getCoordinateValues(item);
          const mapsUrl = getGoogleMapsUrl(item);

          return (
            <Marker
              key={item.id}
              position={[coordinates.latitude, coordinates.longitude]}
              icon={getMarkerIcon(item.status)}
            >
              <Popup>
                <div className="map-popup">
                  <h3>{item.anomaly || "Unknown Anomaly"}</h3>
                  <p><strong>Status:</strong> {item.status || "Unknown"}</p>
                  <p><strong>Confidence:</strong> {Math.round((item.confidence || 0) * 100)}%</p>
                  <p><strong>Location:</strong> {getLocationLabel(item.address)}</p>
                  <p><strong>Latitude:</strong> {coordinates.latitude}</p>
                  <p><strong>Longitude:</strong> {coordinates.longitude}</p>
                  {mapsUrl ? (
                    <a
                      className="maps-btn"
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open in Google Maps
                    </a>
                  ) : (
                    <span className="maps-btn maps-btn-disabled">
                      Location unavailable
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;
