
	import { Theme } from "@mui/material";
export default function Popover(theme: Theme) {
	return {
		MuiPopover: {
			styleOverrides: {
				paper: {
					boxShadow: theme.customShadows[15],
					borderRadius: Number(theme.shape.borderRadius) * 1.5,
				},
			},
		},
	};
}
