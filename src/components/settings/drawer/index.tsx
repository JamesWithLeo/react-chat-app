import React from "react";

import { AnimatePresence, m } from "framer-motion";
import { useState, useEffect } from "react";
// @mui
import { alpha, styled, Theme } from "@mui/material/styles";
import {
	Stack,
	Divider,
	Backdrop,
	Typography,
	IconButton,
	useMediaQuery,
} from "@mui/material";
// hooks
import { useSettingsContext } from "../../../contexts/SettingsContext";
// utils
import cssStyles from "../../../utils/cssStyles";
// config
import { NAVBAR } from "../../../config";
//
import Iconify from "../../Iconify";
import Scrollbar from "../../Scrollbar";
//
import ToggleButton from "./ToggleButton";
import SettingDirection from "./SettingDirection";
import SettingFullscreen from "./SettingFullscreen";
import SettingColorPresets from "./SettingColorPresets";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/store";
import AntSwitch from "../../AntSwitch";

const RootStyle = styled(m.div)(({ theme }) => ({
	...cssStyles(theme).bgBlur({
		color: theme.palette.background.paper,
		opacity: 0.92,
	}),
	top: 0,
	right: 0,
	bottom: 0,
	display: "flex",
	position: "fixed",
	overflow: "hidden",
	width: NAVBAR.BASE_WIDTH,
	flexDirection: "column",
	margin: theme.spacing(2),
	paddingBottom: theme.spacing(3),
	zIndex: theme.zIndex.drawer + 3,
	borderRadius: Number(theme.shape.borderRadius) * 1.5,
	boxShadow: `-24px 12px 32px -4px ${alpha(
		theme.palette.mode === "light"
			? theme.palette.grey[500]
			: theme.palette.common.black,
		0.16,
	)}`,
}));

export default function SettingsDrawer() {
	const { onResetSetting, onToggleMode } = useSettingsContext();

	const [open, setOpen] = useState(false);
	const sidebar = useSelector((state: AppState) => state.app.navbar);
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);
	const settings = useSettingsContext();
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	}, [open]);

	const handleToggle = () => {
		setOpen((prev) => !prev);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Backdrop
				open={open}
				onClick={handleClose}
				sx={{
					background: "transparent",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
			/>

			{!open && sidebar.type === "THEME" && !isSmallScreen && (
				<ToggleButton onToggle={handleToggle} />
			)}

			<AnimatePresence>
				{open && !isSmallScreen && (
					<>
						<RootStyle>
							<Stack
								direction="row"
								alignItems="center"
								justifyContent="space-between"
								sx={{ py: 2, pr: 1, pl: 2.5 }}
							>
								<Typography
									variant="subtitle1"
									sx={{ flexGrow: 1 }}
								>
									Theme
								</Typography>

								<IconButton onClick={onResetSetting}>
									<Iconify
										icon={"ic:round-refresh"}
										sx={{ width: 20, height: 20 }}
									/>
								</IconButton>

								<IconButton onClick={handleClose}>
									<Iconify
										icon={"eva:close-fill"}
										sx={{ width: 20, height: 20 }}
									/>
								</IconButton>
							</Stack>

							<Divider sx={{ borderStyle: "dashed" }} />

							<Scrollbar sx={{ flexGrow: 1 }}>
								<Stack spacing={3} sx={{ p: 3 }}>
									<Stack spacing={1.5}>
										<Typography variant="subtitle2">
											Direction
										</Typography>
										<SettingDirection />
									</Stack>

									<Stack spacing={1.5}>
										<Typography variant="subtitle2">
											Presets
										</Typography>
										<SettingColorPresets />
									</Stack>

									<Stack
										spacing={1.5}
										direction={"row"}
										width={"100%"}
									>
										<Typography
											variant="subtitle2"
											flexGrow={1}
										>
											Darkmode
										</Typography>
										<AntSwitch
											checked={
												settings.themeMode === "dark"
											}
											onClick={() => onToggleMode()}
										/>
									</Stack>
									<SettingFullscreen />
								</Stack>
							</Scrollbar>
						</RootStyle>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
