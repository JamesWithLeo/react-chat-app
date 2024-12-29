import React from "react";

import { Box, Stack } from "@mui/material";
import Conversation from "../../components/Conversation";
import { useTheme } from "@mui/material/styles";
import Contact from "../../components/Contact";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import { useChatContext } from "../../contexts/ChatContext";
import { Navigate } from "react-router-dom";

const Chat = () => {
	const theme = useTheme();

	const { navbar: sidebar } = useSelector((store: AppState) => store.app);
	const { conversation_id } = useChatContext();
	if (!conversation_id) {
		return <Navigate to={"/"} />;
	}
	return (
		<Stack direction="row" sx={{ width: "100%" }}>
			{sidebar.isOpen && sidebar.type === "CONTACT" ? (
				<Contact />
			) : (
				<Box
					sx={{
						height: "100%",
						width: "100%",
						backgroundColor:
							theme.palette.mode === "light"
								? "#F0F4FA"
								: theme.palette.background.default,
					}}
				>
					<Conversation />
				</Box>
			)}
		</Stack>
	);
};

export default Chat;
