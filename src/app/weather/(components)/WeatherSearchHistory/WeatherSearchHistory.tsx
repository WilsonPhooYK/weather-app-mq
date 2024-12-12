import { memo } from "react";
import WeatherSearchHistoryList from "./WeatherSearchHistoryList";
import useWeatherSearchHistory from "./(hooks)/useWeatherSearchHistory";

/**
 * This component displays a list of previously searched weather data.
 * - It retrieves the weather search history using a custom hook.
 * - If there is no search history, it returns null.
 * - Displays a section with the search history title and a list of previous searches.
 * - Allows for the removal of an item from the history through a delete function.
 * - The history list is rendered by a separate `WeatherSearchHistoryList` component to optimize rendering and avoid unnecessary re-renders from the `WeatherContext`.
 */
export default memo(function WeatherSearchHistory() {
  const {
    weatherHistory,
    deleteItemFromWeatherHistory,
    setHistorySearchWeatherData,
  } = useWeatherSearchHistory();

  if (!weatherHistory?.length) {
    return null;
  }

  return (
    <section className="bg-white/20 dark:bg-black-secondary/30 rounded-3xl px-3 py-6 sm:px-5">
      <h2 className="mb-5 ml-2 max-sm:text-sm dark:text-white">Search History</h2>
      {/* Component is seperated to prevent rerender from WeatherContext */}
      <WeatherSearchHistoryList
        weatherHistory={weatherHistory}
        deleteItemFromWeatherHistory={deleteItemFromWeatherHistory}
        setHistorySearchWeatherData={setHistorySearchWeatherData}
      />
    </section>
  );
});
