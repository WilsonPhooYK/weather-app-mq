import { WeatherSearchHistoryItem } from "@/app/weather/(components)/WeatherSearchHistory/WeatherSearchHistoryList";

const WEATHER_APP_HISTORY_LOCALSTORAGE = "weather_app_history";
export const MAX_HISTORY_LENGTH = 10;

export function getWeatherHistoryFromLocalStorage() {
  try {
    const weatherHistoryRaw = localStorage.getItem(
      WEATHER_APP_HISTORY_LOCALSTORAGE
    );
    if (weatherHistoryRaw) {
      const weatherHistoryJson: WeatherSearchHistoryItem[] =
        JSON.parse(weatherHistoryRaw);
      if (Array.isArray(weatherHistoryJson)) {
        return weatherHistoryJson;
      }
    }
  } catch (error) {
    // Ignore for now, treat it as a new history if fails
    console.error("Error getting weather history from local storage:", error);
  }

  return null;
}

export function setWeatherHistoryToLocalStorage(
  weatherHistory: WeatherSearchHistoryItem[]
) {
  try {
    const weatherHistoryString = JSON.stringify(weatherHistory);
    localStorage.setItem(
      WEATHER_APP_HISTORY_LOCALSTORAGE,
      weatherHistoryString
    );
  } catch (error) {
    console.error("Error setting weather history to local storage:", error);
  }
}
