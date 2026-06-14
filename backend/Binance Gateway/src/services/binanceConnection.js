const WebSocket = require('ws');
const { producer } = require('../utils/kafkaProducer');
const { BINANCE_STREAM_URL, KAFKA_TOPIC_MARKET_PRICE } = require('../config/config');

let ws;

function connectBinance() {

    ws = new WebSocket(BINANCE_STREAM_URL);

    ws.on('open', () => { console.log('Connected To Binance'); });

    ws.on('message', async (data) => {
        try {

            const tickers = JSON.parse(data.toString());
            
            await producer.send({
                topic: KAFKA_TOPIC_MARKET_PRICE,
                messages: [
                    {
                        value: JSON.stringify({
                            timestamp: Date.now(),
                            tickers
                        })
                    }
                ]
            });

            console.log(`Published ${tickers.length} symbols to Kafka`);
        } catch (error) {
            console.error(
                'Error Processing Binance Data:',
                error.message
            );
        }
    });

    ws.on('close', () => {
        console.log('Binance Connection Closed. Reconnecting...');

        // reconnect
        setTimeout(() => {
            connectBinance();
        }, 5000);
    });

    ws.on('error', (error) => {
        console.error('Binance WebSocket Error:',error.message);
        ws.close();
    });
}

module.exports = {
    connectBinance
};