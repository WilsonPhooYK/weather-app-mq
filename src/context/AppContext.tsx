import LoadingScreen, { LoadingScreenHandle } from "@/components/LoadingScreen";
import { cn } from "@/lib/utils";
import { ReactNode, createContext, useMemo, useRef, useState } from "react";

const WEATHER_APP_THEME_LOCALSTORAGE = "weather_app_theme";

type AppContext = {
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<AppContext["theme"]>>;
  toggleLoadingScreen: LoadingScreenHandle['setIsLoading'],
};

export const AppContext = createContext<AppContext>({
  theme: "light",
  setTheme: () => {},
  toggleLoadingScreen: () => {},
});

export default function AppContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const loadingScreenRef = useRef<LoadingScreenHandle>(null);
  // Controls light or dark mode
  const [appTheme, setAppTheme] = useState<AppContext["theme"]>(() => {
    const localStorageTheme = localStorage?.getItem(WEATHER_APP_THEME_LOCALSTORAGE);
    if (localStorageTheme === 'light' || localStorageTheme === 'dark') {
      return localStorageTheme;
    }

    const systemTheme = typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    return systemTheme;
  });

  const value = useMemo<AppContext>(
    () => ({
      theme: appTheme,
      setTheme: (value) => {
        setAppTheme(value);
        localStorage.setItem(WEATHER_APP_THEME_LOCALSTORAGE, value as string);
      },
      toggleLoadingScreen: (isLoading) => loadingScreenRef.current?.setIsLoading(isLoading),
    }),
    [appTheme, setAppTheme]
  );

  return (
    <AppContext.Provider value={value}>
      <main
        className={cn(
          appTheme,
          "max-w-[100vw] overflow-x-hidden min-h-[100vh] flex flex-col"
        )}
      >
        {children}
      </main>
      <LoadingScreen ref={loadingScreenRef} />
    </AppContext.Provider>
  );
}
