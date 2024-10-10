import { ReactNode, useMemo } from "react";
// @mui
import { CssBaseline } from "@mui/material";
import {
	alpha,
	ThemeProvider,
	createTheme,
	useTheme,
	ThemeOptions,
} from "@mui/material/styles";
// hooks
import useSettings from "../../hooks/useSettings";
//
import componentsOverride from "../../theme/overrides";
import palette from "../../theme/palette";
import { customShadows } from "../../theme/shadows";

export default function ThemeContrast({ children }: { children: ReactNode }) {
	const defaultTheme = useTheme();

	const { themeContrast, themeMode } = useSettings();

	const isLight = defaultTheme.palette.mode === "light";

	const shadowColor = isLight
		? defaultTheme.palette.grey[500]
		: defaultTheme.palette.common.black;

	const styles = {
		bgDefault: defaultTheme.palette.background.default,
		bgBold: isLight
			? defaultTheme.palette.grey[100]
			: defaultTheme.palette.grey[900],
		cardDefault: defaultTheme.components?.MuiCard?.styleOverrides?.root,
		cardBold: {
			zIndex: 0,
			position: "relative",
			borderRadius: Number(defaultTheme.shape.borderRadius) * 2,
			boxShadow: `0 0 1px 0 ${alpha(shadowColor, 0.48)}, 0 2px 4px -1px ${alpha(shadowColor, 0.24)}`,
		},
	};
	const isDarkMode = themeMode === "dark";

	const themeOptions: ThemeOptions = useMemo(
		() => ({
			...defaultTheme,
			palette: isDarkMode
				? {
						...palette.dark,
						background: {
							...defaultTheme.palette.background,
							default:
								themeContrast === "bold"
									? styles.bgBold
									: styles.bgDefault,
						},
					}
				: {
						...palette.light,
						background: {
							...defaultTheme.palette.background,
							default:
								themeContrast === "bold"
									? styles.bgBold
									: styles.bgDefault,
						},
					},
			customShadows: isDarkMode
				? customShadows.dark
				: customShadows.light,

			components: {
				MuiCard: {
					styleOverrides: {
						root: {
							zIndex: 1,
							position: "relative",
							borderRadius: 12,
							boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",

							variants: [
								{
									props: { raised: true },
									style: {
										boxShadow:
											"0px 6px 30px rgba(0, 0, 0, 0.2)",
									},
								},
							],
						},
					},
				},
			},
		}),

		[
			defaultTheme,
			themeContrast,
			isDarkMode,
			styles.bgBold,
			styles.bgDefault,
			// styles.cardBold,
			// styles.cardDefault,
		],
	);

	const theme = createTheme(themeOptions);

	theme.components = {
		...componentsOverride(theme),
		MuiCard: themeOptions.components?.MuiCard,
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}
