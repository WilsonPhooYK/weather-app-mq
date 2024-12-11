import WeatherContextProvider from "@/context/WeatherContext";
import WeatherSearch from "./(components)/WeatherSearch/WeatherSearch";
import WeatherInfoCurrent from "./(components)/WeatherInfoCurrent";
import WeatherSearchHistory from "./(components)/WeatherSearchHistory";

export default function Weather() {
  return (
    <WeatherContextProvider>
      {/* Still need to have a h1 tag for SEO, hidden for screen reader */}
      <h1 className="sr-only">Weather App</h1>
      <main className={`bg-light-clouds min-h-[100svh] bg-center`}>
        <div className="max-w-screen-md mx-auto px-3 py-10">
          <WeatherSearch />
          <div className="rounded-[2.5rem] bg-white/20 ring-1 ring-white/50 mt-32 sm:mt-20 py-5 sm:py-10 px-3 sm:px-8 space-y-10">
            <WeatherInfoCurrent />
            <WeatherSearchHistory />
          </div>
        </div>
      </main>
    </WeatherContextProvider>
  );
}
