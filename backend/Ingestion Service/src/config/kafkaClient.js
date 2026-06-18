const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');

exports.kafka = new Kafka({
  clientId: 'ingestion-service',
  brokers: [
    `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`
  ],
  ssl: {
    ca: [
      fs.readFileSync(
        path.join(__dirname, '../certs/ca.pem'),
        'utf8'
      )
    ]
  },
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD
  }
});