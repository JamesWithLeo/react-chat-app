import { Navigate, Outlet } from "react-router-dom";
import { Stack, Theme, useMediaQuery } from "@mui/material";
import NavBar from "../../components/navbar/SideBar";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import SlideBar from "../../components/navbar";
import ConvoSlideBar from "../../components/ConvoSlideBar";

const DashboardLayout = () => {
	const user = useSelector((state: AppState) => state.auth.user);
	const sidebar = useSelector((state: AppState) => state.app.sidebar);
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
			{/* this is slide bar */}
			{isSmallScreen && sidebar.isOpen && sidebar.type === "NAVBAR" ? (
				<SlideBar />
			) : null}

			{/* nav bar for destop */}
			{!isSmallScreen ? <NavBar /> : null}

			{sidebar.type === "CONVO_MINI_SETTING" && sidebar.isOpen ? (
				<ConvoSlideBar />
			) : null}

			<Outlet />
		</Stack>
	);
};

export default DashboardLayout;
