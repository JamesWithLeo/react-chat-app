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

		builder.addCase(SigninThunk.rejected, (state, action) => {
			localStorage.removeItem(localStorageKey);
			if (action.payload) {
				return {
					...state,
					user: null,
					errorMessage: action.payload.errorMessage,
				};
			}
			return state;
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

		builder.addCase(SignupThunk.rejected, (state, action) => {
			localStorage.removeItem(localStorageKey);
			if (action.payload) {
				return {
					...state,
					user: null,
					errorMessage: action.payload.errorMessage,
				};
			}
			return state;
		});

		builder.addCase(LogoutThunk.fulfilled, (state, action) => {
			localStorage.removeItem(localStorageKey);
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

interface SigninArg {
	email: string;
	uid: string;
}
interface rejectValue {
	errorMessage: string;
}

export const SigninThunk = createAsyncThunk<
	IUser,
	SigninArg,
	{ rejectValue: rejectValue }
>(
	"auth/Signin",
	async ({ email, uid }: { email: string; uid: string }, thunkApi) => {
		try {
			const response = await SigninFetch({ email, uid });
			if (!response.ok || !response.user) {
				return thunkApi.rejectWithValue({ errorMessage: response });
			}

			const rawUser = response.user;
			const user: IUser = {
				id: rawUser.id,
				email: rawUser.email,
				uid: rawUser.uid,
				firstName: rawUser.first_name,
				lastName: rawUser.last_name,
				photoUrl: rawUser.photo_url,
				phoneNumber: rawUser.phone_number,
				status: rawUser.status,
				gender: rawUser.gender,
				createdAt: rawUser.created_at,
				updatedAt: rawUser.updated_at,
				lastLogin: rawUser.last_login,
				birthDate: rawUser.birth_date,
			};
			return user;
		} catch (error) {
			console.log("Signin error", error);
			return Promise.reject(error);
		}
	},
);
interface SignupArgs {
	email: string;
	uid: string;
	photoUrl: string | null;
	phoneNumber: string | null;
	firstName: string | null;
	lastName: string | null;
}

export const SignupThunk = createAsyncThunk<
	IUser,
	SignupArgs,
	{ rejectValue: rejectValue }
>(
	"auth/Signup",
	async (
		{ email, uid, photoUrl, phoneNumber, firstName, lastName },
		thunkApi,
	) => {
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
				return thunkApi.rejectWithValue({ errorMessage: response });
			}

			const rawUser = response.user;
			const user: IUser = {
				id: rawUser.id,
				email: rawUser.email,
				uid: rawUser.uid,
				firstName: rawUser.first_name,
				lastName: rawUser.last_name,
				photoUrl: rawUser.photo_url,
				phoneNumber: rawUser.phone_number,
				status: rawUser.status,
				gender: rawUser.gender,
				createdAt: rawUser.created_at,
				updatedAt: rawUser.updated_at,
				lastLogin: rawUser.last_login,
				birthDate: rawUser.birth_date,
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

export const SetupThunk = createAsyncThunk<
	SetupFulfilledValue,
	SetupArguments,
	{ rejectValue: rejectValue }
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
				firstName: user.first_name,
				lastName: user.last_name,
				gender: user.gender,
				birthDate: user.birth_date,
			};
		}
	},
);
export default authSlice.reducer;
