import { ComponentType, Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// layouts
import DashboardLayout from "../layouts/dashboard";
import AuthLayout from "../layouts/auth";

// config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";

const Loadable = (Component: ComponentType) => {
	return (props: { [key: string]: any }) => {
		return (
			<Suspense fallback={<LoadingScreen />}>
				<Component {...props} />
			</Suspense>
		);
	};
};

export default function Router() {
	return useRoutes([
		{
			path: "/auth",
			element: <AuthLayout />,
			children: [
				{ element: <LoginPage />, path: "login" },
				{ element: <RegisterPage />, path: "register" },
				{ element: <SetupPage />, path: "setup" },
				{ element: <ResetPasswordPage />, path: "reset-password" },
				{ element: <NewPasswordPage />, path: "new-password" },
			],
		},
		{
			path: "/",
			element: <DashboardLayout />,
			children: [
				{
					element: <Navigate to={DEFAULT_PATH} replace />,
					index: true,
				},
				{ path: "chats", element: <GeneralChats /> },
				{ path: "chat", element: <Chat /> },
				{
					path: "search",
					element: <SearchPage />,
					children: [
						{
							index: true,
							element: <Navigate to={"/search/all"} replace />,
						},
						{ path: "all", element: <SearchAll /> },
						{ path: "people", element: <SearchPeople /> },
						{ path: "chats", element: <SearchChats /> },
					],
				},
				{ path: "settings", element: <Settings /> },
				{ path: "group", element: <GroupPage /> },
				{ path: "call", element: <CallPage /> },
				{ path: "profile", element: <ProfilePage /> },
				{ path: "404", element: <Page404 /> },
				{ path: "*", element: <Navigate to="/404" replace /> },
			],
		},
		{ path: "*", element: <Navigate to="/404" replace /> },
	]);
}

const Chat = Loadable(lazy(() => import("../pages/dashboard/Chat")));
const GeneralChats = Loadable(
	lazy(() => import("../pages/dashboard/generalChat")),
);

const LoginPage = Loadable(lazy(() => import("../pages/auth/Login")));

const RegisterPage = Loadable(lazy(() => import("../pages/auth/Register")));
const SetupPage = Loadable(lazy(() => import("../pages/auth/SetUp")));

const ResetPasswordPage = Loadable(
	lazy(() => import("../pages/auth/ResetPassword")),
);

const NewPasswordPage = Loadable(
	lazy(() => import("../pages/auth/NewPassword")),
);
const GroupPage = Loadable(lazy(() => import("../pages/dashboard/Group")));

const Settings = Loadable(lazy(() => import("../pages/dashboard/Settings")));

const CallPage = Loadable(lazy(() => import("../pages/dashboard/Call")));

const ProfilePage = Loadable(lazy(() => import("../pages/dashboard/Profile")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));

const SearchPage = Loadable(lazy(() => import("../pages/dashboard/Search")));
const SearchAll = Loadable(
	lazy(() => import("../components/Search/SearchAll")),
);
const SearchPeople = Loadable(
	lazy(() => import("../components/Search/SearchPeople")),
);
const SearchChats = Loadable(
	lazy(() => import("../components/Search/SearchChats")),
);
