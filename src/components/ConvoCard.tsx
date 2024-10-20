import { Avatar, Badge, Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StyledBadge from "./StyledBadge";
import { IConversation } from "../contexts/ConvoContext";

const ChatElement = ({ convo }: { convo: IConversation }) => {
	const theme = useTheme();
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
		>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
			>
				<Stack direction="row" spacing={2}>
					{true ? (
						// online
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
						{/* {time} */}
						{new Date(
							convo.last_message_created_at,
						).toLocaleTimeString()}
					</Typography>
					<Badge color="primary" badgeContent={1}></Badge>
				</Stack>
			</Stack>
		</Box>
	);
};

export default ChatElement;
