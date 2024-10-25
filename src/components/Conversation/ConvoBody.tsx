import { Box, Stack, Theme, Typography, useMediaQuery } from "@mui/material";
import React from "react";
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

	return (
		<Box p={isSmallScreen ? 1 : 3} height={"100%"}>
			<Stack spacing={3} height={"100%"} minHeight={"100dvh"}>
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
		</Box>
	);
};

export default ConvoBody;
