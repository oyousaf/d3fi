async function fetchWithRetry(url: string, retries = 4): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url);
    if (response.status !== 429) return response;

    const retryAfter = Number(response.headers.get("retry-after"));
    const backoffMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : 500 * 2 ** attempt + Math.random() * 250;

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    } else {
      return response;
    }
  }
  return fetch(url);
}

export type Crypto = {
  id: string;
  name: string;
  symbol: string;
  imageUrl: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
};

let cryptoDataPromise: Promise<Crypto[]> | null = null;

// Memoized so pages that need both the full list (getStaticPaths) and a
// single entry don't issue duplicate, rate-limit-prone requests per build.
export function fetchCryptoData(): Promise<Crypto[]> {
  if (!cryptoDataPromise) {
    cryptoDataPromise = (async () => {
      try {
        const response = await fetchWithRetry(
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
    })();
  }
  return cryptoDataPromise;
}

export type TrendingCoin = {
  id: string;
  name: string;
  symbol: string;
  imageUrl: string;
  marketCapRank: number | null;
};

export async function fetchTrendingCoins(): Promise<TrendingCoin[]> {
  try {
    const response = await fetchWithRetry("https://api.coingecko.com/api/v3/search/trending");

    if (!response.ok) throw new Error("Failed to fetch trending coins");

    const data = await response.json();

    return (data.coins ?? []).slice(0, 6).map(({ item }: any) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol,
      imageUrl: item.large ?? item.small ?? item.thumb,
      marketCapRank: item.market_cap_rank ?? null,
    }));
  } catch (error) {
    console.error("Error fetching trending coins:", error);
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
    const response = await fetchWithRetry(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=gbp&days=${days}&sparkline=false`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch historical data for ${id}`);
    }

    const data = await response.json();

    if (!data.prices || data.prices.length === 0) {
      throw new Error(`No price data available for ${id}`);
    }

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
