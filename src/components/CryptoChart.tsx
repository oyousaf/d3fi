import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

type CryptoChartProps = {
  labels: string[];
  prices: number[];
  currencyLabel?: string;
};

function readCssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export default function CryptoChart({ labels, prices, currencyLabel = "Price (GBP)" }: CryptoChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const accent = readCssVar("--color-accent", "#0d9488");
    const ink = readCssVar("--color-ink", "#18181b");
    const inkMuted = readCssVar("--color-ink-muted", "#52525b");
    const border = readCssVar("--color-border", "#e4e4e7");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels.length > 0 ? labels : ["Jan", "Feb", "Mar"],
        datasets: [
          {
            label: currencyLabel,
            data: prices.length > 0 ? prices : [200, 250, 300],
            borderColor: accent,
            backgroundColor: accent,
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: accent,
            tension: 0.25,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" },
        scales: {
          x: {
            ticks: { color: inkMuted, maxTicksLimit: 8 },
            grid: { color: border },
          },
          y: {
            beginAtZero: false,
            ticks: { color: inkMuted },
            grid: { color: border },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            titleColor: ink,
            bodyColor: ink,
            backgroundColor: readCssVar("--color-surface-raised", "#f4f4f5"),
            borderColor: border,
            borderWidth: 1,
          },
        },
      },
    });

    return () => {
      chartInstanceRef.current?.destroy();
      chartInstanceRef.current = null;
    };
  }, [labels, prices, currencyLabel]);

  const min = prices.length ? Math.min(...prices) : null;
  const max = prices.length ? Math.max(...prices) : null;

  return (
    <div className="h-[400px] w-full">
      <canvas
        ref={chartRef}
        role="img"
        aria-label={
          min !== null && max !== null
            ? `Line chart of ${currencyLabel} over time, ranging from £${min.toLocaleString()} to £${max.toLocaleString()}.`
            : `Line chart of ${currencyLabel}.`
        }
      />
    </div>
  );
}
