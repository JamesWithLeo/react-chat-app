import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { FetchConvo } from "../services/fetch";
import { useSelector } from "react-redux";
import { AppState } from "../redux/store";
import socket from "../services/sockets";
import { IMessage_type } from "./ChatContext";
import { IViewUser } from "../redux/slices/auth";

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
	};

	// to add ff:
	is_pinned: boolean;
	is_archived: boolean;
}

interface IConvoContext {
	conversation: IConversation[];
	isLoading: boolean;
	isSuccess: boolean;
	fetchConversation: (userId: string) => void;
	refreshStatus: (value: boolean) => void;
}

const defaultContextValue: IConvoContext = {
	conversation: [],
	isLoading: false,
	isSuccess: false,
	refreshStatus: () => {},
	fetchConversation: async (userId: string) => {},
};

export const ConvoContext = createContext(defaultContextValue);

interface ConvoContextProviderProps {
	children: ReactNode;
}

const ConvoContextProvider: React.FC<ConvoContextProviderProps> = ({
	children,
}) => {
	const id = useSelector((state: AppState) => state.auth.user?.id);
	const [senderId, setSenderId] = useState<string>(id ?? "");

	const queryClient = useQueryClient();

	const {
		data: conversation,
		isLoading,
		isSuccess,
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
			refetchOnWindowFocus: false, // Disable auto-refetch on window focus
			refetchOnReconnect: false, // Disable auto-refetch on reconnect
			refetchInterval: false, // No periodic polling
		},
	);
	const fetchConversation = async (userId: string) => {
		setSenderId(userId);
	};

	// const pinConversation = async () => {};

	const refreshStatus = (value: boolean) => {
		if (!id) return;
	};

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
				socket.emit("userCameOnline", { id });
			} else if (document.visibilityState === "visible") {
				console.log("User returned to the tab");
				socket.emit("userCameOffline", { id });
			}
		};
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			console.log("beforeunload event fired / user going offlne");
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
				isLoading,
				isSuccess,
				refreshStatus,
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
