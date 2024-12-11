import { ReactNode, createContext, useMemo, useState } from "react";

type AppContext = {
  mode: 'light' | 'dark';
  setMode: React.Dispatch<React.SetStateAction<AppContext['mode']>>,
};

export const AppContext = createContext<AppContext>({
  mode: 'light',
  setMode: () => {},
});

export default function AppContextProvider({
  mode: inputMode,
  children,
}: Pick<AppContext, 'mode'> & {
  children: ReactNode;
}) {
  // Controls light or dark mode
  const [mode, setMode] = useState<AppContext['mode']>(inputMode);

  const value = useMemo<AppContext>(() => ({
    mode,
    setMode,
  }), [mode]);

  return (
    <AppContext.Provider
      value={value}
    >
      {children}
    </AppContext.Provider>
  );
}
