import { formatPrice, formatPercent } from '../utils/format';

// Mirrors the "Top Gainer / Top Volume" reference cards: two compact
// ranked lists side by side, text-only rows (icons intentionally
// skipped), each row links out to "More".
export default function TopCards({ topGainers, topVolume }) {
  return (
    <div className="top-cards">
      <TopCard title="Top gainer" rows={topGainers} />
      <TopCard title="Top volume" rows={topVolume} />
    </div>
  );
}

function TopCard({ title, rows }) {
  return (
    <div className="top-card">
      <div className="top-card__header">
        <span className="top-card__title">{title}</span>
        {/* <span className="top-card__more">
          More
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
            <path d="M2 1L6 4L2 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span> */}
      </div>

      <div className="top-card__rows">
        {rows.length === 0 && <p className="empty-state">No data yet.</p>}
        {rows.map((t) => {
          const pos = t.priceChangePercent >= 0;
          return (
            <div key={t.symbol} className="top-card__row">
              <span className="top-card__symbol">{t.symbol}</span>
              <span className="top-card__price">{formatPrice(t.currentPrice)}</span>
              <span className={`top-card__pct ${pos ? 'change--pos' : 'change--neg'}`}>
                {formatPercent(t.priceChangePercent)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}