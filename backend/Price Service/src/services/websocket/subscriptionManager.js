const marketClients = new Set();
const symbolSubscribers = new Map();

function addMarketClient(ws){
    marketClients.add(ws);
}

function subscribeSymbol(symbol, ws) {
    if (!symbolSubscribers.has(symbol)) {
        symbolSubscribers.set(
            symbol,
            new Set()
        );
    }
    symbolSubscribers.get(symbol).add(ws);
}

function getSubscribers(symbol) {
    return symbolSubscribers.get(symbol);
}

function removeClient(ws) {
    marketClients.delete(ws);
    for(const subscribers of symbolSubscribers.values()) {
        subscribers.delete(ws);
    }
}

module.exports = {
    marketClients,
    subscribeSymbol,
    getSubscribers,
    addMarketClient,
    removeClient
};