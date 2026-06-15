const express = require('express')
const {PORT} = require('./config/serverConfig')
const bodyParser = require('body-parser')
const v1ApiRoutes = require('./routes/index')
const orderRoutes = require('./routes/index')
const { connectKafka } = require('./config/kafkaClient')
const { connectRedis } = require('./config/redisClient')
const { startWorker } = require('./services/limitOrderWorker')

const setupAndStartServer = async () => {
    const app = express()

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use('/api/v1/orders', orderRoutes);

    await connectKafka()
    await connectRedis()
    await startWorker()

    app.listen(PORT , async() => {
        console.log(`Server started on PORT ${PORT}`)
    })
}

setupAndStartServer()