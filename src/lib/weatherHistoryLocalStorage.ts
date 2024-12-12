import { WeatherSearchHistoryItem } from "@/app/weather/(components)/WeatherSearchHistory/WeatherSearchHistoryList";

const WEATHER_APP_HISTORY_LOCALSTORAGE = "weather_app_history";
export const MAX_HISTORY_LENGTH = 10;

/**
 * Retrieves the weather search history from localStorage.
 * 
 * This function attempts to fetch the weather search history from localStorage. 
 * If the data exists and is a valid array, it returns the parsed history.
 * 
 * @returns {WeatherSearchHistoryItem[] | null} The parsed weather search history or `null` if retrieval fails.
 */
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

/**
 * Saves the provided weather search history to localStorage.
 * 
 * This function takes an array of weather search history items and saves them to localStorage.
 * 
 * @param {WeatherSearchHistoryItem[]} weatherHistory The array of weather search history items to save.
 */
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
