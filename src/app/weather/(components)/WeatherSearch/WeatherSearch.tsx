import Input from "@/components/(fields)/Input";
import Button from "@/components/Button";
import { memo, useState } from "react";

import imgSearch from "@/assets/search.webp";
import imgSpinner from "@/assets/spinner.svg";
import useWeatherSearch from "./(hooks)/useWeatherSearch";
import useWeatherInput from "./(hooks)/useWeatherInput";
import useHistorySearch from "./(hooks)/useHistorySearch";

/**
 * This component handles the user input for querying weather data.
 * It includes:
 * - A search input field for the user to enter a city or country.
 * - Validation of the input to ensure it's in a correct format.
 * - A submit button that triggers a weather search via an API call.
 * - Handling and displaying of loading states and error messages.
 * - Integration with the history search feature to retrieve previously searched locations.
 */
export default memo(function WeatherSearch() {
  // Error message for both input and Api errors
  const [errorMessage, setErrorMessage] = useState("");

  // Handles form input and input errors
  const { query, validateAndSetInput, clearInput } = useWeatherInput(setErrorMessage);
  // Handle form submit and Api search errors
  const { onSubmitRetrieveWeatherInfo, searchDisabled } =
    useWeatherSearch(setErrorMessage);

  // Handles Search from history
  useHistorySearch(validateAndSetInput, onSubmitRetrieveWeatherInfo);

  return (
    <section className="relative z-10">
      <form
        // The min height here is to cater for error message to prevent jumping
        className="flex gap-3 sm:gap-5 w-full max-[369px]:min-h-32 max-sm:min-h-24"
        noValidate
        onSubmit={async (e?: React.FormEvent<HTMLFormElement>) => {
          e?.preventDefault();
          await onSubmitRetrieveWeatherInfo(query, errorMessage);
          // Close the keyboard by blurring the active element
          (document.activeElement as HTMLElement)?.blur();
        }}
      >
        <Input
          className="flex-1"
          name="query"
          required={false}
          label="Search"
          error={errorMessage}
          value={query}
          onChange={validateAndSetInput}
          adornmentType="cancel"
          adornmentOnClick={clearInput}
        />
        <Button
          className="w-14 h-14 p-1"
          variant="primary"
          disabled={searchDisabled}
        >
          {searchDisabled ? (
            <img
              src={imgSpinner}
              alt="Spinner"
              referrerPolicy="no-referrer"
              className="animate-spin p-2 opacity-50"
            />
          ) : (
            <img
              src={imgSearch}
              alt="Search"
              referrerPolicy="no-referrer"
              className="invert"
            />
          )}
        </Button>
      </form>
    </section>
  );
});
