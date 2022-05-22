const EventEmitter = require("events");

const eventEmitter = new EventEmitter();

const requestTypes = [
  {
    type: "send",
    payload: "to send a document",
  },
  {
    type: "receive",
    payload: "to receive a document",
  },
  {
    type: "sign",
    payload: "to sign a document",
  },
];

class Customer {
  constructor(params) {
    this.type = params.type;
    this.payload = params.payload;
  }
}

class Handler {
  static send(payload) {
    console.log("Send request");
    console.log(`Customer need ${payload}`);
  }
  static receive(payload) {
    console.log("Receive request");
    console.log(`Customer need ${payload}`);
  }
  static sign(payload) {
    console.log("Sign request");
    console.log(`Customer need ${payload}`);
  }
  static pay() {
    console.log(`Customer needs to pay for the services`);
  }
}

const generateIntInRange = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const delay = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
};

const generateNewCustomer = () => {
  const intervalValue = generateIntInRange(1, 5) * 1000;
  const params = requestTypes[generateIntInRange(0, 2)];
  return delay(intervalValue).then(() => new Customer(params));
};

eventEmitter.on("send", Handler.send);
eventEmitter.on("send", Handler.pay);
eventEmitter.on("receive", Handler.receive);
eventEmitter.on("sign", Handler.sign);

const run = async () => {
  const customer = await generateNewCustomer();
  eventEmitter.emit(customer.type, customer.payload);
  run();
};
run();