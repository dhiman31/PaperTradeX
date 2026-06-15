const {kafka} = require("../config/kafkaClient");
const emailService = require('./emailService')
const notifyService = require('./notifyService')

const emailServ = new emailService()
const notifyServ = new notifyService()

const consumer = kafka.consumer({
  groupId: "notification-group",
});

const ORDER_EVENT_MESSAGES = {
  MARKET_ORDER_COMPLETED: (data) => `Your MARKET order for ${data.symbol} has been completed.`,
  LIMIT_ORDER_CREATED: (data) => `Your LIMIT order for ${data.symbol} has been placed.`,
  LIMIT_ORDER_COMPLETED: (data) => `Your LIMIT order for ${data.symbol} has been executed.`,
  LIMIT_ORDER_CANCELLED: (data) => `Your LIMIT order for ${data.symbol} has been cancelled.`,
  ORDER_FAILED: (data) => `Your order for ${data.symbol} has failed.`,
};

async function startConsumer() {

  await consumer.connect();
  await consumer.subscribe({
    topic: "notification-events",
  });
  await consumer.subscribe({
    topic: "order-events",
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
        const data = JSON.parse(
            message.value.toString()
        );

        console.log("KAFKA MESSAGE:", topic);
        console.log(data);

        if (topic === "notification-events") {
            await notifyServ.createNotification({
                userEmail : data.email,
                content : data.otp,
                type : "EMAIL_VERIFICATION"
            })
        } else if (topic === "order-events") {
            const messageBuilder = ORDER_EVENT_MESSAGES[data.type];
            if (!messageBuilder) return;

            await notifyServ.createNotification({
                userEmail : data.userEmail,
                content : messageBuilder(data),
                type : data.type
            })
        }
    }
  });
}

module.exports = startConsumer;