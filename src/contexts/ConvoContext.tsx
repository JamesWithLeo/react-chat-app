import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useReducer,
	useState,
} from "react";
import { FetchConvo } from "../services/fetch";
import { useSelector } from "react-redux";
import { AppState } from "../redux/store";
import socket from "../services/sockets";
import { IMessage_type } from "./ChatContext";
import { IViewUser } from "../redux/slices/auth";

type SelectedConvoState = {
	conversation_id: string;
	is_pinned: boolean;
	is_archived: boolean;
};
type SelectedConvoActionReducer =
	| {
			type: "initialize";
			payload: {
				conversation_id: string;
				is_pinned: boolean;
				is_archived: boolean;
			};
	  }
	| {
			type: "set";
			payload: { is_pinned?: boolean; is_archived?: boolean };
	  };

export interface IConversation {
	conversation_id: string;
	conversation_name: string | null;
	conversation_thumbnail: string | null;
	created_at: Date;
	updated_at: Date;
	conversation_type: "direct" | "group";
	peers: IViewUser[];
	last_message: {
		content: string;
		created_at: string;
		message_type: IMessage_type;
	} | null;

	// to add ff:
	is_pinned: boolean;
	is_archived: boolean;
}

interface IConvoContext {
	conversation: IConversation[];
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean;

	selectedConvo: {
		conversation_id: string;
		is_pinned: boolean;
		is_archived: boolean;
	} | null;
	setSelectedConvo: (convo: SelectedConvoState) => void;
	fetchConversation: (userId: string) => void;
	archivedConversation: (isArchived: boolean) => void;
	pinConversation: (isPinned: boolean) => void;
}

const defaultContextValue: IConvoContext = {
	conversation: [],
	isLoading: true,
	isSuccess: false,
	isError: false,
	selectedConvo: null,
	setSelectedConvo: () => {},
	pinConversation: () => {},
	archivedConversation: () => {},
	fetchConversation: async (userId: string) => {},
};

export const ConvoContext = createContext(defaultContextValue);

const ConvoContextProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const queryClient = useQueryClient();
	const id = useSelector((state: AppState) => state.auth.user?.id);
	const [senderId, setSenderId] = useState<string>(id ?? "");

	const selectedConvoReducer = (
		state: SelectedConvoState | null,
		action: SelectedConvoActionReducer,
	): SelectedConvoState | null => {
		switch (action.type) {
			case "initialize":
				return {
					...action.payload,
				};
			case "set":
				return state
					? {
							...state,
							is_archived:
								action.payload.is_archived ?? state.is_archived,
							is_pinned:
								action.payload.is_pinned ?? state.is_pinned,
						}
					: null;
			default:
				return state;
		}
	};
	const [selectedConvo, setSelectedConvoReducer] = useReducer(
		selectedConvoReducer,
		null,
	);

	const pinConversation = (isPinned: boolean) => {
		console.log("Convo cached changing!");
		if (selectedConvo) {
			queryClient.setQueryData(
				["convo"],
				(oldData: IConversation[] | undefined) => {
					if (!oldData) return oldData;
					return oldData.map((c) =>
						c.conversation_id === selectedConvo.conversation_id
							? { ...c, is_pinned: !selectedConvo.is_pinned }
							: c,
					);
				},
			);

			setSelectedConvoReducer({
				type: "set",
				payload: { is_pinned: isPinned },
			});
		}
	};

	const archivedConversation = (isArchived: boolean) => {
		console.log("Convo cached changing!");
		if (selectedConvo) {
			queryClient.setQueryData(
				["convo"],
				(oldData: IConversation[] | undefined) => {
					if (!oldData) return oldData;
					return oldData.map((c) =>
						c.conversation_id === selectedConvo.conversation_id
							? { ...c, is_archived: !selectedConvo.is_archived }
							: c,
					);
				},
			);

			setSelectedConvoReducer({
				type: "set",
				payload: { is_archived: isArchived },
			});
		}
	};

	const fetchConversation = async (userId: string) => {
		setSenderId(userId);
	};

	const handleSetSelectedConvo = (convo: SelectedConvoState) => {
		setSelectedConvoReducer({ type: "initialize", payload: convo });
	};

	const {
		data: conversation,
		isLoading,
		isSuccess,
		isError,
	} = useQuery(
		["convo"],
		async () => {
			const response = await FetchConvo(senderId);
			console.log(response);
			if (response.ok && response.conversation) {
				return response.conversation;
			}
			return [];
		},
		{
			enabled: !!senderId,

			// refetchOnWindowFocus: false, // Disable auto-refetch on window focus
			// refetchOnReconnect: false, // Disable auto-refetch on reconnect
			// refetchInterval: false, // No periodic polling
		},
	);

	useEffect(() => {
		if (!id || !isSuccess || !Array.isArray(conversation)) return;

		// Notify server the user joined conversations
		socket.emit("joinConvo", {
			conversationIds: conversation.map((c) => c.conversation_id),
		});

		// Notify server the user came online
		socket.emit("userCameOnline", { id });

		const handleVisibilityChange = () => {
			console.log("Visibility change detected!");
			if (document.visibilityState === "hidden") {
				console.log("User left the tab or minimized the browser");
				socket.emit("userCameOffline", { id });
			} else {
				console.log("User returned to the tab");
				socket.emit("userCameOnline", { id });
			}
		};

		const handleBeforeUnload = () => {
			console.log("User going offline (beforeunload)");
			socket.emit("userCameOffline", { id });
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("beforeunload", handleBeforeUnload);

		const handleUpdateStatus = (data: string[]) => {
			console.log("Current online users:", data);
			queryClient.setQueryData(
				["convo"],
				(oldData: IConversation[] | undefined) => {
					if (!oldData) return oldData;
					return oldData.map((conversation) => ({
						...conversation,
						peers: conversation.peers.map((peer) =>
							data.includes(peer.id)
								? { ...peer, isOnline: true }
								: peer,
						),
					}));
				},
			);
		};
		// Listen for current online peers
		socket.on("currentOnlinePeers", handleUpdateStatus);

		const handleUpdateConversation = (data: any) => {
			console.log("Message received:", data);
			queryClient.setQueryData(
				["convo"],
				(prevConvo: IConversation[] | undefined) => {
					if (!prevConvo) return prevConvo;
					return prevConvo.map((p) =>
						p.conversation_id === data.conversation_id
							? {
									...p,
									last_message: {
										content: data.content,
										created_at: data.created_at,
										message_type: data.message_type,
									},
								}
							: p,
					);
				},
			);
		};
		// Listen for incoming messages
		socket.on("toClientMessage", handleUpdateConversation);

		return () => {
			document.removeEventListener(
				"visibilitychange",
				handleVisibilityChange,
			);
			window.removeEventListener("beforeunload", handleBeforeUnload);
			socket.off("currentOnlinePeers", handleUpdateStatus);
			socket.off("toClientMessage", handleUpdateConversation);
		};
	}, [queryClient, conversation, isSuccess, id]);

	return (
		<ConvoContext.Provider
			value={{
				conversation,
				fetchConversation,
				selectedConvo,
				setSelectedConvo: handleSetSelectedConvo,
				archivedConversation,
				pinConversation,
				isLoading,
				isSuccess,
				isError,
			}}
		>
			{children}
		</ConvoContext.Provider>
	);
};
export default ConvoContextProvider;

export const useConvoContext = () => {
	const context = useContext(ConvoContext);
	if (!context) {
		console.error(
			"useConvoContext must be used with a ConvoContextProvider",
		);
		throw new Error(
			"useConvoContext must be used with a ConvoContextProvider",
		);
	}
	return context;
};
