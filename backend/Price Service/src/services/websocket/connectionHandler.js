const {handleHome} = require('./handlers/homeHandler');
const {handleMarket} = require('./handlers/marketHandler');
const {handleSymbol} = require('./handlers/symbolHandler');
const {removeClient} = require('./subscriptionManager');

async function handleConnection(ws,req) {
    try{
        const url = new URL(req.url,'http://localhost');
        const pathname = url.pathname;

        if(pathname === '/market'){
            await handleMarket(ws);
        }
        else if(pathname === '/home'){
            await handleHome(ws);
        }
        else if(pathname.startsWith('/symbol/')){
            const symbol = pathname.split('/')[2];
            await handleSymbol(ws, symbol);
        }

        ws.on('close',() => removeClient(ws));

    } catch (error) {
        console.error(error);
        ws.close();
    }
}

module.exports = {
    handleConnection
};