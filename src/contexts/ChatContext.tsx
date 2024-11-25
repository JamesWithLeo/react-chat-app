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
	const dispatch = useDispatch();

	const id = useSelector((state: AppState) => state.auth.user?.id);

	const [peerId, setPeerId] = useState<string>(
		sessionStorage.getItem("peerId") ?? "",
	);
	const [conversation_id, setConversationId] = useState<string>(
		sessionStorage.getItem("conversationId") ?? "",
	);

	const {
		data: peer,
		isLoading,
		isSuccess,
	} = useQuery(
		["peer", peerId],
		async () => {
			const response = await FetchPeer(id, peerId);
			if (response.ok && response.peer) {
				dispatch(DispatchSetPeerId(response.peer.id ?? ""));
				dispatch(
					DispatchSetConversation({
						id: response.conversation_id ?? "",
					}),
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
			dispatch(DispatchSetPeerId(peer_id ?? ""));
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

		if (result.isNew) {
			setConversationId(result.conversation_id);
			dispatch(
				DispatchSetConversation({ id: result.conversation_id ?? "" }),
			);
			return;
		}

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

	useEffect(() => {
		socket.emit("joinMessage", { conversationId: conversation_id });
		socket.on("toClientMessage", (messageData) => {
			console.log("New Message recieved:");
			console.log(messageData);
			queryClient.setQueryData(
				["messages", messageData.conversation_id],
				(prevMessages: IMessages[] | undefined) =>
					prevMessages ? [...prevMessages, messageData] : [],
			);
		});
		return () => {
			socket.off("toClientMessage");
		};
	}, [conversation_id, queryClient]);
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
