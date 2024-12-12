import { WeatherContext } from "@/contexts/WeatherContext";
import getFormattedLocaleDateTime from "@/lib/date";
import { cn } from "@/lib/utils";
import { memo, useContext } from "react";
import WeatherInfoCurrentEmpty from "./WeatherInfoCurrentEmpty";

/**
 * Displays the current weather data if available, otherwise shows an empty state.
 * This component fetches weather details from the WeatherContext and renders:
 * - Temperature (current, max, and min)
 * - Weather description
 * - Humidity
 * - Location (city and country)
 * - Date and time in local format
 * If no weather data is available, it falls back to showing the WeatherInfoCurrentEmpty component.
 */
export default memo(function WeatherInfoCurrent() {
  const { currentWeatherData } = useContext(WeatherContext);

  if (!currentWeatherData) {
    return <WeatherInfoCurrentEmpty />;
  }

  const { main, name, country, dt, weather, timezone } = currentWeatherData;

  return (
    <section>
      <div className="relative px-3 dark:text-white min-[370px]:grid grid-cols-4 items-end max-sm:text-sm">
        <h2 className="col-span-full max-[369px]:text-center max-[369px]:dark:text-white/70">Today's Weather</h2>
        <div className="col-span-2 sm:col-span-1 text-center min-[370px]:text-left">
          {main?.temp && (
            <p className="text-primary dark:text-white text-[4rem] sm:text-[6rem] font-bold leading-tight">
              {Math.round(main.temp)}°C
            </p>
          )}
          <p className="space-x-2">
            {main?.temp_max && (
              <span>H: {Math.round(main.temp_max)}°C</span>
            )}
            {main?.temp_min && (
              <span>L: {Math.round(main.temp_min)}°C</span>
            )}
          </p>
          {(name || country) && (
            <p className="font-bold text-light-grey dark:text-white">
              {/* Remove empty strings and joing together */}
              {[name, country]
                .filter((p) => p)
                .join(", ")}
            </p>
          )}
        </div>
        <div className={cn(
          'col-span-2 sm:col-span-3 flex flex-col sm:flex-row',
          'text-center min-[370px]:items-end min-[370px]:text-right justify-between text-light-grey dark:text-white',
          'max-[369px]:text-sm max-[369px]:dark:text-white/70 max-[369px]:mt-2',
        )}>
          {dt && (
            <p className="order-3 sm:order-1">
              {getFormattedLocaleDateTime(
                dt, timezone
              )}
            </p>
          )}
          {main?.humidity && (
            <p className="order-2">Humidity: {main.humidity}%</p>
          )}
          {weather?.description && (
            <p className="order-1 sm:order-3 first-letter:capitalize">
              {weather.description}
            </p>
          )}
        </div>
        {weather?.description &&
          weather?.icon && (
            <div
              className={cn(
                "absolute",
                "-top-48 right-0 max-[369px]:left-0 max-[369px]:flex justify-center",
                'min-[370px]:-top-32 min-[370px]:-right-5 min-[370px]:scale-[1.1]',
                "sm:-top-28 sm:right-8 sm:scale-[1.8]"
              )}
            >
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                alt={weather?.description}
                className="relative z-[1] contrast-150 brightness-85 saturate-150"
              />
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                alt={weather?.description}
                className="absolute top-0 sm:left-0 blur-lg translate-y-1 opacity-50 saturate-0 brightness-0"
              />
            </div>
          )}
      </div>
    </section>
  );
});
