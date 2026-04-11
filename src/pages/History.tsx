import { motion } from "framer-motion";
import { mockTransactions } from "@/lib/mock-data";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function History() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20 p-4 max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-3 py-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">Transaction History</h2>
      </div>

      <div className="space-y-2">
        {mockTransactions.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold text-primary">
                {tx.recipient[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{tx.recipient}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{tx.id}</p>
                <p className="text-[10px] text-muted-foreground">{format(tx.timestamp, "MMM d, yyyy · h:mm a")}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">-{tx.amount} {tx.currency}</p>
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  tx.status === "completed"
                    ? "bg-success/10 text-success"
                    : tx.status === "pending"
                    ? "bg-warning/10 text-warning"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {tx.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
