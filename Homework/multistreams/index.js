const worker_threads = require("worker_threads");

const generateIntInRange = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const genPass = (options) => {
  return new Promise((resolve, reject) => {
    const worker = new worker_threads.Worker("./worker.js", {
      workerData: options,
    });

    worker.on("message", resolve);
    worker.on("messageerror", reject);
  });
};

Promise.all(
  new Array(15).fill(0).map(async (_value, index) => {
    const name = "pass-" + index;
    const password = await genPass({
      length: generateIntInRange(4, 24),
      delay: generateIntInRange(1, 15) * 1000,
    });
    console.log(name, password);
  })
);