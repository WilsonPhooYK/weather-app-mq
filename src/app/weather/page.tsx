import WeatherContextProvider from "@/contexts/WeatherContext";
import WeatherSearch from "./(components)/WeatherSearch/WeatherSearch";
import WeatherInfoCurrent from "./(components)/WeatherInfoCurrent";
import WeatherSearchHistory from "./(components)/WeatherSearchHistory";
import { cn } from "@/lib/utils";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Weather() {
  return (
    <WeatherContextProvider>
      <div className="bg-light-clouds dark:bg-dark-clouds flex-1 bg-center bg-cover">
        {/* Still need to have a h1 tag for SEO, hidden for screen reader */}
        <h1 className="sr-only">Weather App</h1>
        <div className="max-w-screen-md mx-auto px-3 py-10">
          <div className="flex justify-end mb-3">
            <ThemeSwitcher />
          </div>
          <WeatherSearch />
          <div className={cn(
            'rounded-[2.5rem] bg-white/20 dark:bg-black-secondary/30 ring-1 ring-white/50 dark:ring-transparent',
            'mt-32 sm:mt-24 py-5 sm:py-10 px-3 sm:px-8 space-y-10',
          )}>
            <WeatherInfoCurrent />
            <WeatherSearchHistory />
          </div>
        </div>
      </div>
    </WeatherContextProvider>
  );
}
