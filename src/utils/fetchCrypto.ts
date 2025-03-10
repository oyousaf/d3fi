export type Crypto = {
  id: string;
  name: string;
  symbol: string;
  imageUrl: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
};

export async function fetchCryptoData(): Promise<Crypto[]> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=gbp&order=market_cap_desc&per_page=10&page=1&sparkline=false"
    );

    if (!response.ok) throw new Error("Failed to fetch crypto data");

    const data = await response.json();

    return data.map((crypto: any) => ({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      imageUrl: crypto.image,
      current_price: crypto.current_price,
      market_cap: crypto.market_cap,
      price_change_percentage_24h: crypto.price_change_percentage_24h,
    }));
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    return [];
  }
}

export type CryptoNewsArticle = {
  id: string;
  title: string;
  description: string;
  url: string;
};

export async function fetchCryptoNews(): Promise<CryptoNewsArticle[]> {
  try {
    const response = await fetch(
      "https://cryptopanic.com/api/v1/posts/?public=true"
    );

    if (!response.ok) throw new Error("Failed to fetch crypto news");

    const data = await response.json();

    return data.results.map((news: any) => ({
      id: news.id || Math.random().toString(36).substring(7),
      title: news.title,
      description: news.body || "No description available.",
      url: news.url,
    }));
  } catch (error) {
    console.error("Error fetching crypto news:", error);
    return [];
  }
}

export type CryptoHistoricalData = {
  prices: number[][];
  market_caps: number[][];
  total_volumes: number[][];
};

export async function fetchCryptoHistoricalData(
  id: string,
  days: number = 30
): Promise<CryptoHistoricalData> {
  try {
    console.log(`Fetching historical data for ID: ${id}`);

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=gbp&days=${days}&sparkline=false`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch historical data for ${id}`);
    }

    const data = await response.json();

    if (!data.prices || data.prices.length === 0) {
      throw new Error(`No price data available for ${id}`);
    }

    console.log("Fetched historical data successfully:", data);

    return {
      prices: data.prices,
      market_caps: data.market_caps,
      total_volumes: data.total_volumes,
    };
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return { prices: [], market_caps: [], total_volumes: [] };
  }
}
