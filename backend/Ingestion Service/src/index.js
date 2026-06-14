const express = require('express')
const {PORT} = require('./config/serverConfig')
const bodyParser = require('body-parser')
// const v1ApiRoutes = require('./routes/index')
// const redisClient = require("./config/redisClient");
const startConsumer = require('./services/consumeService')

const setupAndStartServer = async () => {
    const app = express()

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    // app.use('/api',v1ApiRoutes);
    // await redisClient.connect();
    await startConsumer()

    app.listen(PORT , async() => {
        console.log(`Server started on PORT ${PORT}`)
    })
}

setupAndStartServer()