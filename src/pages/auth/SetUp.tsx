import { Stack, Typography } from "@mui/material";
import SetupForm from "../../sections/auth/SetupForm";

export default function Setup() {
	return (
		<Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
			<Typography>WeChat, Account set up.</Typography>
			<SetupForm />
		</Stack>
	);
}
