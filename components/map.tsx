import dynamic from "next/dynamic";
import { Location } from "@/app/generated/prisma";

const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
});

interface MapPageProps {
  itineraries: Location[];
}

export default function Map({ itineraries }: MapPageProps) {
  return <LeafletMap itineraries={itineraries} />;
}
