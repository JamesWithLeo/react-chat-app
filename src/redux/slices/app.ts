import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SideBarType = "CONTACT" | "STARRED" | "SHARED" | "NAVBAR" | "THEME";

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
		type: "THEME", // can be CONTACT, STARRED,SHARED
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
} = appSlice.actions;
