import { useContext, useEffect } from "react";
import { UseWeatherInput } from "./useWeatherInput";
import { UseWeatherSearch } from "./useWeatherSearch";
import { WeatherContext } from "@/contexts/WeatherContext";

/**
 * This hook will consume a history search triggered by the user
 * and will remove it from the state in the context
 */
function useHistorySearch(
  validateAndSetInput: UseWeatherInput["validateAndSetInput"],
  onSubmitRetrieveWeatherInfo: UseWeatherSearch["onSubmitRetrieveWeatherInfo"]
) {
  const { historySearchWeatherData, setHistorySearchWeatherData } =
    useContext(WeatherContext);

  useEffect(() => {
    if (!historySearchWeatherData) {
      return;
    }

    const query = [
      historySearchWeatherData.name,
      historySearchWeatherData.country,
    ]
      .filter((p) => p)
      .join(",");
    if (validateAndSetInput(query)) {
      onSubmitRetrieveWeatherInfo(query);
    }

    setHistorySearchWeatherData(null);
  }, [
    onSubmitRetrieveWeatherInfo,
    validateAndSetInput,
    historySearchWeatherData,
    setHistorySearchWeatherData,
  ]);
}

export default useHistorySearch;
