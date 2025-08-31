"use client"

import {Location} from "@/app/generated/prisma";
import {GoogleMap, Marker, useLoadScript} from "@react-google-maps/api";

interface MapProps {
  itineraries: Location[];
}

export default function Map({itineraries}: MapProps) {
  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  })

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded) return <div>Loading maps...</div>

  const center = itineraries.length > 0
    ? {lat: itineraries[0].lat, lng: itineraries[0].lon}
    : {lat: 0, lng: 0};

  return (
    <GoogleMap mapContainerStyle={{width: "100%", height: "100%"}} zoom={8} center={center}>
      {itineraries.map((location, key) => (
        <Marker
          key={key}
          position={{lat: location.lat, lng: location.lon}}
          title={location.locationTitle}
        />
      ))}
    </GoogleMap>
  )
}

// TODO: MIGRATE TO LocationIQ from Google Maps

//
// "use client";
//
// import {Location} from "@/app/generated/prisma";
// import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
//
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-ignore
// const iconDefault = L.Icon.Default.prototype as any;
// delete iconDefault._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//   iconUrl: require("leaflet/dist/images/marker-icon.png"),
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
// });
//
// interface MapProps {
//   itineraries: Location[];
// }
//
// export default function Map({itineraries}: MapProps) {
//   const center =
//     itineraries.length > 0
//       ? [itineraries[0].lat, itineraries[0].lon]
//       : [0, 0];
//
//   return (
//     <div style={{height: "100vh", width: "100%"}}>
//       <MapContainer center={center} zoom={8} scrollWheelZoom={true} style={{height: "100%", width: "100%"}}>
//         <TileLayer
//           url={`https://maps.locationiq.com/v3/tiles/osm/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY}`}
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//         />
//         {itineraries.map((location, key) => (
//           <Marker key={key} position={[location.lat, location.lon]}>
//             <Popup>{location.locationTitle}</Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// }
