import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SetupFetch, SigninFetch, SignupFetch } from "../../services/fetch";
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
	birthDate: Date;
}

interface IAuth {
	user: IUser | null;
	errorMessage: string | null;
}

const authInit: IAuth = {
	user: currentUser,
	errorMessage: null,
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
				birthDate,
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
					birthDate,
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
				birthDate,
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
					birthDate,
				},
			};
		});

		builder.addCase(LogoutThunk.fulfilled, (state, action) => {
			return {
				...state,
				user: null,
			};
		});
		builder.addCase(SetupThunk.fulfilled, (state, action) => {
			const user = state.user;
			const { payload } = action;
			if (user) {
				localStorage.setItem(
					localStorageKey,
					JSON.stringify({
						...state,
						user: {
							...state.user,
							firstName: payload.firstName,
							lastName: payload.lastName,
							gender: payload.gender,
							birthDate: payload.birthDate,
						},
					}),
				);
				return {
					...state,
					user: {
						...user,
						firstName: payload.firstName,
						lastName: payload.lastName,
						gender: payload.gender,
						birthDate: payload.birthDate,
					},
				};
			} else return state;
		});
		builder.addCase(SetupThunk.rejected, (state, action) => {
			if (action.payload) {
				const { errorMessage } = action.payload;
				return {
					...state,
					errorMessage,
				};
			} else return state;
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
				firstName: rawUser.firstName,
				lastName: rawUser.lastName,
				photoUrl: rawUser.photoUrl,
				phoneNumber: rawUser.phoneNumber,
				status: rawUser.status,
				gender: rawUser.gender,
				createdAt: rawUser.createdAt,
				updatedAt: rawUser.updatedAt,
				lastLogin: rawUser.lastLogin,
				birthDate: rawUser.birthDate,
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
				firstName: rawUser.firstName,
				lastName: rawUser.lastName,
				photoUrl: rawUser.photoUrl,
				phoneNumber: rawUser.phoneNumber,
				status: rawUser.status,
				gender: rawUser.gender,
				createdAt: rawUser.createdAt,
				updatedAt: rawUser.updatedAt,
				lastLogin: rawUser.lastLogin,
				birthDate: rawUser.birthDate,
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

interface SetupArguments {
	email: string;
	firstName: string;
	lastName: string;
	gender: Gender;
	birthDate: Date;
}
interface SetupFulfilledValue {
	firstName: string;
	lastName: string;
	gender: Gender;
	birthDate: Date;
}
interface SetupRejectValue {
	errorMessage: string;
}
export const SetupThunk = createAsyncThunk<
	SetupFulfilledValue,
	SetupArguments,
	{ rejectValue: SetupRejectValue }
>(
	"auth/Setup",
	async ({ email, firstName, lastName, gender, birthDate }, thunkApi) => {
		const response = await SetupFetch({
			email,
			firstName,
			lastName,
			gender,
			birthDate,
		});
		if (!response.user) {
			return thunkApi.rejectWithValue({ errorMessage: response });
		} else {
			const user = response.user;
			return {
				firstName: user.firstName,
				lastName: user.lastName,
				gender: user.gender,
				birthDate: user.birthDate,
			};
		}
	},
);
export default authSlice.reducer;
