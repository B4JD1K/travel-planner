export type Result<T = null> = {
  success: boolean;
  message: string;
  data?: T;
}

export type GeocodeData = {
  lat: number;
  lon: number;
  country_code: string;
};

export type CountryCodeData = {
  code: string;
  name: string;
};