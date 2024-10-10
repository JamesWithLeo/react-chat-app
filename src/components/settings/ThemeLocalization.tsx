// @mui
import { ThemeProvider, createTheme, ThemeOptions } from "@mui/material/styles";
import useSettings from "../../hooks/useSettings";
// hooks
import palette from "../../theme/palette";
import { customShadows } from "../../theme/shadows";
import typography from "../../theme/typography";
import breakpoints from "../../theme/breakpoints";
import { shadows } from "../../theme/shadows";

import useLocales from "../../hooks/useLocales";
import { ReactNode, useMemo } from "react";

export default function ThemeLocalization({
	children,
}: {
	children: ReactNode;
}) {
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

	const { currentLang } = useLocales();

	const theme = createTheme(themeOptions, currentLang.systemValue);

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
