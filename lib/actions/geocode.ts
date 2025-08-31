interface GeocodeResult {
  country: string,
}

export async function getCountryFromCoordinates(lat: number, lon: number): Promise<GeocodeResult> {
  const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
  const url = `https://eu1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`;

  const response = await fetch(url);

  const textResponse = await response.text();

  try {
    const data = JSON.parse(textResponse);
    console.log('data', data);

    if (!data || !data.address)
      return {country: 'Unknown country'};

    return {country: data.address.country || "Unknown country"};

  } catch (error) {
    console.error("Error parsing LocationIQ reverse geocode response:", error);
    throw new Error("Failed to parse reverse geocoding response.");
  }
}