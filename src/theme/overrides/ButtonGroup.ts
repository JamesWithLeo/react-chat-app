// ----------------------------------------------------------------------

import { Theme } from "@mui/material";
import { customShadowType } from "../shadows";

export default function ButtonGroup(theme: Theme) {
	const styleContained = (color: customShadowType, index: number) => ({
		props: { variant: "contained", color },
		style: { boxShadow: theme.customShadows[index] },
	});

	return {
		MuiButtonGroup: {
			variants: [
				{
					props: { variant: "contained", color: "inherit" },
					style: { boxShadow: theme.customShadows[2] },
				},
				styleContained("primary", 7),
				styleContained("info", 8),
				styleContained("secondary", 9),
				styleContained("success", 10),
				styleContained("warning", 11),
				styleContained("error", 12),

				{
					props: { disabled: true },
					style: {
						boxShadow: "none",
						"& .MuiButtonGroup-grouped.Mui-disabled": {
							color: theme.palette.action.disabled,
							borderColor: `${theme.palette.action.disabledBackground} !important`,
							"&.MuiButton-contained": {
								backgroundColor:
									theme.palette.action.disabledBackground,
							},
						},
					},
				},
			],

			styleOverrides: {
				root: {
					"&:hover": {
						boxShadow: "none",
					},
				},
			},
		},
	};
}
