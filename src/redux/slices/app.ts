import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SideBarType = "CONTACT" | "STARRED" | "SHARED";

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
}
const initialState: IApp = {
	sidebar: {
		isOpen: false,
		type: "CONTACT", // can be CONTACT, STARRED,SHARED
	},
	convobar: {
		isOpen: false,
	},
};

// create slice
const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		//Toggle sidebar
		ToggleSidebar(state) {
			state.sidebar.isOpen = !state.sidebar.isOpen;
		},
		UpdateSidebarType(state, action: PayloadAction<SideBarType>) {
			state.sidebar.type = action.payload;
			state.sidebar.isOpen = true;
		},
		ToggleConvobar(state) {
			state.convobar.isOpen = !state.convobar.isOpen;
		},
	},
	extraReducers: {},
});

// export reducer
export default appSlice.reducer;

export const { ToggleSidebar, UpdateSidebarType, ToggleConvobar } =
	appSlice.actions;
