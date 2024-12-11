import Button from "@/components/Button";
import getFormattedLocaleDateTime from "@/lib/date";
import { memo, useCallback } from "react";
import imgSearch from "@/assets/search.webp";
import imgDelete from "@/assets/delete.webp";

export type WeatherSearchHistoryItem = {
  name?: string;
  country?: string;
  dt?: number;
  lon?: number;
  lat?: number;
};

type WeatherSearchHistoryList = {
  weatherHistory: WeatherSearchHistoryItem[];
  deleteItemFromWeatherHistory: (indexToDelete: number) => void;
  setHistorySearchWeatherData: React.Dispatch<
    React.SetStateAction<WeatherSearchHistoryItem | null>
  >;
};

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
          key={`${history.name}-${history.country}-${history.dt}`}
          className="sm:flex justify-between items-center gap-3 bg-white/40 rounded-2xl px-5 py-3"
        >
          <div className="sm:flex justify-between items-center w-full">
            {(history.name || history.country) && (
              <p>
                {/* Remove empty strings and joing together */}
                {[history.name, history.country].filter((p) => p).join(", ")}
              </p>
            )}
            {history.dt && (
              <p className="text-sm">
                {getFormattedLocaleDateTime(new Date(history.dt * 1000))}
              </p>
            )}
          </div>
          <div className="max-sm:mt-3 max-sm:justify-end flex items-center gap-x-1.5">
            <Button
              type="button"
              className="relative btn-circle shrink-0"
              onClick={() => onSearchHistoryItem(history)}
            >
              <img
                src={imgSearch}
                alt="Search"
                referrerPolicy="no-referrer"
                className="w-4 h-4 object-contain"
              />
            </Button>
            <Button
              type="button"
              className="btn-circle shrink-0"
              onClick={() => deleteItemFromWeatherHistory(i)}
            >
              <img
                src={imgDelete}
                alt="Delete"
                referrerPolicy="no-referrer"
                className="w-4 h-4 object-contain"
              />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
});
