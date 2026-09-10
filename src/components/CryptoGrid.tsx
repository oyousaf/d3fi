import FadeIn from "./FadeIn";
import type { Crypto } from "../utils/fetchCrypto";

type CryptoGridProps = {
  cryptos: Crypto[];
};

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 2,
});

const gbpCompact = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function CryptoGrid({ cryptos }: CryptoGridProps) {
  if (cryptos.length === 0) {
    return (
      <p className="text-center text-ink-muted" role="status">
        Live prices are unavailable right now. Please try again shortly.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0">
      {cryptos.map((crypto, index) => {
        const isPositive = crypto.price_change_percentage_24h >= 0;
        return (
          <li key={crypto.id}>
            <FadeIn delay={index * 0.05}>
              <a
                href={`/crypto/${crypto.id}`}
                className="group block h-full rounded-2xl border border-border bg-surface-raised p-5 transition-colors hover:border-accent"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={crypto.imageUrl}
                    alt=""
                    width={40}
                    height={40}
                    loading={index < 3 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-ink">{crypto.name}</h3>
                    <p className="text-sm uppercase text-ink-muted">{crypto.symbol}</p>
                  </div>
                </div>

                <dl className="mt-4 space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-sm text-ink-muted">Price</dt>
                    <dd className="font-medium text-ink">{gbp.format(crypto.current_price)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-sm text-ink-muted">Market cap</dt>
                    <dd className="text-ink">{gbpCompact.format(crypto.market_cap)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-sm text-ink-muted">24h change</dt>
                    <dd className={isPositive ? "font-medium text-positive" : "font-medium text-negative"}>
                      {isPositive ? "+" : ""}
                      {crypto.price_change_percentage_24h.toFixed(2)}%
                    </dd>
                  </div>
                </dl>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:underline">
                  View details
                  <span aria-hidden="true">→</span>
                </span>
              </a>
            </FadeIn>
          </li>
        );
      })}
    </ul>
  );
}
