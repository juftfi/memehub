import { useState } from "react";
import { useWallet, shortAddress } from "@/lib/wallet";

export function ConnectWalletButton({ compact = false }: { compact?: boolean }) {
  const { address, connecting, connect, disconnect, error, isConnected } = useWallet();
  const [open, setOpen] = useState(false);

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded border border-primary/40 bg-primary/10 text-primary px-3 py-1.5 text-xs font-mono flex items-center gap-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--buy)]" />
          {shortAddress(address)}
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute right-0 mt-2 w-56 z-50 rounded-md border border-border bg-card shadow-xl p-3 text-xs">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Connected</div>
              <div className="font-mono mt-1 break-all">{address}</div>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(address);
                }}
                className="mt-3 w-full rounded border border-border py-1.5 hover:bg-muted"
              >
                Copy address
              </button>
              <button
                onClick={() => {
                  disconnect();
                  setOpen(false);
                }}
                className="mt-1.5 w-full rounded bg-[color:var(--sell)]/20 text-[color:var(--sell)] py-1.5"
              >
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={connect}
        disabled={connecting}
        className="rounded border border-primary/40 bg-primary/10 text-primary px-3 py-1.5 text-xs disabled:opacity-60"
      >
        ◆ {connecting ? "Connecting…" : compact ? "Connect" : "Connect wallet"}
      </button>
      {error && (
        <div className="absolute right-0 mt-2 w-64 z-50 rounded-md border border-[color:var(--sell)]/40 bg-card p-3 text-[11px] text-[color:var(--sell)]">
          {error}
        </div>
      )}
    </div>
  );
}
