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
import { IConversation } from "../../../contexts/ConvoContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { DotsThreeVertical } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useChatContext } from "../../../contexts/ChatContext";

dayjs.extend(relativeTime);
export default function ChatCard({ convo }: { convo: IConversation }) {
	const theme = useTheme();
	const navigate = useNavigate();
	const { setChat } = useChatContext();
	const isNotSmallScreen = useMediaQuery((state: Theme) =>
		state.breakpoints.up("sm"),
	);

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const handleDotClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseDotMenu = () => {
		setAnchorEl(null);
	};

	const handleMessage = async () => {
		handleCloseDotMenu();

		if (convo.conversation_type === "direct") {
			setChat({
				initialConvoId: convo.conversation_id,
				InitialPeersData: convo.peers,
				conversationType: "direct",
				initialConvoName: convo.conversation_name,
				thumbnail: convo.peers[0].photoUrl,
			});
			navigate("/chat");
		} else if (convo.conversation_type === "group") {
			setChat({
				initialConvoId: convo.conversation_id,
				InitialPeersData: convo.peers,
				initialConvoName: convo.conversation_name,
				conversationType: "group",
				thumbnail: convo.conversation_thumbnail,
			});
			navigate("/chat");
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
				<Avatar
					src={
						convo.conversation_thumbnail ?? convo.peers[0].photoUrl
					}
				/>
				<Stack>
					<Typography variant="subtitle2">
						{convo.conversation_name ??
							`${convo.peers[0].firstName} ${convo.peers[0].lastName}`}
					</Typography>
					{convo.last_message?.content ? (
						<Typography variant="caption">
							{convo.last_message.content}
						</Typography>
					) : null}
				</Stack>
			</Stack>

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
						open={!!anchorEl}
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
							{!isNotSmallScreen && (
								<MenuItem onClick={handleMessage}>
									Message
								</MenuItem>
							)}
							<MenuItem>Archived</MenuItem>
							<MenuItem>Pin</MenuItem>
							<MenuItem>Block</MenuItem>
						</Stack>
					</Menu>
				</Stack>
			</CardActions>
		</Box>
	);
}
