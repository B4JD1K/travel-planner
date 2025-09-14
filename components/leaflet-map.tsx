"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface MapWithMarkersProps {
  itineraries: { lat: number; lon: number; locationTitle: string; id: string }[];
}

export default function MapWithMarkers({ itineraries }: MapWithMarkersProps) {
  const center: LatLngTuple =
    itineraries.length > 0 ? [itineraries[0].lat, itineraries[0].lon] : [0, 0];

  return (
    <MapContainer center={center} zoom={8} scrollWheelZoom style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url={`https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY}`}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {itineraries.map((location) => (
        <Marker key={location.id} position={[location.lat, location.lon]}>
          <Popup>{location.locationTitle}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
