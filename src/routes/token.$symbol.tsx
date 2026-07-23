import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import logo from "@/assets/ponhub-logo.png.asset.json";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { useWallet } from "@/lib/wallet";

type Token = {
  symbol: string;
  name: string;
  hue: number;
  price: number;
  change: number;
  mcap: string;
  age: string;
  holders: number;
  bonding: number;
  supply: string;
  liquidity: string;
  volume24: string;
  desc: string;
};

const TOKENS: Record<string, Token> = {
  PON: { symbol: "PON", name: "PonHub", hue: 45, price: 0.00701, change: 12.4, mcap: "$221K", age: "3d", holders: 1420, bonding: 68, supply: "1,000,000,000", liquidity: "$42.8K", volume24: "$88.4K", desc: "The native launchpad token of PonHub. Fair-launched on Robinhood Chain, no team allocation, no presale." },
  TRT: { symbol: "TRT", name: "Trotter", hue: 260, price: 0.00042, change: -3.1, mcap: "$18K", age: "12h", holders: 214, bonding: 22, supply: "1,000,000,000", liquidity: "$4.1K", volume24: "$6.2K", desc: "Trotter — because every pon needs a good gait." },
  SDL: { symbol: "SDL", name: "Saddle", hue: 30, price: 0.02198, change: 42.6, mcap: "$412K", age: "6d", holders: 3110, bonding: 92, supply: "1,000,000,000", liquidity: "$91.2K", volume24: "$204K", desc: "Saddle up. Nearly bonded — one more push to graduate to the open market." },
  REN: { symbol: "REN", name: "Reinhold", hue: 300, price: 0.00088, change: 8.2, mcap: "$41K", age: "1d", holders: 512, bonding: 34, supply: "1,000,000,000", liquidity: "$9.4K", volume24: "$14.1K", desc: "Reinhold, first of his herd." },
  TSK: { symbol: "TSK", name: "Tuskeg", hue: 170, price: 0.00519, change: -12.7, mcap: "$88K", age: "4d", holders: 902, bonding: 55, supply: "1,000,000,000", liquidity: "$18.2K", volume24: "$32.7K", desc: "Tuskeg is a slow burn. HODLers welcome." },
  MNE: { symbol: "MNE", name: "Mane", hue: 15, price: 0.00012, change: 4.4, mcap: "$6K", age: "3h", holders: 88, bonding: 9, supply: "1,000,000,000", liquidity: "$1.2K", volume24: "$2.8K", desc: "Brand new. Flowing Mane, freshly launched." },
  HFY: { symbol: "HFY", name: "Hayfy", hue: 90, price: 0.00776, change: 21.1, mcap: "$154K", age: "5d", holders: 1780, bonding: 74, supply: "1,000,000,000", liquidity: "$34.1K", volume24: "$71.9K", desc: "Feed the herd. Hayfy is a community-driven yield play." },
  BRD: { symbol: "BRD", name: "Bridle", hue: 200, price: 0.00234, change: -1.9, mcap: "$29K", age: "2d", holders: 340, bonding: 41, supply: "1,000,000,000", liquidity: "$6.7K", volume24: "$11.2K", desc: "Bridle keeps the herd in check." },
  STL: { symbol: "STL", name: "Stallar", hue: 340, price: 0.01123, change: 33.8, mcap: "$276K", age: "7d", holders: 2210, bonding: 85, supply: "1,000,000,000", liquidity: "$61.4K", volume24: "$148K", desc: "Interstellar Stallar. Bonding curve almost complete." },
  GLP: { symbol: "GLP", name: "Gallop", hue: 55, price: 0.00061, change: -6.5, mcap: "$12K", age: "9h", holders: 141, bonding: 17, supply: "1,000,000,000", liquidity: "$2.9K", volume24: "$4.4K", desc: "Full Gallop or nothing." },
  OTT: { symbol: "OTT", name: "Trotcoin", hue: 120, price: 0.00889, change: 15.6, mcap: "$132K", age: "5d", holders: 1210, bonding: 63, supply: "1,000,000,000", liquidity: "$28.4K", volume24: "$58.1K", desc: "Trotcoin — the official currency of casual trotting." },
  PNY: { symbol: "PNY", name: "Ponee", hue: 320, price: 0.00019, change: 2.2, mcap: "$4K", age: "1h", holders: 42, bonding: 6, supply: "1,000,000,000", liquidity: "$0.9K", volume24: "$1.4K", desc: "The littlest pon. Fresh launch on Robinhood." },
};

export const Route = createFileRoute("/token/$symbol")({
  loader: ({ params }) => {
    const token = TOKENS[params.symbol.toUpperCase()];
    if (!token) throw notFound();
    return token;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Token not found — PonHub" }, { name: "robots", content: "noindex" }] };
    }
    const t = loaderData;
    const title = `$${t.symbol} ${t.name} — PonHub`;
    const desc = `Trade ${t.name} ($${t.symbol}) on PonHub. ${t.bonding}% bonded, ${t.holders} holders, ${t.mcap} market cap on Robinhood Chain.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/token/${t.symbol}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/token/${t.symbol}` }],
    };
  },
  component: TokenPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Token not found</h1>
        <p className="text-muted-foreground mb-4">This ticker isn't on PonHub yet.</p>
        <Link to="/" className="rounded bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">Back to launchpad</Link>
      </div>
    </div>
  ),
});

// Deterministic pseudo-random for chart + trade rows
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function TokenPage() {
  const t = Route.useLoaderData();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("0.1");

  // Bonding curve preview points (price vs supply progression)
  const curve = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 60; i++) {
      const x = i / 60;
      // exponential-ish bonding curve
      const y = Math.pow(x, 1.6) * 0.9 + x * 0.1;
      pts.push({ x, y });
    }
    return pts;
  }, []);

  // Price history sparkline
  const spark = useMemo(() => {
    const rnd = seeded(t.symbol.charCodeAt(0) * 137 + t.symbol.charCodeAt(1));
    const pts: number[] = [];
    let v = 0.5;
    for (let i = 0; i < 80; i++) {
      v += (rnd() - 0.48) * 0.08;
      v = Math.max(0.05, Math.min(0.95, v));
      pts.push(v);
    }
    // Nudge trend to match change sign
    return pts.map((p, i) => p + (t.change / 100) * (i / pts.length) * 0.4);
  }, [t.symbol, t.change]);

  const trades = useMemo(() => {
    const rnd = seeded(t.symbol.charCodeAt(0) * 17);
    const rows: { side: "BUY" | "SELL"; who: string; amt: string; rbh: string; ago: string }[] = [];
    for (let i = 0; i < 22; i++) {
      const isBuy = rnd() > 0.42;
      const amt = (rnd() * 800_000 + 5_000).toFixed(0);
      const rbh = (Number(amt) * t.price).toFixed(4);
      const who = "0x" + Math.floor(rnd() * 0xffffff).toString(16).padStart(6, "0") + "…" + Math.floor(rnd() * 0xffff).toString(16).padStart(4, "0");
      const ago = i < 3 ? `${Math.floor(rnd() * 60)}s` : i < 10 ? `${Math.floor(rnd() * 59) + 1}m` : `${Math.floor(rnd() * 12) + 1}h`;
      rows.push({ side: isBuy ? "BUY" : "SELL", who, amt: Number(amt).toLocaleString(), rbh, ago });
    }
    return rows;
  }, [t.symbol, t.price]);

  const gradient = `linear-gradient(135deg, oklch(0.65 0.18 ${t.hue}), oklch(0.35 0.12 ${(t.hue + 60) % 360}))`;
  const positive = t.change >= 0;

  const amountNum = parseFloat(amount) || 0;
  const estTokens = amountNum / t.price;
  const feeRbh = amountNum * 0.01;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-3 text-xs">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo.url} alt="PonHub" className="h-6 w-auto" />
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <Link to="/" className="text-muted-foreground hover:text-foreground">launchpad</Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-foreground font-mono">${t.symbol}</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline text-primary font-mono">◆ Robinhood Mainnet</span>
            <ConnectWalletButton />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="min-w-0 space-y-6">
          {/* Header card */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-56 aspect-square sm:aspect-auto relative shrink-0" style={{ background: gradient }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono font-bold text-6xl text-white/90 drop-shadow-lg">
                    {t.symbol.slice(0, 2)}
                  </span>
                </div>
              </div>
              <div className="flex-1 p-5">
                <div className="flex items-start gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground font-mono">ponhub.{t.symbol.toLowerCase()}</div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                      {t.name} <span className="text-primary">${t.symbol}</span>
                    </h1>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="font-mono text-2xl">{t.price.toFixed(5)}</div>
                    <div className={"font-mono text-xs " + (positive ? "text-[color:var(--buy)]" : "text-[color:var(--sell)]")}>
                      {positive ? "+" : ""}{t.change.toFixed(2)}% 24h
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{t.desc}</p>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <MiniStat k="Market cap" v={t.mcap} />
                  <MiniStat k="Liquidity" v={t.liquidity} />
                  <MiniStat k="24h volume" v={t.volume24} />
                  <MiniStat k="Holders" v={t.holders.toLocaleString()} />
                </div>
              </div>
            </div>
          </div>

          {/* Price sparkline */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Price</h2>
              <div className="flex items-center gap-1 text-[10px] font-mono">
                {["1H", "1D", "1W", "1M", "ALL"].map((r, i) => (
                  <button
                    key={r}
                    className={
                      "px-2 py-1 rounded " +
                      (i === 1 ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground")
                    }
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <Sparkline points={spark} positive={positive} />
          </div>

          {/* Bonding curve */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold">Bonding curve</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Graduates to open market at 100%. Liquidity is auto-deployed to Robinhood DEX.
                </p>
              </div>
              <div className="text-right">
                <div className="font-mono text-xl text-primary">{t.bonding}%</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">progress</div>
              </div>
            </div>
            <BondingCurve curve={curve} progress={t.bonding / 100} />
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <CurveStat k="Curve" v="Exponential" />
              <CurveStat k="Graduation MC" v="$690K" />
              <CurveStat k="Remaining" v={`${(100 - t.bonding).toFixed(0)}%`} />
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-[color:var(--buy)]"
                style={{ width: `${t.bonding}%` }}
              />
            </div>
          </div>

          {/* Transaction history */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between p-5 pb-3">
              <h2 className="text-sm font-semibold">Transactions</h2>
              <span className="text-[10px] font-mono text-[color:var(--buy)]">● LIVE</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead className="text-muted-foreground text-[10px] uppercase tracking-wider">
                  <tr className="border-t border-border">
                    <th className="text-left px-5 py-2 font-medium">Type</th>
                    <th className="text-left px-5 py-2 font-medium">Wallet</th>
                    <th className="text-right px-5 py-2 font-medium">${t.symbol}</th>
                    <th className="text-right px-5 py-2 font-medium">RBH</th>
                    <th className="text-right px-5 py-2 font-medium">Age</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((r, i) => (
                    <tr key={i} className="border-t border-border/60 hover:bg-muted/40">
                      <td className="px-5 py-2">
                        <span className={r.side === "BUY" ? "text-[color:var(--buy)]" : "text-[color:var(--sell)]"}>
                          {r.side}
                        </span>
                      </td>
                      <td className="px-5 py-2 text-muted-foreground">{r.who}</td>
                      <td className="px-5 py-2 text-right">{r.amt}</td>
                      <td className="px-5 py-2 text-right">{r.rbh}</td>
                      <td className="px-5 py-2 text-right text-muted-foreground">{r.ago}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Buy/Sell panel */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 sticky top-4">
            <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-muted mb-4">
              <button
                onClick={() => setSide("buy")}
                className={
                  "py-2 rounded-md text-sm font-medium transition-colors " +
                  (side === "buy"
                    ? "bg-[color:var(--buy)]/20 text-[color:var(--buy)]"
                    : "text-muted-foreground")
                }
              >
                Buy
              </button>
              <button
                onClick={() => setSide("sell")}
                className={
                  "py-2 rounded-md text-sm font-medium transition-colors " +
                  (side === "sell"
                    ? "bg-[color:var(--sell)]/20 text-[color:var(--sell)]"
                    : "text-muted-foreground")
                }
              >
                Sell
              </button>
            </div>

            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {side === "buy" ? "You pay" : "You sell"}
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                className="flex-1 bg-transparent outline-none font-mono text-lg min-w-0"
              />
              <span className="text-xs font-mono text-muted-foreground shrink-0">
                {side === "buy" ? "RBH" : `$${t.symbol}`}
              </span>
            </div>
            <div className="mt-2 flex gap-1">
              {["0.1", "0.5", "1", "5"].map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className="flex-1 text-[10px] font-mono py-1 rounded border border-border hover:border-primary/40 hover:text-primary"
                >
                  {v}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-md bg-muted/50 p-3 text-xs font-mono space-y-1.5">
              <Row k={side === "buy" ? "You receive" : "You receive"} v={`${side === "buy" ? estTokens.toLocaleString(undefined, { maximumFractionDigits: 0 }) + " $" + t.symbol : (amountNum * t.price).toFixed(5) + " RBH"}`} highlight />
              <Row k="Price" v={`${t.price.toFixed(5)} RBH`} />
              <Row k="Slippage" v="1.0%" />
              <Row k="Protocol fee" v={`${feeRbh.toFixed(4)} RBH`} />
              <Row k="Price impact" v={`${(amountNum * 0.4).toFixed(2)}%`} />
            </div>

            <TradeButton side={side} symbol={t.symbol} />
            <p className="mt-2 text-center text-[10px] text-muted-foreground font-mono">
              Trading on Robinhood Chain • powered by PonHub
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-xs font-semibold mb-3">Token info</h3>
            <Row k="Contract" v="0x8f4b…24ce" />
            <Row k="Supply" v={t.supply} />
            <Row k="Age" v={t.age} />
            <Row k="Deployer" v="0x21ac…9f01" />
            <Row k="Chain" v="Robinhood" />
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-xs font-semibold mb-3">Holders top 5</h3>
            {[38.2, 12.4, 6.8, 4.1, 2.9].map((pct, i) => (
              <div key={i} className="flex items-center gap-2 py-1 text-xs font-mono">
                <span className="text-muted-foreground w-4">#{i + 1}</span>
                <span>0x{Math.floor(Math.random() * 0xffff).toString(16).padStart(4, "0")}…{Math.floor(Math.random() * 0xffff).toString(16).padStart(4, "0")}</span>
                <span className="ml-auto">{pct}%</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function MiniStat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="font-mono text-sm mt-0.5">{v}</div>
    </div>
  );
}

function CurveStat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md bg-muted/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="font-mono text-sm mt-0.5">{v}</div>
    </div>
  );
}

function TradeButton({ side, symbol }: { side: "buy" | "sell"; symbol: string }) {
  const { isConnected, connect, connecting } = useWallet();
  if (!isConnected) {
    return (
      <button
        onClick={connect}
        disabled={connecting}
        className="mt-4 w-full rounded-md py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60"
      >
        ◆ {connecting ? "Connecting…" : "Connect wallet to trade"}
      </button>
    );
  }
  return (
    <button
      className={
        "mt-4 w-full rounded-md py-2.5 text-sm font-semibold transition-colors " +
        (side === "buy"
          ? "bg-[color:var(--buy)] text-black hover:opacity-90"
          : "bg-[color:var(--sell)] text-white hover:opacity-90")
      }
    >
      {side === "buy" ? `Buy $${symbol}` : `Sell $${symbol}`}
    </button>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 text-xs font-mono">
      <span className="text-muted-foreground">{k}</span>
      <span className={highlight ? "text-primary" : ""}>{v}</span>
    </div>
  );
}

function Sparkline({ points, positive }: { points: number[]; positive: boolean }) {
  const w = 800;
  const h = 180;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => [i * step, h - ((p - min) / range) * (h - 20) - 10] as const);
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = line + ` L${w},${h} L0,${h} Z`;
  const color = positive ? "var(--buy)" : "var(--sell)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="currentColor" strokeOpacity="0.06" />
      ))}
      <path d={area} fill="url(#spark-fill)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BondingCurve({ curve, progress }: { curve: { x: number; y: number }[]; progress: number }) {
  const w = 800;
  const h = 200;
  const pad = 10;
  const coords = curve.map((p) => [pad + p.x * (w - pad * 2), h - pad - p.y * (h - pad * 2)] as const);
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = line + ` L${w - pad},${h - pad} L${pad},${h - pad} Z`;
  const cutoffIdx = Math.floor(progress * (curve.length - 1));
  const filledCoords = coords.slice(0, cutoffIdx + 1);
  const filledLine = filledCoords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const filledArea = filledLine + ` L${filledCoords[filledCoords.length - 1][0]},${h - pad} L${pad},${h - pad} Z`;
  const marker = coords[cutoffIdx];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48" preserveAspectRatio="none">
      <defs>
        <linearGradient id="curve-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="curve-fill-dim" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={pad} x2={w - pad} y1={pad + (h - pad * 2) * g} y2={pad + (h - pad * 2) * g} stroke="currentColor" strokeOpacity="0.06" />
      ))}
      <path d={area} fill="url(#curve-fill-dim)" />
      <path d={line} fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d={filledArea} fill="url(#curve-fill)" />
      <path d={filledLine} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1={marker[0]} x2={marker[0]} y1={pad} y2={h - pad} stroke="var(--primary)" strokeOpacity="0.4" strokeDasharray="2 3" />
      <circle cx={marker[0]} cy={marker[1]} r="5" fill="var(--primary)" />
      <circle cx={marker[0]} cy={marker[1]} r="10" fill="var(--primary)" fillOpacity="0.2" />
    </svg>
  );
}
