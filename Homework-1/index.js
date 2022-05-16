
const colors = require("colors/safe");

const isPrime = (number) => {
  if (number < 2) return false;

  for (let i = 2; i <= number / 2; i++) {
    if (number % i === 0) return false;
  }

  return true;
};

let count = 1;
let primeCount = 0;

const from = +process.argv[2];
const to = +process.argv[3];

if (!(isFinite(from) && isFinite(to))) {
  console.error(colors.red("Входные параметры должны быть числами!!!"));
  process.exit(1);
}

for (let number = from; number <= to; number++) {
  let colorer = colors.green;

  if (isPrime(number)) {
    primeCount++;
    if (count % 2 === 0) {
      colorer = colors.yellow;
      count += 1;
    } else if (count % 3 === 0) {
      colorer = colors.red;
      count = 1;
    } else {
      count += 1;
    }

    console.log(colorer(number));
  }
}

if (primeCount === 0) {
  console.error(colors.red("В последовательности нет простых чисел!!!"));
}