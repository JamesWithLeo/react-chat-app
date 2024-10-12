import { initializeApp } from "firebase/app";
import {
	GoogleAuthProvider,
	signInWithPopup,
	getAuth,
	getAdditionalUserInfo,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const firebaseConfig = {
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

export const SigninGooglePopup = async () => {
	return await signInWithPopup(auth, googleProvider)
		.then(async (result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential?.accessToken;
			// The signed-in user info.
			const user = result.user;

			const idp = getAdditionalUserInfo(result);
			console.log("user toker:", token);

			return { user, isNewUser: idp?.isNewUser };
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			// ...
			console.log(errorCode);
			console.log(errorMessage);
			console.log(email);
			console.log("credentital", credential);
			return null;
		});
};

export const LogoutFirebase = () => {
	return auth.signOut();
};
