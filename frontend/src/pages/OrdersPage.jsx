import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { useTickerWs } from '../hooks/useTickerWs';
import '../styles/theme.css';

const ORDER_SIDES = ['BUY', 'SELL'];
const ORDER_TYPES = ['MARKET', 'LIMIT'];

export default function OrdersPage() {
  const [searchParams] = useSearchParams();

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 20;
  const { orders, total, loading, error, submitOrder } = useOrders({ page, limit });
  const totalPages = Math.ceil(total / limit);

  // Live prices for the order form — same ticker stream as Market page
  const { tickers } = useTickerWs('/market');

  // Order form state
  // Pre-fill symbol if navigated from Market page (?symbol=BTCUSDT)
  const [symbol, setSymbol] = useState(searchParams.get('symbol') ?? '');
  const [side, setSide] = useState('BUY');
  const [type, setType] = useState('MARKET');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const livePrice = tickers[symbol]?.currentPrice;

  const handleOrder = async (e) => {

  e.preventDefault();

  setFormError('');

  setFormSuccess('');

  setSubmitting(true);

  try {

    const payload = {

      symbol:
        symbol
          .trim()
          .toUpperCase(),

      transactionType:
        side,

      amount:
        Number(qty),

      ...(type === 'LIMIT' && {

        limitPrice:
          Number(price),

      }),

    };

    await submitOrder(
      payload,
      type
    );

    setFormSuccess(
      `${type} ${side} order placed for ${qty} ${symbol}`
    );

    setQty('');

    setPrice('');

  } catch (err) {

    setFormError(
      err.message
    );

  } finally {

    setSubmitting(false);

  }

};

  return (
    <div className="page">

      <p className="eyebrow">Trade execution</p>
      <h1 className="heading-1">Orders
        <p className="sub">Place a market or limit order, then track every fill below.</p>
      </h1>

      {/* ── Place Order ── */}
      <section className="panel">
        <div className="panel__header">
          <h2 className="heading-2">Place order</h2>
        </div>

        <form onSubmit={handleOrder} className="fields-stack">

          <div className="field">
            <label htmlFor="symbol">Symbol</label>
            <div className="field-inline">
              <input
                id="symbol"
                type="text"
                required
                placeholder="e.g. BTCUSDT"
                style={{ maxWidth: 220 }}
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              />
              {livePrice && (
                <span className="live-badge">Live: {livePrice}</span>
              )}
            </div>
          </div>

          <div className="field">
            <label>Side</label>
            <div className="radio-group">
              {ORDER_SIDES.map((s) => (
                <label
                  key={s}
                  className={`radio-pill ${side === s ? `radio-pill--active radio-pill--${s.toLowerCase()}` : ''}`}
                >
                  <input
                    type="radio"
                    name="side"
                    value={s}
                    checked={side === s}
                    onChange={() => setSide(s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Order type</label>
            <div className="radio-group">
              {ORDER_TYPES.map((t) => (
                <label
                  key={t}
                  className={`radio-pill ${type === t ? 'radio-pill--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={type === t}
                    onChange={() => setType(t)}
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field" style={{ maxWidth: 220 }}>
            <label htmlFor="qty">Quantity</label>
            <input
              id="qty"
              type="number"
              required
              min="0"
              step="any"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>

          {type === 'LIMIT' && (
            <div className="field" style={{ maxWidth: 220 }}>
              <label htmlFor="limitPrice">Limit price</label>
              <input
                id="limitPrice"
                type="number"
                required
                min="0"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          )}

          <button
            type="submit"
            className={`btn btn--block ${side === 'BUY' ? 'btn--buy' : 'btn--sell'}`}
            disabled={submitting}
          >
            {submitting ? 'Placing…' : `Place ${side} order`}
          </button>
        </form>

        {formError && <div className="alert alert--error">{formError}</div>}
        {formSuccess && <div className="alert alert--success">{formSuccess}</div>}
      </section>

      {/* ── Order History ── */}
      <section className="panel">
        <div className="panel__header">
          <h2 className="heading-2">Order history</h2>
        </div>

        {error && (
          <div className="alert alert--error">{error}</div>
        )}

        {loading && <p className="empty-state">Loading…</p>}

        {!loading && orders.length === 0 && (
          <p className="empty-state">No orders yet.</p>
        )}

        {!loading && orders.length > 0 && (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Symbol</th>
                  <th>Transaction</th>
                  <th>Order Type</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>

                {orders.map((o) => (

                  <tr key={o.id}>

                    <td>{o.id}</td>

                    <td>{o.symbol}</td>

                    <td className={o.transactionType === 'BUY' ? 'change--pos' : 'change--neg'}>
                      {o.transactionType}
                    </td>

                    <td>
                      {o.orderType}
                    </td>

                    <td>
                      {Number(o.amount)}
                    </td>

                    <td>
                      $ {Number(o.price).toFixed(2)}
                    </td>

                    <td>
                      $ {Number(o.totalAmount).toFixed(2)}
                    </td>

                    <td>
                      <span
                        className={`pill ${
                          o.status === 'COMPLETED'
                            ? 'pill--pos'
                            : o.status === 'FAILED'
                            ? 'pill--neg'
                            : 'pill--pending'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        o.createdAt
                      ).toLocaleString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
          </div>
        )}

        {/* Pagination */}

        {totalPages > 1 && (

          <div className="pagination">

            <button
              className="btn btn--ghost"
              onClick={() =>
                setPage((p) =>
                  Math.max(1, p - 1)
                )
              }
              disabled={page === 1}
            >
              ← Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              className="btn btn--ghost"
              onClick={() =>
                setPage((p) =>
                  Math.min(
                    totalPages,
                    p + 1
                  )
                )
              }
              disabled={
                page === totalPages
              }
            >
              Next →
            </button>

          </div>

        )}

      </section>
    </div>
  );
}