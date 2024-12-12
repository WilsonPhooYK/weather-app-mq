import { memo, useContext } from "react";
import Switch from "./(fields)/Switch";
import { AppContext } from "@/contexts/AppContext";

export default memo(function ThemeSwitcher() {
  const { theme, setTheme } = useContext(AppContext);
  return (
    <Switch
      name="theme_switcher"
      label={theme === 'dark' ? 'Dark mode' : 'Light mode'}
      value={theme === 'dark'}
      onChange={(value) => setTheme(value ? 'dark' : 'light')}
    />
  );
});
