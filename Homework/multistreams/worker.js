const worker_threads = require("worker_threads");
const crypto = require("crypto");

const { length, delay } = worker_threads.workerData;

const password = crypto.randomBytes(length).toString("hex");

setTimeout(() => worker_threads.parentPort.postMessage(password), delay);