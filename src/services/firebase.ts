import { FirebaseOptions, initializeApp } from "firebase/app";
import {
	GoogleAuthProvider,
	signInWithPopup,
	getAuth,
	getAdditionalUserInfo,
	OAuthCredential,
} from "firebase/auth";
import GetProviders, {
	GetCredentialFromResult,
	validProvider,
} from "../utils/firebase/getProviders";

const firebaseConfig: FirebaseOptions = {
	apiKey: "AIzaSyDvkb8dIEot0mNF8ak82iBKVHTjcP8zMDs",
	authDomain: "chatapp-61fa6.firebaseapp.com",
	projectId: "chatapp-61fa6",
	storageBucket: "chatapp-61fa6.appspot.com",
	messagingSenderId: "1039961628406",
	appId: "1:1039961628406:web:cb6aa7e0b1e71dc16a16d7",
	measurementId: "G-HBEB516JTP",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const ERROR_CODES = {
	ACCOUNT_EXISTS: "auth/account-exists-with-different-credential",
	USER_NOT_FOUND: "auth/user-not-found",
};

export const SigninWithPopup = async (provider: validProvider) => {
	let authProvider = GetProviders(provider);

	return await signInWithPopup(auth, authProvider)
		.then(async (result) => {
			const {
				user,
				// providerId,
				//  operationType
			} = result;

			let credential: OAuthCredential | null = GetCredentialFromResult(
				provider,
				result,
			);

			const token = credential?.accessToken;
			// The signed-in user info.

			const idp = getAdditionalUserInfo(result);

			return { user, isNewUser: idp?.isNewUser };
		})
		.catch(async (error) => {
			const email = error.customData.email;
			const errorCode = error.code;
			const errorMessage = error.message;

			if (error.code === ERROR_CODES.ACCOUNT_EXISTS) {
				return { isNewUser: false, user: null };
			} else if (error.code === ERROR_CODES.USER_NOT_FOUND) {
				console.log(error.code);
				return null;
			} else {
				const credential =
					GoogleAuthProvider.credentialFromError(error);
				console.log(errorCode);
				console.log(errorMessage);
				console.log(email);
				console.log("credentital", credential);
				return null;
			}
		});
};

export const LogoutFirebase = () => {
	return auth.signOut();
};
