const {kafka} = require("../config/kafkaClient");
const emailService = require('./emailService')
const notifyService = require('./notifyService')

const emailServ = new emailService()
const notifyServ = new notifyService()

const consumer = kafka.consumer({
  groupId: "notification-group",
});

async function startConsumer() {

  await consumer.connect();
  await consumer.subscribe({
    topic: "notification-events",
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
        const data = JSON.parse(
            message.value.toString()
        );

        console.log("KAFKA MESSAGE:");
        console.log(data);

        const notificationTicket = notifyServ.createNotification({
            userEmail : data.email,
            otp : data.otp,
            type : "EMAIL_VERIFICATION"
        })
    }
  });

}

module.exports = startConsumer;