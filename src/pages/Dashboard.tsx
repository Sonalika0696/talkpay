import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { mockTransactions } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Mic, Keyboard, LogOut, TrendingUp, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const recent = mockTransactions.slice(0, 3);

  return (
    <div className="min-h-screen pb-20 p-4 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs text-muted-foreground">Welcome back</p>
          <h2 className="text-lg font-semibold">{user?.name || "User"}</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground">
          <LogOut className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6 glow-primary gradient-border"
      >
        <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="text-gradient-primary">AED 5,000</span>
        </h1>
        <div className="flex items-center gap-1 mt-2 text-success text-xs font-medium">
          <TrendingUp className="h-3 w-3" />
          <span>+12.5% this month</span>
        </div>
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
          <span className="text-sm font-medium">Voice Payment</span>
        </button>
        <button
          onClick={() => navigate("/pay")}
          className="glass p-5 flex flex-col items-center gap-3 hover:border-accent/50 transition-colors group"
        >
          <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <Keyboard className="h-5 w-5 text-accent" />
          </div>
          <span className="text-sm font-medium">Text Payment</span>
        </button>
      </motion.div>

      {/* Recent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Recent Transactions</h3>
          <button onClick={() => navigate("/history")} className="text-xs text-primary font-medium flex items-center gap-1">
            View all <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
        <div className="space-y-2">
          {recent.map((tx) => (
            <div key={tx.id} className="glass p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold text-primary">
                  {tx.recipient[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{tx.recipient}</p>
                  <p className="text-[10px] text-muted-foreground">{format(tx.timestamp, "MMM d, h:mm a")}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">-{tx.amount} {tx.currency}</p>
                <p className={`text-[10px] font-medium ${tx.status === "completed" ? "text-success" : tx.status === "pending" ? "text-warning" : "text-destructive"}`}>
                  {tx.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
