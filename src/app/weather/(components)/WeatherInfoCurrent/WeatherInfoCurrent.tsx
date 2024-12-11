import { WeatherContext } from "@/context/WeatherContext";
import getFormattedLocaleDateTime from "@/lib/date";
import { cn } from "@/lib/utils";
import { memo, useContext } from "react";

export default memo(function WeatherInfoCurrent() {
  const { currentWeatherData } = useContext(WeatherContext);

  return (
    <section>
      {!currentWeatherData && <h2>Opps nothing here!</h2>}
      {currentWeatherData && (
        <div className="relative px-3 [&_p]:max-sm:text-center [&_h2]:max-sm:text-center">
          <h2>Today's Weather</h2>
          {currentWeatherData.main?.temp && (
            <p className="text-purple-900 text-[6rem] font-bold leading-tight">{Math.round(currentWeatherData.main.temp)}°</p>
          )}
          <p className="space-x-2">
            {currentWeatherData.main?.temp_max && (
              <span>H: {Math.round(currentWeatherData.main.temp_max)}°</span>
            )}
            {currentWeatherData.main?.temp_min && (
              <span>L: {Math.round(currentWeatherData.main.temp_min)}°</span>
            )}
          </p>
          <div className="sm:flex justify-between text-slate-600">
            {(currentWeatherData.name || currentWeatherData.country) && (
              <p className="font-bold">
                {/* Remove empty strings and joing together */}
                {[currentWeatherData.name, currentWeatherData.country]
                  .filter((p) => p)
                  .join(", ")}
              </p>
            )}
            {currentWeatherData.dt && (
              <p>
                {getFormattedLocaleDateTime(new Date(currentWeatherData.dt * 1000))}
              </p>
            )}
            {currentWeatherData.main?.humidity && (
              <p>Humidity: {currentWeatherData.main.humidity}%</p>
            )}
            {currentWeatherData.weather?.description && (
              <p className="first-letter:capitalize">
                {currentWeatherData.weather.description}
              </p>
            )}
          </div>
          {currentWeatherData.weather?.description &&
            currentWeatherData.weather?.icon && (
              <div className={cn(
                'absolute',
                '-top-48 right-0 max-sm:left-0 max-sm:flex justify-center',
                'sm:-top-28 sm:right-8 sm:scale-[1.8]',
              )}>
                <img
                  src={`https://openweathermap.org/img/wn/${currentWeatherData.weather.icon}@4x.png`}
                  alt={currentWeatherData.weather?.description}
                  className="relative z-[1] contrast-150 brightness-85 saturate-150"
                />
                <img
                  src={`https://openweathermap.org/img/wn/${currentWeatherData.weather.icon}@4x.png`}
                  alt={currentWeatherData.weather?.description}
                  className="absolute top-0 sm:left-0 blur-lg translate-y-1 opacity-50 saturate-0 brightness-0"
                />
              </div>
            )}
        </div>
      )}
    </section>
  );
});
