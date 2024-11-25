import { Box, Stack } from "@mui/material";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import ConvoBody from "./ConvoBody";

const Conversation = () => {
	return (
		<Stack height={"100dvh"} maxHeight={"100vh"} width={"100%"}>
			<>
				<Header />

				<ConvoBody isOptionOpen={true} />

				<Footer />
			</>
		</Stack>
	);
};

export default Conversation;
