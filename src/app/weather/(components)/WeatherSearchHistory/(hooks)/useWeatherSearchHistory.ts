import { WeatherContext } from "@/contexts/WeatherContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { WeatherSearchHistoryItem } from "../WeatherSearchHistoryList";
import { getWeatherHistoryFromLocalStorage, MAX_HISTORY_LENGTH, setWeatherHistoryToLocalStorage } from "@/lib/weatherHistoryLocalStorage";

/**
 * Custom hook to handle weather search input.
 */
function useWeatherSearchHistory() {
  const { currentWeatherData, setHistorySearchWeatherData } = useContext(WeatherContext);
  const [weatherHistory, setWeatherHistory] = useState<
    WeatherSearchHistoryItem[] | null
  >(null);

  // Init, get from local storage
  useEffect(() => {
    setWeatherHistory(getWeatherHistoryFromLocalStorage());
  }, [setWeatherHistory]);

  // Set new to local storage after search is done
  useEffect(() => {
    if (!currentWeatherData) {
      return;
    }

    // Init with empty array if empty,
    // Take from localstorage to prevent update
    const weatherHistoryUpdate = getWeatherHistoryFromLocalStorage() || [];

    // Returns if same data
    if (
      weatherHistoryUpdate?.[0] &&
      weatherHistoryUpdate[0].local_dt === currentWeatherData.local_dt &&
      weatherHistoryUpdate[0].country === currentWeatherData.country &&
      weatherHistoryUpdate[0].dt === currentWeatherData.dt
    ) {
      return;
    }

    // Push to the front
    weatherHistoryUpdate.unshift({
      name: currentWeatherData.name,
      country: currentWeatherData.country,
      dt: currentWeatherData.dt,
      local_dt: currentWeatherData.local_dt,
      timezone: currentWeatherData.timezone,
      lon: currentWeatherData.lon,
      lat: currentWeatherData.lat,
      temp: currentWeatherData.main?.temp,
    });

    // Pop last one if > MAX_HISTORY_LENGTH
    if (weatherHistoryUpdate.length >= MAX_HISTORY_LENGTH) {
      weatherHistoryUpdate.pop();
    }
    setWeatherHistory(weatherHistoryUpdate);
    setWeatherHistoryToLocalStorage(weatherHistoryUpdate);
  }, [currentWeatherData]);

  const deleteItemFromWeatherHistory = useCallback(
    (indexToDelete: number) => {
      try {
        // Init with empty array if empty
        // Take from localstorage to prevent update
        let weatherHistoryUpdate = getWeatherHistoryFromLocalStorage() || [];

        // Filter away the item by indexToDelete
        weatherHistoryUpdate = weatherHistoryUpdate.filter(
          (_, index) => index !== indexToDelete
        );

        setWeatherHistory(weatherHistoryUpdate);
        setWeatherHistoryToLocalStorage(weatherHistoryUpdate);
      } catch (error) {
        // Ignore for now, treat it as a new history if fails
        console.error("Error deleting item from weather history:", error);
      }
    },
    [setWeatherHistory]
  );

  return {
    deleteItemFromWeatherHistory,
    setHistorySearchWeatherData,
    weatherHistory,
  }
}

export default useWeatherSearchHistory;
