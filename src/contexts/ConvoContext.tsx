import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";
import { FetchConvo } from "../services/fetch";
import { useSelector } from "react-redux";
import { AppState } from "../redux/store";

export interface IConversation {
	conversation_id: string;
	conversation_name: string;
	conversation_thumbnail: string;
	created_at: string;
	last_message_id: string;
	last_sender_id: string;
	recipient_name: string;
	last_message_created_at: string;
	last_message_content: string;
	updated_at: string;
}

interface IConvoContext {
	conversation: IConversation[];
	isLoading: boolean;
	isSuccess: boolean;
	fetchConversation: (userId: string) => void;
}

const defaultContextValue: IConvoContext = {
	conversation: [],
	isLoading: false,
	isSuccess: false,
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
	return (
		<ConvoContext.Provider
			value={{ conversation, fetchConversation, isLoading, isSuccess }}
		>
			{children}
		</ConvoContext.Provider>
	);
};
export default ConvoContextProvider;

export const useConvoContext = () => {
	const context = useContext(ConvoContext);
	if (!context) {
		throw new Error(
			"useConvoContext must be used with a ConvoContextProvider",
		);
	}
	return context;
};
