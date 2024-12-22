import { Gender } from "../sections/auth/SetupForm";
import { apiUrl } from "../config";
import { IMessage_type } from "../contexts/ChatContext";

export async function SigninFetch({ uid }: { uid: string }) {
	const response = await fetch(`${apiUrl}auth/signin`, {
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
	const response = await fetch(`${apiUrl}auth/signup`, {
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
	const response = await fetch(`${apiUrl}auth/setup`, {
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

export async function FetchSearch(
	id: string,
	query: string,
	scope: string = "all",
) {
	const response = await fetch(
		`${apiUrl}search/${id}/?scope=${scope}&query=${query}`,
		{
			method: "GET",
		},
	);

	if (!response.ok) {
		return `${response.status} ${response.statusText}`;
	}
	return await response.json();
}

export async function FetchPeers(
	userId: string | undefined,
	conversationId: string,
) {
	if (!userId) return;
	const url = `${apiUrl}peer/${userId}?convoId=${conversationId}`;
	console.log(`GET fetching for ${url}`);
	const response = await fetch(url, {
		method: "GET",
	});

	if (!response.ok) {
		return `${response.status} ${response.statusText}`;
	}

	return await response.json();
}

export async function FetchConversationId({
	userId,
	peerId,
}: {
	userId: string;
	peerId: string;
}) {
	const url = `${apiUrl}convo/${userId}/getId`;
	console.log("(Fetch API) GET fetching:", url);
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify({ peerId }),
		headers: {
			"Content-type": "application/json",
		},
	});
	if (!response.ok) {
		return `${response.status} ${response.statusText}`;
	}
	return await response.json();
}

export async function DeleteChat(messageId: string) {
	const url = `${apiUrl}messages/${messageId}`;

	const response = await fetch(url, {
		method: "DELETE",
	});
	if (!response.ok) {
		return `${response.status} ${response.statusText}`;
	}
	return await response.json();
}

export async function FetchConvo(senderId: string) {
	const url = `${apiUrl}convo/${senderId}`;
	const response = await fetch(url, {
		method: "GET",
	});

	if (!response.ok) {
		return `${response.status} ${response.statusText}`;
	}
	return await response.json();
}

export async function FetchMessages(conversationId: string) {
	if (!conversationId) return;

	const url = `${apiUrl}messages/${conversationId}`;

	const response = await fetch(url, {
		method: "GET",
	});

	if (!response.ok) {
		return `${response.status} ${response.statusText}`;
	}
	return await response.json();
}
export async function SendInitialMessage({
	userId,
	message,
	messageType,
	recipientId,
}: {
	userId: string;
	message: string;
	messageType: IMessage_type;
	recipientId: string;
}) {
	const url = `${apiUrl}messages/${userId}`;
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify({
			message,
			messageType,
			recipientId,
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

export async function PinConvoRequest(
	userId: string,
	conversationId: string,
	isPinned: boolean,
) {
	const url = `${apiUrl}convo/${userId}/pin`;
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify({
			conversationId,
			isPinned,
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

export async function ArchiveConvoRequest(
	userId: string,
	conversationId: string,
	isArchived: boolean,
) {
	const url = `${apiUrl}convo/${userId}/archive`;
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify({
			conversationId,
			isArchived,
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
