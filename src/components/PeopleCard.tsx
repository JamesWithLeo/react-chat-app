import {
	Avatar,
	Box,
	Button,
	CardActions,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	Theme,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { useState } from "react";
import { IViewUser } from "../redux/slices/auth";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../contexts/ChatContext";

export default function PeopleCard({
	user,

	readOnly = false,
}: {
	user: IViewUser;

	readOnly?: boolean;
}) {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const theme = useTheme();
	const navigate = useNavigate();
	const { fetchPeer } = useChatContext();

	const isNotSmallScreen = useMediaQuery((state: Theme) =>
		state.breakpoints.up("sm"),
	);

	const handleDotClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleCloseDotMenu = () => {
		setAnchorEl(null);
	};

	const handleMessage = () => {
		fetchPeer(user.id);
		navigate("/chat");
	};

	return (
		<Box
			component={"span"}
			sx={{
				display: "flex",
				justifyContent: "space-between",
				p: "0.7rem",
				width: "100%",
				borderRadius: 1,
				backgroundColor:
					theme.palette.mode === "light"
						? "#fff"
						: theme.palette.background.default,
			}}
		>
			<Stack direction={"row"} spacing={2}>
				{user.photo_url ? <Avatar src={user.photo_url} /> : <Avatar />}
				<Typography variant="subtitle2">
					{user.first_name} {user.last_name}
				</Typography>
			</Stack>

			{!readOnly ? (
				<>
					<CardActions>
						<Stack direction={"row"} spacing={2}>
							{isNotSmallScreen ? (
								<Button
									variant="text"
									size="small"
									onClick={handleMessage}
								>
									message
								</Button>
							) : null}
							<IconButton onClick={handleDotClick}>
								<DotsThreeVertical
									size={24}
									aria-haspopup="true"
									className={"menu-dots"}
								/>
							</IconButton>

							<Menu
								open={Boolean(anchorEl)}
								anchorOrigin={{
									vertical: "top",
									horizontal: "center",
								}}
								anchorEl={anchorEl}
								MenuListProps={{
									"aria-labelledby": "basic-button",
								}}
								onClose={handleCloseDotMenu}
							>
								<Stack>
									{!isNotSmallScreen ? (
										<MenuItem onClick={handleMessage}>
											Message
										</MenuItem>
									) : null}
									<MenuItem>Add friend</MenuItem>
									<MenuItem>Block</MenuItem>
								</Stack>
							</Menu>
						</Stack>
					</CardActions>
				</>
			) : null}
		</Box>
	);
}
