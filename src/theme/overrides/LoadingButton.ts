import { Theme } from "@mui/material";

export default function LoadingButton(theme: Theme) {
	return {
		MuiLoadingButton: {
			styleOverrides: {
				root: {
					"&.MuiButton-text": {
						"& .MuiLoadingButton-startIconPendingStart": {
							marginLeft: 0,
						},
						"& .MuiLoadingButton-endIconPendingEnd": {
							marginRight: 0,
						},
					},
				},
			},
		},
	};
}
