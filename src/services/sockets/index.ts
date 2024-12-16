import { io, Socket } from "socket.io-client";
import { IMessage_type } from "../../contexts/ChatContext";
import { apiUrl } from "../../config";

interface ServerToClientEvents {
	toClientMessage: (messageData: any) => void;
	peerTyping: ({
		id,
		conversation_id,
	}: {
		id: string;
		conversation_id: string;
	}) => void;
}

interface ClientToServerEvents {
	joinMessage: ({ conversationId }: { conversationId: string }) => void;
	newMessage: (messageData: {
		sender_id: string;
		conversation_id: string;
		content: string;
		message_type: IMessage_type;
	}) => void;
	activeTyping: ({
		sender_id,
		conversation_id,
	}: {
		sender_id: string;
		conversation_id: string;
	}) => void;
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
