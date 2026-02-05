import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { LatLng, Icon } from "leaflet";
import { Search, MapPin, Loader2 } from "lucide-react";

// Fix para el ícono de Leaflet en React
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

// Coordenadas de San Juan, Argentina
const SAN_JUAN_CENTER: [number, number] = [-31.5375, -68.5364];
const DEFAULT_ZOOM = 13;

interface MapSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (lat: number, lng: number, address?: string) => void;
  initialLat?: number;
  initialLng?: number;
}

// Componente para manejar clicks en el mapa
function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Componente para centrar el mapa
function MapCenterHandler({ center }: { center: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 16);
    }
  }, [center, map]);

  return null;
}

export function MapSelector({
  open,
  onClose,
  onSelect,
  initialLat,
  initialLng,
}: MapSelectorProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchCenter, setSearchCenter] = useState<[number, number] | null>(
    null,
  );

  // Reset cuando se abre el modal
  useEffect(() => {
    if (open) {
      if (initialLat && initialLng) {
        setPosition([initialLat, initialLng]);
        setSearchCenter([initialLat, initialLng]);
      } else {
        setPosition(null);
        setSearchCenter(null);
      }
      setSearchQuery("");
    }
  }, [open, initialLat, initialLng]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setPosition([lat, lng]);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Usar Nominatim (OpenStreetMap) para geocoding
      const query = encodeURIComponent(`${searchQuery}, San Juan, Argentina`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition: [number, number] = [
          parseFloat(lat),
          parseFloat(lon),
        ];
        setPosition(newPosition);
        setSearchCenter(newPosition);
      } else {
        // No se encontró la dirección
        alert(
          "No se encontró la dirección. Intentá con otra búsqueda o hacé click en el mapa.",
        );
      }
    } catch (error) {
      console.error("Error buscando dirección:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirm = async () => {
    if (!position) return;

    // Obtener dirección aproximada (reverse geocoding)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`,
      );
      const data = await response.json();
      const address = data.display_name || "";
      onSelect(position[0], position[1], address);
    } catch {
      onSelect(position[0], position[1]);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Seleccionar ubicación
          </DialogTitle>
        </DialogHeader>

        {/* Buscador */}
        <div className="flex gap-2 mb-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Buscar dirección... (ej: Av. Libertador 1234)"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-2">
          Buscá una dirección o hacé click en el mapa para marcar la ubicación
          exacta
        </p>

        {/* Mapa */}
        <div className="flex-1 rounded-lg overflow-hidden border border-border">
          <MapContainer
            center={
              initialLat && initialLng
                ? [initialLat, initialLng]
                : SAN_JUAN_CENTER
            }
            zoom={DEFAULT_ZOOM}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onLocationSelect={handleLocationSelect} />
            <MapCenterHandler center={searchCenter} />
            {position && <Marker position={position} icon={defaultIcon} />}
          </MapContainer>
        </div>

        {position && (
          <p className="text-sm text-muted-foreground mt-2">
            📍 Coordenadas: {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="hero" onClick={handleConfirm} disabled={!position}>
            Confirmar ubicación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
