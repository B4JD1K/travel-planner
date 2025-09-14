"use server"

import {auth} from "@/auth";
import {prisma} from "@/lib/prisma";
import {getCountryCodeFromCoordinates} from "@/lib/actions/geocode";
import countryCodes from "@/public/country_codes.json";
import {Result, GeocodeData} from "@/lib/types";

async function geocodeAddress(address: string): Promise<Result<GeocodeData>> {
  const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
  const url = `https://eu1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(address)}&format=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data || data.length === 0)
      return {
        success: false,
        message: "Could not geocode the address."
      };

    const {lat, lon} = data[0];
    if (isNaN(lat) || isNaN(lon))
      return {
        success: false,
        message: "Invalid coordinates returned."
      };

    const countryResult = await getCountryCodeFromCoordinates(
      parseFloat(lat),
      parseFloat(lon)
    );

    if (!countryResult.success)
      return {
        success: false,
        message: "Could not determine country code."
      };

    const {code} = countryResult.data!;

    return {
      success: true,
      message: "Geocoding successful.",
      data: {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        country_code: code,
      }
    };

  } catch (error) {
    console.error("Error parsing JSON:", error);

    return {
      success: false,
      message: "Could not geocode address, provide more details."
    };
  }
}

export async function addLocation(formData: FormData, tripId: string): Promise<Result> {
  const session = await auth();
  if (!session)
    return {
      success: false,
      message: "Not authenticated."
    };

  const address = formData.get("address")?.toString();
  if (!address)
    return {
      success: false,
      message: "Address is missing."
    };

  const location = await geocodeAddress(address);
  if (!location.success)
    return {
      success: false,
      message: location.message
    };

  const {lat, lon, country_code} = location.data!;

  const count = await prisma.location.count({where: {tripId}});

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

  return {
    success: true,
    message: `Address geocoded successfully for location in placed in ${countryCodes[country_code as keyof typeof countryCodes]}.`
  };
}
