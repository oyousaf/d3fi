import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

type CryptoChartProps = {
  labels: string[];
  prices: number[];
};

export default function CryptoChart({ labels, prices }: CryptoChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Destroy any existing chart before creating a new one
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels.length > 0 ? labels : ["Jan", "Feb", "Mar"],
        datasets: [
          {
            label: "Price (GBP)",
            data: prices.length > 0 ? prices : [200, 250, 300],
            borderColor: "teal",
            borderWidth: 2,
            fill: false,
            pointRadius: 5,
            pointBackgroundColor: "teal",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: false },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [labels, prices]);

  return (
    <div className="w-full h-[400px] bg-gray-200 p-4 rounded-md">
      <canvas ref={chartRef} className="w-full h-full"></canvas>
    </div>
  );
}
