const { kafka } = require("../config/kafkaClient");
const { KAFKA_TOPIC_MARKET_PRICE } = require("../config/serverConfig");
const {bulkUpsertPrices} = require("../repository/currentPriceRepository");
const {publishPriceUpdates} = require("./publisher");

const consumer = kafka.consumer({
  groupId: "ingestion-group",
});

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({
    topic: KAFKA_TOPIC_MARKET_PRICE,
  });

  await consumer.run({ eachMessage: async ({ message }) => {
      const data = JSON.parse(
        message.value.toString()
      );

      console.log("KAFKA MESSAGE:");
      console.log(data);

      // Normalize Binance payload
      const updates = data.tickers.map(ticker => ({

        symbol: ticker.s,
        event: ticker.e,
        eventTime: ticker.E,
        priceChange: ticker.p,
        priceChangePercent: ticker.P,
        weightedAvgPrice: ticker.w,
        openPrice: ticker.o,
        highPrice: ticker.h,
        lowPrice: ticker.l,
        currentPrice: ticker.c,
        volume: ticker.v,
        quoteVolume: ticker.q,
        openTime: ticker.O,
        closeTime: ticker.C,
        firstTradeId: ticker.F,
        lastTradeId: ticker.L,
        totalTrades: ticker.n,
        updatedAt: new Date()
      }));

      await bulkUpsertPrices(updates);
      await publishPriceUpdates(updates);
    }

  });

}

module.exports = startConsumer;