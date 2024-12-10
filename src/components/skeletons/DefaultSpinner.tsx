import { Box, Typography } from "@mui/material";
import React from "react";
import { Spinner } from "@phosphor-icons/react";

const LoadingScreen = () => {
	return (
		<>
			<Box
				width={"100%"}
				height={"100%"}
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
			>
				<Typography>Chats</Typography>
				<Spinner />
			</Box>
		</>
	);
};

export default LoadingScreen;
