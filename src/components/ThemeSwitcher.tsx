import { memo, useContext } from "react";
import Switch from "./(fields)/Switch";
import { AppContext } from "@/contexts/AppContext";

/**
 * The ThemeSwitcher component provides a toggle to switch between light and dark modes.
 * It uses the `AppContext` to access and update the current theme.
 * @component
 * 
 * @returns {JSX.Element} The switch component that toggles between light and dark themes.
 */
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
