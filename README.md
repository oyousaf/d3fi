# D3fi Crypto Dashboard

A modern crypto app built with Astro and Tailwind CSS. Track the top 10 cryptocurrencies by market cap, browse trending coins, and explore 30-day price history — all server-rendered at build time, with zero JavaScript framework runtime shipped to the browser.

## Stack

- **Astro** — static site generation, no client framework; every component is Astro-native
- **Tailwind CSS v4** — CSS-first theming (`@theme` tokens in `src/styles/global.css`), class-based dark mode
- **Chart.js** — the only client-side script, loaded solely on crypto detail pages for the price chart
- **CoinGecko API** — live prices, market caps, trending coins, and historical data (no API key required)

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check and build a static site to dist/
npm run preview   # preview the production build locally
npm run check     # run astro check on its own
```

## Notes

- All pages are statically generated at build time; there is no server runtime.
- CoinGecko's free tier rate-limits aggressively, so data fetching includes retry/backoff — a `build` can take a few minutes without an API key.
