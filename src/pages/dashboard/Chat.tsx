import React from "react";

import { Box, Stack } from "@mui/material";
import Conversation from "../../components/Conversation";
import { useTheme } from "@mui/material/styles";
import Contact from "../../components/Contact";
import { useSelector } from "react-redux";
import SharedMessages from "../../components/SharedMessages";
import StarredMessages from "../../components/StarredMessages";
import { AppState } from "../../redux/store";

const GeneralApp = () => {
	const theme = useTheme();
	const { sidebar, convobar } = useSelector((store: AppState) => store.app);
	return (
		<Stack direction="row" sx={{ width: "100%" }}>
			{convobar.isOpen ? (
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

			{sidebar.isOpen &&
				(() => {
					switch (sidebar.type) {
						case "STARRED":
							return <StarredMessages />;

						case "SHARED":
							return <SharedMessages />;

						default:
							break;
					}
				})()}
		</Stack>
	);
};

export default GeneralApp;
