import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTickerWs } from '../hooks/useTickerWs';
import { useAuth } from '../context/AuthContext';
import Dropdown from '../components/Dropdown';
import BreadthDonut from '../components/BreadthDonut';
import TopCards from '../components/TopCards';
import { formatPrice, formatVolume, formatPercent } from '../utils/format';
import '../styles/theme.css';
import '../styles/market.css';

const SORT_OPTIONS = [
  { label: 'Symbol (A→Z)', key: 'symbol', dir: 1 },
  { label: 'Symbol (Z→A)', key: 'symbol', dir: -1 },
  { label: 'Price ↑', key: 'currentPrice', dir: 1 },
  { label: 'Price ↓', key: 'currentPrice', dir: -1 },
  { label: '24h Change ↑', key: 'priceChangePercent', dir: 1 },
  { label: '24h Change ↓', key: 'priceChangePercent', dir: -1 },
  { label: 'Volume ↓', key: 'quoteVolume', dir: -1 },
];

const PAGE_SIZES = [10, 20, 50];

export default function MarketPage() {
  const { isAuthenticated } = useAuth();

  // Live ticker stream — INITIAL_DATA seeds the map, then incremental updates
  const { tickers, connected, error } = useTickerWs('/market');

useEffect(() => {

  console.log('========================');

  console.log('WS Connected:', connected);

  console.log('WS Error:', error);

  console.log('Total Symbols:', Object.keys(tickers).length);

  console.log(
    'First 20 symbols:',
    Object.keys(tickers).slice(0, 20)
  );

  console.log(
    'First ticker:',
    Object.values(tickers)[0]
  );

}, [tickers, connected, error]);

  // Client-side pagination & sort (server has no REST symbols endpoint backing this —
  // everything we know about symbols comes from the WS stream itself)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sortIndex, setSortIndex] = useState(0);
  const [view, setView] = useState('table'); // 'table' | 'grid'
  const [moversTab, setMoversTab] = useState('gainers'); // 'gainers' | 'losers'
  const [search, setSearch] = useState('');

  const { key: sortKey, dir: sortDir } = SORT_OPTIONS[sortIndex];

  const allRows = useMemo(() => Object.values(tickers), [tickers]);

useEffect(() => {

  console.log('allRows length:', allRows.length);

}, [allRows]);

  // Symbol search — case-insensitive substring match against the live set
  const searchedRows = useMemo(() => {

  const q = search.trim().toUpperCase();

  console.log('Search:', q);

  if (!q) return allRows;

  const result = allRows.filter((t) => {

    const symbol = t.symbol?.toUpperCase();

    return symbol?.includes(q);

  });

  console.log('Matches:', result.length);

  console.log(
    'Matched symbols:',
    result.map(x => x.symbol)
  );

  return result;

}, [allRows, search]);

  const sortedRows = useMemo(() => {
    const rows = [...searchedRows];
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string') return av.localeCompare(bv) * sortDir;
      return (av - bv) * sortDir;
    });
    return rows;
  }, [searchedRows, sortKey, sortDir]);

  const total = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const page_ = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((page_ - 1) * limit, page_ * limit);

  // Gainers and losers — top 5 each by 24h % change across the full known set
  const gainers = useMemo(
    () =>
      [...allRows]
        .filter((t) => t.priceChangePercent > 0)
        .sort((a, b) => b.priceChangePercent - a.priceChangePercent)
        .slice(0, 5),
    [allRows],
  );

  const losers = useMemo(
    () =>
      [...allRows]
        .filter((t) => t.priceChangePercent < 0)
        .sort((a, b) => a.priceChangePercent - b.priceChangePercent)
        .slice(0, 5),
    [allRows],
  );

  // Top volume — highest quoteVolume across the full known set
  const topVolume = useMemo(
    () => [...allRows].sort((a, b) => b.quoteVolume - a.quoteVolume).slice(0, 3),
    [allRows],
  );

  const topGainers3 = useMemo(() => gainers.slice(0, 3), [gainers]);

  // Market breadth — how many symbols are green vs red right now
  const breadth = useMemo(() => {
    const upCount = allRows.filter((t) => t.priceChangePercent > 0).length;
    const downCount = allRows.filter((t) => t.priceChangePercent < 0).length;
    const flatCount = allRows.length - upCount - downCount;
    return { upCount, downCount, flatCount };
  }, [allRows]);

  // Diverging strip needs a shared max magnitude so bar lengths are comparable
  const maxMagnitude = useMemo(() => {
    const vals = [...gainers, ...losers].map((t) => Math.abs(t.priceChangePercent));
    return Math.max(1, ...vals);
  }, [gainers, losers]);

  const activeMovers = moversTab === 'gainers' ? gainers : losers;

  const handleSortChange = (val) => {
    setSortIndex(Number(val));
    setPage(1);
  };

  const handleLimitChange = (val) => {
    setLimit(Number(val));
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="page">

      <p className="eyebrow">Live market</p>
      <div className="market-header">

  <h1 className="heading-1">
    Market
  </h1>

</div>

      {/* ── Market breadth donut ── */}
      {allRows.length > 0 && (
        <section className="panel">
          <BreadthDonut
            upCount={breadth.upCount}
            downCount={breadth.downCount}
            flatCount={breadth.flatCount}
          />
        </section>
      )}

      {/* ── Top Gainer / Top Volume cards ── */}
      {allRows.length > 0 && (
        <TopCards topGainers={topGainers3} topVolume={topVolume} />
      )}

      {/* ── Top Movers: diverging performance strip ── */}
      {(gainers.length > 0 || losers.length > 0) && (
        <section className="panel">
          <div className="panel__header">
            <h2 className="heading-2">Top movers (24h)</h2>
            <div className="seg seg--sm">
              <button
                className={`seg__btn ${moversTab === 'gainers' ? 'seg__btn--active' : ''}`}
                onClick={() => setMoversTab('gainers')}
                disabled={moversTab === 'gainers'}
              >
                Gainers
              </button>
              <button
                className={`seg__btn ${moversTab === 'losers' ? 'seg__btn--active' : ''}`}
                onClick={() => setMoversTab('losers')}
                disabled={moversTab === 'losers'}
              >
                Losers
              </button>
            </div>
          </div>

          <div className="mover-strip">
            {activeMovers.map((t, i) => {
              const pct = t.priceChangePercent;
              const pos = pct >= 0;
              const widthPct = (Math.abs(pct) / maxMagnitude) * 100;
              return (
                <Link
                  to={isAuthenticated ? `/orders?symbol=${t.symbol}` : '#'}
                  key={t.symbol}
                  className="mover-row"
                  onClick={(e) => { if (!isAuthenticated) e.preventDefault(); }}
                >
                  <span className="mover-row__rank">{i + 1}</span>
                  <span className="mover-row__symbol">{t.symbol}</span>
                  <span className="mover-row__bar-track">
                    <span
                      className={`mover-row__bar ${pos ? 'mover-row__bar--pos' : 'mover-row__bar--neg'}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </span>
                  <span className={`mover-row__pct ${pos ? 'change--pos' : 'change--neg'}`}>
                    {formatPercent(pct)}
                  </span>
                  <span className="mover-row__price">{formatPrice(t.currentPrice)}</span>
                </Link>
              );
            })}
            {activeMovers.length === 0 && (
              <p className="empty-state">No {moversTab} right now.</p>
            )}
          </div>
        </section>
      )}

      {/* ── Listings ── */}
      <section className="panel">

        <div className="toolbar">
          <div className="toolbar__group">
            <div className="search-box">
              <svg className="search-box__icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                className="search-box__input"
                placeholder="Search symbol…"
                value={search}
                onChange={handleSearchChange}
              />
              {search && (
                <button
                  type="button"
                  className="search-box__clear"
                  onClick={() => { setSearch(''); setPage(1); }}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <Dropdown
              label="Sort"
              value={sortIndex}
              onChange={handleSortChange}
              options={SORT_OPTIONS.map((o, i) => ({ value: i, label: o.label }))}
            />

            <Dropdown
              label="Per page"
              value={limit}
              onChange={handleLimitChange}
              options={PAGE_SIZES.map((s) => ({ value: s, label: String(s) }))}
            />

          <div
              className={`live-pill ${
                connected
                  ? 'live-pill--on'
                  : 'live-pill--off'
              }`}
              >
                <span className="live-pill__dot" />
                {connected ? 'Live' : 'Offline'}
          </div>

          </div>

          <div className="seg">
            <button
              className={`seg__btn ${view === 'table' ? 'seg__btn--active' : ''}`}
              onClick={() => setView('table')}
              disabled={view === 'table'}
            >
              Table
            </button>
            <button
              className={`seg__btn ${view === 'grid' ? 'seg__btn--active' : ''}`}
              onClick={() => setView('grid')}
              disabled={view === 'grid'}
            >
              Grid
            </button>
          </div>
        </div>

        {allRows.length === 0 && (
          <div className="empty-state empty-state--block">
            <div className="empty-state__spinner" />
            <span>Waiting for market data…</span>
          </div>
        )}

        {allRows.length > 0 && total === 0 && (
          <div className="empty-state empty-state--block">
            <span>No symbols match "{search}".</span>
          </div>
        )}

        {/* ── Table View ── */}
        {total > 0 && view === 'table' && (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>24h Change</th>
                  <th>Volume</th>
                  {isAuthenticated && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => {
                  const pos = row.priceChangePercent >= 0;
                  return (
                    <tr key={row.symbol}>
                      <td className="table__symbol">{row.symbol}</td>
                      <td className="num">{formatPrice(row.currentPrice)}</td>
                      <td className={`num ${pos ? 'change--pos' : 'change--neg'}`}>
                        {formatPercent(row.priceChangePercent)}
                      </td>
                      <td className="num">{formatVolume(row.quoteVolume ?? row.volume)}</td>
                      {isAuthenticated && (
                        <td>
                          <Link to={`/orders?symbol=${row.symbol}`} className="auth-link">Trade</Link>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Grid View ── */}
        {total > 0 && view === 'grid' && (
          <div className="grid-view">
            {pageRows.map((row) => {
              const pos = row.priceChangePercent >= 0;
              return (
                <div key={row.symbol} className="crypto-card">
                  <div className="crypto-card__top">
                    <span className="crypto-card__symbol">{row.symbol}</span>
                    <span className={pos ? 'change--pos' : 'change--neg'}>
                      {formatPercent(row.priceChangePercent)}
                    </span>
                  </div>
                  <span className="crypto-card__price">{formatPrice(row.currentPrice)}</span>
                  <span className="crypto-card__vol">Vol: {formatVolume(row.quoteVolume ?? row.volume)}</span>
                  {isAuthenticated && (
                    <Link to={`/orders?symbol=${row.symbol}`} className="auth-link">Trade</Link>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && total > 0 && (
          <div className="pagination">
            <button className="btn btn--ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page_ === 1}>
              ← Prev
            </button>
            <span>Page {page_} of {totalPages}</span>
            <button className="btn btn--ghost" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page_ === totalPages}>
              Next →
            </button>
          </div>
        )}

      </section>

    </div>
  );
}