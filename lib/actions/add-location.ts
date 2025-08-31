"use server"

import {auth} from "@/auth";
import {prisma} from "@/lib/prisma";
import {redirect} from "next/navigation";

async function geocodeAddress(address: string) {
  const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
  const url = `https://eu1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(address)}&format=json`;

  const response = await fetch(url);

  /* DZIAŁA, ale do weryfikacji przy zmianie map.tsx z Google Maps na Mapę LocationIQ
  const data = await response.json();

  try {
    if (!data || data.length === 0) return null;
    {...}
  }
  * */

  // Pobranie odpowiedzi w formie tekstowej
  const textResponse = await response.text();

  try {
    const data = JSON.parse(textResponse); // Próba sparsowania tekstu do JSONa
    if (!data || data.length === 0) return null;

    const {lat, lon} = data[0];
    if (isNaN(lat) || isNaN(lon)) return null;

    return {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    };

  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw new Error("Failed to parse geocoding response.");
  }
}

export async function addLocation(formData: FormData, tripId: string) {
  const session = await auth();
  if (!session)
    throw new Error("Not authenticated.");

  const address = formData.get("address")?.toString();
  if (!address)
    throw new Error("Address is missing.");

  const location = await geocodeAddress(address);
  if (!location)
    throw new Error("Could not geocode the address.");

  const {lat, lon} = location;

  const count = await prisma.location.count({
    where: {tripId}
  });

  await prisma.location.create({
    data: {
      locationTitle: address,
      lat,
      lon,
      trip: {connect: {id: tripId}},
      order: count,
    }
  });

  redirect(`/trips/${tripId}`);
}
