import {
	Avatar,
	AvatarGroup,
	Box,
	Stack,
	Theme,
	Typography,
	useMediaQuery,
} from "@mui/material";
import React, { useEffect } from "react";
import { IMessages } from "../../contexts/ChatContext";
import {
	// DocMsg,
	// IChatMessage,
	// LinkMsg,
	// MediaMsg,
	// ReplyMsg,
	// TimeLine,
	TextMsg,
} from "./MsgTypes";
import { useChatContext } from "../../contexts/ChatContext";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import StyledBadge from "../StyledBadge";
import socket from "../../services/sockets";
import { useQueryClient } from "@tanstack/react-query";

const ConvoBody = ({ isOptionOpen }: { isOptionOpen: boolean }) => {
	const queryClient = useQueryClient();
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);
	const id = useSelector((state: AppState) => state.auth.user?.id);
	const {
		messages,
		isSuccessMessages,
		peers,
		conversation_type,
		conversation_id,
		seenMessage,
	} = useChatContext();

	useEffect(() => {
		const body = document.getElementById("body") as HTMLDivElement;
		if (body) body.scrollTop = body.scrollHeight;

		if (id && messages && messages.length) {
			seenMessage({ messageId: undefined });
		}
	}, [messages, id, seenMessage]);
	useEffect(() => {
		socket.on("toClientMessage", (messageData) => {
			console.log("New Message seen: ", messageData);
			seenMessage({ messageId: messageData.message_id });
		});
		return () => {
			socket.off("toClientMessage");
		};
	}, [queryClient, seenMessage]);

	return (
		<Box
			className="scrollbar"
			width={"100%"}
			sx={{
				flexGrow: 1,
				height: "100%",
				overflowY: "scroll",
			}}
			component={"div"}
			id="body"
		>
			<Box
				p={isSmallScreen ? 1 : 3}
				height={"100%"}
				alignContent={"flex-end"}
			>
				<Stack spacing={3}>
					{isSuccessMessages && messages && messages.length ? (
						messages.map((message, index) => {
							switch (message.message_type) {
								case "text":
									return (
										<TextMsg
											isFromOther={
												id !== message.sender_id
											}
											key={message.message_id}
											message={message}
											isOptionOpen={isOptionOpen}
											peers={peers?.flatMap((p) =>
												p.lastSeen.messageId ===
												message.message_id
													? [
															{
																id: p.id,
																photoUrl:
																	p.photoUrl,
															},
														]
													: [],
											)}
										/>
									);
								default:
									return <></>;
							}
						})
					) : (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								py: "4rem",
							}}
						>
							<Stack sx={{ gap: "1rem" }}>
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
									{conversation_type === "group" ? (
										<AvatarGroup
											sx={{
												height: 128,
												width: 128,
											}}
										/>
									) : (
										<Avatar
											src={
												peers
													? peers[0].photoUrl
													: undefined
											}
											sx={{
												height: 128,
												width: 128,
											}}
										/>
									)}
								</StyledBadge>

								<Stack
									spacing={0.2}
									sx={{
										display: "flex",
										alignItems: "center",
									}}
								>
									<Typography
										sx={{
											flexGrow: 1,
											fontWeight: 800,
											fontSize: "16px",
										}}
										variant="caption"
									>
										{conversation_type === "group"
											? peers
												? peers
														.map((p) => p.firstName)
														.join(", ")
												: conversation_id
											: peers
												? `${peers[0].firstName} ${peers[0].lastName}`
												: conversation_id}
									</Typography>
								</Stack>
							</Stack>
						</Box>
					)}
				</Stack>

				{conversation_type === "direct" ? (
					<>
						{peers?.some((p) => p.isTyping) && (
							<Typography variant="caption">Typing...</Typography>
						)}
					</>
				) : (
					<>
						<Typography variant="caption">
							to do : group typing
						</Typography>
						{/* {peers?.filter(
							(p) =>
								p.isTyping && (
									<Typography variant="caption">
										{p.firstName} is typing...
									</Typography>
								),
						)} */}
					</>
				)}
			</Box>
		</Box>
	);
};

export default ConvoBody;
