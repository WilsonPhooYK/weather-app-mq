import { getCurrentWeather } from "@/api/openWeatherMap/getCurrentWeather";
import { getGeoCoding } from "@/api/openWeatherMap/getGeoCoding";
import { OpenWeatherData } from "@/api/openWeatherMap/types";
import { AppContext } from "@/context/AppContext";
import { WeatherContext } from "@/context/WeatherContext";
import { GENERIC_ERROR_DESC, isApiErrorData } from "@/lib/fetchApi";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

const QUERY_NOT_FOUND_STR = "Oops, nothing found.";
const QUERY_EMPTY_STR = "Try london (city) or london,gb (city,country code).";

/**
 * Custom hook to handle weather search functionality.
 */
function useWeatherSearch(setErrorMessage: React.Dispatch<React.SetStateAction<string>>) {
  const { setCurrentWeatherData } = useContext(WeatherContext);
  const { toggleLoadingScreen } = useContext(AppContext);
  const [searchDisabled, setSearchDisabled] = useState(false);
  const controller = useRef<AbortController>();

  // We need to call getGeoCoding first before using the lat and lon to
  // call getCurrentWeather. This is because Built-in geocoding for the 
  // weather API is depreceated
  const getWeatherInfo = useCallback(async (query: string, errorMessage?: string) => {
    try {
      // Input error or empty query, return
      if (errorMessage) {
        return;
      }

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

  // Retrieve data
  const onSubmitRetrieveWeatherInfo = useCallback(async (query: string, errorMessage?: string) => {
    setSearchDisabled(true);
    toggleLoadingScreen(true);

    await getWeatherInfo(query, errorMessage);

    toggleLoadingScreen(false)
    setSearchDisabled(false);
  }, [getWeatherInfo, toggleLoadingScreen]);

  // Clean up any active AbortControllers
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
