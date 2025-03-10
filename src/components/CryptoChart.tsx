import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// Define the prop types for the CryptoChart component
type CryptoChartProps = {
  labels: string[];
  prices: number[];
};

export default function CryptoChart({ labels, prices }: CryptoChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Price (GBP)",
            data: prices,
            borderColor: "teal",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      chartInstance.destroy();
    };
  }, [labels, prices]);

  return <canvas ref={chartRef} className="w-full h-96"></canvas>;
}
