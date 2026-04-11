import { motion } from "framer-motion";
import { mockTransactions } from "@/lib/mock-data";
import { format } from "date-fns";
import { ArrowLeft, Mic, RotateCcw, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function VoiceHistory() {
  const navigate = useNavigate();
  const voiceTransactions = mockTransactions.filter((tx) => tx.method === "voice");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleRepeat = (tx: (typeof voiceTransactions)[0]) => {
    navigate("/pay", { state: { repeatCommand: tx.voiceCommand || `Send ${tx.amount} ${tx.currency} to ${tx.recipient}` } });
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
                  <p className="text-sm font-medium">{tx.recipient}</p>
                  <p className="text-[10px] text-muted-foreground">{format(tx.timestamp, "MMM d, yyyy · h:mm a")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold">{tx.amount} {tx.currency}</p>
                  <span className={`text-[10px] font-medium ${tx.status === "completed" ? "text-success" : tx.status === "pending" ? "text-warning" : "text-destructive"}`}>
                    {tx.status}
                  </span>
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
                    Repeat Payment
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
