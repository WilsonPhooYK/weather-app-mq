import { CurrentWeatherData } from "./getCurrentWeather";
import { GeoCodingData } from "./getGeoCoding";

// Error response from OpenWeatherMap
export type OpenWeatherMapError = {
  cod?: string;
  message?: string;
}

// Combined data
export type OpenWeatherData = GeoCodingData & CurrentWeatherData;
