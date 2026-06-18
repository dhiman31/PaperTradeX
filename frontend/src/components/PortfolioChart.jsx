import { useEffect, useRef } from 'react';

// Chart.js loaded via CDN in index.html, or import it if using npm:
// import { Chart, ArcElement, DoughnutController, BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
// Chart.register(ArcElement, DoughnutController, BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend);

import {
  Chart,
  ArcElement,
  DoughnutController,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js';

Chart.register(
  ArcElement,
  DoughnutController,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
);

const COIN_COLORS = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  BNB: '#F0B90B',
};

const FALLBACK_COLORS = ['#5C6BC0', '#26C6DA', '#AB47BC', '#66BB6A', '#FFA726'];

function coinColor(symbol, index) {
  const base = symbol.replace('USDT', '');
  return COIN_COLORS[base] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

export default function PortfolioChart({ holdings, totals }) {
  const donutRef = useRef(null);
  const barRef = useRef(null);
  const donutChart = useRef(null);
  const barChart = useRef(null);

  useEffect(() => {
    const Chart = window.Chart;
    if (!Chart) return;

    const labels = holdings.map((h) => h.symbol.replace('USDT', ''));
    const values = holdings.map((h) => h.currentValue);
    const colors = holdings.map((h, i) => coinColor(h.symbol, i));
    const pnls = holdings.map((h) => parseFloat(h.unrealizedPnl.toFixed(2)));
    const pnlColors = pnls.map((v) => (v >= 0 ? '#0ecb81' : '#f6465d'));

    // ── Donut: allocation ──────────────────────────────────
    if (donutChart.current) donutChart.current.destroy();
    donutChart.current = new Chart(donutRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                ` $${Number(ctx.parsed).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            },
          },
        },
      },
    });

    // ── Bar: P&L per coin ──────────────────────────────────
    if (barChart.current) barChart.current.destroy();
    barChart.current = new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Unrealized P&L ($)',
            data: pnls,
            backgroundColor: pnlColors,
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const v = ctx.parsed.y;
                return ` ${v >= 0 ? '+' : ''}$${Math.abs(v).toFixed(2)}`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#888780', font: { size: 12 } },
            grid: { display: false },
            border: { color: 'rgba(255,255,255,0.08)' },
          },
          y: {
            ticks: {
              color: '#888780',
              font: { size: 11 },
              callback: (v) => `$${v}`,
            },
            grid: { color: 'rgba(255,255,255,0.05)' },
            border: { display: false },
          },
        },
      },
    });

    return () => {
      donutChart.current?.destroy();
      barChart.current?.destroy();
    };
  }, [holdings]);

  const labels = holdings.map((h) => h.symbol.replace('USDT', ''));
  const colors = holdings.map((h, i) => coinColor(h.symbol, i));

  return (
    <div className="hp-charts">

      {/* Donut + legend */}
      <div className="hp-chart-card">
        <p className="hp-chart-card__label">Allocation</p>
        <div className="hp-donut-wrap">
          <div style={{ position: 'relative', height: '200px' }}>
            <canvas
              ref={donutRef}
              role="img"
              aria-label={`Portfolio allocation donut chart across ${labels.join(', ')}`}
            >
              {holdings.map((h) => `${h.symbol}: $${h.currentValue.toFixed(2)}`).join(', ')}
            </canvas>
          </div>
          {/* Custom legend */}
          <div className="hp-donut-legend">
            {holdings.map((h, i) => {
              const pct = totals.currentValue
                ? ((h.currentValue / totals.currentValue) * 100).toFixed(1)
                : '0';
              return (
                <div key={h.symbol} className="hp-donut-legend__item">
                  <span
                    className="hp-donut-legend__swatch"
                    style={{ background: colors[i] }}
                  />
                  <span className="hp-donut-legend__name">{labels[i]}</span>
                  <span className="hp-donut-legend__pct">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* P&L bar chart */}
      <div className="hp-chart-card">
        <p className="hp-chart-card__label">Unrealized P&amp;L by coin</p>
        <div style={{ position: 'relative', height: '200px' }}>
          <canvas
            ref={barRef}
            role="img"
            aria-label={`Bar chart of unrealized P&L for ${labels.join(', ')}`}
          >
            {holdings.map((h) => `${h.symbol}: $${h.unrealizedPnl.toFixed(2)}`).join(', ')}
          </canvas>
        </div>
      </div>

    </div>
  );
}