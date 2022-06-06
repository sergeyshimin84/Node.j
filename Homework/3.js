const http = require("http");
const path = require("path");
const fs = require("fs");

const HTML = fs.readFileSync("./index.html");

const readFile = (filePath) =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject("Error when read file");
      }
      resolve(data);
    });
  });

const server = http.createServer(async (req, res) => {
  if (req.method === "GET") {
    if (req.url === "/") {
      res.end(HTML);
    } else {
      try {
        const filePath = path.join(__dirname, req.url);
        const data = await readFile(filePath);
        res.end(data);
      } catch (e) {
        res.writeHead(400, e);
        res.end();
      }
    }
  } else {
    res.writeHead(405, "Method not Allowed");
    res.end("Method not Allowed");
  }
});

server.listen(8085);