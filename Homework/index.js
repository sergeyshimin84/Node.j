// Подключаем модуль fs. 
const fs = require("fs");
// Подключаем вид потока на чтение и запись Transform модуля stream. 
const { Transform } = require("stream");
// Передаем файл с данными.
const DATA = "./access.log";
// Передаем массив с ip адресами.
const IP = ["89.123.1.41", "34.48.240.111"];
// Создаем файлы с именем данных ip.
const getOutputFileName = (ip) => `./${ip}_requests.log`;
// Создаем поток на чтение файла с данными.
const readStream = fs.createReadStream(DATA, "utf-8");
// Перебираем массив с помощью метода forEach.
IP.forEach((ip) => {
  // Проходим по всем совпадениям. С помощью регулярных выражений находим совпадения.
  const regExp = new RegExp("^" + ip + ".*$", "gm");
  const outputFileName = getOutputFileName(ip);

  const transformStream = new Transform({
    transform(chunk, _encoding, callback) {
      // С помощью методов toString и match получаем массив совпавших строк.
      // При помощи метода join записываем элементы с новой строки. 
      const transformedChunk = chunk.toString().match(regExp).join("\n");
      callback(null, transformedChunk);
    },
  });
  // Записываем результат в writeStream.
  const writeStream = fs.createWriteStream(outputFileName, "utf-8");
  // Связываем поток для чтения и записи, с помощью метода pipe.
  readStream.pipe(transformStream).pipe(writeStream);
});