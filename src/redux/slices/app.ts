import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IViewUser } from "./auth";

const sessionStorageAppKey = "WeChatConfig";
const appWeChat = sessionStorage.getItem(sessionStorageAppKey);
const currentApp: IApp | null = appWeChat ? JSON.parse(appWeChat) : null;

type SideBarType =
	| "CONTACT"
	| "STARRED"
	| "SHARED"
	| "NAVBAR"
	| "THEME"
	| "CONVO_MINI_SETTING"
	| "INSTANTMESSAGEPEER";

export type SearchScope = "all" | "people" | "chats";
// define initial state
interface ISiderBar {
	isOpen: boolean;
	type: SideBarType;
}

interface IApp {
	sidebar: ISiderBar;
	search: SearchScope | null;
	conversation: null | {
		id: string;
		is_pinned?: boolean;
		is_archived?: boolean;
	};
	instantMessagePeer: IViewUser | null;
}
const initialState: IApp = currentApp
	? currentApp
	: {
			sidebar: {
				isOpen: false,
				type: "THEME", // can be CONTACT, STARRED,SHARED
			},

			search: "all",
			conversation: null,
			instantMessagePeer: null,
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
				sidebar: {
					isOpen: true,
					type: "CONVO_MINI_SETTING",
				},
				conversation: action.payload,
			};
		},
		SetInstantMessage(state, action: PayloadAction<IViewUser>) {
			return {
				...state,
				sidebar: {
					isOpen: true,
					type: "INSTANTMESSAGEPEER",
				},
				instantMessagePeer: action.payload,
			};
		},

		ToggleSidebarOff(state) {
			return {
				...state,
				sidebar: {
					isOpen: !state.sidebar.isOpen,
					type: "THEME",
				},
				conversation: null,
				instantMessagePeer: null,
			};
		},
		ToggleSidebarOn(state, action: PayloadAction<SideBarType>) {
			return {
				...state,
				sidebar: {
					isOpen: !state.sidebar.isOpen,
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
	SetInstantMessage,
} = appSlice.actions;
