import { createContext, useEffect, ReactNode, ChangeEvent } from "react";
import { defaultSettings } from "../config";
import useLocalStorage from "../hooks/useLocalStorage";
import getColorPresets, { defaultPreset, colorPresets, IColorPreset } from "../utils/getColorPresets";

// Define settings state interface
interface SettingsContextProps {
  themeMode: string;
  themeLayout: string;
  themeStretch: boolean;
  themeContrast: string;
  themeDirection: string;
  themeColorPresets: string;
  onToggleMode: () => void;
  onChangeMode: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleDirection: () => void;
  onChangeDirection: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeDirectionByLang: (lang: string) => void;
  onToggleLayout: () => void;
  onChangeLayout: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleContrast: () => void;
  onChangeContrast: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeColor: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleStretch: () => void;
  onResetSetting: () => void;
  setColor: IColorPreset;
  colorOption: Array<{ name: string; value: string }>;
}

// Initial state object
const initialState: SettingsContextProps = {
  ...defaultSettings,
  onToggleMode: () => {},
  onChangeMode: () => {},
  onToggleDirection: () => {},
  onChangeDirection: () => {},
  onChangeDirectionByLang: () => {},
  onToggleLayout: () => {},
  onChangeLayout: () => {},
  onToggleContrast: () => {},
  onChangeContrast: () => {},
  onChangeColor: () => {},
  onToggleStretch: () => {},
  onResetSetting: () => {},
  setColor: defaultPreset,
  colorOption: [],
};

// Create the SettingsContext with initialState
const SettingsContext = createContext(initialState);

interface SettingsProviderProps {
  children: ReactNode;
}

// SettingsProvider component
const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useLocalStorage("settings", {
    themeMode: initialState.themeMode,
    themeLayout: initialState.themeLayout,
    themeStretch: initialState.themeStretch,
    themeContrast: initialState.themeContrast,
    themeDirection: initialState.themeDirection,
    themeColorPresets: initialState.themeColorPresets,
  });

  const isArabic = localStorage.getItem("i18nextLng") === "ar";

  useEffect(() => {
    if (isArabic) {
      // onChangeDirectionByLang("ar");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArabic]);

  // Mode
  const onToggleMode = () => {
    setSettings((prev:SettingsContextProps) => ({
      ...prev,
      themeMode: prev.themeMode === "light" ? "dark" : "light",
    }));
  };

  const onChangeMode = (event: ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeMode: event.target.value,
    });
  };

  // Similar logic for other handlers

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        onToggleMode,
        onChangeMode,
        // onToggleDirection,
        // onChangeDirection,
        // onChangeDirectionByLang,
        // onToggleLayout,
        // onChangeLayout,
        // onChangeContrast,
        // onToggleContrast,
        // onToggleStretch,
        // onChangeColor,
        setColor: getColorPresets(settings.themeColorPresets),
        colorOption: colorPresets.map((color) => ({
          name: color.name,
          value: color.main,
        })),
        // onResetSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext };
export default SettingsProvider;
