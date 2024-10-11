import { ReactNode, useMemo } from "react";
// @mui
import { CssBaseline } from "@mui/material";
import {
	createTheme,
	ThemeProvider as MUIThemeProvider,
	StyledEngineProvider,
	ThemeOptions,
} from "@mui/material/styles";
// hooks
import useSettings from "../hooks/useSettings";
//
import palette from "./palette";
import typography from "./typography";
import breakpoints from "./breakpoints";
import componentsOverride from "./overrides";
import { customShadows, shadows } from "./shadows";

declare module "@mui/material" {
	interface Color {
		0: string;
		100: string;
		200: string;
		300: string;
		400: string;
		500: string;
		600: string;
		700: string;
		800: string;
		900: string;
		500_8: string;
		500_12: string;
		500_16: string;
		500_24: string;
		500_32: string;
		500_48: string;
		500_56: string;
		500_80: string;
	}
}
declare module "@mui/material/styles" {
	interface TypeBackground {
		neutral: string;
	}

	interface Theme {
		customShadows: [
			none: string,
			z1: string,
			z8: string,
			z12: string,
			z16: string,
			z20: string,
			z24: string,
			primary: string,
			info: string,
			secondary: string,
			success: string,
			warning: string,
			error: string,
			card: string,
			dialog: string,
			dropdown: string,
			button: string,
			tooltip: string,
			popover: string,
			navbar: string,
			sidebar: string,
			modal: string,
			hover: string,
			focus: string,
			input: string,
		];
	}
	// allow configuration using `createTheme`
	interface ThemeOptions {
		customShadows: [
			none: string,
			z1: string,
			z8: string,
			z12: string,
			z16: string,
			z20: string,
			z24: string,
			primary: string,
			info: string,
			secondary: string,
			success: string,
			warning: string,
			error: string,
			card: string,
			dialog: string,
			dropdown: string,
			button: string,
			tooltip: string,
			popover: string,
			navbar: string,
			sidebar: string,
			modal: string,
			hover: string,
			focus: string,
			input: string,
		];
	}
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
	const { themeMode, themeDirection } = useSettings();

	const isLight = themeMode === "light";

	const themeOptions: ThemeOptions = useMemo(
		() => ({
			palette: isLight ? palette.light : palette.dark,
			typography,
			breakpoints,
			shape: { borderRadius: 8 },
			direction: themeDirection,
			shadows: isLight ? shadows.light : shadows.dark,
			customShadows: isLight ? customShadows.light : customShadows.dark,
		}),
		[isLight, themeDirection],
	);

	const theme = createTheme(themeOptions);

	theme.components = componentsOverride(theme);

	return (
		<StyledEngineProvider injectFirst>
			<MUIThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</MUIThemeProvider>
		</StyledEngineProvider>
	);
}
