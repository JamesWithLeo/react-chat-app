import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { IViewUser } from "../redux/slices/auth";
import {
	DeleteChat,
	FetchMessages,
	FetchPeers,
	// FetchPeer,
} from "../services/fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { AppState } from "../redux/store";

import socket from "../services/sockets";
import { useNavigate } from "react-router-dom";

export type IMessage_type = "text" | "reply" | "doc" | "link" | "media";

export interface IMessages {
	conversation_id: string;
	message_id: string;
	sender_id: string;
	content: string;
	created_at: string;
	message_type: IMessage_type;
	is_edited: boolean;

	// todo: add read and receive features
}
export interface ITypist {
	id: string;
	photoUrl: string;
}
interface ChatContextType {
	conversation_type: "direct" | "group";
	conversation_thumbnail: string;
	peers: IViewUser[] | null; // Store peer user information
	setChat: ({
		initialConvoId,
		InitialPeersData,
		conversationType,
		thumbnail,
	}: {
		initialConvoId: string;
		InitialPeersData: IViewUser[];
		conversationType: "direct" | "group";
		thumbnail: string;
	}) => void;

	isTyping: boolean; // for user, to check if the user is typing
	setIsTyping: (value: boolean) => void;
	messages: IMessages[];
	// fetchPeer: (peerId: string) => void; // Function to fetch peer data

	createMessage: (messageData: {
		userId: string;
		content: string;
		content_type: IMessage_type;
		peerId: string[];
		conversation_type: "direct" | "group";
	}) => void;
	insertMessage: (
		message: string,
		userId: string,
		messageType: IMessage_type,
	) => Promise<void>;
	removeMessage: (messageId: string) => Promise<void>;
	isSuccessMessages: boolean;
	isLoadingMessages: boolean;
	conversation_id: string;
	seenMessage: ({ messageId }: { messageId: string | undefined }) => void;
}

const defaultContextValue: ChatContextType = {
	conversation_type: "direct",
	conversation_thumbnail: "",
	peers: null,
	isTyping: false,
	setIsTyping: () => {},
	setChat: () => {},
	conversation_id: "",
	insertMessage: async () => {},
	createMessage: async () => {},
	removeMessage: async () => {},
	seenMessage: async () => {},
	messages: [],
	isSuccessMessages: false,
	isLoadingMessages: false,
};

export const ChatContext = createContext<ChatContextType>(defaultContextValue);

interface ChatContextProviderProps {
	children: ReactNode;
}

const ChatContextProvider: React.FC<ChatContextProviderProps> = ({
	children,
}) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const id = useSelector((state: AppState) => state.auth.user?.id);

	const [conversationId, setConversationId] = useState<string>(
		sessionStorage.getItem("conversationId") ?? "",
	);
	const [conversationType, setConversationType] = useState<
		"direct" | "group"
	>("direct");
	const [conversationThumbnail, setConversationThumbnail] =
		useState<string>("");
	const [isTyping, setIsTyping] = useState<boolean>(false);

	const {
		data: messages,
		isLoading: isLoadingMessages,
		isSuccess: isSuccessMessages,
	} = useQuery(
		["messages", conversationId],
		async () => {
			const fetchMessageResponse = await FetchMessages(conversationId);
			return fetchMessageResponse.ok ? fetchMessageResponse.messages : [];
		},
		{
			enabled: !!conversationId,
			initialData: [],
			onSuccess: (data) => {
				console.log("messsage:", data);
			},
		},
	);

	// Query for peers: can be used if you want to refresh peers on each conversationId change
	const { data: peers } = useQuery(
		["peers", conversationId],
		async () => {
			if (!conversationId) return []; // Fallback to initialPeers

			const response = await FetchPeers(id, conversationId);
			return response.ok ? response.peers : [];
		},
		{
			enabled: !!conversationId,
			onSuccess: (data) => {
				console.log("peers:", data);
			},
		},
	);

	const setChat = async ({
		initialConvoId,
		InitialPeersData,
		conversationType,
		thumbnail,
	}: {
		initialConvoId: string;
		InitialPeersData: IViewUser[];
		conversationType: "direct" | "group";
		thumbnail: string;
	}) => {
		sessionStorage.setItem("conversationId", initialConvoId);
		setConversationId(initialConvoId);
		setConversationType(conversationType);
		setConversationThumbnail(thumbnail);
		navigate("/chat");
	};

	const insertMessage = async (
		message: string,
		userId: string,
		messageType: IMessage_type,
	) => {
		if (!peers) return;
		socket.emit("insertMessage", {
			conversation_id: conversationId,
			content: message,
			userId,
			content_type: messageType,
		});
	};

	const createMessage = async ({
		userId,
		content,
		content_type,
		peerId,
		conversation_type,
	}: {
		userId: string;
		content: string;
		content_type: IMessage_type;
		peerId: string[];
		conversation_type: "direct" | "group";
	}) => {
		if (!peers) return;
		socket.emit("createMessage", {
			peerId,
			content,
			content_type,
			userId,
			conversation_type,
		});
	};

	const removeMessage = async (messageId: string) => {
		const response = await DeleteChat(messageId);
		const deletedMessage = response.message;
		if (response.ok && response.message) {
			queryClient.setQueryData(
				["messages", deletedMessage.conversation_id],
				(prevMessages: IMessages[] | undefined) =>
					prevMessages
						? prevMessages.filter(
								(msg) =>
									msg.message_id !==
									deletedMessage.message_id,
							)
						: [],
			);
		}
	};

	const HandleTyping = (value: boolean) => {
		setIsTyping(value);
	};

	const seenMessage = useCallback(
		({ messageId }: { messageId: string | undefined }) => {
			if (!id || !conversationId) return;
			const seenAt = new Date().toISOString();

			socket.emit("messageSeen", {
				conversationId: conversationId,
				messageId:
					messageId ?? messages[messages.length - 1].message_id,
				userId: id,
				seenAt,
			});
		},
		[id, conversationId, messages],
	);

	useEffect(() => {
		if (!id) return;

		if (conversationId) {
			socket.emit("userCameOnline", { id });

			socket.emit("joinMessage", { conversationId: conversationId });
		}
		socket.on("toClientMessage", (messageData) => {
			console.log("New Message recieved and seen: ", messageData);
			queryClient.setQueryData(
				["messages", messageData.conversation_id],
				(prevMessages: IMessages[] | undefined) =>
					prevMessages ? [...prevMessages, messageData] : [],
			);
		});

		socket.on("peerTyping", (data) => {
			console.log("Received typing event:", data);
			if (data.id === id) return;

			queryClient.setQueryData(
				["peers", data.conversation_id],
				(oldPeers: IViewUser[] | undefined) => {
					if (!oldPeers) {
						console.log("No old peers data found");
						return oldPeers; // Safeguard in case oldPeer is null
					}
					return oldPeers.map((peer) => {
						const isMatchingPeer = peer.id === data.id;
						console.log(
							"Is Matching Peer:",
							isMatchingPeer,
							"Data.isTyping:",
							data.isTyping,
						);
						return isMatchingPeer
							? { ...peer, isTyping: data.isTyping } // Update the typing status
							: peer;
					});
				},
			);
			const updatedPeers = queryClient.getQueryData([
				"peers",
				data.conversation_id,
			]);
			console.log("Updated Peers Data:", updatedPeers);
		});

		socket.on("currentOnlinePeers", (data) => {
			queryClient.setQueriesData(
				["peers", conversationId],
				(oldData: IViewUser[] | null | undefined) => {
					console.log(
						"(socket.currentOnlinePeers) optimistic update:",
						oldData,
					);
					if (!oldData) return oldData;
					return oldData.map((p) => {
						if (data.includes(p.id)) {
							return {
								...p,
								isOnline: true,
							};
						} else {
							return {
								...p,
								isOnline: false,
							};
						}
					});
				},
			);
		});

		socket.on("currentSeen", (data) => {
			console.log("(socket.currentSeen) optimistic update:", data);
			queryClient.setQueryData(
				["peers", data.conversation_id],
				(oldPeers: IViewUser[] | undefined) => {
					if (!oldPeers) return oldPeers;
					return oldPeers.map((p) =>
						p.id === data.user_id
							? {
									...p,
									lastSeen: {
										seenAt: data.seen_at,
										messageId: data.message_id,
									},
								}
							: p,
					);
				},
			);
		});

		return () => {
			socket.off("toClientMessage");
			socket.off("peerTyping");
			socket.off("currentOnlinePeers");
			socket.off("currentSeen");
		};
	}, [conversationId, peers, queryClient, id, seenMessage]);
	return (
		<ChatContext.Provider
			value={{
				conversation_id: conversationId,
				conversation_type: conversationType,
				conversation_thumbnail: conversationThumbnail,
				peers,
				messages,
				setChat,
				createMessage,
				insertMessage,
				removeMessage,
				seenMessage,

				isTyping,
				// isOtherOnline,
				// isOtherTyping,
				setIsTyping: HandleTyping,
				isSuccessMessages,
				isLoadingMessages,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export default ChatContextProvider;

export const useChatContext = () => {
	const context = useContext(ChatContext);

	if (!context) {
		throw new Error(
			"useChatContext must be used within a ChatContextProvider",
		);
	}

	return context;
};
