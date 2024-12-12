import { OPEN_WEATHER_QUERY_REGEX } from "@/api/openWeatherMap/openWeatherMapHelpers";
import { useCallback, useState } from "react";

const QUERY_ERROR_STR =
  "Please try in the format london (city) or london,gb (city,country code)";

/**
 * Custom hook to manage and validate weather search input.
 *
 * This hook provides state and handlers for managing user input 
 * in a weather search field. It ensures input conforms to the required
 * format and provides error handling for invalid input.
 *
 * @param setErrorMessage - Function to set error messages for invalid input.
 * @returns An object containing:
 * - `query`: The current value of the input field.
 * - `validateAndSetInput`: Function to validate and set input.
 * - `clearInput`: Function to clear the input field.
 */
function useWeatherInput(setErrorMessage: React.Dispatch<React.SetStateAction<string>>) {
  const [query, setQuery] = useState('');

  /**
   * Validates the user input and updates the query state.
   *
   * @param value - The input string to validate.
   * @returns `true` if the input is valid, `false` otherwise.
   */
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

  /**
   * Clears the query input and resets validation state.
   */
  const clearInput = useCallback(() => {
    validateAndSetInput('');
  }, [validateAndSetInput]);

  return {
    query,
    validateAndSetInput,
    clearInput,
  }
}

export type UseWeatherInput = ReturnType<typeof useWeatherInput>;
export default useWeatherInput;
