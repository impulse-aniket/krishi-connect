import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

function LocationMap({
  latitude,
  longitude,
  location,
  title = "Location",
}) {
  if (!latitude || !longitude) {
    return (
      <div className="bg-gray-100 rounded-lg p-5 text-center text-gray-600">
        Location coordinates are not available.
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden shadow">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{
          height: "350px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[latitude, longitude]}>
          <Popup>
            <strong>{title}</strong>
            <br />
            {location}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default LocationMap;