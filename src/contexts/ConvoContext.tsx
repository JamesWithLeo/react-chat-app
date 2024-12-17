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

export interface IConversation {
	conversation_id: string;
	conversation_name: string | null;
	conversation_thumbnail: string | null;
	created_at: Date;
	updated_at: Date;
	conversation_type: "direct" | "group";
	peers: {
		id: string;
		photoUrl: string;
		firstName: string;
		lastName: string;
	}[];
	last_message: {
		content: string;
		created_at: string;
		is_read: boolean;
		message_type: IMessage_type;
	};

	// to add ff:
	is_pinned: boolean;
	is_archived: boolean;
	isOnline: boolean;
}

interface IConvoContext {
	conversation: IConversation[];
	isLoading: boolean;
	isSuccess: boolean;
	refreshStatus: (value: boolean) => void;
	fetchConversation: (userId: string) => void;
}

const defaultContextValue: IConvoContext = {
	conversation: [],
	isLoading: false,
	isSuccess: false,
	refreshStatus: async () => {},
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
		{ enabled: !!senderId },
	);
	const fetchConversation = async (userId: string) => {
		setSenderId(userId);
	};

	const pinConversation = async () => {};

	const refreshStatus = (value: boolean) => {
		if (!id) return;
		socket.emit("peersStatus", { sender_id: id, isOnline: value });
	};

	useEffect(() => {
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
						peers: conversation.peers.map((peer: any) =>
							peer.id === data.peers.id
								? { ...peer, isOnline: data.peers.isOnline }
								: peer,
						),
					}));
				},
			);
		});
	}, []);
	return (
		<ConvoContext.Provider
			value={{
				conversation,
				refreshStatus,
				fetchConversation,
				isLoading,
				isSuccess,
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
