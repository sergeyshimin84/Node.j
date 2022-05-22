const EventEmitter = require("events");
const { red, green, yellow } = require("colors/safe");
const { timeStamp } = require("console");

const eventEmitter = new EventEmitter();
const args = process.argv.slice(2);

let timers = {};

const millisecondsToDate = (timestamp) => {
  const oneSecond = 1000;
  const oneMinute = oneSecond * 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;
  const oneMonth = oneDay * 30;
  const oneYear = oneMonth * 12;

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

  let date = "";

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

  return date;
};

for (const arg of args) {
  const parsedDate = arg.split("-");
  const isNumbers = !parsedDate.some((date) => !isFinite(+date));

  if (parsedDate.length !== 4 || !isNumbers) {
    console.log(red("Не правильный формат таймера: ", arg));
    continue;
  }

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

  const delta = timerDate - nowUTCDate;

  if (delta <= 0) {
    console.log(
      red("Время исполнения таймера должно быть больше текущего: ", arg)
    );
    continue;
  }

  const formattdDate = timerDate
    .toISOString()
    .replace("T", " ")
    .replace("Z", "")
    .replace(".000", "");
  
  timers[formattdDate] = delta;
}

if (!Object.keys(timers).length) {
  console.log(red("\nВы не передали ни одного валидного таймера"));
  process.exit(1);
}

console.log(
  green(`Успешно запущено ${Object.keys(timers).length} таймеров:\n`)
);
Object.keys(timers).map((timer) => console.log(green(timer)));
console.log("");

setInterval(() => {
  const newTimers = {};

  Object.keys(timers).map((timer) => {
    const delta = timers[timer] - 1000;
    let message = yellow(`Таймер ${timer} исполнен`);

    if (delta) {
      newTimers[timer] = delta;
      message = green(
        `До исполнения таймера ${timer} осталось ${millisecondsToDate(delta)}`
      );
    }

    eventEmitter.emit("timer", message);
  });

  if (!Object.keys(newTimers).length) {
    console.log(green("\nВсе таймеры успешно исполнены!"));
    process.exit(0);
  }

  timers = newTimers;

  console.log("");  
}, 1000);

eventEmitter.on("timer", console.log);