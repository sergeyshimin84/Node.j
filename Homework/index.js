// Подключаем модуль EventEmitter, для генерации и прослушивания событий.
const EventEmitter = require("events");
// Подключаем методы для окрашивания текста.
const { red, green, yellow } = require("colors/safe");

const eventEmitter = new EventEmitter();
// Передаем в args все аргументы массива начиная со второго (Нулевой - путь к Node; первый - путь к файлу).  
const args = process.argv.slice(2);
//Объявили глобальную переменную timers.
let timers = {};
// В функцию millisecondsToDate передаются милисекунды. Переводятся в секунды, минуты, часы, дни, месяцы и годы.
const millisecondsToDate = (timestamp) => {
  const oneSecond = 1000;
  const oneMinute = oneSecond * 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;
  const oneMonth = oneDay * 30;
  const oneYear = oneMonth * 12;
// Выщитываем время, отнимаем от количества милисекунд. Округляем.
  const year = Math.floor(timestamp / oneYear);
  timestamp -= year * oneYear;

  const month = Math.floor(timestamp / oneMonth);
  timestamp -= month * oneMonth;

  const day = Math.floor(timestamp / oneDay);
  timestamp -= day * oneYear;

  const hours = Math.floor(timestamp / oneHour);
  timestamp -= hours * oneHour;

  const minutes = Math.floor(timestamp / oneMinute);
  timestamp -= minutes * oneMinute;

  const seconds = Math.floor(timestamp / oneSecond);
  timestamp -= seconds * oneSecond;
// Объявляем date.
  let date = "";
// Добавляем подписи к единицам измерения времени. Предварительно проверив.
  if (year) {
    date += year + " лет ";
  }

  if (month) {
    date += month + " месяцев ";
  }

  if (day) {
    date += day + " дней ";
  }

  if (hours) {
    date += hours + " часов ";
  }

  if (minutes) {
    date += minutes + " минут ";
  }

  if (seconds) {
    date += seconds + " секунд ";
  }
// Возвращаем date.
  return date;
};
// Проходим все переданные аргументы в args. Разделяем с помощью метода split по дифису.
for (const arg of args) {
  const parsedDate = arg.split("-");
  // Проверяем все ли элементы массива являются числами.
  const isNumbers = !parsedDate.some((date) => !isFinite(+date));
  // Проверяем, если переданы не все числа или в массиве не 4 элемента, то выводится "Не правильный формат таймера: ". 
  if (parsedDate.length !== 4 || !isNumbers) {
    console.log(red("Не правильный формат таймера: ", arg));
    continue;
  }
  // Передаем в дату исполнения таймера timerDate, конструктор new Date. 
  // Получаем текущее время в своем часовом поясе, нужного формата.
  const timerDate = new Date(
    Date.UTC(parsedDate[3], parsedDate[2] - 1, parsedDate[1], parsedDate[0])
  );
  const nowDate = new Date();
  const nowUTCDate = Date.UTC(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate(),
    nowDate.getHours(),
    nowDate.getMinutes(),
    nowDate.getSeconds(),
  );
  // Вычисляем время от текущего до выполнения таймера, delta.
  const delta = timerDate - nowUTCDate;
  // Проверяем положительно ли значение delta. 
  if (delta <= 0) {
    console.log(
      red("Время исполнения таймера должно быть больше текущего: ", arg)
    );
    continue;
  }
  // Убираем лишние символы из даты.
  const formattdDate = timerDate
    .toISOString()
    .replace("T", " ")
    .replace("Z", "")
    .replace(".000", "");
  // timers заполняем верными таймерами. Сколько осталось до исполнения таймера. Используем дату исполнения таймера formattdDate.
  timers[formattdDate] = delta;
}
// Проверяем, есть ли у нас хоябы один соответствующий таймер заданым условиям. С помощью length проверяем длину переданного таймера.
if (!Object.keys(timers).length) {
  console.log(red("\nВы не передали ни одного валидного таймера"));
  process.exit(1);
}
// В консоль выводим количество запущеных таймеров.
console.log(
  green(`Успешно запущено ${Object.keys(timers).length} таймеров:\n`)
);
// Выводим запущенные таймеры.
Object.keys(timers).map((timer) => console.log(green(timer)));
console.log("");
// С помощью setInterval каждую секунду выводим сообщение с датой оставщейся до его исполнения 
setInterval(() => {
  // Создаем локально newTimers.
  const newTimers = {};
  // Вычитаем из delta секунды.
  Object.keys(timers).map((timer) => {
    const delta = timers[timer] - 1000;
    let message = yellow(`Таймер ${timer} исполнен`);
    // Пока delta положительное число, таймер не исполнился.
    if (delta) {
      newTimers[timer] = delta;
      message = green(
        `До исполнения таймера ${timer} осталось ${millisecondsToDate(delta)}`
      );
    }
    // Через eventEmitter выводим сообщение об оставшемся времени до исполнения или о исполнении таймера. 
    eventEmitter.emit("timer", message);
  });
  // Проверяем исполнены ли все таймеры.
  if (!Object.keys(newTimers).length) {
    console.log(green("\nВсе таймеры успешно исполнены!"));
    // 
    process.exit(0);
  }
  // При наличии новых таймеров, записываем таймеры в timers.
  timers = newTimers;

  console.log("");  
}, 1000);
// Подписка на eventEmitter на событие timer. Передаем console.log.
eventEmitter.on("timer", console.log);