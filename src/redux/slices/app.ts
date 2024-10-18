import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const sessionStorageAppKey = "WeChatConfig";
const appWeChat = sessionStorage.getItem(sessionStorageAppKey);
const currentApp: IApp | null = appWeChat ? JSON.parse(appWeChat) : null;

type SideBarType = "CONTACT" | "STARRED" | "SHARED" | "NAVBAR" | "THEME";
type SearchRoute = "search/all" | "search/people" | "search/chats" | null;
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
	search: SearchRoute | null;
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
			search: null,
		};

// create slice
const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
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

		setSearchRoute: (state, action: PayloadAction<SearchRoute>) => {
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
} = appSlice.actions;
