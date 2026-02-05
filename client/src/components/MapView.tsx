import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

// Fix para el ícono de Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapViewProps {
  lat: number;
  lng: number;
  titulo?: string;
  direccion?: string;
  height?: string;
}

export function MapView({
  lat,
  lng,
  titulo,
  direccion,
  height = "200px",
}: MapViewProps) {
  return (
    <div
      className="rounded-lg overflow-hidden border border-border"
      style={{ height }}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={defaultIcon}>
          {(titulo || direccion) && (
            <Popup>
              {titulo && <strong>{titulo}</strong>}
              {direccion && <p className="text-sm">{direccion}</p>}
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
}
