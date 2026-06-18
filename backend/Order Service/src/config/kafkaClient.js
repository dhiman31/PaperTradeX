const { Kafka } = require('kafkajs');
const { KAFKA_BROKER_IP } = require('./serverConfig');

const kafka = new Kafka({
    clientId: 'order-service',
    brokers: [KAFKA_BROKER_IP]
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