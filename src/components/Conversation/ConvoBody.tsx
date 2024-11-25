import { Box, Stack, Theme, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useRef } from "react";
import {
	DocMsg,
	IChatMessage,
	LinkMsg,
	MediaMsg,
	ReplyMsg,
	TextMsg,
	TimeLine,
} from "./MsgTypes";
import { useChatContext } from "../../contexts/ChatContext";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";

const ConvoBody = ({ isOptionOpen }: { isOptionOpen: boolean }) => {
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);
	const id = useSelector((state: AppState) => state.auth.user?.id);
	const { messages, isSuccessMessages } = useChatContext();

	useEffect(() => {
		console.log("Messages length changed!");
		const body = document.getElementById("body") as HTMLDivElement;
		if (body) body.scrollTop = body.scrollHeight;
	}, [messages]);

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
					{isSuccessMessages ? (
						<>
							{messages.map((message, index) => {
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
											/>
										);
									default:
										return <></>;
								}
							})}
						</>
					) : (
						<Typography>No messages</Typography>
					)}
				</Stack>
				<Typography variant="caption">Typing...</Typography>
			</Box>
		</Box>
	);
};

export default ConvoBody;
