import { Avatar, Badge, Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StyledBadge from "./StyledBadge";
import { IConversation } from "../contexts/ConvoContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useChatContext } from "../contexts/ChatContext";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);
const ChatElement = ({ convo }: { convo: IConversation }) => {
	const theme = useTheme();
	const { fetchPeer } = useChatContext();
	const navigate = useNavigate();
	const HandleOpenChat = () => {
		if (convo.conversation_type === "direct") {
			console.log("reading direct chat!");
			fetchPeer(convo.recipient_id!);
			navigate("/chat");
		} else {
			console.log("group chat");
		}
	};
	return (
		<Box
			sx={{
				width: "100%",
				borderRadius: 1,
				backgroundColor:
					theme.palette.mode === "light"
						? "#fff"
						: theme.palette.background.default,
			}}
			p={2}
			component={"span"}
			onClick={HandleOpenChat}
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
						<Typography variant="subtitle2">
							{convo.recipient_name ?? convo.conversation_id}
						</Typography>
						<Typography variant="caption">
							{convo.last_message_content}
						</Typography>
					</Stack>
				</Stack>
				<Stack spacing={2} alignItems="center">
					<Typography sx={{ fontWeight: 600 }} variant="caption">
						{dayjs(convo.last_message_created_at).fromNow()}
					</Typography>
					<Badge color="primary" badgeContent={1}></Badge>
				</Stack>
			</Stack>
		</Box>
	);
};

export default ChatElement;
