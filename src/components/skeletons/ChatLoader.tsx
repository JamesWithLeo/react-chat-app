import { Box, Stack, LinearProgress } from "@mui/material";

export default function ChatLoader() {
	return (
		<Stack height={"100dvh"} width={"100%"}>
			<Box
				width={"100%"}
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexGrow: 1,
					height: "100%",
				}}
			>
				<LinearProgress sx={{ width: "60%" }} />
			</Box>
		</Stack>
	);
}
