import React, {
	createContext,
	ReactNode,
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
	SendChat,
} from "../services/fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../redux/store";
import {
	SetConversation as DispatchSetConversation,
	SetPeerId as DispatchSetPeerId,
} from "../redux/slices/app";
import socket from "../services/sockets";

export type IMessage_type = "text" | "reply" | "doc" | "link" | "media";

export interface IMessages {
	conversation_id: string;
	message_id: string;
	sender_id: string;
	content: string;
	created_at: string;
	message_type: IMessage_type;
	is_read: boolean;
	is_edited: boolean;
}
export interface ITypist {
	id: string;
	photoUrl: string;
}
interface ChatContextType {
	conversation_type: "direct" | "group";
	conversation_thumbnail: string;
	peers:
		| {
				id: string;
				photoUrl: string;
				firstName: string;
				lastName: string;
				isOnline: boolean;
				isTyping: boolean;
		  }[]
		| null; // Store peer user information
	setChat: ({
		conversationId,
		peers,
	}: {
		conversationId: string;
		peers: {
			id: string;
			photoUrl: string;
			firstName: string;
			lastName: string;
			isOnline: boolean;
			isTyping: boolean;
		}[];
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
	conversation_id: string | null;
	isOtherOnline: boolean;
	isOtherTyping: boolean;
}

const defaultContextValue: ChatContextType = {
	conversation_type: "direct",
	conversation_thumbnail: "",
	peers: null,
	isTyping: false,
	setIsTyping: (value: boolean) => {},
	setChat: async ({
		conversationId,
		peers,
	}: {
		conversationId: string;
		peers: {
			id: string;
			photoUrl: string;
			firstName: string;
			lastName: string;
			isOnline: boolean;
		}[];
	}) => {},
	// fetchPeer: async () => {},
	conversation_id: null,
	insertMessage: async () => {},
	createMessage: async () => {},

	removeMessage: async () => {},
	messages: [],
	isSuccessMessages: false,
	isLoadingMessages: false,
	isOtherOnline: false,
	isOtherTyping: false,
};

export const ChatContext = createContext<ChatContextType>(defaultContextValue);

interface ChatContextProviderProps {
	children: ReactNode;
}

const ChatContextProvider: React.FC<ChatContextProviderProps> = ({
	children,
}) => {
	const queryClient = useQueryClient();

	const id = useSelector((state: AppState) => state.auth.user?.id);

	const [conversationId, setConversationId] = useState<string>(
		sessionStorage.getItem("conversationId") ?? "",
	);
	const [conversationType, setConversationType] = useState<
		"direct" | "group"
	>("direct");
	const [conversationThumbnail, setConversationThumbnail] =
		useState<string>("");
	const [isOtherOnline, setIsOtherOnline] = useState<boolean>(false);
	const [isTyping, setIsTyping] = useState<boolean>(false);
	const [isOtherTyping, setIsOtherTyping] = useState<boolean>(false);
	const [peers, setPeers] = useState<
		{
			id: string;
			photoUrl: string;
			firstName: string;
			lastName: string;
			isOnline: boolean;
			isTyping: boolean;
		}[]
	>([]);

	const {
		data: messages,
		isLoading: isLoadingMessages,
		isSuccess: isSuccessMessages,
	} = useQuery(
		["messages", conversationId],
		async () => {
			const fetchMessageResponse = await FetchMessages(conversationId);
			if (fetchMessageResponse.ok) {
				return fetchMessageResponse.messages;
			}
			return null;
		},
		{
			enabled: !!conversationId,
		},
	);
	// Query for peers: can be used if you want to refresh peers on each conversationId change
	const { data: fetchedPeers, isLoading: isLoadingPeers } = useQuery(
		["peers", conversationId],
		async () => {
			const response = await FetchPeers(id, conversationId);
			return response.ok ? response.peers : [];
		},
		{
			enabled: !!conversationId,
			onSuccess: (data) => {
				if (data && Array.isArray(data) && data.length) {
					// Update context state after fetching peers
					setPeers(data);
				}
			},
		},
	);

	const setChat = async ({
		conversationId,
		peers,
	}: {
		conversationId: string;
		peers: {
			id: string;
			photoUrl: string;
			firstName: string;
			lastName: string;
			isOnline: boolean;
			isTyping: boolean;
		}[];
	}) => {
		setConversationId(conversationId);
		sessionStorage.getItem(conversationId);

		setPeers(peers);
		setIsOtherOnline(peers.some((p) => p.isOnline));
		setIsOtherTyping(peers.some((p) => p.isTyping));
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

	useEffect(() => {
		socket.emit("joinMessage", { conversationId: conversationId });
		socket.on("toClientMessage", (messageData) => {
			console.log("New Message recieved:");
			console.log(messageData);
			queryClient.setQueryData(
				["messages", messageData.conversation_id],
				(prevMessages: IMessages[] | undefined) =>
					prevMessages ? [...prevMessages, messageData] : [],
			);
		});
		socket.on("peerTyping", (data) => {
			if (data.id === id) return;
			console.log("someone is typing!", data);
			queryClient.setQueryData(
				["peers", data.conversation_id],
				(oldPeer: any) => {
					if (!oldPeer) return null; // Safeguard in case oldPeer is null
					return {
						...oldPeer,
						isTyping: data.isTyping, // Update the typing status
					} as IViewUser;
				},
			);
		});

		return () => {
			socket.off("toClientMessage");
			socket.off("peerTyping");
		};
	}, [conversationId, queryClient, id]);
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

				isTyping,
				isOtherOnline,
				isOtherTyping,
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
