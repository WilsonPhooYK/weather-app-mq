import Button from "@/components/Button";
import getFormattedLocaleDateTime from "@/lib/date";
import { memo, useCallback } from "react";
import imgSearch from "@/assets/search.webp";
import imgDelete from "@/assets/delete.webp";
import { cn } from "@/lib/utils";
import { OpenWeatherData } from "@/api/openWeatherMap/types";

export type WeatherSearchHistoryItem = Pick<
  OpenWeatherData,
  "name" | "country" | "dt" | "lon" | "lat" | "timezone" | "local_dt"
> & {
  temp?: NonNullable<OpenWeatherData["main"]>["temp"];
};

type WeatherSearchHistoryList = {
  weatherHistory: WeatherSearchHistoryItem[];
  deleteItemFromWeatherHistory: (indexToDelete: number) => void;
  setHistorySearchWeatherData: React.Dispatch<
    React.SetStateAction<WeatherSearchHistoryItem | null>
  >;
};

/**
 * This component renders a list of previously searched weather data.
 * - For each item in the history:
 *   - Displays the name, country, temperature, and the formatted date of the search.
 *   - Includes buttons to:
 *     - Select a search item, which will populate the selected weather data for further use.
 *     - Delete a search item from the list and local storage.
 */
export default memo(function WeatherSearchHistoryList({
  weatherHistory,
  deleteItemFromWeatherHistory,
  setHistorySearchWeatherData,
}: WeatherSearchHistoryList) {
  const onSearchHistoryItem = useCallback(
    (history: WeatherSearchHistoryItem) => {
      setHistorySearchWeatherData(history);
    },
    [setHistorySearchWeatherData]
  );

  return (
    <ul className="space-y-3">
      {weatherHistory.map((history, i) => (
        <li
          key={`${history.name}-${history.country}-${history.local_dt}`}
          className="min-[370px]:flex justify-between items-center gap-3 bg-white/40 dark:bg-black-secondary/50 rounded-2xl px-5 py-3"
        >
          <div className="sm:flex justify-between items-center w-full gap-2">
            {(history.name || history.country) && (
              <p className="max-sm:inline max-sm:text-sm dark:text-white">
                {/* Remove empty strings and joing together */}
                {[history.name, history.country].filter((p) => p).join(",")}
              </p>
            )}
            {history.temp && (
              <p className="max-sm:inline max-sm:ml-1 text-primary max-sm:text-sm dark:text-white font-bold flex-1">
                {Math.round(history.temp)}°C
              </p>
            )}
            {history.dt && (
              <p className="text-xs sm:text-sm dark:text-white/50">
                {getFormattedLocaleDateTime(history.dt, history.timezone)}
              </p>
            )}
          </div>
          <div className="max-[369px]:mt-2 max-sm:justify-end flex items-center gap-x-3">
            <Button
              type="button"
              className={cn(
                "relative btn-circle shrink-0",
                "dark:bg-transparent ring-white/50 dark:ring-1 dark:hover:bg-white/50"
              )}
              onClick={() => {
                onSearchHistoryItem(history);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <img
                src={imgSearch}
                alt="Search"
                referrerPolicy="no-referrer"
                className="w-4 h-4 object-contain opacity-50 dark:invert"
              />
            </Button>
            <Button
              type="button"
              className={cn(
                "relative btn-circle shrink-0",
                "dark:bg-transparent ring-white/50 dark:ring-1 dark:hover:bg-white/50"
              )}
              onClick={() => deleteItemFromWeatherHistory(i)}
            >
              <img
                src={imgDelete}
                alt="Delete"
                referrerPolicy="no-referrer"
                className="w-4 h-4 object-contain opacity-50 dark:invert"
              />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
});
