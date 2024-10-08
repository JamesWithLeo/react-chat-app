import { Box, Stack } from "@mui/material";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import ConvoBody from "./ConvoBody";

const Conversation = () => {
	return (
		<Stack height={"100%"} maxHeight={"100vh"} width={"100%"}>
			<>
				<Header firstName="James" lastName="Ocampo" />

				<Box
					className="scrollbar"
					width={"100%"}
					sx={{
						flexGrow: 1,
						height: "100%",
						overflowY: "scroll",
					}}
				>
					<ConvoBody isOptionOpen={true} />
				</Box>

				<Footer />
			</>
		</Stack>
	);
};

export default Conversation;
