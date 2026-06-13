const {kafka} = require("../config/kafkaClient");

const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log("Producer Connected");
}

module.exports = {
  producer,
  connectProducer,
};