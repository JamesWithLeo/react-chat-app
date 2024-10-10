import { useMemo } from "react";
// @mui
import {
	alpha,
	ThemeProvider,
	createTheme,
	useTheme,
} from "@mui/material/styles";
// hooks
import useSettings from "../../hooks/useSettings";
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

	const { setColor, themeMode } = useSettings();
	const isDarkMode = themeMode === "dark";
	const themeOptions: ThemeOptions = useMemo(
		() => ({
			...defaultTheme,
			palette: {
				...defaultTheme.palette,
				primary: setColor,
			},
			customShadows: isDarkMode
				? {
						...customShadows.dark,
						primary: `0 8px 16px 0 ${alpha(setColor.main, 0.24)}`,
					}
				: {
						...customShadows.light,
						primary: `0 8px 16px 0 ${alpha(setColor.main, 0.24)}`,
					},
		}),
		[setColor, defaultTheme],
	);

	const theme = createTheme(themeOptions);

	theme.components = componentsOverride(theme);

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
