import { useEffect, useRef } from 'react';
import {
  Chart,
  ArcElement,
  DoughnutController,
  Tooltip,
} from 'chart.js';

Chart.register(ArcElement, DoughnutController, Tooltip);

const UP = '#0ecb81';
const DOWN = '#f6465d';
const FLAT = 'rgba(234, 236, 239, 0.25)';

export default function BreadthDonut({ upCount, downCount, flatCount }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (!chartRef.current) {
      chartRef.current = new Chart(canvasRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Up', 'Down', 'Flat'],
          datasets: [
            {
              data: [upCount, downCount, flatCount],
              backgroundColor: [UP, DOWN, FLAT],
              borderWidth: 0,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.label}: ${ctx.parsed}`,
              },
            },
          },
        },
      });
    } else {
      const chart = chartRef.current;
      chart.data.datasets[0].data = [upCount, downCount, flatCount];
      chart.update();
    }

    return () => {
      // keep chart alive across re-renders; destroy only on unmount
    };
  }, [upCount, downCount, flatCount]);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  const total = upCount + downCount + flatCount;
  const upPct = total ? Math.round((upCount / total) * 100) : 0;

  return (
    <div
      className="breadth-donut"
      role="img"
      aria-label={`Market breadth: ${upCount} symbols up, ${downCount} down, ${flatCount} flat`}
    >
      <div className="breadth-donut__chart">
        <canvas ref={canvasRef} />
        <div className="breadth-donut__center">
          <span className="breadth-donut__pct">{upPct}%</span>
          <span className="breadth-donut__pct-label">up</span>
        </div>
      </div>

      <div className="breadth-donut__legend">
        <span className="breadth-bar__stat breadth-bar__stat--up">
          <span className="breadth-bar__dot breadth-bar__dot--up" />
          {upCount} up
        </span>
        <span className="breadth-bar__stat breadth-bar__stat--down">
          <span className="breadth-bar__dot breadth-bar__dot--down" />
          {downCount} down
        </span>
        {flatCount > 0 && (
          <span className="breadth-bar__stat">
            <span className="breadth-bar__dot" style={{ background: FLAT }} />
            {flatCount} flat
          </span>
        )}
      </div>
    </div>
  );
}