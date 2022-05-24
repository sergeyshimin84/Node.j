const fs = require("fs");

const log =
  '127.0.0.1 - - [30/Jan/2021:11:11:20 -0300] "POST /foo HTTP/1.1" 200 0 "-" "curl/7.47.0"';

fs.writeFileSync("./access.log", log, { flag: "a" }, (err) => console.log(err));
fs.writeFileSync("./access.log", "\n", { flag: "a" }, (err) => console.log(err));

const data = fs.readFileSync("./access.log", "utf-8");

console.log(data);

const readStream = fs.createReadStream("./access.log", "utf8");
const writeStream = fs.createWriteStream("./access.log", {
  flags: "a",
  encoding: "utf-8",
});

readStream.on("data", (chunk) => {
  console.log("Chunk");
  console.log(chunk);
});

writeStream.write("\nText after read\n");

readStream.on("error", (err) => console.log(err));
readStream.on("end", () => console.log("File reading finished"));

writeStream.end(() => console.log("File writing finished"));