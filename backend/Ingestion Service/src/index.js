const express = require('express')
const {PORT} = require('./config/serverConfig')
const bodyParser = require('body-parser')
const startConsumer = require('./services/consumeService')
const { connectRedis } = require('./config/redisClient')

const setupAndStartServer = async () => {
    const app = express()

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    await startConsumer()
    await connectRedis()

    app.listen(PORT , async() => {
        console.log(`Server started on PORT ${PORT}`)
    })
}

setupAndStartServer()