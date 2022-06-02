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

io.on("connection", (client, username) => {
  // Отправляем сообщение при подключении.
  client.emit('message', 'Connected!');
  // Сообщаем всем пользователям о подключении нового клиента.
  client.broadcast.emit('message', 'A new client has connected!');

  // Сохраняем полученное имя пользователя в переменной.
  client.on('little_newbie', (username) => {
      client.username = username;
  });

  // Полученное сообщение записывается в консоль.
  client.on('message', (message) => {
      console.log(client.username + ` reported: ` + {message});
  });
});

server.listen(8085);