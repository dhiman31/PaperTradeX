# Trading App — React + Vite

## Setup

```bash
cp .env.example .env   # set your API + WS URLs
npm install
npm run dev
```

## Structure

```
src/
├── main.jsx                  # React entry point
├── App.jsx                   # Router + AuthProvider + all routes
│
├── context/
│   └── AuthContext.jsx       # isAuthenticated, login(), register(), logout()
│
├── services/
│   ├── api.js                # All REST calls (same payloads as original api.js)
│   └── websocket.js          # createWsConnection() factory
│
├── hooks/
│   ├── useHomeWs.js          # /home WS → { portfolio, pnl, connected }
│   ├── useMarketWs.js        # /market WS → { prices, connected }
│   ├── useMarketSymbols.js   # paginated REST fetch → { symbols, total, loading }
│   └── useOrders.js          # order history + submitOrder()
│
├── pages/
│   ├── HomePage.jsx          # Live prices (public) + portfolio + P&L (auth)
│   ├── MarketPage.jsx        # Paginated symbols, sort, grid/table, top performers
│   ├── OrdersPage.jsx        # Place order form + order history (auth-gated)
│   ├── LoginPage.jsx         # { email, passwordHash } → loginUser()
│   ├── SignupPage.jsx        # { firstName, lastName, email, phoneNumber, passwordHash } → registerUser()
│   └── NotFoundPage.jsx      # 404
│
└── components/
    ├── layout/
    │   ├── AppLayout.jsx     # Navbar + <Outlet />
    │   └── Navbar.jsx        # Nav links, conditional auth links
    └── common/
        └── ProtectedRoute.jsx  # Redirects to /login if not authenticated
```

## Auth flow

- Token stored in `localStorage` under key `"token"` (identical to original).
- `AuthContext` reads it on mount; `ProtectedRoute` enforces it per-route.
- Login → token saved → redirect to intended page (or `/`).
- Signup → redirect to `/login` after 1.2 s (mirrors original).

## WebSocket

| Endpoint  | Auth required | Data pushed                     |
|-----------|---------------|---------------------------------|
| `/home`   | Yes (token sent as first frame) | portfolio holdings, P&L |
| `/market` | No            | symbol → { price, change24h, volume } |

Adapt the message handler in `useHomeWs.js` / `useMarketWs.js` to match your server's actual message shape.

## Pages & access

| Route      | Auth required | Notes                                |
|------------|---------------|--------------------------------------|
| `/`        | No            | Prices visible; portfolio hidden     |
| `/market`  | No            | Trade link shown only when logged in |
| `/orders`  | **Yes**       | Redirect to `/login` if not authed   |
| `/login`   | No            |                                      |
| `/signup`  | No            |                                      |
