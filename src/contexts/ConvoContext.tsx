import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	act,
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
		is_read: boolean;
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
		if (!id) return;
		if (isSuccess) {
			socket.emit("joinConvo", {
				conversationIds: conversation.map(
					(c: IConversation) => c.conversation_id,
				),
			});
		}

		const handleVisibilityChange = () => {
			console.log("visibility chnange fired!");
			if (document.visibilityState === "hidden") {
				console.log("User left the tab or minimized the browser");
				socket.emit("userCameOffline", { id });
			} else if (document.visibilityState === "visible") {
				console.log("User returned to the tab");
				socket.off("currentOnlinePeers");
			}
		};
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			console.log("beforeunload event fired / user going offlne");
			socket.emit("userCameOffline", { id });
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("beforeunload", handleBeforeUnload);

		socket.emit("userCameOnline", { id });

		socket.on("currentOnlinePeers", (data) => {
			console.log("Current online users:", data);
			queryClient.setQueryData(
				["convo"],
				(oldData: IConversation[] | undefined) => {
					if (!oldData) {
						return oldData;
					}
					return oldData.map((conversation) => ({
						...conversation,
						peers: conversation.peers.map((peer) => {
							return data.includes(peer.id)
								? { ...peer, isOnline: true }
								: peer;
						}),
					}));
				},
			);
		});

		return () => {
			document.removeEventListener(
				"visibilitychange",
				handleVisibilityChange,
			);
			window.removeEventListener("beforeunload", handleBeforeUnload);
			socket.off("currentOnlinePeers");
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
