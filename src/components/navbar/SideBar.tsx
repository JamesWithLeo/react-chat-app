import React, { useState } from "react";
import {
	Avatar,
	Box,
	Divider,
	IconButton,
	Menu,
	MenuItem,
	Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSettingsContext } from "../../contexts/SettingsContext";
import AntSwitch from "../AntSwitch";
import Logo from "../../assets/Images/logo.ico";
import { useNavigate } from "react-router-dom";
import { ChatCircleDots, User, Gear } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";

const Nav_Buttons = [{ index: 0, icon: <ChatCircleDots /> }];
const Profile_Menu = [
	{
		title: "Profile",
		icon: <User />,
	},
];
const getPath = (index: number) => {
	switch (index) {
		case 0:
			return "/chats";

		case 1:
			return "/group";

		case 2:
			return "/call";

		case 3:
			return "/settings";

		default:
			return "/home";
	}
};

const getMenuPath = (index: number) => {
	switch (index) {
		case 0:
			return "/profile";

		case 1:
			return "/settings";

		case 2:
			// todo - update token and set isAuth = false
			return "/auth/login";

		default:
			return "/profile";
	}
};

export default function NavBar() {
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const theme = useTheme();
	const navigate = useNavigate();
	// state for selected button
	const [selected, setSelected] = useState(0);
	//switch themes
	const { onToggleMode } = useSettingsContext();
	const user = useSelector((state: AppState) => state.auth.user);
	return (
		<Box
			p={2}
			sx={{
				backgroundColor: theme.palette.background.paper,
				boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
				height: { md: "100dvh" },
				display: "flex",
				width: { xs: "100dwh", md: 100 },
			}}
		>
			<Stack
				direction={"column"}
				alignItems={"center"}
				justifyContent="space-between"
				sx={{ width: "100%", height: "100%" }}
				spacing={3}
			>
				<Stack alignItems={"center"} spacing={4}>
					<Box
						sx={{
							backgroundColor: theme.palette.primary.main,
							height: 64,
							width: 64,
							borderRadius: 1.5,
						}}
					>
						<img src={Logo} alt={"Logo icon"} />
					</Box>

					<Stack
						sx={{ width: "max-content" }}
						direction="column"
						alignItems="center"
						spacing={3}
					>
						{Nav_Buttons.map((el) =>
							el.index === selected ? (
								<Box
									onClick={() => {
										setSelected(el.index);
										navigate(getPath(el.index));
									}}
									key={crypto.randomUUID()}
									sx={{
										backgroundColor:
											theme.palette.primary.main,
										borderRadius: 1.5,
									}}
								>
									<IconButton
										sx={{
											width: "max-content",
											color: "#fff",
										}}
										key={el.index}
									>
										{el.icon}
									</IconButton>
								</Box>
							) : (
								<IconButton
									onClick={() => {
										setSelected(el.index);
										navigate(getPath(el.index));
									}}
									sx={{
										width: "max-content",
										color:
											theme.palette.mode === "light"
												? "#000"
												: theme.palette.text.primary,
									}}
									key={el.index}
								>
									{el.icon}
								</IconButton>
							),
						)}
						<Divider sx={{ width: "48px" }} />
						{selected === 3 ? (
							<Box
								sx={{
									backgroundColor: theme.palette.primary.main,
									borderRadius: 1.5,
								}}
							>
								<IconButton
									sx={{ width: "max-content", color: "#fff" }}
								>
									<Gear />
								</IconButton>
							</Box>
						) : (
							<IconButton
								onClick={() => {
									setSelected(3);
									navigate(getPath(3));
								}}
								sx={{
									width: "max-content",
									color:
										theme.palette.mode === "light"
											? "#000"
											: theme.palette.text.primary,
								}}
							>
								<Gear />
							</IconButton>
						)}
					</Stack>
				</Stack>

				<Stack spacing={4}>
					<AntSwitch
						onChange={() => {
							onToggleMode();
						}}
						defaultChecked
					/>
					{user ? (
						<Avatar
							sx={{ cursor: "pointer" }}
							src={user.photoUrl}
							aria-controls={open ? "basic-menu" : undefined}
							aria-haspopup="true"
							aria-expanded={open ? "true" : undefined}
							onClick={handleClick}
						/>
					) : null}
					<Menu
						id="basic-menu"
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							"aria-labelledby": "basic-button",
						}}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "right",
						}}
						transformOrigin={{
							vertical: "bottom",
							horizontal: "left",
						}}
					>
						<Stack spacing={1} px={1}>
							{Profile_Menu.map((el, index) => (
								<MenuItem
									onClick={() => {
										navigate(getMenuPath(index));
										handleClose();
									}}
									key={index}
								>
									<Stack
										sx={{ width: 100 }}
										direction="row"
										alignItems={"center"}
										justifyContent="space-between"
									>
										<span>{el.title}</span>
										{el.icon}
									</Stack>
								</MenuItem>
							))}
						</Stack>
					</Menu>
				</Stack>
			</Stack>
		</Box>
	);
}
