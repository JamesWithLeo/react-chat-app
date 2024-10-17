import {
	GithubAuthProvider,
	GoogleAuthProvider,
	UserCredential,
} from "firebase/auth";
export type validProvider = "github.com" | "google.com";

export default function GetProviders(providerId: validProvider) {
	switch (providerId) {
		case GoogleAuthProvider.PROVIDER_ID:
			return new GoogleAuthProvider();
		case GithubAuthProvider.PROVIDER_ID:
			return new GithubAuthProvider();
		default:
			throw new Error(`No provider match with ${providerId}`);
	}
}

export function GetCredentialFromResult(
	providerId: validProvider,
	useCred: UserCredential,
) {
	switch (providerId) {
		case GoogleAuthProvider.PROVIDER_ID:
			return GoogleAuthProvider.credentialFromResult(useCred);
		case GithubAuthProvider.PROVIDER_ID:
			return GithubAuthProvider.credentialFromResult(useCred);
		default:
			throw new Error(`No provider match with ${providerId}`);
	}
}
