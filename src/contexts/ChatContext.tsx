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
	FetchConversationInfo,
	FetchMessages,
	FetchPeers,
	// FetchPeer,
} from "../services/fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { AppState } from "../redux/store";

import socket from "../services/sockets";

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
	conversation_type?: "direct" | "group";
	conversation_thumbnail: string | null;
	conversation_name: string | null;
	peers: IViewUser[] | null; // Store peer user information
	messages: IMessages[];
	info: {
		conversation_id: string;
		conversation_name: string;
		conversation_thumbnail: string;
		conversation_type: "direct" | "group";
		created_at: string;
		updated_at: string;
	};
	setChat: ({
		initialConvoId,
		InitialPeersData,
		conversationType,
		initialConvoName,
		thumbnail,
	}: {
		initialConvoId: string;
		InitialPeersData: IViewUser[];
		conversationType: "direct" | "group";
		initialConvoName: string | null;
		thumbnail: string | null;
	}) => void;

	isTyping: boolean; // for user, to check if the user is typing
	setIsTyping: (value: boolean) => void;
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
	conversation_name: null,
	peers: null,
	info: {
		conversation_id: "",
		conversation_name: "",
		conversation_thumbnail: "",
		conversation_type: "direct",
		created_at: "",
		updated_at: "",
	},
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

	const userId = useSelector((state: AppState) => state.auth.user?.id);
	const [conversationId, setConversationId] = useState<string>(
		sessionStorage.getItem("conversationId") ?? "",
	);
	const [conversationType, setConversationType] = useState<
		"direct" | "group"
	>();
	const [conversationName, setConversationName] = useState<string | null>(
		null,
	);

	const [conversationThumbnail, setConversationThumbnail] = useState<
		string | null
	>(null);
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
				console.log("query messsages:", data);
			},
		},
	);

	const { data: peers } = useQuery(
		["peers", conversationId],
		async () => {
			if (!conversationId) return []; // Fallback to initialPeers

			const response = await FetchPeers(userId, conversationId);
			return response.ok ? response.peers : [];
		},
		{
			enabled: !!conversationId,
			onSuccess: (data) => {
				console.log("peers:", data);
			},
		},
	);
	const { data: info } = useQuery(
		["convo", conversationId],
		async () => {
			const response = await FetchConversationInfo({
				userId: userId,
				conversationId,
			});
			return response.info;
		},
		{
			enabled: !!conversationId,
			onSuccess: (data) => {
				if (
					data.conversation_type &&
					(data.conversation_type === "direct" ||
						data.conversation_type === "group")
				) {
					setConversationType(data.conversation_type);
				}
				if (
					data.conversation_name &&
					typeof data.conversation_name === "string"
				) {
					setConversationName(data.conversation_name);
				}
				if (
					data.conversation_thumbnail &&
					typeof data.conversation_thumbnail === "string"
				) {
					setConversationThumbnail(data.conversation_thumbnail);
				}
				console.log("convo info:", data);
			},
		},
	);

	const setChat = ({
		initialConvoId,
		conversationType,
		initialConvoName,
		thumbnail,
	}: {
		initialConvoId: string;
		initialConvoName: string | null;
		conversationType: "direct" | "group";
		thumbnail: string | null;
	}) => {
		setConversationId(initialConvoId);
		setConversationType(conversationType);
		setConversationName(initialConvoName);
		setConversationThumbnail(thumbnail);
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
			if (!userId || !conversationId) return;
			const seenAt = new Date().toISOString();

			socket.emit("messageSeen", {
				conversationId: conversationId,
				messageId:
					messageId ?? messages[messages.length - 1].message_id,
				userId: userId,
				seenAt,
			});
		},
		[userId, conversationId, messages],
	);

	useEffect(() => {
		if (!userId) return;

		if (conversationId) {
			socket.emit("userCameOnline", { id: userId });

			socket.emit("joinMessage", { conversationId: conversationId });
		}
		const handleUpdateMessages = (messageData: any) => {
			console.log("New Message recieved:", messageData);
			queryClient.setQueryData(
				["messages", messageData.conversation_id],
				(prevMessages: IMessages[] | undefined) =>
					prevMessages ? [...prevMessages, messageData] : [],
			);
		};
		socket.on("toClientMessage", handleUpdateMessages);

		socket.on("peerTyping", (data) => {
			console.log("Received typing event:", data);
			// if (data.id === userId) return;

			queryClient.setQueryData(
				["peers", data.conversation_id],
				(oldPeers: IViewUser[] | undefined) => {
					if (!oldPeers) {
						console.log("No old peers data found");
						return []; // Safeguard in case oldPeer is null
					}
					return oldPeers.map((peer) => {
						const isMatchingPeer = peer.id === data.id;
						console.log(data.id, "is typing:", data.isTyping);
						return isMatchingPeer
							? { ...peer, isTyping: data.isTyping } // Update the typing status
							: peer;
					});
				},
			);
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
			socket.off("toClientMessage", handleUpdateMessages);
			socket.off("peerTyping");
			socket.off("currentOnlinePeers");
			socket.off("currentSeen");
		};
	}, [conversationId, peers, queryClient, userId, seenMessage]);
	return (
		<ChatContext.Provider
			value={{
				conversation_id: conversationId,
				conversation_type: conversationType,
				conversation_thumbnail: conversationThumbnail,
				conversation_name: conversationName,
				peers,
				info,
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
