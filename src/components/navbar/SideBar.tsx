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
import Logo from "../../assets/Images/logo.ico";
import { useNavigate } from "react-router-dom";
import {
	ChatCircleDots,
	User,
	Gear,
	Archive,
	UsersFour,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import { setSidebar, SidebarType } from "../../redux/slices/app";

const Nav_Buttons: { icon: any; target: SidebarType }[] = [
	{ icon: <ChatCircleDots />, target: "chats" },
	{
		icon: <Archive />,
		target: "archived",
	},
	{
		icon: <UsersFour />,
		target: "group",
	},
];

const Profile_Menu = [
	{
		title: "Profile",
		icon: <User />,
	},
];

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
	const dispatch = useDispatch();

	const user = useSelector((state: AppState) => state.auth.user);
	const sidebar = useSelector((state: AppState) => state.app.sidebar);
	const [selected, setSelected] = useState<SidebarType>(sidebar);
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
						{Nav_Buttons.map((el, index) => (
							<Box
								onClick={() => {
									setSelected(el.target);
									dispatch(setSidebar(el.target));
									navigate(el.target);
								}}
								key={crypto.randomUUID()}
								sx={
									selected === el.target
										? {
												backgroundColor:
													theme.palette.primary.main,
												borderRadius: 1.5,
											}
										: {}
								}
							>
								<IconButton
									sx={
										selected === el.target
											? {
													width: "max-content",
													color: "#fff",
												}
											: {
													width: "max-content",
													color:
														theme.palette.mode ===
														"light"
															? "#000"
															: theme.palette.text
																	.primary,
												}
									}
									key={index}
								>
									{el.icon}
								</IconButton>
							</Box>
						))}

						<Divider sx={{ width: "48px" }} />
						<Box
							sx={
								selected === "settings"
									? {
											backgroundColor:
												theme.palette.primary.main,
											borderRadius: 1.5,
										}
									: {}
							}
						>
							<IconButton
								onClick={() => {
									setSelected("settings");
									dispatch(setSidebar("settings"));
									navigate("settings");
								}}
								sx={
									selected === "settings"
										? {
												width: "max-content",
												color: "#fff",
											}
										: {
												width: "max-content",
												color:
													theme.palette.mode ===
													"light"
														? "#000"
														: theme.palette.text
																.primary,
											}
								}
							>
								<Gear />
							</IconButton>
						</Box>
					</Stack>
				</Stack>

				<Stack spacing={4}>
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
