"use server"

import {auth} from "@/auth";
import {prisma} from "@/lib/prisma";
import {getCountryCodeFromCoordinates} from "@/lib/actions/geocode";

type GeocodeSuccess = {
  ok: true;
  lat: number;
  lon: number;
  country_code: string;
};

type GeocodeFail = {
  ok: false;
  error: string;
};

type GeocodeResult = GeocodeSuccess | GeocodeFail;

async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
  const url = `https://eu1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(address)}&format=json`;

  try {
    const data = await fetch(url)
      .then((res) => res.json());

    if (!data || data.length === 0)
      return {ok: false, error: "Could not geocode the address."};

    const {lat, lon} = data[0];
    if (isNaN(lat) || isNaN(lon))
      return {ok: false, error: "Invalid coordinates returned."};

    const {code} = await getCountryCodeFromCoordinates(
      parseFloat(lat),
      parseFloat(lon)
    );

    return {
      ok: true,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country_code: code,
    };

  } catch (error) {
    console.error("Error parsing JSON:", error);
    return {ok: false, error: "Could not geocode the address. Try to specify more details."};
  }
}

export async function addLocation(formData: FormData, tripId: string) {
  const session = await auth();
  if (!session)
    return {error: "Not authenticated."};

  const address = formData.get("address")?.toString();
  if (!address)
    return {error: "Address is missing."};

  const location = await geocodeAddress(address);
  if (!location.ok)
    return {error: location.error};

  const {lat, lon, country_code} = location;

  const count = await prisma.location.count({
    where: {tripId}
  });

  await prisma.location.create({
    data: {
      locationTitle: address,
      lat,
      lon,
      country_code,
      trip: {connect: {id: tripId}},
      order: count,
    }
  });

  // redirect(`/trips/${tripId}`);
  return {success: true};
}
