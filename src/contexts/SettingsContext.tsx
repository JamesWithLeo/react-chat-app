import { createContext, useEffect, ReactNode, ChangeEvent } from "react";
import { defaultSettings } from "../config";
import useLocalStorage from "../hooks/useLocalStorage";
import getColorPresets, {
	defaultPreset,
	colorPresets,
	IColorPreset,
} from "../utils/getColorPresets";
import { Direction } from "@mui/material";

// Define settings state interface
interface ISettingsContextProps {
	themeMode: string;
	themeLayout: string;
	themeStretch: boolean;
	themeContrast: string;
	themeDirection: Direction;
	themeColorPresets: string;
	onToggleMode: () => void;
	onChangeMode: (e: ChangeEvent<HTMLInputElement>) => void;
	onToggleDirection: () => void;
	onChangeDirection: (event: ChangeEvent<HTMLInputElement>) => void;
	onChangeDirectionByLang: (lang: string) => void;
	onToggleLayout: () => void;
	onChangeLayout: (e: ChangeEvent<HTMLInputElement>) => void;
	onToggleContrast: () => void;
	onChangeContrast: (e: ChangeEvent<HTMLInputElement>) => void;
	onChangeColor: (event: ChangeEvent<HTMLInputElement>) => void;
	onToggleStretch: () => void;
	onResetSetting: () => void;
	setColor: IColorPreset;
	colorOption: Array<{ name: string; value: string }>;
}

// Initial state object
const initialState: ISettingsContextProps = {
	...defaultSettings,
	onToggleMode: () => {},
	onChangeMode: (e: ChangeEvent<HTMLInputElement>) => {},
	onToggleDirection: () => {},
	onChangeDirection: (event: ChangeEvent<HTMLInputElement>) => {},
	onChangeDirectionByLang: (lang: string) => {},
	onToggleLayout: () => {},
	onChangeLayout: (e: ChangeEvent<HTMLInputElement>) => {},
	onToggleContrast: () => {},
	onChangeContrast: (e: ChangeEvent<HTMLInputElement>) => {},
	onChangeColor: (event: ChangeEvent<HTMLInputElement>) => {},
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
	const [settings, setSettings] = useLocalStorage("settings", initialState);

	const isArabic = localStorage.getItem("i18nextLng") === "ar";

	useEffect(() => {
		if (isArabic) {
			// onChangeDirectionByLang("ar");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isArabic]);

	const onToggleMode = () => {
		setSettings((prev: ISettingsContextProps) => ({
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
	const onToggleDirection = () => {};
	const onChangeColor = (event: ChangeEvent<HTMLInputElement>) => {
		setSettings({ ...settings, themeColorPresets: event.target.value });
	};

	const onChangeDirection = (event: ChangeEvent<HTMLInputElement>) => {
		setSettings({ ...settings, themeDirection: event.target.value });
	};

	const onChangeDirectionByLang = () => {};

	const onToggleLayout = () => {};

	const onChangeLayout = () => {};

	const onChangeContrast = () => {};

	const onToggleContrast = () => {};

	const onToggleStretch = () => {};

	const onResetSetting = () => {
		setSettings({
			themeMode: initialState.themeMode,
			themeLayout: initialState.themeLayout,
			themeStretch: initialState.themeStretch,
			themeContrast: initialState.themeContrast,
			themeDirection: initialState.themeDirection,
			themeColorPresets: initialState.themeColorPresets,
		});
	};

	return (
		<SettingsContext.Provider
			value={{
				...settings,
				onToggleMode,
				onChangeMode,
				onToggleDirection,
				onChangeDirection,
				onChangeDirectionByLang,
				onToggleLayout,
				onChangeLayout,
				onChangeContrast,
				onToggleContrast,
				onToggleStretch,
				onChangeColor,
				setColor: getColorPresets(settings.themeColorPresets),
				colorOption: colorPresets.map((color) => ({
					name: color.name,
					value: color.main,
				})),
				onResetSetting,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};

export { SettingsContext, ISettingsContextProps };
export default SettingsProvider;
