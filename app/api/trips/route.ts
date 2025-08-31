import {auth} from "@/auth";
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {getCountryFromCoordinates} from "@/lib/actions/geocode";

export async function GET() {
  try {
    const session = await auth();
    if (!session)
      return new NextResponse("Not authenticated.", {status: 401});

    const locations = await prisma.location.findMany({
      where: {
        trip: {
          userId: session.user?.id
        },
      },
      select: {
        locationTitle: true,
        lat: true,
        lon: true,
        trip: {
          select: {
            title: true,
          }
        }
      }
    });

    const transformedLocations = await Promise.all(locations.map(async (loc) => {
      const geocodeResult = await getCountryFromCoordinates(loc.lat, loc.lon);
      return {
        name: `${loc.trip.title} - ${geocodeResult.country}`,
        lat: loc.lat,
        lon: loc.lon,
        country: geocodeResult.country,
      }
    }))

    // Pobranie danych dotyczących wszystkich odwiedzonych lokalizacji, przerobionych na widok 3D
    return NextResponse.json(transformedLocations);
  } catch (err) {
    console.error("Error in GET fetching locations:", err);
    throw new NextResponse("Error", {status: 500})
  }
}