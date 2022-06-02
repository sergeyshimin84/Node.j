const socket = require("socket.io");
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  const indexPath = path.join(__dirname, "./index.html");
  const readStream = fs.createReadStream(indexPath);

  readStream.pipe(res);
});

const io = socket(server);

io.on("connection", (client) => {
  console.log("Connected");

  client.on("newMessage", (data) => {
    console.log(data);

    client.broadcast.emit("newMessage", data);
    client.emit("newMessage", data);
  });
});

server.listen(8085);