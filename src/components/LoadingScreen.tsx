import { Box } from "@mui/material";
import React from "react";
import { Spinner } from "@phosphor-icons/react";

const LoadingScreen = () => {
	return (
		<>
			<Box width={"100%"} height={"100%"}>
				<Spinner />
			</Box>
		</>
	);
};

export default LoadingScreen;
