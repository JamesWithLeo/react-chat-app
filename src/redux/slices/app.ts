import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchScope } from "../../contexts/SearchContext";

export const sessionStorageAppKey = "WeChatConfig";
const appWeChat = sessionStorage.getItem(sessionStorageAppKey);
const currentApp: IApp | null = appWeChat ? JSON.parse(appWeChat) : null;

type navbarType =
	| "CONTACT"
	| "STARRED"
	| "SHARED"
	| "NAVBAR"
	| "THEME"
	| "CONVO_MINI_SETTING";
export type SidebarType = "chats" | "archived" | "group" | "settings";
// define initial state
interface INavbar {
	isOpen: boolean;
	type: navbarType;
}

interface IApp {
	navbar: INavbar;
	sidebar: SidebarType;
	search: SearchScope | null;
}
const initialState: IApp = currentApp
	? currentApp
	: {
			navbar: {
				isOpen: false,
				type: "THEME", // can be CONTACT, STARRED,SHARED
			},
			sidebar: "chats",
			search: "all",
		};

// create slice
const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		SetConversation(
			state,
			action: PayloadAction<{
				id: string;
				is_pinned?: boolean;
				is_archived?: boolean;
			}>,
		) {
			sessionStorage.setItem("conversationId", action.payload.id);
			return {
				...state,
				navbar: {
					isOpen: true,
					type: "CONVO_MINI_SETTING",
				},

				conversation: action.payload,
			};
		},

		ToggleSidebarOff(state) {
			return {
				...state,
				navbar: {
					isOpen: !state.navbar.isOpen,
					type: "THEME",
				},
				conversation: null,
				instantMessagePeer: null,
			};
		},
		ToggleSidebarOn(state, action: PayloadAction<navbarType>) {
			return {
				...state,
				navbar: {
					isOpen: !state.navbar.isOpen,
					type: action.payload,
				},
			};
		},

		setSearchRoute: (state, action: PayloadAction<SearchScope>) => {
			sessionStorage.setItem(
				sessionStorageAppKey,
				JSON.stringify({ ...state, search: action.payload } as IApp),
			);
			return {
				...state,
				search: action.payload,
			};
		},
		setSidebar: (state, action: PayloadAction<SidebarType>) => {
			sessionStorage.setItem(
				sessionStorageAppKey,
				JSON.stringify({ ...state, sidebar: action.payload } as IApp),
			);
			return {
				...state,
				sidebar: action.payload,
			};
		},
	},
	extraReducers: {},
});

// export reducer
export default appSlice.reducer;

export const {
	ToggleSidebarOff,
	ToggleSidebarOn,
	setSearchRoute,
	SetConversation,
	setSidebar,
} = appSlice.actions;
