import { useEffect, useRef, useState } from 'react';
import '../styles/home.css';

// Keeps a rolling window of the last N prices for the sparkline
const SPARKLINE_MAX = 40;

export default function PriceCard({ ticker }) {
  const { symbol, currentPrice, priceChangePercent, volume } = ticker;
  const positive = Number(priceChangePercent) >= 0;

  const [history, setHistory] = useState([Number(currentPrice)]);
  const prevPrice = useRef(Number(currentPrice));
  const [flash, setFlash] = useState(''); // 'up' | 'down' | ''

  useEffect(() => {
    const next = Number(currentPrice);
    if (next === prevPrice.current) return;

    setFlash(next > prevPrice.current ? 'up' : 'down');
    const t = setTimeout(() => setFlash(''), 600);

    setHistory((prev) => {
      const updated = [...prev, next];
      return updated.length > SPARKLINE_MAX
        ? updated.slice(updated.length - SPARKLINE_MAX)
        : updated;
    });

    prevPrice.current = next;
    return () => clearTimeout(t);
  }, [currentPrice]);

  // Build SVG sparkline path
  const sparkline = buildSparkline(history, 120, 40);
  const lineColor = positive ? '#0ecb81' : '#f6465d';

  // Coin meta
  const base = symbol.replace('USDT', '').replace('BTC', 'BTC').replace('ETH', 'ETH').replace('BNB', 'BNB');
  const coinColors = {
    BTC: '#F7931A',
    ETH: '#627EEA',
    BNB: '#F0B90B',
  };
  const coinColor = coinColors[base] || '#888';

  return (
    <div className={`hp-price-card hp-price-card--flash-${flash}`}>
      <div className="hp-price-card__top">
        <div className="hp-price-card__coin">
          <span
            className="hp-price-card__coin-dot"
            style={{ background: coinColor }}
          />
          <span className="hp-price-card__symbol">{base}</span>
          <span className="hp-price-card__pair">/ USDT</span>
        </div>
        <span className={`hp-price-card__change ${positive ? 'hp-pos' : 'hp-neg'}`}>
          {positive ? '▲' : '▼'} {Math.abs(Number(priceChangePercent)).toFixed(2)}%
        </span>
      </div>

      <div className={`hp-price-card__price ${flash === 'up' ? 'hp-pos' : flash === 'down' ? 'hp-neg' : ''}`}>
        ${Number(currentPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>

      {/* Sparkline */}
      <svg
        className="hp-price-card__spark"
        viewBox="0 0 120 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {sparkline.fill && (
          <path d={sparkline.fill} fill={lineColor} fillOpacity="0.08" />
        )}
        {sparkline.line && (
          <path d={sparkline.line} fill="none" stroke={lineColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>

      <div className="hp-price-card__vol">
        Vol&nbsp;
        <span>{formatVolume(Number(volume))}</span>
      </div>
    </div>
  );
}

function buildSparkline(history, W, H) {
  if (history.length < 2) return {};
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const pad = 4;

  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * W;
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return [x, y];
  });

  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const fill = `${line} L${W},${H} L0,${H} Z`;

  return { line, fill };
}

function formatVolume(v) {
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(2) + 'B';
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(2) + 'M';
  if (v >= 1_000) return (v / 1_000).toFixed(2) + 'K';
  return v.toFixed(0);
}