import { Gender } from "../sections/auth/SetupForm";
const apiUrl = process.env.REACT_APP_API_URL;
export async function SigninFetch({ uid }: { uid: string }) {
	const response = await fetch(`${apiUrl}signin`, {
		method: "POST",
		body: JSON.stringify({ uid }),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		return `Error: ${response.status} ${response.statusText}`;
	}

	return await response.json();
}

export async function SignupFetch({
	email,
	uid,
	phoneNumber,
	photoUrl,
	firstName,
	lastName,
}: {
	email: string | null;
	uid: string;
	phoneNumber: string | null;
	photoUrl: string | null;
	firstName: string | null;
	lastName: string | null;
}) {
	const response = await fetch(`${apiUrl}signup`, {
		method: "POST",
		body: JSON.stringify({
			email,
			uid,
			phoneNumber,
			photoUrl,
			firstName,
			lastName,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		return `${response.status} ${response.statusText}`;
	}

	return await response.json();
}

export async function SetupFetch({
	uid,
	firstName,
	lastName,
	gender,
	birthDate,
}: {
	uid: string;
	firstName: string;
	lastName: string;
	gender: Gender;
	birthDate: Date;
}) {
	const response = await fetch(`${apiUrl}setup`, {
		method: "POST",
		body: JSON.stringify({
			uid,
			firstName,
			lastName,
			gender,
			birthDate,
		}),
		headers: {
			"Content-type": "application/json",
		},
	});
	if (!response.ok) {
		return `${response.status} ${response.statusText}`;
	}
	return await response.json();
}
