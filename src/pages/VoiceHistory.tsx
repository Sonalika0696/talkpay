import { motion } from "framer-motion";
import { useWallet } from "@/lib/wallet-context";
import { format } from "date-fns";
import { ArrowLeft, Mic, RotateCcw, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function VoiceHistory() {
  const navigate = useNavigate();
  const { transactions } = useWallet();
  const voiceTransactions = transactions.filter((tx) => tx.method === "voice" && tx.kind === "send");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleRepeat = (tx: (typeof voiceTransactions)[0]) => {
    const recipient = (tx.counterparty || "").replace("@", "");
    navigate("/pay", { state: { repeatCommand: tx.voiceCommand || `Send ${tx.amount} INR to ${recipient}` } });
  };

  return (
    <div className="min-h-screen pb-20 p-4 max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-3 py-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Mic className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold">Voice History</h2>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {voiceTransactions.length} voice-initiated transfer{voiceTransactions.length !== 1 && "s"}
      </p>

      <div className="space-y-2">
        {voiceTransactions.length === 0 && (
          <div className="glass p-8 text-center text-sm text-muted-foreground">
            No voice transfers yet. Use the mic on the Pay screen to send money.
          </div>
        )}
        {voiceTransactions.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mic className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{tx.counterparty}</p>
                  <p className="text-[10px] text-muted-foreground">{format(tx.timestamp, "MMM d, yyyy · h:mm a")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold">₹{tx.amount.toLocaleString("en-IN")}</p>
                  <span className="text-[10px] font-medium text-success">{tx.status}</span>
                </div>
                <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expandedId === tx.id ? "rotate-90" : ""}`} />
              </div>
            </button>

            {expandedId === tx.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-glass-border"
              >
                <div className="p-4 space-y-3">
                  {tx.voiceCommand && (
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground mb-1 font-medium">Voice Command</p>
                      <p className="text-xs font-mono text-primary">"{tx.voiceCommand}"</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground text-[10px]">Transaction ID</p>
                      <p className="font-mono">{tx.id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px]">Method</p>
                      <p className="capitalize">{tx.method}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRepeat(tx)}
                    variant="outline"
                    className="w-full text-xs h-9 gap-2 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Repeat Transfer
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
