const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');
const { createServer } = require('http');
const { WebSocketServer, WebSocket } = require('ws');
const url = require('url');
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('./config/serverConfig');

const {
  PORT,
  USER_PORT,
  PORTFOLIO_PORT,
  PRICE_PORT,
  WATCHLIST_PORT,
  ORDER_PORT
} = require('./config/serverConfig');

const app = express();
const server = createServer(app);

app.use(cors());
app.use(morgan('combined'));

const isAuthenticated = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const response = jwt.verify(token, JWT_KEY);
    req.user = response;
    next();

  } catch (err) {

    console.log(err.name);
    console.log(err.message);

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// ── PRICE SERVICE (public, no auth) ──────────────
// GET /prices/:symbol

app.use(
  '/prices',
  createProxyMiddleware({
    target: `http://localhost:${PRICE_PORT}`,
    changeOrigin: true,
    pathRewrite: {
      '^/': '/api/v1/prices/'
    }
  })
);

// ── USER SERVICE ─────────────────────────────────
// POST   /user/register               (public)
// POST   /user/login                  (public)
// POST   /user/initiateVerification   (public)
// POST   /user/verifyViaOTP              (public)
// DELETE /user                        (authenticated)

app.use(
  '/user',
  createProxyMiddleware({
    target: `http://localhost:${USER_PORT}`,
    changeOrigin: true,
    pathRewrite: {
      '^/': '/api/v1/user/'
    }
  })
);

// DELETE only — auth required
app.delete(
  '/user',
  isAuthenticated,
  createProxyMiddleware({
    target: `http://localhost:${USER_PORT}`,
    changeOrigin: true,
    pathRewrite: {
      '^/': '/api/v1/user/'
    }
  })
);

// ── WATCHLIST SERVICE (all routes authenticated) ─
// POST   /watchlist/symbol    (id, symbol in req.body)
// DELETE /watchlist
// GET    /watchlist

app.use(
  '/watchlist',
  isAuthenticated,
  createProxyMiddleware({
    target: `http://localhost:${WATCHLIST_PORT}`,
    changeOrigin: true,
    pathRewrite: {
      '^/': '/api/v1/watchlist/'
    }
  })
);

// ── PORTFOLIO SERVICE (external, authenticated) ──
// GET /portfolio
// GET /portfolio/:symbol
//
// NOTE: /api/v1/portfolio/internal/* is NOT exposed here.
// callPortfolio.js inside Order Service calls Portfolio Service
// directly on port 3005 — never through the gateway.

app.use(
  '/portfolio',
  isAuthenticated,
  createProxyMiddleware({
    target: `http://localhost:${PORTFOLIO_PORT}`,
    changeOrigin: true,

    pathRewrite: (path) => {
      return '/api/v1/portfolio';
    }
  })
);

// ── ORDER SERVICE (authenticated) ────────────────
// POST   /orders/market
// POST   /orders/limit
// GET    /orders/
// DELETE /orders/:orderId/cancel
//
// NOTE: /api/v1/orders/internal/* is NOT exposed here.
// The Limit Order Worker (cron inside Order Service) executes
// orders by calling limitWorkers.js directly — same process,
// no HTTP involved at all.

app.use(
  '/orders',
  isAuthenticated,
  createProxyMiddleware({
    target: `http://localhost:${ORDER_PORT}`,
    changeOrigin: true,
    pathRewrite: {
      '^/': '/api/v1/orders/'
    }
  })
);


/* ================================================
   WEBSOCKET GATEWAY

   Client
   ws://localhost:3008/home
   ws://localhost:3008/market

   Gateway
          ↓

   Price Service
   ws://localhost:3003/home
   ws://localhost:3003/market
================================================ */

const wss = new WebSocketServer({ server });

function proxyWS(clientSocket, upstreamPath) {

  console.log('Creating upstream:', upstreamPath);

  const upstream = new WebSocket(
    `ws://localhost:${PRICE_PORT}${upstreamPath}`
  );

  // ----------------------------
  // Upstream connected
  // ----------------------------

  upstream.on('open', () => {
    console.log(
      `[WS] Upstream connected → ${upstreamPath}`
    );
  });

  // ----------------------------
  // Price Service → Client
  // ----------------------------

  upstream.on('message', (data) => {
    if(clientSocket.readyState === WebSocket.OPEN){
      clientSocket.send(
        data.toString()
      );
    }
  });

  // ----------------------------
  // Client → Price Service
  // ----------------------------

  clientSocket.on('message', (data) => {

    if(upstream.readyState === WebSocket.OPEN){
      upstream.send(data);
    }
  });

  // ----------------------------
  // Upstream error
  // ----------------------------

  upstream.on('error', (err) => {

    console.error(
      '[WS] Upstream error:',
      err.message
    );

    if(clientSocket.readyState === WebSocket.OPEN){
      clientSocket.close(
        1011,
        'Upstream error'
      );
    }
  });

  // ----------------------------
  // Upstream closed
  // ----------------------------

  upstream.on('close', () => {
    console.log(
      '[WS] Upstream disconnected'
    );

    if(clientSocket.readyState === WebSocket.OPEN){
      clientSocket.close();
    }
  });

  // ----------------------------
  // Client closed
  // ----------------------------

  clientSocket.on('close', () => {
    console.log(
      '[WS] Client disconnected'
    );
    if(upstream.readyState === WebSocket.OPEN){
      upstream.close();
    }
  });

  // ----------------------------
  // Client error
  // ----------------------------

  clientSocket.on('error', (err) => {
    console.error(
      '[WS] Client error:',
      err.message
    );

    if(upstream.readyState === WebSocket.OPEN){
      upstream.close();
    }
  });
}

/* ==========================================
   NEW WS CONNECTION
========================================== */

wss.on('connection', (socket, req) => {

  console.log(
    'Gateway client connected:',
    req.url
  );

  // ----------------------------
  // Route selection
  // ----------------------------

  const { pathname } = url.parse(req.url);

  switch (pathname) {
    case '/market':
      return proxyWS(
        socket,
        '/market'
      );

    case '/home':
      return proxyWS(
        socket,
        '/home'
      );

    default:
      return socket.close(
        1008,
        'Unknown route'
      );
  }
});


server.listen(PORT, () => {
  console.log('API GATEWAY STARTED!!');
});