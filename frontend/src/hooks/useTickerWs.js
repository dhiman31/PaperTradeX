import { useEffect, useRef, useState } from 'react';
import { createWsConnection } from '../services/websocket';
import { parseTickerMessage } from '../utils/ticker';

/**
 * useTickerWs
 *
 * Connects to a ticker-protocol WebSocket endpoint ('/market' or '/home' —
 * both speak the exact same protocol, see utils/ticker.js for the shape).
 *
 * Maintains a running map of symbol → normalized ticker, seeded by the
 * INITIAL_DATA envelope and kept fresh by subsequent single-ticker updates.
 *
 * @param {string} path - '/market' or '/home'
 * @returns {{ tickers: Record<string, object>, connected: boolean, error: string|null }}
 */
export function useTickerWs(path) {
  const [tickers, setTickers] = useState({});
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = createWsConnection(
      path,
      (message) => {
        setConnected(true);
        const parsed = parseTickerMessage(message);
        if (!parsed) return;

        if (parsed.isInitial) {
          // Seed/replace the whole map from INITIAL_DATA
          setTickers(parsed.tickers);
        } else {
          // Merge a single updated ticker in
          setTickers((prev) => ({ ...prev, [parsed.ticker.symbol]: parsed.ticker }));
        }
      },
      () => {
        setError('WebSocket error');
        setConnected(false);
      },
    );

    return () => {
      wsRef.current?.close();
    };
  }, [path]);

  return { tickers, connected, error };
}
