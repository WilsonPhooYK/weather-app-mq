import { OpenWeatherData } from "@/api/openWeatherMap/types";
import { WeatherSearchHistoryItem } from "@/app/weather/(components)/WeatherSearchHistory/WeatherSearchHistoryList";
import { ReactNode, createContext, useMemo, useState } from "react";

type WeatherContext = {
  currentWeatherData: OpenWeatherData | null;
  setCurrentWeatherData: React.Dispatch<React.SetStateAction<OpenWeatherData | null>>;
  historySearchWeatherData: WeatherSearchHistoryItem | null;
  setHistorySearchWeatherData: React.Dispatch<React.SetStateAction<WeatherSearchHistoryItem | null>>;
};

export const WeatherContext = createContext<WeatherContext>({
  currentWeatherData: null,
  setCurrentWeatherData: () => {},
  historySearchWeatherData: null,
  setHistorySearchWeatherData: () => {},
});

export default function WeatherContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Set weather data
  const [currentWeatherData, setCurrentWeatherData] = useState<WeatherContext['currentWeatherData']>(null);
  const [historySearchWeatherData, setHistorySearchWeatherData] = useState<WeatherSearchHistoryItem | null>(null);

  const value = useMemo<WeatherContext>(() => ({
    currentWeatherData,
    setCurrentWeatherData,
    historySearchWeatherData,
    setHistorySearchWeatherData,
  }), [currentWeatherData, historySearchWeatherData]);

  return (
    <WeatherContext.Provider
      value={value}
    >
      {children}
    </WeatherContext.Provider>
  );
}
