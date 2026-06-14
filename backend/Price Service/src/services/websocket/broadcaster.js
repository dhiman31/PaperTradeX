const WebSocket = require('ws');
const {marketClients,getSubscribers} = require('./subscriptionManager');

function broadcastPrice(symbol,price) {

    const payload = JSON.stringify({ symbol,price });
    marketClients.forEach(
        client => {
            if(client.readyState === WebSocket.OPEN){
                client.send(payload);
            }
        }
    );

    const subscribers = getSubscribers(symbol);
    if (!subscribers) return;

    subscribers.forEach(
        client => {
            if(client.readyState ===WebSocket.OPEN){
                client.send(payload);
            }
        }
    );
}

module.exports = {
    broadcastPrice
};