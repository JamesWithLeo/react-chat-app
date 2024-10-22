import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { IViewUser } from "../redux/slices/auth";
import { FetchPeer, SendChat } from "../services/fetch";
import { useQuery } from "@tanstack/react-query";

interface ChatContextType {
	peer: IViewUser | null; // Store peer user information
	isLoading: boolean;
	isSuccess: boolean;
	fetchPeer: (peerId: string) => void; // Function to fetch peer data
	messagePeer: (message: string, userId: string) => Promise<void>;
}

const defaultContextValue: ChatContextType = {
	peer: null,
	isLoading: false,
	isSuccess: false,
	fetchPeer: async () => {},
	messagePeer: async () => {},
};

export const ChatContext = createContext<ChatContextType>(defaultContextValue);

interface ChatContextProviderProps {
	children: ReactNode;
}

const ChatContextProvider: React.FC<ChatContextProviderProps> = ({
	children,
}) => {
	const [peerId, setPeerId] = useState<string>(
		sessionStorage.getItem("peerId") ?? "",
	);

	const {
		data: peer,
		isLoading,
		isSuccess,
	} = useQuery(
		["peer", peerId],
		async () => {
			const response = await FetchPeer(peerId);
			console.log(response);
			if (response.ok && response.peer) {
				sessionStorage.setItem("peerId", response.peer.id);
				return response.peer;
			}
			return null;
		},
		{ enabled: !!peerId },
	);

	// Function to fetch peer data from the API
	const fetchPeer = async (peerId: string) => {
		setPeerId(peerId);
	};

	const messagePeer = async (message: string, userId: string) => {
		if (!peer || !peer.id) return;

		const result = await SendChat(userId, peer.id, message);
		console.log(result);
	};

	return (
		<ChatContext.Provider
			value={{ peer, fetchPeer, isLoading, isSuccess, messagePeer }}
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
