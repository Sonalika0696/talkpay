import { motion } from "framer-motion";
import { useWallet } from "@/lib/wallet-context";
import { format } from "date-fns";
import { ArrowLeft, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function History() {
  const navigate = useNavigate();
  const { transactions } = useWallet();

  return (
    <div className="min-h-screen pb-20 p-4 max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-3 py-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">Wallet History</h2>
      </div>

      <div className="space-y-2">
        {transactions.map((tx, i) => {
          const isCredit = tx.kind === "topup" || tx.kind === "receive";
          return (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isCredit ? "bg-success/15 text-success" : "bg-secondary text-primary"}`}>
                  {isCredit ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{tx.counterparty || "Wallet"}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{tx.id}</p>
                  <p className="text-[10px] text-muted-foreground">{format(tx.timestamp, "MMM d, yyyy · h:mm a")}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${isCredit ? "text-success" : ""}`}>
                  {isCredit ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-success/10 text-success">
                  {tx.kind === "topup" ? "Top-up" : tx.kind === "send" ? "Sent" : "Received"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
