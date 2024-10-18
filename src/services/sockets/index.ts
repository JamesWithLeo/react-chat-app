import { io, Socket } from "socket.io-client";

export interface ServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
	hello: () => void;
}

export interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {
	name: string;
	age: number;
}

// please note that the types are reversed
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	"http://localhost:5000/",
	{ autoConnect: true },
);

export default socket;
