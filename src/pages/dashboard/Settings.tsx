import {
	Avatar,
	Box,
	Divider,
	IconButton,
	Stack,
	Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
	Bell,
	CaretLeft,
	Image,
	Info,
	Key,
	Keyboard,
	Lock,
	Note,
	PencilCircle,
} from "phosphor-react";
import Shortcuts from "../../sections/settings/Shortcuts";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../redux/store";
import { Door } from "@phosphor-icons/react";
import { LogoutThunk } from "../../redux/slices/auth";

const Settings = () => {
	const theme = useTheme();
	const user = useSelector((state: AppState) => state.auth.user);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const [openShortcuts, setOpenShortcuts] = useState(false);

	const handleOpenShortcuts = () => {
		setOpenShortcuts(true);
	};

	const handleCloseShortcuts = () => {
		setOpenShortcuts(false);
	};

	const options = [
		{
			key: 0,
			icon: <Bell size={20} />,
			title: "Notifications",
			onclick: () => {},
		},
		{
			key: 1,
			icon: <Lock size={20} />,
			title: "Privacy",
			onclick: () => {},
		},
		{
			key: 2,
			icon: <Key size={20} />,
			title: "Security",
			onclick: () => {},
		},
		{
			key: 3,
			icon: <PencilCircle size={20} />,
			title: "Theme",
			//onclick: handleOpenTheme
			onclick: () => {},
		},
		{
			key: 4,
			icon: <Image size={20} />,
			title: "Chat Wallpaper",
			onclick: () => {},
		},
		{
			key: 5,
			icon: <Note size={20} />,
			title: "Request Account Info",
			onclick: () => {},
		},
		{
			key: 6,
			icon: <Keyboard size={20} />,
			title: "Keyboard Shortcuts",
			onclick: handleOpenShortcuts,
		},
		{
			key: 7,
			icon: <Info size={20} />,
			title: "Help",
			onclick: () => {},
		},
		{
			key: 8,
			icon: <Door size={20} />,
			title: "Logout",
			onclick: () => {
				dispatch(LogoutThunk());
			},
		},
	];

	return (
		<>
			<Stack direction="row" sx={{ width: "100%" }}>
				{/* Left panel */}
				<Box
					className="scrollbar"
					sx={{
						overflow: "scroll",
						height: "100dvh",
						width: "100%",
						backgroundColor:
							theme.palette.mode === "light"
								? "#F8FAFF"
								: theme.palette.background.default,
						boxShadow: "0px 0px 2px rgba(0)",
					}}
				>
					<Stack p={4} spacing={5}>
						{/* Header */}
						<Stack
							direction={"row"}
							alignItems="center"
							spacing={3}
						>
							<IconButton
								onClick={() => {
									navigate("/chats");
								}}
							>
								<CaretLeft size={24} color="#4B4B4B" />
							</IconButton>
							<Typography variant="h6">Settings</Typography>
						</Stack>

						{/* List of options */}
						<Stack spacing={4}>
							{options.map(({ key, icon, title, onclick }) => (
								<Stack
									key={title}
									spacing={2}
									sx={{ cursor: "pointer" }}
									onClick={onclick}
								>
									<Stack direction="row" spacing={2}>
										{icon}
										<Typography variant="body2">
											{title}
										</Typography>
									</Stack>
									{key !== options.length && <Divider />}
								</Stack>
							))}
						</Stack>
					</Stack>
				</Box>
				{/* Right panel */}
			</Stack>
			{openShortcuts && (
				<Shortcuts
					isOpen={openShortcuts}
					handleClose={handleCloseShortcuts}
				/>
			)}
		</>
	);
};

export default Settings;
