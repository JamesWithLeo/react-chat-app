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
import { IConversation } from "../contexts/ConvoContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useChatContext } from "../contexts/ChatContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetConversation, ToggleSidebarOn } from "../redux/slices/app";
import { AppState } from "../redux/store";

dayjs.extend(relativeTime);
const ChatElement = ({ convo }: { convo: IConversation }) => {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const id = useSelector((state: AppState) => state.auth.user?.id);
	const { fetchPeer } = useChatContext();
	const isSmallScreen = useMediaQuery((state: Theme) =>
		state.breakpoints.up("sm"),
	);
	const [isLongPress, setIsLongPress] = useState<boolean>(false);
	const [pressTimeoutId, setPressTimeoutId] = useState<NodeJS.Timeout | null>(
		null,
	);

	const HandleOpenChat = () => {
		if (convo.conversation_type === "direct") {
			fetchPeer(convo.recipient_id!);
			navigate("/chat");
		} else {
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

		dispatch(ToggleSidebarOn("CONVO_MINI_SETTING"));
	};

	const HandleLongPressStart = () => {
		setIsLongPress(false);
		const timeoutId = setTimeout(() => {
			setIsLongPress(true);
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
			// onClick={HandleOpenChat}
		>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
			>
				<Stack direction="row" spacing={2}>
					{true ? (
						<StyledBadge
							overlap="circular"
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "right",
							}}
							variant="dot"
						>
							<Avatar src={convo.conversation_thumbnail} />
						</StyledBadge>
					) : (
						<Avatar src={convo.conversation_thumbnail} />
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
							{convo.recipient_name ?? convo.conversation_id}
						</Typography>
						<Typography variant="caption">
							{convo.last_message_content}
						</Typography>
					</Stack>
				</Stack>
				<Stack spacing={2} alignItems="center">
					<Typography
						sx={{ fontWeight: 400 }}
						variant="caption"
						fontSize={10}
					>
						{dayjs(convo.last_message_created_at).fromNow()}
					</Typography>
					<Badge color="primary" badgeContent={1}></Badge>
				</Stack>
			</Stack>
		</Box>
	);
};

export default ChatElement;
