import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const COIN_COLORS = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  BNB: '#F0B90B',
};

const FALLBACK_COLORS = [
  '#5C6BC0',
  '#26C6DA',
  '#AB47BC',
  '#66BB6A',
  '#FFA726',
];

function coinColor(symbol, index) {
  const base = symbol.replace('USDT', '');

  return (
    COIN_COLORS[base] ||
    FALLBACK_COLORS[index % FALLBACK_COLORS.length]
  );
}

export default function PortfolioChart({
  holdings = [],
  totals = {},
}) {
  const donutRef = useRef(null);
  const barRef = useRef(null);

  const donutChart = useRef(null);
  const barChart = useRef(null);

  useEffect(() => {

    if (!holdings.length) return;

    const labels = holdings.map((h) =>
      h.symbol.replace('USDT', '')
    );

    const values = holdings.map(
      (h) => Number(h.currentValue) || 0
    );

    const colors = holdings.map((h, i) =>
      coinColor(h.symbol, i)
    );

    const pnls = holdings.map((h) => {

      const value = Number(h.unrealizedPnl);

      return Number.isFinite(value)
        ? Number(value.toFixed(2))
        : 0;
    });

    const pnlColors = pnls.map((v) =>
      v >= 0
        ? '#0ecb81'
        : '#f6465d'
    );

    // ==========================
    // DONUT
    // ==========================

    donutChart.current?.destroy();

    donutChart.current = new Chart(
      donutRef.current,
      {
        type: 'doughnut',

        data: {

          labels,

          datasets: [
            {
              data: values,

              backgroundColor: colors,

              borderWidth: 0,

              hoverOffset: 8,
            },
          ],
        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          cutout: '68%',

          plugins: {

            legend: {
              display: false,
            },

            tooltip: {

              callbacks: {

                label: (ctx) =>

                  `$${Number(
                    ctx.parsed
                  ).toLocaleString(
                    'en-US',
                    {
                      minimumFractionDigits: 2,

                      maximumFractionDigits: 2,
                    }
                  )}`,
              },
            },
          },
        },
      }
    );

    // ==========================
    // BAR CHART
    // ==========================

    barChart.current?.destroy();

    barChart.current = new Chart(
      barRef.current,
      {
        type: 'bar',

        data: {

          labels,

          datasets: [
            {
              label: 'Unrealized P&L',

              data: pnls,

              backgroundColor:
                pnlColors,

              borderRadius: 8,

              borderSkipped: false,

              maxBarThickness: 42,
            },
          ],
        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {
              display: false,
            },

            tooltip: {

              callbacks: {

                label: (ctx) => {

                  const v =
                    ctx.parsed.y;

                  return `${v >= 0 ? '+' : ''
                    }$${Math.abs(v).toFixed(2)}`;
                },
              },
            },
          },

          scales: {

            x: {

              ticks: {

                color: '#888780',

                font: {
                  size: 12,
                },
              },

              grid: {
                display: false,
              },

              border: {
                color:
                  'rgba(255,255,255,0.08)',
              },
            },

            y: {

              beginAtZero: true,

              suggestedMin:
                Math.min(
                  ...pnls,
                  0
                ),

              suggestedMax:
                Math.max(
                  ...pnls,
                  0
                ),

              ticks: {

                color: '#888780',

                font: {
                  size: 11,
                },

                callback: (v) =>
                  `$${v}`,
              },

              grid: {
                color:
                  'rgba(255,255,255,0.05)',
              },

              border: {
                display: false,
              },
            },
          },
        },
      }
    );

    return () => {

      donutChart.current?.destroy();

      barChart.current?.destroy();
    };

  }, [holdings]);

  const labels = holdings.map((h) =>
    h.symbol.replace('USDT', '')
  );

  const colors = holdings.map((h, i) =>
    coinColor(h.symbol, i)
  );

  return (

    <div className="hp-charts">

      {/* Allocation */}

      <div className="hp-chart-card">

        <p className="hp-chart-card__label">

          Allocation

        </p>

        <div className="hp-donut-wrap">

          <div
            style={{
              position: 'relative',
              height: '220px',
            }}
          >

            <canvas
              ref={donutRef}
            />

          </div>

          <div className="hp-donut-legend">

            {holdings.map(
              (h, i) => {

                const pct =
                  totals.currentValue

                    ? (
                      (h.currentValue /
                        totals.currentValue) *
                      100
                    ).toFixed(1)

                    : '0';

                return (

                  <div
                    key={h.symbol}

                    className="hp-donut-legend__item"
                  >

                    <span
                      className="hp-donut-legend__swatch"

                      style={{
                        background:
                          colors[i],
                      }}
                    />

                    <span className="hp-donut-legend__name">

                      {labels[i]}

                    </span>

                    <span className="hp-donut-legend__pct">

                      {pct}%

                    </span>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </div>

      {/* P&L */}

      <div className="hp-chart-card">

        <p className="hp-chart-card__label">

          Unrealized P&amp;L by coin

        </p>

        <div
          style={{
            position: 'relative',

            height: '220px',
          }}
        >

          <canvas
            ref={barRef}
          />

        </div>

      </div>

    </div>
  );
}