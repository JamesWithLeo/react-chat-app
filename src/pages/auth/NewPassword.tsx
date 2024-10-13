import { Link, Stack, Typography } from "@mui/material";
import { CaretLeft } from "phosphor-react";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import NewPasswordForm from "../../sections/auth/NewPasswordForm";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import { Navigate } from "react-router-dom";
const NewPassword = () => {
	const user = useSelector((state: AppState) => state.auth.user);
	if (user) {
		return <Navigate to={"/"} />;
	}

	return (
		<>
			<Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
				<Typography variant="h3" paragraph>
					Reset Password?
				</Typography>
				<Typography sx={{ color: "text.secondary", mb: 5 }}>
					Please set your new password
				</Typography>
			</Stack>
			{/* New Password Form */}

			<NewPasswordForm />

			<Link
				component={RouterLink}
				to="/auth/login"
				color="inherit"
				variant="subtitle2"
				sx={{
					mt: 3,
					mx: "auto",
					alignItems: "center",
					display: "inline-flex",
				}}
			>
				<CaretLeft />
				Return to sign in
			</Link>
		</>
	);
};

export default NewPassword;
