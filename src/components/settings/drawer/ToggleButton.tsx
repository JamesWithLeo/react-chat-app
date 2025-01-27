import { alpha, styled, Theme } from "@mui/material/styles";
import { Tooltip } from "@mui/material";
// utils
import cssStyles from "../../../utils/cssStyles";
//
import Iconify from "../../Iconify";
import { IconButtonAnimate } from "../../animate";

const RootStyle = styled("span")(({ theme }) => ({
	...cssStyles(theme).bgBlur({ opacity: 0.64 }),
	right: 0,
	top: "50%",
	position: "fixed",
	marginTop: theme.spacing(-3),
	padding: theme.spacing(0.5),
	zIndex: theme.zIndex.drawer + 2,
	borderRadius: "24px 0 20px 24px",
	boxShadow: `-12px 12px 32px -4px ${alpha(
		theme.palette.mode === "light"
			? theme.palette.grey[600]
			: theme.palette.common.black,
		0.36,
	)}`,
}));

export default function ToggleButton({ onToggle }: { onToggle: () => void }) {
	return (
		<RootStyle>
			<Tooltip title="Settings" placement="left">
				<IconButtonAnimate
					color="inherit"
					onClick={onToggle}
					sx={{
						p: 1.25,
						transition: (theme: Theme) =>
							theme.transitions.create("all"),
						"&:hover": {
							color: "primary.main",
							bgcolor: (theme: Theme) =>
								alpha(
									theme.palette.primary.main,
									theme.palette.action.hoverOpacity,
								),
						},
					}}
				>
					<Iconify
						icon="eva:options-2-fill"
						sx={{ width: 20, height: 20 }}
					/>
				</IconButtonAnimate>
			</Tooltip>
		</RootStyle>
	);
}
