import { useMemo } from "react";
// @mui
import {
	alpha,
	ThemeProvider,
	createTheme,
	useTheme,
} from "@mui/material/styles";
// hooks
import { useSettingsContext } from "../../contexts/SettingsContext";
//
import componentsOverride from "../../theme/overrides";
import { ThemeOptions } from "@mui/material/styles/createTheme";
import { customShadows } from "../../theme/shadows";

export default function ThemeColorPresets({
	children,
}: {
	children: React.ReactNode;
}) {
	const defaultTheme = useTheme();

	const { setColor, themeMode } = useSettingsContext();

	const themeOptions: ThemeOptions = useMemo(
		() => ({
			...defaultTheme,
			palette: {
				...defaultTheme.palette,
				primary: {
					...setColor,
				},
			},
			customShadows:
				themeMode === "dark"
					? {
							...customShadows.dark,
							primary: `0 8px 16px 0 ${alpha(setColor.main, 0.24)}`,
						}
					: {
							...customShadows.light,
							primary: `0 8px 16px 0 ${alpha(setColor.main, 0.24)}`,
						},
		}),
		[setColor, defaultTheme, themeMode],
	);

	const theme = createTheme(themeOptions);

	theme.components = componentsOverride(theme);

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
