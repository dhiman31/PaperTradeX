const {kafka} = require("../config/kafkaClient");
const { KAFKA_TOPIC_MARKET_PRICE } = require("../config/serverConfig");
const { bulkUpsertPrices } = require("../repository/currentPriceRepository");
const {publishPriceUpdates} = require("./publisher");


const consumer = kafka.consumer({
  groupId: "ingestion-group",
});

async function startConsumer() {

  await consumer.connect();
  await consumer.subscribe({
    topic: KAFKA_TOPIC_MARKET_PRICE,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
        const data = JSON.parse(
            message.value.toString()
        );

        console.log("KAFKA MESSAGE:");
        console.log(data);

        const records = data.tickers.map(
            (ticker) => ({
                symbol: ticker.s,
                currentPrice: ticker.c,
                openPrice: ticker.o,
                highPrice: ticker.h,
                lowPrice: ticker.l,
                updatedAt: new Date()
            })
        );

        await bulkUpsertPrices(records);

        const updates = data.tickers.map( ticker => ({ symbol: ticker.s, price:ticker.c}));

        await publishPriceUpdates(updates);
    }
  });

}

module.exports = startConsumer;