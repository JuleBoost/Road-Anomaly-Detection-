import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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

function MapView({ anomalies }) {
  const validAnomalies = anomalies.filter((item) => getCoordinateValues(item));

  return (
    <div style={{ height: "420px", width: "100%", marginTop: "20px" }}>
      <MapContainer
        center={[33.8938, 35.5018]}
        zoom={10}
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
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
              icon={markerIcon}
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
