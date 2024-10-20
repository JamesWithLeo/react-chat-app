import { Navigate, Outlet } from "react-router-dom";
import { Stack, Theme, useMediaQuery } from "@mui/material";
import SideBar from "./SideBar";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import NavBar from "../../components/navbar";

const DashboardLayout = () => {
	const user = useSelector((state: AppState) => state.auth.user);
	const sideBarMobile = useSelector((state: AppState) => state.app.sidebar);
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);

	if (!user || !user.email || !user.uid || !user.id) {
		return <Navigate to="/auth/login" />;
	}
	if ((user && !user.firstName) || !user.lastName || !user.gender) {
		return <Navigate to={"/auth/setup"} />;
	}
	return (
		<Stack direction={{ xs: "column", sm: "row" }}>
			{isSmallScreen &&
			sideBarMobile.isOpen &&
			sideBarMobile.type === "NAVBAR" ? (
				<NavBar />
			) : null}
			{!isSmallScreen ? <SideBar /> : null}
			<Outlet />
		</Stack>
	);
};

export default DashboardLayout;
