`
  ╔══════════════════════════════════════════════════╗
  ║         API Gateway running on :${PORT}             ║
  ╚══════════════════════════════════════════════════╝

  REST ROUTES
  ──────────────────────────────────────────────────
  [PUBLIC]
    GET    /api/v1/prices/:symbol          → :${PRICE_PORT}

  [USER SERVICE]                           → :${USER_PORT}
    POST   /api/v1/user/register
    POST   /api/v1/user/login
    POST   /api/v1/user/initiateverification
    POST   /api/v1/user/verifyOTP
    DELETE /api/v1/user                    (x-access-token)

  [WATCHLIST SERVICE]                      → :${WATCHLIST_PORT}  (x-access-token)
    POST   /api/v1/watchlist/symbol
    DELETE /api/v1/watchlist
    GET    /api/v1/watchlist

  [PORTFOLIO SERVICE]                      → :${PORTFOLIO_PORT}  (x-access-token)
    GET    /api/v1/portfolio
    GET    /api/v1/portfolio/:symbol

  [ORDER SERVICE]                          → :${ORDER_PORT}  (x-access-token)
    POST   /api/v1/orders/market
    POST   /api/v1/orders/limit
    GET    /api/v1/orders/
    DELETE /api/v1/orders/:orderId/cancel

  INTERNAL (bypasses gateway entirely)
  ──────────────────────────────────────────────────
    Order Service → Portfolio Service      :${PORTFOLIO_PORT}/api/v1/portfolio/internal/*
    Limit Worker  → same process (no HTTP)

  WEBSOCKET
  ──────────────────────────────────────────────────
    ws://localhost:${PORT}/home    → Price Service /ws/home   (top-3)
    ws://localhost:${PORT}/market  → Price Service /ws/market (all)
  `