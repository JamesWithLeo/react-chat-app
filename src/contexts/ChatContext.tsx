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
	FetchPeer,
	SendChat,
} from "../services/fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { AppState } from "../redux/store";

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
interface ChatContextType {
	peer: IViewUser | null; // Store peer user information
	messages: IMessages[];
	isLoading: boolean;
	isSuccess: boolean;
	fetchPeer: (peerId: string) => void; // Function to fetch peer data

	messagePeer: (
		message: string,
		userId: string,
		messageType: IMessage_type,
	) => Promise<void>;
	getMessages: (conversation_id: string) => Promise<void>;
	removeMessage: (messageId: string) => Promise<void>;
	isSuccessMessages: boolean;
	isLoadingMessages: boolean;
	conversation_id: string;
}

const defaultContextValue: ChatContextType = {
	peer: null,
	isLoading: false,
	isSuccess: false,
	fetchPeer: async () => {},
	conversation_id: "",
	messagePeer: async () => {},

	getMessages: async () => {},
	removeMessage: async () => {},
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

	const [peerId, setPeerId] = useState<string>(
		sessionStorage.getItem("peerId") ?? "",
	);
	const [conversation_id, setConversationId] = useState<string>(
		sessionStorage.getItem("conversationId") ?? "",
	);
	const id = useSelector((state: AppState) => state.auth.user?.id);

	const {
		data: peer,
		isLoading,
		isSuccess,
	} = useQuery(
		["peer", peerId],
		async () => {
			const response = await FetchPeer(id, peerId);
			if (response.ok && response.peer) {
				sessionStorage.setItem("peerId", response.peer.id);
				sessionStorage.setItem(
					"conversationId",
					response.conversation_id,
				);
				setConversationId(response.conversation_id ?? "");

				return response.peer;
			}
			return null;
		},
		{ enabled: !!peerId },
	);

	const {
		data: messages,
		isLoading: isLoadingMessages,
		isSuccess: isSuccessMessages,
	} = useQuery(
		["messages", conversation_id],
		async () => {
			const fetchMessageResponse = await FetchMessages(conversation_id);
			if (fetchMessageResponse.ok) {
				return fetchMessageResponse.messages;
			}
			return null;
		},
		{
			enabled: !!conversation_id,
		},
	);

	const fetchPeer = async (peer_id: string) => {
		const previousConvoId = sessionStorage.getItem("peerId");
		if (previousConvoId !== peer_id) {
			sessionStorage.setItem("peerId", peer_id);
			setPeerId(peer_id);
		}
	};

	const messagePeer = async (
		message: string,
		userId: string,
		messageType: IMessage_type,
	) => {
		if (!peer || !peer.id) return;
		const result = await SendChat(userId, peer.id, message, messageType);

		if (result.ok && result.message) {
			queryClient.setQueryData(
				["messages", (result.message as IMessages).conversation_id],
				(prevMessage: IMessages[] | undefined) => {
					return prevMessage
						? [...prevMessage, result.message]
						: [result.message];
				},
			);
		}
	};

	const getMessages = async (convo_id: string) => {
		sessionStorage.setItem("conversation_id", convo_id);
		setConversationId(convo_id);
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

	return (
		<ChatContext.Provider
			value={{
				conversation_id,
				peer,
				fetchPeer,
				isLoading,
				isSuccess,
				//
				messages,
				getMessages,
				messagePeer,
				removeMessage,

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
