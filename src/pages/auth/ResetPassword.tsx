import { Link, Stack, Typography } from "@mui/material";
import { CaretLeft } from "phosphor-react";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import ResetPasswordForm from "../../sections/auth/ResetPasswordForm";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import { Navigate } from "react-router-dom";

const ResetPassword = () => {
	const user = useSelector((state: AppState) => state.auth.user);
	if (user) {
		return <Navigate to={"/"} />;
	}
	return (
		<>
			<Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
				<Typography variant="h3" paragraph>
					Forgot your password?
				</Typography>
				<Typography sx={{ color: "text.secondary", mb: 5 }}>
					Please enter the email address associated with your account
					and we will email you a link to reset your password
				</Typography>
				{/* Reset password form */}
				<ResetPasswordForm />

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
			</Stack>
		</>
	);
};

export default ResetPassword;
