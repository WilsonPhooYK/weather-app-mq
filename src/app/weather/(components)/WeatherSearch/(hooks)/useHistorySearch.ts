import { useContext, useEffect } from "react";
import { UseWeatherInput } from "./useWeatherInput";
import { UseWeatherSearch } from "./useWeatherSearch";
import { WeatherContext } from "@/contexts/WeatherContext";

/**
 * Custom hook to handle weather searches triggered from a user's search history.
 *
 * This hook listens for changes in the `historySearchWeatherData` state from the `WeatherContext`.
 * When a history item is present:
 * - It validates and formats the query using `validateAndSetInput`.
 * - Submits the query to fetch weather data using `onSubmitRetrieveWeatherInfo`.
 * - Clears the history search data from the context after processing.
 *
 * @param validateAndSetInput - Function to validate and set the input query from `useWeatherInput`.
 * @param onSubmitRetrieveWeatherInfo - Function to fetch weather data from `useWeatherSearch`.
 */
function useHistorySearch(
  validateAndSetInput: UseWeatherInput["validateAndSetInput"],
  onSubmitRetrieveWeatherInfo: UseWeatherSearch["onSubmitRetrieveWeatherInfo"]
) {
  // Access the history search data and from the WeatherContext, this is triggered from the history list
  const { historySearchWeatherData, setHistorySearchWeatherData } =
    useContext(WeatherContext);

  useEffect(() => {
    if (!historySearchWeatherData) {
      return;
    }

    // Construct the query string using the city name and country code
    const query = [
      historySearchWeatherData.name,
      historySearchWeatherData.country,
    ]
      .filter((p) => p)
      .join(",");

    // Validate and submit the query
    if (validateAndSetInput(query)) {
      onSubmitRetrieveWeatherInfo(query);
    }

    // Clear the history search data from the context after processing
    setHistorySearchWeatherData(null);
  }, [
    onSubmitRetrieveWeatherInfo,
    validateAndSetInput,
    historySearchWeatherData,
    setHistorySearchWeatherData,
  ]);
}

export default useHistorySearch;
