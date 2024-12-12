import { GET, Response } from "@/lib/fetchApi";
import { OpenWeatherMapError } from "./types";

// There are more attributes from API, but we do not need
type CurrentWeatherApiData = {
  weather?: {
    // Group of weather parameters (Rain, Snow, Clouds etc.)
    main?: string;
    // Weather condition within the group.
    description?: string;
    // Icon for the weather. src="https://openweathermap.org/img/wn/${icon}@2x.png"
    icon?: string;
  }[];
  main?: {
    temp?: number;
    temp_min?: number;
    temp_max?: number;
    humidity?: number;
  };
  // Time of data calculation, unix, UTC
  dt?: number;
  timezone?: number;
};

// Weather is in an array, we will flatten it and always take the 1st one
export type CurrentWeatherData = Omit<CurrentWeatherApiData, "weather"> & {
  weather?: NonNullable<CurrentWeatherApiData["weather"]>[number];
  // Added local_dt to track the actual local time to fetch this data
  local_dt?: number;
};

export async function getCurrentWeather(
  lon: number,
  lat: number,
  controller?: AbortController
) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lon=${lon}&lat=${lat}&units=metric&appid=${
    import.meta.env.VITE_OPEN_WEATHER_MAP_KEY
  }`;
  const [responseError, response] = await GET<CurrentWeatherApiData, OpenWeatherMapError>(
    url,
    undefined,
    controller
  );

  // If success, there is alot unnecessary data, so we prune it
  if (response) {
    const prunedWeatherData: CurrentWeatherData = {
      weather: {
        main: response.weather?.[0].main,
        description: response.weather?.[0].description,
        icon: response.weather?.[0].icon,
      },
      main: {
        temp: response.main?.temp,
        temp_min: response.main?.temp_min,
        temp_max: response.main?.temp_max,
        humidity: response.main?.humidity,
      },
      dt: response.dt,
      timezone: response.timezone,
      local_dt: Math.floor(Date.now() * 0.001),
    };

    return [undefined, prunedWeatherData] as Response<
      CurrentWeatherData,
      OpenWeatherMapError
    >;
  }

  // If contains error, returns as it is
  return [responseError, undefined] as Response<
    CurrentWeatherData,
    OpenWeatherMapError
  >;
}
