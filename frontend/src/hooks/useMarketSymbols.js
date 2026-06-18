import { useState, useEffect, useCallback } from 'react';
import { fetchMarketSymbols } from '../services/api';

/**
 * useMarketSymbols
 *
 * Handles paginated, sorted fetching of market symbols from REST.
 * NOTE: currently unused — MarketPage now derives everything from the
 * /market WebSocket stream directly via useTickerWs. Kept here in case
 * a paginated REST symbols endpoint exists/gets added later.
 */
export function useMarketSymbols({ page = 1, limit = 20, sort = 'symbol', order = 'asc' } = {}) {
  const [symbols, setSymbols] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMarketSymbols({ page, limit, sort, order });
      setSymbols(data.symbols ?? data.data ?? data);
      setTotal(data.total ?? 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sort, order]);

  useEffect(() => { load(); }, [load]);

  return { symbols, total, loading, error, refresh: load };
}
