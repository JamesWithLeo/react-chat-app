// @mui
import { useTheme } from "@mui/material/styles";
// hooks
import useResponsive from "../hooks/useResponsive";
import { pxToRem } from "./pxToRem"
import { remToPx } from "./remToPx"
// ----------------------------------------------------------------------

export default function GetFontValue(variant) {
	const theme = useTheme();

	const breakpoints = useWidth();

	const key = theme.breakpoints.up(breakpoints === "xl" ? "lg" : breakpoints);

	const hasResponsive =
		variant === "h1" ||
		variant === "h2" ||
		variant === "h3" ||
		variant === "h4" ||
		variant === "h5" ||
		variant === "h6";

	const getFont =
		hasResponsive && theme.typography[variant][key]
			? theme.typography[variant][key]
			: theme.typography[variant];

	const fontSize = remToPx(getFont.fontSize);

	const lineHeight = Number(theme.typography[variant].lineHeight) * fontSize;

	const { fontWeight } = theme.typography[variant];

	const { letterSpacing } = theme.typography[variant];

	return { fontSize, lineHeight, fontWeight, letterSpacing };
}




// ----------------------------------------------------------------------

function useWidth() {
	const theme = useTheme();

	const keys = [...theme.breakpoints.keys].reverse();

	return (
		keys.reduce((output, key) => {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const matches = useResponsive("up", key);

			return !output && matches ? key : output;
		}, null) || "xs"
	);
}
