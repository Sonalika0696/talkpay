import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useWallet } from "@/lib/wallet-context";
import { motion } from "framer-motion";
import { Mic, Keyboard, LogOut, Plus, ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { balance, transactions, contacts } = useWallet();
  const navigate = useNavigate();
  const recent = transactions.slice(0, 4);

  return (
    <div className="min-h-screen pb-20 p-4 max-w-lg mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs text-muted-foreground">Welcome back</p>
          <h2 className="text-lg font-semibold">{user?.name || "User"}</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground">
          <LogOut className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Wallet Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6 glow-primary gradient-border space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">TalkPay Wallet</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/15 text-success font-medium">Active</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="text-gradient-primary">₹{balance.toLocaleString("en-IN")}</span>
        </h1>
        <Button onClick={() => navigate("/add-money")} className="w-full gap-2 h-11">
          <Plus className="h-4 w-4" /> Add Money to Wallet
        </Button>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3"
      >
        <button
          onClick={() => navigate("/pay")}
          className="glass p-5 flex flex-col items-center gap-3 hover:border-primary/50 transition-colors group"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Mic className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-medium">Voice Send</span>
        </button>
        <button
          onClick={() => navigate("/pay")}
          className="glass p-5 flex flex-col items-center gap-3 hover:border-accent/50 transition-colors group"
        >
          <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <Keyboard className="h-5 w-5 text-accent" />
          </div>
          <span className="text-sm font-medium">Text Send</span>
        </button>
      </motion.div>

      {/* Wallet contacts row */}
      {contacts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Send to wallet user</h3>
            <button onClick={() => navigate("/accounts")} className="text-xs text-primary font-medium">Manage</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
            {contacts.slice(0, 8).map((c) => (
              <button
                key={c.id}
                onClick={() => navigate("/pay", { state: { presetHandle: c.handle } })}
                className="flex flex-col items-center gap-1 shrink-0"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                  {c.avatar}
                </div>
                <span className="text-[10px] text-muted-foreground">{c.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Wallet Activity</h3>
          <button onClick={() => navigate("/history")} className="text-xs text-primary font-medium flex items-center gap-1">
            View all <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
        <div className="space-y-2">
          {recent.map((tx) => {
            const isCredit = tx.kind === "topup" || tx.kind === "receive";
            return (
              <div key={tx.id} className="glass p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center ${isCredit ? "bg-success/15 text-success" : "bg-secondary text-primary"}`}>
                    {isCredit ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.counterparty || "Wallet"}</p>
                    <p className="text-[10px] text-muted-foreground">{format(tx.timestamp, "MMM d, h:mm a")}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${isCredit ? "text-success" : ""}`}>
                    {isCredit ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{tx.kind === "topup" ? "Top-up" : tx.kind === "send" ? "Sent" : "Received"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
