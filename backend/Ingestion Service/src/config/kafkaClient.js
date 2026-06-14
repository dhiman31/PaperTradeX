const { Kafka } = require("kafkajs");
const {KAFKA_BROKER_IP} = require('./serverConfig')

exports.kafka = new Kafka({
  clientId: "ingestion-service",
  brokers: [KAFKA_BROKER_IP]
});