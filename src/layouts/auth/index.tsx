import { Alert, Box, Container, Stack } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import Logo from "../../assets/Images/logo.ico";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";

const AuthLayout = () => {
	const auth = useSelector((state: AppState) => state.auth);

	return (
		<>
			<Container sx={{ mt: 5 }} maxWidth="sm">
				{auth.errorMessage ? (
					<Box
						borderRadius={{ xs: 0 }}
						position={{ sm: "fixed" }}
						right={"1rem"}
						top={"1rem"}
					>
						<Alert severity="error">{auth.errorMessage}</Alert>
					</Box>
				) : null}
				<Stack
					sx={{ width: "100%" }}
					direction="column"
					alignItems={"center"}
				>
					<img
						style={{ height: 120, width: 120 }}
						src={Logo}
						alt="Logo"
					/>
				</Stack>
				<Outlet />
			</Container>
		</>
	);
};

export default AuthLayout;
