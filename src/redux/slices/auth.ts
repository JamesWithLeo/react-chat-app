import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SigninFetch, SignupFetch } from "../../services/fetch";
import { LogoutFirebase } from "../../services/firebase";

const localStorageKey = "userWeChat";

const userWeChat = localStorage.getItem(localStorageKey);
const currentUser: IUser | null = userWeChat ? JSON.parse(userWeChat) : null;

type Status = "offline" | "online";
type Gender = "male" | "female" | "others";

interface IUser {
	id: string;
	email: string;
	uid: string;
	photoUrl: string;
	phoneNumber: string | null;

	firstName: string | null;
	lastName: string | null;

	createdAt: Date | string;
	updatedAt: Date | string;
	lastLogin: Date;
	gender: Gender;
	status: Status;
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
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(SigninThunk.fulfilled, (state, action) => {
			const {
				id,
				email,
				uid,
				firstName,
				lastName,
				photoUrl,
				phoneNumber,
				status,
				gender,
				createdAt,
				updatedAt,
				lastLogin,
			} = action.payload;

			localStorage.setItem(
				localStorageKey,
				JSON.stringify(action.payload),
			);

			return {
				...state,
				user: {
					id,
					email,
					uid,
					firstName,
					lastName,
					photoUrl,
					phoneNumber,
					status,
					gender,
					createdAt,
					updatedAt,
					lastLogin,
				},
			};
		});

		builder.addCase(SignupThunk.fulfilled, (state, action) => {
			const {
				id,
				email,
				uid,
				firstName,
				lastName,
				photoUrl,
				phoneNumber,
				status,
				gender,
				createdAt,
				updatedAt,
				lastLogin,
			} = action.payload;

			localStorage.setItem(
				localStorageKey,
				JSON.stringify(action.payload),
			);

			return {
				...state,
				user: {
					id,
					email,
					uid,
					firstName,
					lastName,
					photoUrl,
					phoneNumber,
					status,
					gender,
					createdAt,
					updatedAt,
					lastLogin,
				},
			};
		});

		builder.addCase(LogoutThunk.fulfilled, (state, action) => {
			return {
				...state,
				user: null,
			};
		});
	},
});

export const SigninThunk = createAsyncThunk(
	"auth/Signin",
	async ({ email, uid }: { email: string; uid: string }) => {
		try {
			const response = await SigninFetch({ email, uid });
			if (!response.ok) {
				throw new Error(response.errorMessage);
			}

			const rawUser = response.user;
			const user: IUser = {
				id: rawUser.id,
				email: rawUser.email,
				uid: rawUser.uid,
				firstName: rawUser.firstname,
				lastName: rawUser.lastname,
				photoUrl: rawUser.photourl,
				phoneNumber: rawUser.phonenumber,
				status: rawUser.status,
				gender: rawUser.gender,
				createdAt: rawUser.createdat,
				updatedAt: rawUser.updatedat,
				lastLogin: rawUser.lastlogin,
			};

			return user;
		} catch (error) {
			console.log("Signin error", error);
			return Promise.reject(error);
		}
	},
);

export const SignupThunk = createAsyncThunk(
	"auth/Signup",
	async ({
		email,
		uid,
		photoUrl,
		phoneNumber,
		firstName,
		lastName,
	}: {
		email: string;
		uid: string;
		photoUrl: string | null;
		phoneNumber: string | null;
		firstName: string | null;
		lastName: string | null;
	}) => {
		try {
			const response = await SignupFetch({
				email,
				uid,
				photoUrl,
				phoneNumber,
				firstName,
				lastName,
			});
			if (!response.ok || !response.user) {
				throw new Error(response.errorMessage);
			}

			const rawUser = response.user;
			const user: IUser = {
				id: rawUser.id,
				email: rawUser.email,
				uid: rawUser.uid,
				firstName: rawUser.firstname,
				lastName: rawUser.lastname,
				photoUrl: rawUser.photourl,
				phoneNumber: rawUser.phonenumber,
				status: rawUser.status,
				gender: rawUser.gender,
				createdAt: rawUser.createdat,
				updatedAt: rawUser.updatedat,
				lastLogin: rawUser.lastLogin,
			};
			return user;
		} catch (error) {
			console.log("Signup error:", error);
			return Promise.reject(error);
		}
	},
);

export const LogoutThunk = createAsyncThunk("auth/Logout", () => {
	LogoutFirebase().then(() => {
		return Promise.resolve();
	});
});
export default authSlice.reducer;
