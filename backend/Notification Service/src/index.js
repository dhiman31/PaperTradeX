const express = require('express')
const {PORT} = require('./config/serverConfig')
const bodyParser = require('body-parser')
const v1ApiRoutes = require('./routes/index')
const startConsumer = require('./services/consumeService')
const { setUpJobs } = require('./services/cronJob')

const setupAndStartServer = async () => {
    const app = express()

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use('/api',v1ApiRoutes);

    await startConsumer()
    setUpJobs()

    app.listen(PORT , async() => {
        console.log(`Server started on PORT ${PORT}`)

        console.log(process.env.EMAIL_ID);
        console.log(process.env.EMAIL_PASS);

    })
}

setupAndStartServer()