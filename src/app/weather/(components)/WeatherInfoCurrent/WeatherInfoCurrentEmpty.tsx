import { memo } from "react";
import imgWeatherApp from '@/assets/weather-app.svg';

export default memo(function WeatherInfoCurrentEmpty() {
  return (
    <section className="px-3 flex flex-col justify-center gap-3">
      <img src={imgWeatherApp} alt="Weather app" referrerPolicy="no-referrer" className="h-52 -mt-32" />
      <h2 className="dark:text-white text-center max-sm:text-sm">
        Start searching some cities or countries to get current weather.
        <br />
        <span className="underline">Eg. london,gb or london</span>
      </h2>
    </section>
  );
});
