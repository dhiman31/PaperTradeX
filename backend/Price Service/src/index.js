const express = require('express');
const http = require('http');
const {connectRedis} = require('./config/redisClient');
const {initializeWebsocket} = require('./services/websocket');
const {startSubscriber} = require('./services/subscriber');
const priceRoutes = require('./routes/priceRoutes');
const PORT = 3003

async function startServer() {
    try {
        const app = express();
        app.use(express.json());

        app.use('/api/v1/prices',priceRoutes);

        const server = http.createServer(app);
        await connectRedis();
        initializeWebsocket(server);
        await startSubscriber();

        server.listen(PORT,() => {
                console.log(`Price Service running on ${PORT}`);
            }
        );
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

startServer();