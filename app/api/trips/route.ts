import {auth} from "@/auth";
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import rawCountryCodes from "@/public/country_codes.json";

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
        country_code: true,
        trip: {
          select: {
            title: true,
          }
        }
      }
    });

    const countryCodes: Record<string, string> = rawCountryCodes;
    const transformedLocations = locations.map((loc: {
      locationTitle: string;
      lat: number;
      lon: number;
      country_code: string | null;
      trip: { title: string };
    }) => {
      const code = loc.country_code?.toLowerCase() ?? "xx";
      const countryName = countryCodes[code] ?? "Unknown country";

      return {
        name: `${loc.trip.title} - ${countryName}`,
        lat: loc.lat,
        lon: loc.lon,
        country: countryName,
      };
    });

    // Pobranie danych dotyczących wszystkich odwiedzonych lokalizacji, przerobionych na widok 3D
    return NextResponse.json(transformedLocations);
  } catch (err) {
    console.error("Error in GET fetching locations:", err);
    throw new NextResponse("Error", {status: 500})
  }
}