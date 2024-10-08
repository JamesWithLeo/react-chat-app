import { createSlice } from "@reduxjs/toolkit";

const localStorageKey = "userWeChat";

const userWeChat = localStorage.getItem(localStorageKey);
const currentUser: IUser | null = userWeChat ? JSON.parse(userWeChat) : null;

interface IUser {
	email: string | null;
}

interface IAuth {
	user: IUser | null;
}

const authInit: IAuth = {
	user: currentUser,
};

const authSlice = createSlice({
	name: "auth",
	initialState: authInit,
	reducers: {
		login() {},
	},
	extraReducers: {},
});

export default authSlice.reducer;
