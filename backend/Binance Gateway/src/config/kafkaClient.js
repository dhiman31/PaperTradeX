const { Kafka } = require("kafkajs");
const {KAFKA_BROKER_IP} = require('./config')
const {KAFKA_CLIENT_ID} = require('./config')

exports.kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [KAFKA_BROKER_IP]
});