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

function MapView({ anomalies }) {
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

        {anomalies.map((item) => (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={markerIcon}
          >
            <Popup>
              <b>{item.anomaly}</b>
              <br />
              Confidence: {Math.round(item.confidence * 100)}%
              <br />
              {item.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;