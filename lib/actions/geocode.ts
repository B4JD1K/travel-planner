import rawCountryCodes from "@/public/country_codes.json"; // { "pl": "Poland", ... }

// Funkcja opóźnienia dla retry logic
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getCountryCodeFromCoordinates(lat: number, lon: number): Promise<{ code: string, name: string }> {

  const countryCache = new Map<string, string>();
  const countryCodes: Record<string, string> = rawCountryCodes;

  // Tworzymy unikalny klucz dla współrzędnych
  const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;

  // Sprawdzamy, czy wynik jest już w cache
  if (countryCache.has(cacheKey)) {
    const code = countryCache.get(cacheKey)!;
    return {code, name: countryCodes[code] ?? code};
  }

  const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
  const url = `https://eu1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`;

  let attempts = 0;
  const maxAttempts = 10; // Maksymalna liczba prób (zapytań)
  const delayTime = 500; // Początkowe opóźnienie

  while (attempts < maxAttempts) {
    try {
      const data = await fetch(url)
        .then((res) => res.json());

      // Jeśli napotkany został błąd Rate Limited, ponawia zapytanie z opóźnieniem
      if (data?.error?.includes("Rate Limited")) {
        attempts++;
        console.warn(`Rate limit exceeded. Retrying, please wait... (attempt ${attempts})`);

        await delay(delayTime * attempts);
        continue;
      }

      const code = data?.address?.country_code?.toLowerCase();
      if (!code) return {code: "xx", name: "Unknown country"};

      countryCache.set(cacheKey, code);
      return {code, name: countryCodes[code] ?? code};
    } catch (error) {
      console.error("Error fetching country:", error);
      throw new Error("Failed to reverse geocode location.");
    }
  }

  // Jeśli wszystkie próby zawiodą
  return {code: "xx", name: "Rate limit exceeded"};
}
