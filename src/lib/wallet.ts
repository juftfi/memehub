import { useEffect, useState, useCallback } from "react";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const STORAGE_KEY = "ponhub_wallet_address";
// Fictional Robinhood Chain params. Real chain will replace these later.
const ROBINHUD_CHAIN = {
  chainId: "0x52424844", // "RBHD" — placeholder
  chainName: "Robinhood Chain",
  nativeCurrency: { name: "Robinhood", symbol: "RBH", decimals: 18 },
  rpcUrls: ["https://rpc.robinhud.example"],
  blockExplorerUrls: ["https://explorer.robinhud.example"],
};

type State = {
  address: string | null;
  connecting: boolean;
  error: string | null;
};

const listeners = new Set<(s: State) => void>();
let state: State = { address: null, connecting: false, error: null };

function setState(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l(state));
}

export function shortAddress(addr: string | null | undefined) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function useWallet() {
  const [snapshot, setSnapshot] = useState(state);

  useEffect(() => {
    listeners.add(setSnapshot);
    return () => {
      listeners.delete(setSnapshot);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const eth = window.ethereum;
    if (!eth) return;

    // Restore session if the wallet still exposes the account.
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      eth
        .request({ method: "eth_accounts" })
        .then((res) => {
          const accounts = res as string[];
          if (accounts && accounts.length > 0) {
            setState({ address: accounts[0] });
          } else {
            window.localStorage.removeItem(STORAGE_KEY);
          }
        })
        .catch(() => {});
    }

    const handleAccounts = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (!accounts || accounts.length === 0) {
        window.localStorage.removeItem(STORAGE_KEY);
        setState({ address: null });
      } else {
        window.localStorage.setItem(STORAGE_KEY, accounts[0]);
        setState({ address: accounts[0] });
      }
    };

    eth.on?.("accountsChanged", handleAccounts);
    return () => {
      eth.removeListener?.("accountsChanged", handleAccounts);
    };
  }, []);

  const connect = useCallback(async () => {
    if (typeof window === "undefined") return;
    const eth = window.ethereum;
    if (!eth) {
      setState({
        error:
          "No browser wallet detected. Install MetaMask or another EVM wallet to continue.",
      });
      return;
    }
    setState({ connecting: true, error: null });
    try {
      const res = (await eth.request({ method: "eth_requestAccounts" })) as string[];
      const addr = res?.[0] ?? null;
      if (addr) {
        window.localStorage.setItem(STORAGE_KEY, addr);
        setState({ address: addr, connecting: false });
        // Best-effort: prompt user to add Robinhood Chain. Ignore failures.
        try {
          await eth.request({
            method: "wallet_addEthereumChain",
            params: [ROBINHUD_CHAIN],
          });
        } catch {
          /* user declined or already added */
        }
      } else {
        setState({ connecting: false, error: "No account returned." });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to connect wallet.";
      setState({ connecting: false, error: msg });
    }
  }, []);

  const disconnect = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setState({ address: null, error: null });
  }, []);

  return {
    address: snapshot.address,
    connecting: snapshot.connecting,
    error: snapshot.error,
    connect,
    disconnect,
    isConnected: Boolean(snapshot.address),
  };
}
