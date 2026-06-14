const WebSocket = require('ws');
const {handleConnection} = require('./connectionHandler');

function initializeWebsocket(server){
    const wss =new WebSocket.Server({server});
    wss.on('connection',handleConnection);
    console.log('Websocket Started');
}

module.exports = {
    initializeWebsocket
};