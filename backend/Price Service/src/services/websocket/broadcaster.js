const WebSocket = require('ws');
const {marketClients,getSubscribers} = require('./subscriptionManager');

function broadcastPrice(ticker){

  const payload = JSON.stringify(ticker);

  // Broadcast to all market clients
  marketClients.forEach(client => {
    if(client.readyState === WebSocket.OPEN){
      client.send(payload);
    }
  });

  // Broadcast to symbol subscribers
  const subscribers = getSubscribers(
    ticker.symbol
  );

  if(!subscribers){
    return;
  }

  subscribers.forEach(client => {
    if(client.readyState === WebSocket.OPEN){
      client.send(payload);
    }
  });
}

module.exports = {
  broadcastPrice
};