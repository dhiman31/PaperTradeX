require('dotenv').config();
const { connectBinance } = require('./services/binanceConnection');
const { connectProducer } = require('./utils/kafkaProducer');

async function initiateTheGateway() {
    try {
        await connectProducer()
        connectBinance();
        console.log(
            'Binance Gateway Started Successfully'
        );

    } catch (error) {
        console.error(
            'Failed To Start Gateway:',
            error
        );
        process.exit(1);
    }
}

initiateTheGateway();