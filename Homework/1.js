console.log("Record 1"); // 1

Promise.resolve().then(() => console.log("Record 2")); // 3

setTimeout(() => {
  console.log("Record 3"); // 6
  Promise.resolve().then(() => {
    console.log("Record 4"); // 7
  });
});

Promise.resolve().then(() => {
  Promise.resolve().then(() => {
    console.log("Record 5"); // 5
  });
  console.log("Record 6");  // 4
});

console.log("Record 7"); // 2
