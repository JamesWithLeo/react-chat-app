import { useQuery } from "@tanstack/react-query";
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

export interface IConversation {
	conversation_id: string;
	conversation_name: string;
	conversation_thumbnail: string;
	conversation_type: "direct" | "group";
	created_at: string;
	last_message_id: string;
	last_sender_id: string;
	recipient_id: "string" | null;
	recipient_name: string | null;
	last_message_created_at: string;
	last_message_content: string;
	updated_at: string;
	is_pinned: boolean;
	is_archived: boolean;
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
			console.log(data);
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
