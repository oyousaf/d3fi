import FadeIn from "./FadeIn";
import type { TrendingCoin } from "../utils/fetchCrypto";

type TrendingGridProps = {
  coins: TrendingCoin[];
};

export default function TrendingGrid({ coins }: TrendingGridProps) {
  if (coins.length === 0) {
    return (
      <p className="text-center text-ink-muted" role="status">
        Trending coins are unavailable right now. Please try again shortly.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0">
      {coins.map((coin, index) => (
        <li key={coin.id}>
          <FadeIn delay={index * 0.05}>
            <a
              href={`/crypto/${coin.id}`}
              className="group flex h-full items-center gap-3 rounded-2xl border border-border bg-surface-raised p-4 transition-colors hover:border-accent"
            >
              <img
                src={coin.imageUrl}
                alt=""
                width={36}
                height={36}
                loading="lazy"
                decoding="async"
                className="h-9 w-9 rounded-full"
              />
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{coin.name}</p>
                <p className="text-sm uppercase text-ink-muted">
                  {coin.symbol}
                  {coin.marketCapRank ? ` · Rank #${coin.marketCapRank}` : ""}
                </p>
              </div>
              <span
                className="ml-auto text-accent opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              >
                →
              </span>
            </a>
          </FadeIn>
        </li>
      ))}
    </ul>
  );
}
