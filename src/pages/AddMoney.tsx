import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CreditCard, Smartphone, Building2, Check, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/lib/wallet-context";

type Source = "card" | "upi" | "netbanking";
type Stage = "form" | "processing" | "success";

const sources: { id: Source; label: string; icon: typeof CreditCard; desc: string }[] = [
  { id: "card", label: "Debit / Credit Card", icon: CreditCard, desc: "Visa, Mastercard, RuPay" },
  { id: "upi", label: "UPI", icon: Smartphone, desc: "GPay, PhonePe, Paytm, BHIM" },
  { id: "netbanking", label: "Netbanking", icon: Building2, desc: "All major Indian banks" },
];

const QUICK = [500, 1000, 2000, 5000];

export default function AddMoney() {
  const navigate = useNavigate();
  const { balance, addMoney } = useWallet();
  const [source, setSource] = useState<Source>("upi");
  const [amount, setAmount] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [creditedAmount, setCreditedAmount] = useState(0);

  const numericAmount = parseInt(amount || "0", 10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount < 1) return;
    setStage("processing");
    setTimeout(() => {
      addMoney(numericAmount, source);
      setCreditedAmount(numericAmount);
      setStage("success");
    }, 1400);
  };

  return (
    <div className="min-h-screen pb-20 p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 py-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">Add Money to Wallet</h2>
      </div>

      <AnimatePresence mode="wait">
        {stage === "form" && (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="glass p-5 gradient-border">
              <p className="text-xs text-muted-foreground">Wallet Balance</p>
              <p className="text-2xl font-bold text-gradient-primary">INR {balance.toLocaleString()}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium">Enter amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">₹</span>
                <Input
                  type="tel"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="0"
                  className="pl-9 h-14 text-2xl font-bold bg-secondary border-glass-border"
                />
              </div>
              <div className="flex gap-2 pt-1">
                {QUICK.map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setAmount(String(v))}
                    className="flex-1 text-xs py-2 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                  >
                    ₹{v.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium">Payment source</label>
              <div className="space-y-2">
                {sources.map((s) => {
                  const active = source === s.id;
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setSource(s.id)}
                      className={`w-full glass p-4 flex items-center gap-3 transition-colors text-left ${
                        active ? "border-primary/60 glow-primary" : "hover:border-primary/30"
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${active ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                        <s.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{s.label}</p>
                        <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                      </div>
                      {active && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              disabled={numericAmount < 1}
              className="w-full h-12 text-base font-semibold glow-primary"
            >
              Add ₹{numericAmount.toLocaleString() || "0"} to Wallet
            </Button>
          </motion.form>
        )}

        {stage === "processing" && (
          <motion.div key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass p-8 text-center space-y-4">
            <div className="h-16 w-16 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Securely processing your top-up…</p>
          </motion.div>
        )}

        {stage === "success" && (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="glass p-8 text-center space-y-4 glow-success">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center mx-auto"
              >
                <Wallet className="h-10 w-10 text-success" />
              </motion.div>
              <div>
                <p className="text-sm text-muted-foreground">Money Added</p>
                <p className="text-3xl font-bold mt-1">+ ₹{creditedAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-2">New balance: ₹{balance.toLocaleString()}</p>
              </div>
            </div>
            <Button onClick={() => navigate("/")} className="w-full">Back to Wallet</Button>
            <Button
              variant="ghost"
              onClick={() => { setStage("form"); setAmount(""); }}
              className="w-full text-muted-foreground"
            >
              Add more
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
