import { getCurrentWeather } from "@/api/openWeatherMap/getCurrentWeather";
import { getGeoCoding } from "@/api/openWeatherMap/getGeoCoding";
import { OpenWeatherData } from "@/api/openWeatherMap/types";
import { AppContext } from "@/contexts/AppContext";
import { WeatherContext } from "@/contexts/WeatherContext";
import { GENERIC_ERROR_DESC, isApiErrorData } from "@/lib/fetchApi";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

const QUERY_NOT_FOUND_STR = "Oops, nothing found.";
const QUERY_EMPTY_STR = "Try london (city) or london,gb (city,country code).";

/**
 * Custom hook to manage weather search functionality.
 *
 * This hook handles:
 * - Validating and processing weather search queries.
 * - Fetching geographical coordinates (latitude and longitude) from the query.
 * - Fetching weather information based on the coordinates.
 * - Managing error states, loading states, and aborting requests.
 *
 * @param setErrorMessage - Function to set error messages for invalid input or API errors.
 * @returns An object containing:
 * - `getWeatherInfo`: Function to fetch weather information for a given query.
 * - `searchDisabled`: State indicating whether the search is disabled (e.g., during a request).
 * - `onSubmitRetrieveWeatherInfo`: Function to trigger the entire weather search workflow.
 */
function useWeatherSearch(setErrorMessage: React.Dispatch<React.SetStateAction<string>>) {
  const { setCurrentWeatherData } = useContext(WeatherContext);
  const { toggleLoadingScreen } = useContext(AppContext);
  const [searchDisabled, setSearchDisabled] = useState(false);
  const controller = useRef<AbortController>();


  /**
   * Fetches weather information based on the provided query.
   * This involves two API calls because built-in geocoding for the weather API is depreceated:
   * 1. `getGeoCoding` to retrieve latitude and longitude based on the query.
   * 2. `getCurrentWeather` to fetch weather details using the retrieved coordinates.
   *
   * @param query - The city or city-country combination to search for (e.g., "london" or "london,gb").
   * @param errorMessage - Optional error message for invalid input (if present, the function exits early).
   */
  const getWeatherInfo = useCallback(async (query: string, errorMessage?: string) => {
    try {
      // Input error or empty query, return
      if (errorMessage) {
        return;
      }
      
      // Trim ends
      query = query?.trim();

      // Attempt to submit empty query, prompt user the input format
      if (!query) {
        setErrorMessage(QUERY_EMPTY_STR);
        return;
      }
      
      // Abort previous request, if any
      if (controller.current) controller.current.abort();

      // Retrieve Geo Coding data
      const [geoCodingError, geoCodingResult] = await getGeoCoding(
        query,
        (controller.current = new AbortController())
      );

      // Set error message if not abort error
      if (geoCodingError) {
        if (isApiErrorData(geoCodingError) && !geoCodingError.is_aborted) {
          setErrorMessage(geoCodingError.error_data?.message || GENERIC_ERROR_DESC);
        }
        return;
      }

      // No data found
      if (!geoCodingResult) {
        setErrorMessage(QUERY_NOT_FOUND_STR);
        return;
      }

      // Should not happen unless the API response changes
      if (
        !geoCodingResult?.lon ||
        !geoCodingResult?.lat
      ) {
        setErrorMessage(GENERIC_ERROR_DESC);
        return;
      }

      // Get weather information based on latitude and longitude
      const [currentWeatherError, currentWeatherResult] =
        await getCurrentWeather(
          geoCodingResult.lon,
          geoCodingResult.lat,
          (controller.current = new AbortController())
        );
      
      // Set error message if not abort error
      if (currentWeatherError) {
        if (isApiErrorData(currentWeatherError) && !currentWeatherError.is_aborted) {
          setErrorMessage(
            currentWeatherError.error_data?.message || GENERIC_ERROR_DESC
          );
        }
        return;
      }

      // Clear errors
      setErrorMessage('');

      // CurrentWeatherData is a combination of both Geo Coding and
      // Current Weather data
      const openWeatherData: OpenWeatherData = {
        ...geoCodingResult,
        ...currentWeatherResult,
      };

      setCurrentWeatherData(openWeatherData);
    } catch {
      setErrorMessage(GENERIC_ERROR_DESC);
    }
  }, [setErrorMessage, setCurrentWeatherData]);


   /**
   * Handles the submission of a weather search query.
   * This triggers the entire workflow, including toggling loading states and disabling the search.
   *
   * @param query - The city or city-country combination to search for.
   * @param errorMessage - Optional error message for invalid input.
   */
  const onSubmitRetrieveWeatherInfo = useCallback(async (query: string, errorMessage?: string) => {
    setSearchDisabled(true);
    toggleLoadingScreen(true);

    await getWeatherInfo(query, errorMessage);

    toggleLoadingScreen(false)
    setSearchDisabled(false);
  }, [getWeatherInfo, toggleLoadingScreen]);


  // Cleanup logic to abort ongoing requests and reset the loading state when the component unmounts.
  useEffect(() => {
    return () => { 
      toggleLoadingScreen(false)
      controller.current?.abort();
    }
  }, [toggleLoadingScreen]);

  return {
    getWeatherInfo,
    searchDisabled,
    onSubmitRetrieveWeatherInfo,
  }
}

export type UseWeatherSearch = ReturnType<typeof useWeatherSearch>;
export default useWeatherSearch;
