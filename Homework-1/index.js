
const colors = require("colors");

const isPrime = (number) => {
  if (number < 2) return false;

  for (let i = 2; i <= number / 2; i++) {
    if (number % i === 0) return false;
  }

  return true;
};

let count = 1;

const from = process.argv[2];
const to = process.argv[3];

for (let number = from; number <= to; number++) {
  console.log(number, isPrime(number))
  // let colorer = colors.green;

  // if (isPrime(number)) {
  //   if (count % 2 === 0) {
  //     colorer = colors.yellow;
  //     count += 1;
  //   } else if (count % 3 === 0) {
  //     colorer = colors.red;
  //     count = 1;
  //   } else {
  //     count += 1;
  //   }

  //   console.log(colorer(number));
  // }
}