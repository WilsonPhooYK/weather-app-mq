import { OPEN_WEATHER_QUERY_REGEX } from "@/api/openWeatherMap/openWeatherMapHelpers";
import { useCallback, useState } from "react";

const QUERY_ERROR_STR =
  "Please try in the format london (city) or london,gb (city,country code)";

/**
 * Custom hook to handle weather search input.
 */
function useWeatherInput(setErrorMessage: React.Dispatch<React.SetStateAction<string>>) {
  const [query, setQuery] = useState('');

  // Validate query input
  const validateAndSetInput = useCallback((value?: string) => {
    setQuery(value || '');

    // Reset if empty string
    if (!value) {
      setErrorMessage('');
      return false;
    }

    // Warn if the format is not london (city) or london,gb (city,country code)
    if (!OPEN_WEATHER_QUERY_REGEX.test(value || '')) {
      setErrorMessage(QUERY_ERROR_STR);
      return false;
    }

    setErrorMessage('');
    return true;
  }, [setErrorMessage]);

  return {
    query,
    validateAndSetInput,
  }
}

export type UseWeatherInput = ReturnType<typeof useWeatherInput>;
export default useWeatherInput;
