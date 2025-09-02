// Przechowuje wyniki geokodowania w pamięci
const countryCache = new Map<string, string>();

// Funkcja opóźnienia dla retry logic
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Funkcja do pobierania kraju na podstawie współrzędnych
// TODO: Refactor z country_codes.json
export async function getCountryFromCoordinates(lat: number, lon: number): Promise<{ country: string }> {
  const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`; // Tworzymy unikalny klucz dla współrzędnych

  // Sprawdzamy, czy wynik jest już w cache
  if (countryCache.has(cacheKey)) {
    return {country: countryCache.get(cacheKey)!};
  }

  const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
  const url = `https://eu1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`;

  let attempts = 0;
  const maxAttempts = 10; // Maksymalna liczba prób (zapytań)
  const delayTime = 500; // Początkowe opóźnienie

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(url);
      const textResponse = await response.text();
      const data = JSON.parse(textResponse);

      // Jeśli napotkany został błąd Rate Limited, ponawia zapytanie z opóźnieniem
      if (data?.error?.includes("Rate Limited")) {
        attempts++;
        console.warn(`Rate limit exceeded. Retrying... (attempt ${attempts})`);

        await delay(delayTime * attempts);
        continue;
      }

      if (!data || !data.address || !data.address.country)
        return {country: 'Unknown country'};

      const country = data.address.country;

      // Buforowanie wyników w pamięci
      countryCache.set(cacheKey, country);

      return {country};
    } catch (error) {
      console.error("Error fetching country:", error);
      throw new Error("Failed to reverse geocode location.");
    }
  }

  // Jeśli wszystkie próby zawiodą
  return {country: "Rate limit exceeded"};
}
