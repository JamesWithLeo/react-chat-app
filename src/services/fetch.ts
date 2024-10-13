import { Gender } from "../sections/auth/SetupForm";

export async function SigninFetch({
	email,
	uid,
}: {
	email: string;
	uid: string;
}) {
	try {
		const response = await fetch("/signin", {
			method: "POST",
			body: JSON.stringify({ email, uid }),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error(error);
	} finally {
		console.log("fetching finish");
	}
}

export async function SignupFetch({
	email,
	uid,
	phoneNumber,
	photoUrl,
	firstName,
	lastName,
}: {
	email: string;
	uid: string;
	phoneNumber: string | null;
	photoUrl: string | null;
	firstName: string | null;
	lastName: string | null;
}) {
	try {
		const response = await fetch("/signup", {
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
			throw new Error(`${response.status} ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error(error);
	} finally {
		console.log("fetching finished");
	}
}

export async function SetupFetch({
	email,
	firstName,
	lastName,
	gender,
	birthDate,
}: {
	email: string;
	firstName: string;
	lastName: string;
	gender: Gender;
	birthDate: Date;
}) {
	const response = await fetch("/setup", {
		method: "POST",
		body: JSON.stringify({
			email,
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
