import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const sessionStorageAppKey = "WeChatConfig";
const appWeChat = sessionStorage.getItem(sessionStorageAppKey);
const currentApp: IApp | null = appWeChat ? JSON.parse(appWeChat) : null;

type SideBarType =
	| "CONTACT"
	| "STARRED"
	| "SHARED"
	| "NAVBAR"
	| "THEME"
	| "CONVO_MINI_SETTING";

export type SearchScope = "all" | "people" | "chats";
// define initial state
interface ISiderBar {
	isOpen: boolean;
	type: SideBarType;
}
interface IConvoBar {
	isOpen: boolean;
}
interface IApp {
	sidebar: ISiderBar;
	convobar: IConvoBar;
	search: SearchScope | null;
	conversation: null | {
		id: string;
		is_pinned?: boolean;
		is_archived?: boolean;
	};
	peerId: string | null;
}
const initialState: IApp = currentApp
	? currentApp
	: {
			sidebar: {
				isOpen: false,
				type: "THEME", // can be CONTACT, STARRED,SHARED
			},
			convobar: {
				isOpen: false,
			},
			search: "all",
			conversation: null,
			peerId: null,
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
				conversation: action.payload,
			};
		},

		SetPeerId(state, action: PayloadAction<string>) {
			sessionStorage.setItem("peerId", action.payload);
			return {
				...state,
				peerId: action.payload,
			};
		},
		//Toggle sidebar
		ToggleSidebarOff(state) {
			return {
				...state,
				sidebar: {
					isOpen: !state.sidebar.isOpen,
					type: "THEME",
				},
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

		UpdateSidebarType(state, action: PayloadAction<SideBarType>) {
			state.sidebar.type = action.payload;
			state.sidebar.isOpen = true;
		},
		ToggleConvobar(state) {
			state.convobar.isOpen = !state.convobar.isOpen;
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
	UpdateSidebarType,
	ToggleConvobar,
	ToggleSidebarOn,
	setSearchRoute,

	SetConversation,
	SetPeerId,
} = appSlice.actions;
