import {
	Avatar,
	Box,
	Typography,
	IconButton,
	Divider,
	Stack,
	useMediaQuery,
} from "@mui/material";
import { CaretDown, CaretLeft, Phone, VideoCamera } from "phosphor-react";
import React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import StyledBadge from "../StyledBadge";
import { useDispatch } from "react-redux";
// import { ToggleConvobar } from "../../redux/slices/app";
import { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../../contexts/ChatContext";
import { ToggleSidebarOn } from "../../redux/slices/app";

const HeadInfo = ({
	isOnline,
	thumbnail,
	conversation_name,
}: {
	isOnline: boolean;
	thumbnail?: string;
	conversation_name: string;
}) => {
	const dispatch = useDispatch<AppDispatch>();

	return (
		<>
			<Box alignContent={"center"} component={"div"}>
				<StyledBadge
					onClick={() => {
						dispatch(ToggleSidebarOn("CONTACT"));
					}}
					overlap="circular"
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "right",
					}}
					variant="dot"
					sx={
						isOnline
							? {
									"& .MuiBadge-dot": {
										backgroundColor: "#44b700",
										color: "#44b700",
									},
								}
							: {}
					}
				>
					{thumbnail ? (
						// to do : apply default theme
						<Avatar src={thumbnail} />
					) : (
						<Avatar />
					)}
				</StyledBadge>
			</Box>
			<Stack spacing={0.2}>
				<Typography variant="subtitle2">{conversation_name}</Typography>

				<Typography variant="caption">
					{isOnline ? "Online" : "Offline"}
				</Typography>
			</Stack>
		</>
	);
};

const Header = () => {
	const theme = useTheme();
	const {
		peers,
		messages,
		conversation_type,
		conversation_thumbnail,
		conversation_id,
	} = useChatContext();

	const navigate = useNavigate();
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);

	return (
		<Box
			p={isSmallScreen ? 1 : 2}
			sx={{
				width: "100%",
				maxHeight: "16rem",
				backgroundColor:
					theme.palette.mode === "light"
						? "#F8FAFF"
						: theme.palette.background.paper,
				boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
			}}
		>
			<Stack
				alignItems={"center"}
				direction="row"
				gap={2}
				justifyContent={"space-between"}
				sx={{ width: "100%", height: "100%" }}
			>
				<Stack direction={"row"} spacing={2}>
					<IconButton
						sx={{ fontSize: isSmallScreen ? 20 : 30 }}
						onClick={() => {
							navigate("/chats", { replace: true });
						}}
					>
						<CaretLeft
							fontSize={isSmallScreen ? "small" : "large"}
						/>
					</IconButton>
					{messages && messages.length ? (
						<HeadInfo
							isOnline={
								peers ? peers.some((p) => p.isOnline) : false
							}
							conversation_name={
								conversation_type === "group"
									? peers
										? peers
												.map((p) => p.firstName)
												.join(", ")
										: conversation_id
									: peers
										? `${peers[0].firstName} ${peers[0].lastName}`
										: conversation_id
							}
							thumbnail={
								conversation_type === "group"
									? conversation_thumbnail
									: peers
										? peers[0].photoUrl
										: undefined
							}
						/>
					) : null}
				</Stack>

				<Stack
					direction="row"
					alignItems="center"
					spacing={isSmallScreen ? 1 : 3}
				>
					<IconButton sx={{ fontSize: isSmallScreen ? 20 : 30 }}>
						<Phone fontSize={isSmallScreen ? "small" : "large"} />
					</IconButton>
					<IconButton
						sx={{ fontSize: isSmallScreen ? 20 : 30 }} // Adjust the size based on screen size
					>
						<VideoCamera
							fontSize={isSmallScreen ? "small" : "large"}
						/>
					</IconButton>
					<Divider orientation="vertical" flexItem />
					<IconButton sx={{ fontSize: isSmallScreen ? 20 : 30 }}>
						<CaretDown
							fontSize={isSmallScreen ? "small" : "large"}
						/>
					</IconButton>
				</Stack>
			</Stack>
		</Box>
	);
};

export default Header;
