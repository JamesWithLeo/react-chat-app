import { Link, Stack, Typography } from "@mui/material";
import React from "react";
import { Navigate, Link as RouterLink } from "react-router-dom";
import AuthSocial from "../../sections/auth/AuthSocial";
import LoginForm from "../../sections/auth/LoginForm";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";

const Login = () => {
	const user = useSelector((state: AppState) => state.auth.user);
	if (user) {
		return <Navigate to={"/"} />;
	}

	return (
		<>
			<Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
				<Typography variant="h4">Login to WeChat</Typography>
				<Stack direction="row" spacing={0.5}>
					<Typography variant="body2">New User?</Typography>
					<Link
						to="/auth/register"
						component={RouterLink}
						variant="subtitle2"
					>
						Create an account
					</Link>
				</Stack>
				<LoginForm />
				<AuthSocial />
			</Stack>
		</>
	);
};

export default Login;
