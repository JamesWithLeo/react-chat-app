import { ComponentType, Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// layouts
import DashboardLayout from "../layouts/dashboard";
import AuthLayout from "../layouts/auth";

// config
import { DEFAULT_PATH } from "../config";
import DefaultSpinner from "../components/skeletons/DefaultSpinner";
import ChatContextProvider from "../contexts/ChatContext";
import ConvoContextProvider from "../contexts/ConvoContext";
import { SearchContextProvider } from "../contexts/SearchContext";
import ArchivedLoader from "../components/skeletons/ArchivedLoader";
import GeneralChatLoader from "../components/skeletons/GeneralChatLoader";
import ChatLoader from "../components/skeletons/ChatLoader";
import LoginLoader from "../components/skeletons/LoginLoader";
import RegisterLoader from "../components/skeletons/RegisterLoader";
import SearchLoader from "../components/skeletons/SearchLoader";

const Loadable = (Component: ComponentType, Loader?: ComponentType) => {
	return (props: { [key: string]: any }) => {
		return (
			<Suspense fallback={Loader ? <Loader /> : <DefaultSpinner />}>
				<Component {...props} />
			</Suspense>
		);
	};
};
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const withDelay = async (importFunc: () => Promise<any>, ms: number) => {
	await delay(ms);
	return importFunc();
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
			element: (
				<ConvoContextProvider>
					<DashboardLayout />
				</ConvoContextProvider>
			),
			children: [
				{
					element: <Navigate to={DEFAULT_PATH} replace />,
					index: true,
				},
				{
					path: "chats",
					element: (
						<ChatContextProvider>
							<GeneralChats />
						</ChatContextProvider>
					),
				},
				{
					path: "chat",
					element: (
						<ChatContextProvider>
							<Chat />
						</ChatContextProvider>
					),
				},
				{
					path: "archived",
					element: <ArchivePage />,
				},
				{
					path: "search",
					element: (
						<SearchContextProvider>
							<ChatContextProvider>
								<SearchPage />
							</ChatContextProvider>
						</SearchContextProvider>
					),
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

const Chat = Loadable(
	lazy(() => import("../pages/dashboard/Chat")),
	ChatLoader,
);

const GeneralChats = Loadable(
	lazy(() => import("../pages/dashboard/generalChat")),
	GeneralChatLoader,
);

const ArchivePage = Loadable(
	lazy(() => import("../pages/dashboard/Archived")),
	ArchivedLoader,
);

const LoginPage = Loadable(
	lazy(() => import("../pages/auth/Login")),
	LoginLoader,
);
const RegisterPage = Loadable(
	lazy(() => import("../pages/auth/Register")),
	RegisterLoader,
);

const SearchPage = Loadable(
	lazy(() => withDelay(() => import("../pages/dashboard/Search"), 0)),
	SearchLoader,
);

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
