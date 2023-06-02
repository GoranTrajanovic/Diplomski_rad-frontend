import { Server } from "socket.io";
import { io } from "socket.io-client";

let SOCKET;

export default async function handler(req, res) {
	if (res.socket.server.io) {
		console.log("Socket connection already set up");
		res.end();
		return;
	}

	const ioInternal = new Server(res.socket.server);
	res.socket.server.io = ioInternal;

	ioInternal.on("connection", socket => {
		SOCKET = socket;
		socket.broadcast.emit(
			"newIncomingMessage",
			"Hi from Nextjs API for socket.io"
		);
	});

	console.log("[Nextjs] Socket set-up!");

	// const resExt = await fetch(`${process.env.BACKEND_SOCKET_URL}`);

	// console.log(resExt);

	const socket = io("http://127.0.0.1:8888");

	socket.on("progress", data => {
		SOCKET.emit("progress", data);
	});

	socket.on("no_root", data => {
		console.log("Ok, no root. (middleware)");
		SOCKET.emit("no_root", "no_root");
	});

	res.end();
	/* try {
		// const resExt = await fetch(`${process.env.BACKEND_SOCKET_URL}`, {
		// 	method: "POST",
		// 	body: JSON.stringify({ msg: "Message from Next API." }),
		// 	headers: { "content-type": "application/json" },
		// });

		const resExt = await fetch(`${process.env.BACKEND_SOCKET_URL}`);

		if (!resExt.ok) {
			const error = await resExt.text();
			throw new Error(error);
		}

		const data = await resExt.json();
		console.log(
			`Data received in Nextjs API call for connecting to socket.io: ${JSON.stringify(
				data
			)}`
		);
		res.status(200).json({ msg: "Nextjs API - OK" });
		// uploadToBackend(dir, URLWithoutHttps);
	} catch (err) {
		console.log(err);
		res.status(404).json({ errorMsg: "Error occured in Nextjs API." });
	} */
}
