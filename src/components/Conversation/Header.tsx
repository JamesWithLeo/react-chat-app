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
import { ToggleConvobar } from "../../redux/slices/app";
import { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../../contexts/ChatContext";

const Header = () => {
	const dispatch = useDispatch<AppDispatch>();
	const theme = useTheme();
	const { peer, isLoading, isSuccess } = useChatContext();

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
					<Box alignContent={"center"} component={"div"}>
						<StyledBadge
							onClick={() => {
								dispatch(ToggleConvobar());
							}}
							overlap="circular"
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "right",
							}}
							variant="dot"
						>
							{peer ? (
								<Avatar
									alt={peer.photo_url}
									src={peer.photo_url}
								/>
							) : (
								<Avatar />
							)}
						</StyledBadge>
					</Box>
					<Stack spacing={0.2}>
						{peer ? (
							<Typography variant="subtitle2">
								{peer.first_name} {peer.last_name}
							</Typography>
						) : null}
						<Typography variant="caption">Online</Typography>
					</Stack>
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
