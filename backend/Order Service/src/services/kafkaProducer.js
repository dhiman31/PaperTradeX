const { producer } = require('../config/kafkaClient');

const publishOrderEvent = async (type,payload) => {

    console.log('Publishing',type,payload);

    await producer.send({
        topic: 'order-events',
        messages: [
            {
                value: JSON.stringify({
                    type,
                    ...payload
                })
            }
        ]
    });

};

module.exports = {
    publishOrderEvent
};