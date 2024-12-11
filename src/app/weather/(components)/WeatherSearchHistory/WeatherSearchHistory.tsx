import { memo, useCallback, useContext, useEffect, useState } from "react";
import { WeatherSearchHistoryItem } from "./WeatherSearchHistoryList";
import { WeatherContext } from "@/context/WeatherContext";
import WeatherSearchHistoryList from "./WeatherSearchHistoryList";

const WEATHER_APP_HISTORY_LOCALSTORAGE = "weather_app_history";
const MAX_HISTORY_LENGTH = 10;

function getWeatherHistoryFromLocalStorage() {
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

function setWeatherHistoryToLocalStorage(
  weatherHistory: WeatherSearchHistoryItem[]
) {
  try {
    const weatherHistoryString = JSON.stringify(weatherHistory);
    localStorage.setItem(
      WEATHER_APP_HISTORY_LOCALSTORAGE,
      weatherHistoryString
    );
  } catch {
    // Ignore for now, treat it as a new history if fails
  }
}

export default memo(function WeatherSearchHistory() {
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
    // Take from localstorage so useEffect will not trigger when weatherHistory change
    const weatherHistoryUpdate = getWeatherHistoryFromLocalStorage() || [];

    // Returns if same data
    if (
      weatherHistoryUpdate?.[0] &&
      weatherHistoryUpdate[0].name === currentWeatherData.name &&
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
      lon: currentWeatherData.lon,
      lat: currentWeatherData.lat,
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
        // Take from localstorage so useEffect will not trigger when weatherHistory change
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

  if (!weatherHistory?.length) {
    return null;
  }

  return (
    <section className="bg-white/20 rounded-3xl px-3 py-6 sm:px-5">
      <h2 className="mb-5 ml-2">Search History</h2>
      <WeatherSearchHistoryList
        weatherHistory={weatherHistory}
        deleteItemFromWeatherHistory={deleteItemFromWeatherHistory}
        setHistorySearchWeatherData={setHistorySearchWeatherData}
      />
    </section>
  );
});
