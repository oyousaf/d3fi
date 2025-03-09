import Chart from "chart.js/auto";

export async function renderChart(id) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=gbp&days=7`
  );
  const data = await response.json();

  new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels: data.prices.map((price) =>
        new Date(price[0]).toLocaleDateString()
      ),
      datasets: [
        {
          label: "Price in GBP",
          data: data.prices.map((price) => price[1]),
          borderColor: "#fff",
          fill: false,
        },
      ],
    },
  });
}
