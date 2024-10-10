import { Navigate, Outlet } from "react-router-dom";
import { Stack, Theme, useMediaQuery } from "@mui/material";
import SideBar from "./SideBar";
import { useEffect } from "react";

const isAuthenticated = true;

const DashboardLayout = () => {
	const iSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);

	useEffect(() => {
		async function fetchChats() {
			const response = await fetch("/chats", { method: "GET" });
			const result = await response.json();
			console.log(result);
		}
		fetchChats();
	}, []);
	if (!isAuthenticated) {
		return <Navigate to="/auth/login" />;
	}
	return (
		<Stack direction={{ xs: "column", sm: "row" }}>
			{!iSmallScreen ? <SideBar /> : null}
			<Outlet />
		</Stack>
	);
};

export default DashboardLayout;
