import {
	Avatar,
	Badge,
	Box,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import StyledBadge from "./StyledBadge";
import { IConversation, useConvoContext } from "../contexts/ConvoContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useChatContext } from "../contexts/ChatContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetConversation } from "../redux/slices/app";
import { AppState } from "../redux/store";

dayjs.extend(relativeTime);
const ChatElement = ({ convo }: { convo: IConversation }) => {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const id = useSelector((state: AppState) => state.auth.user?.id);
	const {
		//	fetchPeer
		setChat,
	} = useChatContext();
	const { setSelectedConvo } = useConvoContext();

	const isSmallScreen = useMediaQuery((state: Theme) =>
		state.breakpoints.up("sm"),
	);
	const [isLongPress, setIsLongPress] = useState<boolean>(false);
	const [pressTimeoutId, setPressTimeoutId] = useState<NodeJS.Timeout | null>(
		null,
	);

	const HandleOpenChat = () => {
		if (convo.conversation_type === "direct") {
			setChat({
				initialConvoId: convo.conversation_id,
				InitialPeersData: convo.peers,
				conversationType: "direct",
				thumbnail: convo.peers[0].photoUrl,
			});
			navigate("/chat");
		} else {
			// Todo add group chat functionality
			// getMessages(convo.conversation_id);
			console.log("group chat");
		}
	};

	const HandleOpenConvoSetting = () => {
		if (!id) return;

		dispatch(
			SetConversation({
				id: convo.conversation_id,
				is_archived: convo.is_archived,
				is_pinned: convo.is_pinned,
			}),
		);
	};

	const HandleLongPressStart = () => {
		setIsLongPress(false);
		const timeoutId = setTimeout(() => {
			setIsLongPress(true);
			setSelectedConvo({
				conversation_id: convo.conversation_id,
				is_archived: convo.is_archived,
				is_pinned: convo.is_pinned,
			});
			HandleOpenConvoSetting();
		}, 800);
		setPressTimeoutId(timeoutId);
	};

	const HandlePressEnd = () => {
		if (pressTimeoutId) clearTimeout(pressTimeoutId);
		if (!isLongPress) {
			HandleOpenChat();
		}
	};

	return (
		<>
			<Box
				sx={{
					width: "100%",
					borderRadius: 1,
					height: "100%",
					maxHeight: "5rem",
					backgroundColor:
						theme.palette.mode === "light"
							? "#fff"
							: theme.palette.background.default,
				}}
				p={2}
				component={"span"}
				onMouseDown={HandleLongPressStart}
				onMouseUp={HandlePressEnd}
			>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<Stack direction="row" spacing={2}>
						{convo.peers.some((p) => p.isOnline) ? (
							<StyledBadge
								overlap="circular"
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "right",
								}}
								variant="dot"
								sx={{
									"& .MuiBadge-dot": {
										backgroundColor: "#44b700",
										color: "#44b700",
									},
								}}
							>
								<Avatar
									src={
										convo.conversation_type === "group"
											? (convo.conversation_thumbnail ??
												"")
											: convo.peers[0].photoUrl
									}
								/>
							</StyledBadge>
						) : (
							<StyledBadge
								overlap="circular"
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "right",
								}}
								variant="dot"
								sx={{
									"& .MuiBadge-dot": {
										backgroundColor: "gray",
										color: "gray",
									},
								}}
							>
								<Avatar
									src={
										convo.conversation_type === "group"
											? (convo.conversation_thumbnail ??
												"")
											: convo.peers[0].photoUrl
									}
								/>
							</StyledBadge>
						)}

						<Stack spacing={0.3}>
							<Typography
								variant="subtitle2"
								width={isSmallScreen ? 200 : 130}
								sx={{
									overflow: "hidden",
									whiteSpace: "nowrap",
									textOverflow: "ellipsis",
								}}
							>
								{convo.conversation_type === "group"
									? (convo.conversation_name ??
										convo.peers
											.map((p) => p.firstName)
											.join(", "))
									: (convo.conversation_name ??
										`${convo.peers[0].firstName} ${convo.peers[0].lastName}`)}
							</Typography>
							{convo.last_message ? (
								<Typography variant="caption">
									{convo.last_message.content}
								</Typography>
							) : null}
						</Stack>
					</Stack>
					<Stack spacing={2} alignItems="center">
						{convo.last_message ? (
							<Typography
								sx={{ fontWeight: 400 }}
								variant="caption"
								fontSize={10}
							>
								{dayjs(convo.last_message.created_at).fromNow()}
							</Typography>
						) : null}
						<Badge color="primary" badgeContent={1}></Badge>
					</Stack>
				</Stack>
			</Box>
		</>
	);
};

export default ChatElement;
