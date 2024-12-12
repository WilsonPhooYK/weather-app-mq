import { GET, Response } from "@/lib/fetchApi";
import { OpenWeatherMapError } from "./types";

type GeoCodingApiData = {
  name?: string;
  lat?: number;
  lon?: number;
  country?: string;
}[];

// We will only take the first item and prune all unnecessary attributes
export type GeoCodingData = GeoCodingApiData[number] | null;


/**
 * Function to fetch Geo Coding data pased on (city), or (city,country) query
 * 
 * @param query - (city), or (city,country) query.
 * @param controller - AbortController
 * 
 * @returns Returns GeoCodingData or OpenWeatherMap error
 */
export async function getGeoCoding(
  query: string,
  controller?: AbortController,
) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${import.meta.env.VITE_OPEN_WEATHER_MAP_KEY}`;
  const [responseError, response] = await GET<GeoCodingApiData, OpenWeatherMapError>(url, undefined, controller);

  // If success and have atleaset one data, we will just take the first one, if not return null
  // There is alot unnecessary data, so we prune it
  if (response) {
    const prunedGeoData: GeoCodingData = response?.[0] ? {
      name: response[0].name,
      lat: response[0].lat,
      lon: response[0].lon,
      country: response[0].country,
    } : null;

    return [undefined, prunedGeoData] as Response<
      GeoCodingData,
      OpenWeatherMapError
    >;
  }

  // If contains error, returns as it is
  return [responseError, undefined] as Response<
  GeoCodingData,
    OpenWeatherMapError
  >;
}