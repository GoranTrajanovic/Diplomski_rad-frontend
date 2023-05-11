const Queue = require("bull");

const testQueue = new Queue("test process", "redis://127.0.0.1:6379");

testQueue.process(function (job, done) {
	job.progress(42);
	console.log(job.data);
});

export default function handler(req, res) {
	res.status(200).json({ name: "John Doe" });
}
