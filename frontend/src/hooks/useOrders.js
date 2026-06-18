import { useState, useEffect, useCallback } from 'react';
import { fetchOrderHistory, placeOrder } from '../services/api';

/**
 * useOrders
 *
 * Manages order history pagination and order placement.
 */
export function useOrders({ page = 1, limit = 20 } = {}) {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchOrderHistory({
        page,
        limit,
      });

      const rows = Array.isArray(data)
        ? data
        : (data.orders ?? data.data ?? []);

      setOrders(rows);
      setTotal(rows.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    load();
  }, [load]);

  const submitOrder = useCallback(
    async (payload, type) => {
      const result = await placeOrder(
        payload,
        type
      );

      await load();

      return result;
    },
    [load]
  );

  return {
    orders,
    total,
    loading,
    error,
    refresh: load,
    submitOrder,
  };
}