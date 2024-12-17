import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useRef,
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
	const isUnmountingRef = useRef(false);

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
		{ enabled: !!senderId },
	);
	const fetchConversation = async (userId: string) => {
		setSenderId(userId);
	};

	// const pinConversation = async () => {};

	const refreshStatus = (value: boolean) => {
		if (!id) return;

		socket.emit("peersStatus", {
			sender_id: id,
			isOnline: true,
		});
	};

	useEffect(() => {
		if (!id) return;
		isUnmountingRef.current = false;
		socket.emit("peersStatus", {
			sender_id: id,
			isOnline: true,
		});
		if (isSuccess) {
			socket.emit("joinConvo", {
				conversationIds: conversation.map(
					(c: IConversation) => c.conversation_id,
				),
			});
		}
		socket.on("peersStatus", (data) => {
			console.log("someone is active: ", data);
			// Update cached conversation data
			queryClient.setQueryData(
				["convo"],
				(oldData: IConversation[] | undefined) => {
					if (!oldData) return oldData;

					// Map through the conversations and peers to update isOnline status
					return oldData.map((conversation: IConversation) => ({
						...conversation,
						peers: conversation.peers.map((peer: IViewUser) => {
							console.log(
								peer.id === data.peers.id,
								data.peers.isOnline,
							);
							return peer.id === data.peers.id
								? { ...peer, isOnline: data.peers.isOnline }
								: peer;
						}),
					}));
				},
			);
		});
		return () => {
			if (id) {
				// Avoid emitting "isOnline: false" during re-renders
				if (isUnmountingRef.current) {
					console.log("User going offline...");
					socket.emit("peersStatus", {
						sender_id: id,
						isOnline: false,
					});
				}

				// Mark as unmounting
				isUnmountingRef.current = true;

				// Remove the listener
				socket.off("peersStatus");
			}
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
