// Подключаем модули.
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const yargs = require("yargs");
// Подключаем вид потока на чтение и запись Transform модуля stream. 
const { Transform } = require("stream");
const { stdout } = require("process");
// Передаем путь к файлу (если файл то возвращает true, если папка то вернется false).
const isFile = (fileName) => {
  return fs.lstatSync(fileName).isFile();
};
// Передаем директорию.
const fileManager = async (directory) => {
  // Через библиотеку inquirer выводим сообщение о текущей директории.
  const firstAnswer = await inquirer.prompt([
    {
      name: "fileName",
      type: "list",
      message: "Вы нахдитесь в директории " + directory + ". Выберите файл",
      // Передаем массив(содержимое) данной директории.
      choices: fs.readdirSync(directory),
    },
  ]);
  // Генерируем путьотносительно текущей папки и имени переданного файла или каталога.
  const newFilePath = path.join(directory, firstAnswer.fileName);
  // Если находится папка, ркурсией вызываем fileManager(заново обрабатывается содержимое папки).
  if (!isFile(newFilePath)) return fileManager(newFilePath);
  // Если находится файл, то просим ввести строку для поиска.
  const secondAnswer = await inquirer.prompt([
    {
      name: "search",
      type: "input",
      message: "Введите строку для поиска (опционально):",
    }
  ]);
  // Проходим по всем совпадениям. С помощью регулярных выражений находим совпадения.
  const regExp = new RegExp("^.*" + secondAnswer.search + ".*$", "gm");
  // Открываем стрим на чтение файлов.
  const readStream = fs.createReadStream(newFilePath, "utf-8");

  const transformStream = new Transform({
    transform(chunk, _encoding, callback) {
      // С помощью методов toString и match получаем массив совпавших строк.
      // При помощи метода join записываем элементы с новой строки. 
      const transformedChunk = chunk.toString().match(regExp);
      if (searchArray) {
        const transformedChunk = searchArray.join("\n");
        callback(null, transformedChunk);
      }
    },
  });
  // Если совпадения найдены то выводим в stdout(в консоль).
  if (secondAnswer.search) {
    readStream.pipe(transformStream).pipe(process,stdout);
  } else {
    // Иначе указываем просто stdout.
    readStream.pipe(process.stdout);
  }
};
// Запуск программы. Обрабатываем опции через yargs. Путь до папки из которой мы начинаем работу.
// Если ничего не передаем, то по дефолту берется текущая директория.
const options = yargs.option("d", {
  alias: "directory",
  discribe: "Путь до папки",
  type: "string",
  default: process.cwd(),
}).argv;
// Берем аргумент directory и передаем в функцию fileManager. 
fileManager(options.directory);