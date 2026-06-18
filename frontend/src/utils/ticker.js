/**
 * ticker.js
 *
 * Shared parsing logic for the ticker WebSocket protocol used by
 * both /market and /home. Both sockets send the exact same shape:
 *
 *   1. On connect — one INITIAL_DATA envelope:
 *        {
 *          type: "INITIAL_DATA",
 *          data: {
 *            "BTCUSDT": "{...stringified ticker...}",
 *            "ETHUSDT": "{...stringified ticker...}",
 *            ...
 *          }
 *        }
 *      Each value in `data` is a JSON-encoded string, not an object.
 *
 *   2. On every update — a single raw ticker object, no wrapper:
 *        {
 *          symbol: "ETHUSDT",
 *          event: "1dTicker",
 *          eventTime: 1781680379093,
 *          priceChange: "19.08000000",
 *          priceChangePercent: "1.077",
 *          weightedAvgPrice: "1794.97707147",
 *          openPrice: "1772.01000000",
 *          highPrice: "1839.77000000",
 *          lowPrice: "1763.36000000",
 *          currentPrice: "1791.09000000",
 *          volume: "309600.57870000",
 *          quoteVolume: "555725940.08016500",
 *          openTime: 1781593920000,
 *          closeTime: 1781680378393,
 *          firstTradeId: 4134206370,
 *          lastTradeId: 4137935901,
 *          totalTrades: 3729532,
 *          updatedAt: "2026-06-17T07:12:59.224Z"
 *        }
 *
 * All numeric-looking fields arrive as STRINGS. normalizeTicker()
 * converts the ones we actually use to numbers so sort/math/compare
 * work without surprises.
 */

const NUMERIC_FIELDS = [
  'priceChange',
  'priceChangePercent',
  'weightedAvgPrice',
  'openPrice',
  'highPrice',
  'lowPrice',
  'currentPrice',
  'volume',
  'quoteVolume',
];

/**
 * Converts the known numeric string fields on a raw ticker into numbers.
 * Leaves everything else (symbol, event, timestamps, ids) untouched.
 */
export function normalizeTicker(raw) {
  const ticker = { ...raw };
  for (const field of NUMERIC_FIELDS) {
    if (ticker[field] !== undefined) {
      ticker[field] = Number(ticker[field]);
    }
  }
  return ticker;
}

/**
 * Parses one incoming WS message (already JSON.parsed from event.data)
 * and returns either:
 *   { isInitial: true,  tickers: { SYMBOL: normalizedTicker, ... } }
 *   { isInitial: false, ticker: normalizedTicker }
 * or null if the message doesn't match the expected shape.
 */
export function parseTickerMessage(message) {
  if (message?.type === 'INITIAL_DATA' && message.data) {
    const tickers = {};
    for (const [symbol, encoded] of Object.entries(message.data)) {
      try {
        const parsed = typeof encoded === 'string' ? JSON.parse(encoded) : encoded;
        tickers[symbol] = normalizeTicker(parsed);
      } catch {
        // skip malformed entry, keep the rest of the batch
      }
    }
    return { isInitial: true, tickers };
  }

  if (message?.symbol) {
    return { isInitial: false, ticker: normalizeTicker(message) };
  }

  return null;
}
