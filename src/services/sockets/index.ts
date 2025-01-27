import { io, Socket } from "socket.io-client";
import { IMessage_type } from "../../contexts/ChatContext";
import { apiUrl } from "../../config";

interface ServerToClientEvents {
	toClientMessage: (messageData: any) => void;
	peerTyping: ({
		id,
		conversation_id,
		isTyping,
	}: {
		id: string;
		conversation_id: string;
		isTyping: boolean;
	}) => void;

	peersStatus: (data: {
		peers: { id: string; isOnline: boolean };
		onlinePeers: string[];
	}) => void;
	newConversation: (convoData: {
		conversation_type: "direct" | "group";
		conversation_id: string;
	}) => void;
	currentOnlinePeers: (ids: string[]) => void;
	currentSeen: ({
		user_id,
		conversation_id,
		message_id,
		seen_at,
	}: {
		seen_at: string;
		message_id: string;
		user_id: string;
		conversation_id: string;
	}) => void;
}

interface ClientToServerEvents {
	joinMessage: ({ conversationId }: { conversationId: string }) => void;

	messageSeen: ({
		conversationId,
		messageId,
		userId,
		seenAt,
	}: {
		conversationId: string;
		messageId: string;
		userId: string;
		seenAt: string;
	}) => void;

	insertMessage: (messageData: {
		userId: string;
		conversation_id: string;
		content: string;
		content_type: IMessage_type;
	}) => void;
	createMessage: (messageData: {
		userId: string;
		content: string;
		content_type: IMessage_type;
		peerId: string[];
		conversation_type: "direct" | "group";
	}) => void;
	handleTyping: ({
		sender_id,
		conversation_id,
		isTyping,
	}: {
		sender_id: string;
		conversation_id: string;
		isTyping: boolean;
	}) => void;

	joinConvo: ({ conversationIds }: { conversationIds: string[] }) => void;
	peersStatus: ({
		sender_id,
		isOnline,
	}: {
		sender_id: string;
		isOnline: boolean;
	}) => void;
	userCameOnline: ({ id }: { id: string }) => void;
	userCameOffline: ({ id }: { id: string }) => void;
}

export interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {
	name: string;
	age: number;
}

// please note that the types are reversed
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(apiUrl, {
	autoConnect: true,
});

export default socket;
