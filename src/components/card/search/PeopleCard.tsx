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
import { IViewUser } from "../../../redux/slices/auth";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../../../contexts/ChatContext";
import { useDispatch, useSelector } from "react-redux";
import { FetchConversationId } from "../../../services/fetch";
import { AppState } from "../../../redux/store";
import { SetInstantMessage } from "../../../redux/slices/app";

export default function PeopleCard({
	user,

	readOnly = false,
}: {
	user: IViewUser;

	readOnly?: boolean;
}) {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const theme = useTheme();
	const id = useSelector((state: AppState) => state.auth.user?.id);
	const { setChat } = useChatContext();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const isNotSmallScreen = useMediaQuery((state: Theme) =>
		state.breakpoints.up("sm"),
	);

	const handleDotClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleCloseDotMenu = () => {
		setAnchorEl(null);
	};

	const handleMessage = async () => {
		handleCloseDotMenu();
		if (!id) return;

		const response = await FetchConversationId({
			userId: id,
			peerId: user.id,
		});

		if (
			response &&
			response.conversationId &&
			typeof response.conversationId === "string"
		) {
			setChat({
				initialConvoId: response.conversationId,
				InitialPeersData: [user],
				conversationType: "direct",
				thumbnail: user.photoUrl,
			});
			navigate("/chat");
		} else {
			console.log("Can't create or find conversation");
		}
	};

	return (
		<Box
			component={"span"}
			sx={{
				display: "flex",
				alignItems: "center",
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
				{user.photoUrl ? <Avatar src={user.photoUrl} /> : <Avatar />}
				<Typography variant="subtitle2">
					{user.firstName} {user.lastName}
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
