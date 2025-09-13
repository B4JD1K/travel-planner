import rawCountryCodes from "@/public/country_codes.json";

export type Result<T = null> = { success: boolean; message: string; data?: T; };

type CountryCodeData = { code: string; name: string; };

const countryCache = new Map<string, string>();

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getCountryCodeFromCoordinates(lat: number, lon: number): Promise<Result<CountryCodeData>> {
  const countryCodes: Record<string, string> = rawCountryCodes;

  const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;

  if (countryCache.has(cacheKey)) {
    const code = countryCache.get(cacheKey)!;
    return {
      success: true,
      message: "Country code found in cache.",
      data: {
        code,
        name: countryCodes[code] ?? code,
      },
    };
  }

  const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
  const url = `https://eu1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`;

  let attempts = 0;
  const maxAttempts = 10;
  const delayTime = 500;

  while (attempts < maxAttempts) {
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data?.error?.includes("Rate Limited")) {
        attempts++;
        console.warn(`Rate limit exceeded. Retrying (attempt ${attempts})`);
        await delay(delayTime * attempts);
        continue;
      }

      const code = data?.address?.country_code?.toLowerCase();

      if (!code)
        return {
          success: false,
          message: "Could not determine country code from response."
        };

      const name = countryCodes[code] ?? "Unknown country";
      countryCache.set(cacheKey, code);

      return {
        success: true,
        message: "Country code successfully resolved.",
        data: {code, name}
      };

    } catch (error) {
      console.error("Reverse geocoding error:", error);

      return {
        success: false,
        message: "Failed to fetch reverse geocoding data."
      };
    }
  }

  return {
    success: false,
    message: "Rate limit exceeded after multiple attempts."
  };
}
