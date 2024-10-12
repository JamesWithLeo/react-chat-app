export async function SigninFetch({
	email,
	uid,
}: {
	email: string;
	uid: string;
}) {
	const response = await fetch("/signin", {
		method: "POST",
		body: JSON.stringify({ email, uid }),
		headers: {
			"Content-Type": "application/json",
		},
	});
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
	email: string;
	uid: string;
	phoneNumber: string | null;
	photoUrl: string | null;
	firstName: string | null;
	lastName: string | null;
}) {
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
	return await response.json();
}
