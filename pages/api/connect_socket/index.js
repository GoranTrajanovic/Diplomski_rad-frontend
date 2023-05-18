import { Server } from "socket.io";

export default async function handler(req, res) {
	if (res.socket.server.io) {
		console.log("Already set up");
		res.end();
		return;
	}

	const io = new Server(res.socket.server);
	res.socket.server.io = io;

	// const onConnection = socket => {
	// 	const messageHandler = (io, socket) => {
	// 		const createdMessage = msg => {
	// 			socket.broadcast.emit("newIncomingMessage", msg);
	// 		};

	// 		socket.on("createdMessage", createdMessage);
	// 	};
	// };

	// Define actions inside
	io.on("connection", socket => {
		socket.broadcast.emit(
			"newIncomingMessage",
			"Hi from Nextjs API for socket.io"
		);
	});

	console.log("Setting up socket");
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
