const { Kafka } = require("kafkajs");
const {KAFKA_BROKER_IP} = require('./serverConfig')

exports.kafka = new Kafka({
  clientId: "my-app",
  brokers: [KAFKA_BROKER_IP]
});