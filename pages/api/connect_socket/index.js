import { Server } from "socket.io";
import { io } from "socket.io-client";

export default async function handler(req, res) {
	let SOCKET;

	if (res.socket.server.io) {
		console.log("Socket connection already set up");
		res.end();
		return;
	}

	const ioInternal = new Server(res.socket.server);
	res.socket.server.io = ioInternal;

	ioInternal.on("connection", socket => {
		console.log("Connected to internal!");
		SOCKET = socket;
		socket.broadcast.emit(
			"newIncomingMessage",
			"Hi from Nextjs API for socket.io"
		);
	});

	console.log("[Nextjs] Socket set-up!");

	const socket = io("http://127.0.0.1:8888");

	socket.on("progress", data => {
		try {
			SOCKET.emit("progress", data);
		} catch (e) {
			console.log("There was error in emmiting! ", e);
		}
	});

	socket.on("no_root", data => {
		console.log("Ok, no root. (middleware)");
		SOCKET.emit("no_root", "no_root");
	});

	socket.on("error_in_processing", data => {
		console.log("Ok, error. (middleware)", data);
		SOCKET.emit("error_in_processing", data);
	});

	res.end();
}
