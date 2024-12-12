import { memo } from "react";
import imgWeatherApp from '@/assets/weather-app.svg';

/**
 * A simple UI component that displays a message and an image
 * prompting the user to search for a city or country to get
 * the current weather when there are no weather data
 */
export default memo(function WeatherInfoCurrentEmpty() {
  return (
    <section className="px-3 flex flex-col justify-center gap-3">
      <img src={imgWeatherApp} alt="Weather app" referrerPolicy="no-referrer" className="h-52 -mt-32" />
      <h2 className="dark:text-white text-center max-sm:text-sm">
        Begin by searching for a city or city,country to view the current weather.
        <br />
        <span className="underline">For example: london or london,gb</span>
      </h2>
    </section>
  );
});
