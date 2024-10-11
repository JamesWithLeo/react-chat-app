import { Theme } from "@mui/material";

export default function Button(theme: Theme) {
	return {
		MuiButton: {
			styleOverrides: {
				root: {
					"&:hover": {
						boxShadow: "none",
					},
				},
				sizeLarge: {
					height: 48,
				},
				// contained
				containedInherit: {
					color: theme.palette.grey[800],
					boxShadow: theme.shadows[1],
					"&:hover": {
						backgroundColor: theme.palette.grey[400],
					},
				},
				containedPrimary: {
					boxShadow: theme.customShadows[7],
				},
				containedSecondary: {
					boxShadow: theme.customShadows[9],
				},
				containedInfo: {
					boxShadow: theme.customShadows[8],
				},
				containedSuccess: {
					boxShadow: theme.customShadows[10],
				},
				containedWarning: {
					boxShadow: theme.customShadows[11],
				},
				containedError: {
					boxShadow: theme.customShadows[12],
				},
				// outlined
				outlinedInherit: {
					border: `1px solid ${theme.palette.grey[50048]}`,
					"&:hover": {
						backgroundColor: theme.palette.action.hover,
					},
				},
				textInherit: {
					"&:hover": {
						backgroundColor: theme.palette.action.hover,
					},
				},
			},
		},
	};
}
