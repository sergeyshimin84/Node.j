const http = require("http");
const path = require("path");
const fs = require("fs");

const server = http.createServer((req, res) => {
    if (req.method === "GET") {
      if (req.url === "/1.js") {
        res.end(fs.readFile('./1.js', (err, data) => {
            if (err) {
              return "Not found!"
            } 
              return data
          }));
      } else {
        const filePath = path.join(__dirname, "./index.html");
        const readStream = fs.createReadStream(filePath);
  
        readStream.pipe(res);
      }
    } else if (req.method === "POST") {
      let data = "";
  
      req.on("data", (chunk) => (data = chunk.toString()));
      req.on("end", () => {
        console.log(data);
        const parsedData = JSON.parse(data);
        console.log(parsedData);
  
        res.writeHead(200, "OK", {
          "Content-Type": "application/json",
        });
        res.end(data);
      });
    } else {
      res.writeHead(405, "Method not Allowed");
      res.end("Method not Allowed");
    }
});
  
server.listen(8085);