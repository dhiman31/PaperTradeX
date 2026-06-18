const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');

const kafka = new Kafka({
  clientId: 'order-service',
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

const producer = kafka.producer();
const connectKafka = async () => {
    try {
        await producer.connect();
        console.log('Kafka connected');
    } catch(err){
        console.log(err);
        process.exit(1);
    }
};

module.exports = {
    producer,
    connectKafka
};