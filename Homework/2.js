const http = require("http");
const path = require("path");
const fs = require("fs");
const os = require('os');
const cluster = require('cluster');

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running...`);
    for (let i = 0; i < os.cpus().length; i++) {
        console.log(`Forking process number ${i}`);
        cluster.fork();
    }
} else {
    console.log(`Worker ${process.pid} is running`);

    const server = http.createServer((req, res) => {
        const filePath = path.join(__dirname, './index.html');
        const readStream = fs.createReadStream(filePath);

        setTimeout(() => {
            console.log(`Worker ${process.pid} handling request`);
            res.writeHead(200, {
                'Content-Type': 'text/html',
            });
            readStream.pipe(res);
        }, 5000);
    });

    server.listen(8085);
}