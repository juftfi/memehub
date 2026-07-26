import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import logo from "@/assets/MemeHub-logo.png.asset.json";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { useWallet, shortAddress } from "@/lib/wallet";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MemeHub — Launch tokens on BSC Chain" },
      {
        name: "description",
        content:
          "MemeHub is the community launchpad for fair-launch tokens on the BSC Chain. Discover, trade, and launch memes and micro-caps.",
      },
      { property: "og:title", content: "MemeHub — Launch tokens on BSC Chain" },
      {
        property: "og:description",
        content:
          "MemeHub is the community launchpad for fair-launch tokens on the BSC Chain. Discover, trade, and launch memes and micro-caps.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

type Trade = { side: "BUY" | "SELL"; token: string; amount: string; ticker: string };
const trades: Trade[] = [
  { side: "SELL", token: "PON", amount: "0.00686", ticker: "MemeHub.pon" },
  { side: "BUY", token: "PON", amount: "0.00701", ticker: "MemeHub.pon" },
  { side: "BUY", token: "MOO", amount: "0.0142", ticker: "MemeHub.moo" },
  { side: "SELL", token: "ZAP", amount: "0.0098", ticker: "MemeHub.zap" },
  { side: "BUY", token: "GLD", amount: "0.012", ticker: "MemeHub.gld" },
  { side: "SELL", token: "FRG", amount: "0.00186", ticker: "MemeHub.frg" },
  { side: "BUY", token: "OWL", amount: "0.0001", ticker: "MemeHub.owl" },
  { side: "SELL", token: "HAX", amount: "0.0043", ticker: "MemeHub.hax" },
];

type Token = {
  symbol: string;
  name: string;
  hue: number;
  price: string;
  change: number;
  mcap: string;
  age: string;
  holders: number;
  bonding: number;
};

const tokens: Token[] = [
  {
    symbol: "PON",
    name: "MemeHub",
    hue: 45,
    price: "0.00701",
    change: 12.4,
    mcap: "$221K",
    age: "3d",
    holders: 1420,
    bonding: 68,
  },
  {
    symbol: "TRT",
    name: "Trotter",
    hue: 260,
    price: "0.00042",
    change: -3.1,
    mcap: "$18K",
    age: "12h",
    holders: 214,
    bonding: 22,
  },
  {
    symbol: "SDL",
    name: "Saddle",
    hue: 30,
    price: "0.02198",
    change: 42.6,
    mcap: "$412K",
    age: "6d",
    holders: 3110,
    bonding: 92,
  },
  {
    symbol: "REN",
    name: "Reinhold",
    hue: 300,
    price: "0.00088",
    change: 8.2,
    mcap: "$41K",
    age: "1d",
    holders: 512,
    bonding: 34,
  },
  {
    symbol: "TSK",
    name: "Tuskeg",
    hue: 170,
    price: "0.00519",
    change: -12.7,
    mcap: "$88K",
    age: "4d",
    holders: 902,
    bonding: 55,
  },
  {
    symbol: "MNE",
    name: "Mane",
    hue: 15,
    price: "0.00012",
    change: 4.4,
    mcap: "$6K",
    age: "3h",
    holders: 88,
    bonding: 9,
  },
  {
    symbol: "HFY",
    name: "Hayfy",
    hue: 90,
    price: "0.00776",
    change: 21.1,
    mcap: "$154K",
    age: "5d",
    holders: 1780,
    bonding: 74,
  },
  {
    symbol: "BRD",
    name: "Bridle",
    hue: 200,
    price: "0.00234",
    change: -1.9,
    mcap: "$29K",
    age: "2d",
    holders: 340,
    bonding: 41,
  },
  {
    symbol: "STL",
    name: "Stallar",
    hue: 340,
    price: "0.01123",
    change: 33.8,
    mcap: "$276K",
    age: "7d",
    holders: 2210,
    bonding: 85,
  },
  {
    symbol: "GLP",
    name: "Gallop",
    hue: 55,
    price: "0.00061",
    change: -6.5,
    mcap: "$12K",
    age: "9h",
    holders: 141,
    bonding: 17,
  },
  {
    symbol: "OTT",
    name: "Trotcoin",
    hue: 120,
    price: "0.00889",
    change: 15.6,
    mcap: "$132K",
    age: "5d",
    holders: 1210,
    bonding: 63,
  },
  {
    symbol: "PNY",
    name: "Ponee",
    hue: 320,
    price: "0.00019",
    change: 2.2,
    mcap: "$4K",
    age: "1h",
    holders: 42,
    bonding: 6,
  },
];

const filters = ["All", "Trending", "New", "Top"] as const;

function Index() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Trending");
  const filtered = useMemo(() => {
    if (filter === "New") return [...tokens].sort((a, b) => a.holders - b.holders);
    if (filter === "Top") return [...tokens].sort((a, b) => b.holders - a.holders);
    if (filter === "Trending") return [...tokens].sort((a, b) => b.change - a.change);
    return tokens;
  }, [filter]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Ticker */}
      <div className="border-b border-border overflow-hidden bg-card/50">
        <div className="flex whitespace-nowrap animate-ticker py-2 font-mono text-xs">
          {[...trades, ...trades, ...trades, ...trades].map((t, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-2">
              <span className={t.side === "BUY" ? "text-[color:var(--buy)]" : "text-[color:var(--sell)]"}>
                {t.side}
              </span>
              <span className="text-primary">${t.token}</span>
              <span className="text-muted-foreground">{t.amount} RBH</span>
              <span className="text-muted-foreground/60">{t.ticker}</span>
              <span className="text-border">•</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border min-h-[calc(100vh-40px)] p-5 gap-6">
          <div className="flex items-center gap-2">
            <img src={logo.url} alt="MemeHub" className="h-8 w-auto" />
          </div>
          <div className="rounded-md border border-border bg-card px-3 py-2 text-xs font-mono text-muted-foreground">
            <span className="text-primary">◆</span> BSC Chain
            <div className="text-[10px] mt-0.5 text-muted-foreground/70">Block #4,281,004</div>
          </div>
          <nav className="flex flex-col gap-1 text-sm">
            <SidebarLink label="Search" active />
            <SidebarLink label="Trending" />
            <SidebarLink label="Your Wallet" />
            <SidebarLink label="Portfolio" />
            <SidebarLink label="Docs" />
          </nav>

          <div className="mt-2 rounded-md border border-border bg-card p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <Stat label="Live" value="143" />
              <Stat label="Traded" value="52" />
            </div>
            <div className="mt-4 text-center">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">24h volume</div>
              <div className="mt-1 font-mono text-lg text-primary">$221.31k</div>
            </div>
          </div>

          <WalletCard />

          <div className="mt-auto rounded-md border border-border bg-card p-4">
            <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px] mb-2">
              <div className="text-muted-foreground">1H</div>
              <div className="text-muted-foreground">1D</div>
              <div className="text-primary">7D</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">HUD/RBH</div>
              <div className="font-mono text-lg">0.00701</div>
              <div className="text-xs text-[color:var(--buy)]">+12.40% 7d</div>
            </div>
            <button className="mt-3 w-full rounded bg-primary text-primary-foreground text-xs font-medium py-1.5">
              Buy PON
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* top bar */}
          <div className="flex items-center gap-3 border-b border-border px-6 py-3 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--buy)] animate-pulse" />
              All systems normal
            </div>
            <span className="text-muted-foreground/50">•</span>
            <span className="text-primary font-mono">BSC Mainnet</span>
            <div className="ml-auto flex items-center gap-2">
              <button className="rounded border border-border px-3 py-1.5 hover:bg-card">Docs</button>
              <ConnectWalletButton />
              <button className="rounded bg-primary text-primary-foreground px-3 py-1.5 font-medium">
                Launch a token
              </button>
            </div>
          </div>

          <div className="flex">
            <div className="flex-1 min-w-0 p-6">
              {/* Hero */}
              <div className="rounded-xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <img
                    src={logo.url}
                    alt="MemeHub"
                    className="h-16 md:h-20 w-auto drop-shadow-[0_0_25px_rgba(200,180,120,0.25)]"
                  />
                  <div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                      Fair-launch tokens on <span className="text-primary">BSC Chain</span>
                    </h1>
                    <p className="mt-1.5 text-sm text-muted-foreground max-w-xl">
                      MemeHub is the community launchpad for micro-caps and memes. No presales, no team allocations —
                      every token bonds through a transparent curve.
                    </p>
                  </div>
                  <div className="md:ml-auto flex flex-col sm:flex-row gap-2">
                    <a
                      href="https://four.meme/en/token/0x9fcf422b1810357ac1b7aa4cc554f699bafc4444"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md bg-[color:var(--buy)] text-primary-foreground px-5 py-2.5 font-medium whitespace-nowrap text-center"
                    >
                      BUY $HUB
                    </a>
                    <button className="rounded-md bg-primary text-primary-foreground px-5 py-2.5 font-medium whitespace-nowrap">
                      Launch a token →
                    </button>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm">
                  <span className="text-muted-foreground">⌕</span>
                  <input
                    placeholder="Search token name, ticker, or contract"
                    className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground/60"
                  />
                  <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                    /
                  </kbd>
                </div>
                <button className="rounded-md border border-border bg-card px-3 py-2 text-xs font-mono">
                  Bonding &lt; 100%
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1 mb-5">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={
                      "px-3 py-1.5 rounded-md text-xs font-medium transition-colors " +
                      (filter === f
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : "text-muted-foreground border border-transparent hover:text-foreground")
                    }
                  >
                    {f}
                  </button>
                ))}
                <div className="ml-auto text-xs text-muted-foreground font-mono">{filtered.length} tokens</div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filtered.map((t) => (
                  <TokenCard key={t.symbol} t={t} />
                ))}
              </div>
            </div>

            {/* Activity */}
            <aside className="hidden xl:block w-80 shrink-0 border-l border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Recent trades</h3>
                <span className="text-[10px] font-mono text-[color:var(--buy)]">● LIVE</span>
              </div>
              <div className="flex flex-col gap-1">
                {Array.from({ length: 14 }).map((_, i) => {
                  const t = trades[i % trades.length];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-card font-mono text-xs"
                    >
                      <span
                        className={
                          "text-[10px] font-semibold w-9 " +
                          (t.side === "BUY" ? "text-[color:var(--buy)]" : "text-[color:var(--sell)]")
                        }
                      >
                        {t.side}
                      </span>
                      <span className="text-primary">${t.token}</span>
                      <span className="text-muted-foreground ml-auto">{t.amount}</span>
                      <span className="text-muted-foreground/60 text-[10px]">RBH</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-md border border-border bg-card p-4">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Chain stats</div>
                <Row k="TPS" v="1,842" />
                <Row k="Gas" v="0.0001 RBH" />
                <Row k="Validators" v="128" />
                <Row k="Total tokens" v="4,290" />
              </div>
            </aside>
          </div>

          <footer className="border-t border-border px-6 py-6 text-xs text-muted-foreground flex flex-wrap gap-x-6 gap-y-2 items-center">
            <img src={logo.url} alt="MemeHub" className="h-5 w-auto" />
            <span>Running on BSC Chain</span>
            <div className="ml-auto flex items-center gap-3">
              <a
                href="https://x.com/MemeHub_art"
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground hover:border-primary/50"
              >
                Twitter
              </a>
              <a
                href="https://t.me/MemeHub_art"
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground hover:border-primary/50"
              >
                Telegram
              </a>
              <span className="font-mono">Not affiliated with BSC Markets, Inc.</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={
        "flex items-center gap-2 rounded-md px-3 py-2 text-left transition-colors " +
        (active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-card")
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </button>
  );
}

function WalletCard() {
  const { address, isConnected, connect, connecting } = useWallet();
  if (!isConnected) {
    return (
      <button
        onClick={connect}
        disabled={connecting}
        className="rounded-md border border-primary/30 bg-primary/5 hover:bg-primary/10 p-3 flex items-center gap-2 text-left disabled:opacity-60"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-[color:var(--buy)] flex items-center justify-center text-xs font-mono text-primary-foreground">
          ◆
        </div>
        <div className="text-xs">
          <div className="font-medium text-primary">{connecting ? "Connecting…" : "Connect wallet"}</div>
          <div className="text-muted-foreground text-[10px]">MetaMask · Injected EVM</div>
        </div>
      </button>
    );
  }
  return (
    <div className="rounded-md border border-border bg-card p-3 flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-[color:var(--buy)]" />
      <div className="text-xs min-w-0">
        <div className="font-mono truncate">{shortAddress(address)}</div>
        <div className="text-muted-foreground text-[10px]">BSC Chain</div>
      </div>
      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[color:var(--buy)] shrink-0" />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-mono text-xl mt-0.5">{value}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-xs font-mono">
      <span className="text-muted-foreground">{k}</span>
      <span>{v}</span>
    </div>
  );
}

function TokenCard({ t }: { t: Token }) {
  const bg = `linear-gradient(135deg, oklch(0.65 0.18 ${t.hue}), oklch(0.35 0.12 ${(t.hue + 60) % 360}))`;
  const positive = t.change >= 0;
  return (
    <Link
      to="/token/$symbol"
      params={{ symbol: t.symbol }}
      className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors cursor-pointer block"
    >
      <div className="relative aspect-square" style={{ background: bg }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono font-bold text-4xl text-white/90 drop-shadow-lg">{t.symbol.slice(0, 2)}</span>
        </div>
        <div className="absolute top-2 right-2 rounded-full bg-black/40 backdrop-blur px-2 py-0.5 text-[10px] font-mono text-white">
          {t.age}
        </div>
        <div className="absolute bottom-2 left-2 rounded-full bg-black/40 backdrop-blur px-2 py-0.5 text-[10px] font-mono text-white">
          ◆ RBH
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">${t.symbol}</div>
            <div className="text-[11px] text-muted-foreground">{t.name}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono">{t.price}</div>
            <div
              className={"text-[11px] font-mono " + (positive ? "text-[color:var(--buy)]" : "text-[color:var(--sell)]")}
            >
              {positive ? "+" : ""}
              {t.change.toFixed(1)}%
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1">
            <span>bonding</span>
            <span>{t.bonding}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-[color:var(--buy)]"
              style={{ width: `${t.bonding}%` }}
            />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span>MC {t.mcap}</span>
          <span>{t.holders} holders</span>
        </div>
      </div>
    </Link>
  );
}
