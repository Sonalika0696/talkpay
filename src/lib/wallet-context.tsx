import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface WalletUser {
  id: string;
  name: string;
  handle: string; // @walletid e.g. @aarav
  phone: string;
  avatar: string;
  isFavorite: boolean;
}

export interface WalletTxn {
  id: string;
  kind: "topup" | "send" | "receive";
  amount: number;
  counterparty?: string; // wallet handle or "Card top-up"
  timestamp: Date;
  method?: "voice" | "text" | "card" | "upi" | "netbanking";
  voiceCommand?: string;
  status: "completed" | "pending" | "failed";
}

interface WalletContextType {
  balance: number;
  contacts: WalletUser[];
  transactions: WalletTxn[];
  addMoney: (amount: number, source: "card" | "upi" | "netbanking") => WalletTxn;
  sendMoney: (handle: string, amount: number, opts?: { method?: "voice" | "text"; voiceCommand?: string }) => { ok: boolean; error?: string; txn?: WalletTxn };
  addContact: (c: Omit<WalletUser, "id" | "isFavorite" | "avatar"> & { avatar?: string }) => void;
  removeContact: (id: string) => void;
  toggleFavorite: (id: string) => void;
  findByName: (name: string) => WalletUser | undefined;
}

const WalletContext = createContext<WalletContextType | null>(null);

const initialContacts: WalletUser[] = [
  { id: "c1", name: "Aarav Sharma", handle: "@aarav", phone: "+91 98765 43210", avatar: "A", isFavorite: true },
  { id: "c2", name: "Priya Iyer", handle: "@priya", phone: "+91 99876 54321", avatar: "P", isFavorite: true },
  { id: "c3", name: "Rahul Verma", handle: "@rahul", phone: "+91 91234 56789", avatar: "R", isFavorite: false },
  { id: "c4", name: "Ananya Nair", handle: "@ananya", phone: "+91 90123 45678", avatar: "A", isFavorite: false },
  { id: "c5", name: "Vikram Singh", handle: "@vikram", phone: "+91 93456 78901", avatar: "V", isFavorite: false },
  { id: "c6", name: "Kavya Reddy", handle: "@kavya", phone: "+91 94567 89012", avatar: "K", isFavorite: false },
];

const initialTxns: WalletTxn[] = [
  { id: "t1", kind: "topup", amount: 5000, counterparty: "Card top-up", timestamp: new Date(Date.now() - 86400000 * 2), method: "card", status: "completed" },
  { id: "t2", kind: "send", amount: 200, counterparty: "@aarav", timestamp: new Date(Date.now() - 86400000), method: "voice", voiceCommand: "Send 200 INR to Aarav", status: "completed" },
  { id: "t3", kind: "send", amount: 500, counterparty: "@priya", timestamp: new Date(Date.now() - 3600000 * 5), method: "text", status: "completed" },
];

function id() { return "TXN-" + Math.random().toString(36).substring(2, 10).toUpperCase(); }

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(5000);
  const [contacts, setContacts] = useState<WalletUser[]>(initialContacts);
  const [transactions, setTransactions] = useState<WalletTxn[]>(initialTxns);

  const addMoney = useCallback((amount: number, source: "card" | "upi" | "netbanking") => {
    const txn: WalletTxn = {
      id: id(),
      kind: "topup",
      amount,
      counterparty: source === "card" ? "Card top-up" : source === "upi" ? "UPI top-up" : "Netbanking top-up",
      timestamp: new Date(),
      method: source,
      status: "completed",
    };
    setBalance((b) => b + amount);
    setTransactions((t) => [txn, ...t]);
    return txn;
  }, []);

  const findByName = useCallback((name: string) => {
    const q = name.trim().toLowerCase().replace(/^@/, "");
    return contacts.find((c) =>
      c.handle.toLowerCase().replace("@", "") === q ||
      c.name.toLowerCase().split(" ")[0] === q ||
      c.name.toLowerCase() === q
    );
  }, [contacts]);

  const sendMoney = useCallback<WalletContextType["sendMoney"]>((handle, amount, opts) => {
    const target = findByName(handle);
    if (!target) return { ok: false, error: "Recipient is not a TalkPay wallet user" };
    if (amount <= 0) return { ok: false, error: "Amount must be greater than zero" };
    if (amount > balance) return { ok: false, error: "Insufficient wallet balance. Add money to continue." };
    const txn: WalletTxn = {
      id: id(),
      kind: "send",
      amount,
      counterparty: target.handle,
      timestamp: new Date(),
      method: opts?.method ?? "text",
      voiceCommand: opts?.voiceCommand,
      status: "completed",
    };
    setBalance((b) => b - amount);
    setTransactions((t) => [txn, ...t]);
    return { ok: true, txn };
  }, [balance, findByName]);

  const addContact: WalletContextType["addContact"] = (c) => {
    setContacts((prev) => [
      ...prev,
      { id: "c" + Date.now(), name: c.name, handle: c.handle.startsWith("@") ? c.handle : "@" + c.handle, phone: c.phone, avatar: c.avatar ?? c.name[0]?.toUpperCase() ?? "?", isFavorite: false },
    ]);
  };

  const removeContact = (id: string) => setContacts((p) => p.filter((c) => c.id !== id));
  const toggleFavorite = (id: string) => setContacts((p) => p.map((c) => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));

  return (
    <WalletContext.Provider value={{ balance, contacts, transactions, addMoney, sendMoney, addContact, removeContact, toggleFavorite, findByName }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be inside WalletProvider");
  return ctx;
};
