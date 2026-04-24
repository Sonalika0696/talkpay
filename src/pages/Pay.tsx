import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, ArrowLeft, Check, Copy, AlertCircle, Wallet } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProcessingStep } from "@/components/ProcessingStep";
import { VoiceWaveform } from "@/components/VoiceWaveform";
import { useWallet } from "@/lib/wallet-context";
import { format } from "date-fns";

type Stage = "input" | "processing" | "confirm" | "success" | "error";

interface ParsedCommand {
  intent: string;
  amount: number;
  currency: string;
  recipient: string; // raw text from user
}

const STEPS = [
  "Understanding intent…",
  "Extracting amount…",
  "Looking up wallet user…",
  "Checking wallet balance…",
  "Preparing confirmation…",
];

function parseCommand(input: string): ParsedCommand {
  const amountMatch = input.match(/(\d+)/);
  const amount = amountMatch ? parseInt(amountMatch[1], 10) : 0;
  const toIndex = input.toLowerCase().indexOf("to ");
  let recipient = "";
  if (toIndex !== -1) {
    recipient = input.substring(toIndex + 3).trim().split(/\s/)[0];
  }
  return { intent: "wallet_transfer", amount, currency: "INR", recipient };
}

export default function Pay() {
  const navigate = useNavigate();
  const location = useLocation();
  const { balance, contacts, sendMoney, findByName } = useWallet();

  const [stage, setStage] = useState<Stage>("input");
  const [textInput, setTextInput] = useState("");
  const [parsed, setParsed] = useState<ParsedCommand | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [txId, setTxId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [showTranscription, setShowTranscription] = useState(false);

  useEffect(() => {
    const state = location.state as { repeatCommand?: string; presetHandle?: string } | null;
    if (state?.repeatCommand) setTextInput(state.repeatCommand);
    if (state?.presetHandle) setTextInput(`Send 100 INR to ${state.presetHandle.replace("@", "")}`);
  }, [location.state]);

  const matchedContact = parsed?.recipient ? findByName(parsed.recipient) : undefined;

  const simulateTranscription = useCallback((finalText: string) => {
    setShowTranscription(true);
    setTranscription("");
    const words = finalText.split(" ");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTranscription(words.slice(0, i).join(" "));
      if (i >= words.length) clearInterval(interval);
    }, 200);
  }, []);

  const processCommand = useCallback((input: string) => {
    const result = parseCommand(input);
    setParsed(result);
    setStage("processing");
    setStepIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setStepIndex(current);
      if (current >= STEPS.length) {
        clearInterval(interval);
        setTimeout(() => {
          // Validate
          if (!result.recipient) {
            setErrorMsg("Couldn't identify a recipient. Try: \"Send 200 to Aarav\".");
            setStage("error");
            return;
          }
          const target = findByName(result.recipient);
          if (!target) {
            setErrorMsg(`"${result.recipient}" is not a TalkPay wallet user. You can only send money to wallet users.`);
            setStage("error");
            return;
          }
          if (result.amount <= 0) {
            setErrorMsg("Please specify a valid amount.");
            setStage("error");
            return;
          }
          if (result.amount > balance) {
            setErrorMsg(`Insufficient balance. You have ₹${balance.toLocaleString()} in your wallet.`);
            setStage("error");
            return;
          }
          setStage("confirm");
        }, 500);
      }
    }, 700);
  }, [balance, findByName]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    processCommand(textInput);
  };

  const handleVoicePress = () => {
    setIsRecording(true);
    const fav = contacts.find((c) => c.isFavorite) ?? contacts[0];
    const mockCommand = `Send 200 INR to ${fav.name.split(" ")[0]}`;
    simulateTranscription(mockCommand);
  };

  const handleVoiceRelease = () => {
    setIsRecording(false);
    const fav = contacts.find((c) => c.isFavorite) ?? contacts[0];
    const mockCommand = `Send 200 INR to ${fav.name.split(" ")[0]}`;
    setTimeout(() => {
      processCommand(mockCommand);
      setShowTranscription(false);
    }, 500);
  };

  const handleConfirm = () => {
    if (!parsed) return;
    const result = sendMoney(parsed.recipient, parsed.amount, {
      method: showTranscription || transcription ? "voice" : "text",
      voiceCommand: textInput || undefined,
    });
    if (!result.ok) {
      setErrorMsg(result.error || "Transfer failed");
      setStage("error");
      return;
    }
    setTxId(result.txn!.id);
    setStage("success");
  };

  return (
    <div className="min-h-screen pb-20 p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 py-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => stage === "input" ? navigate("/") : setStage("input")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold flex-1">
          {stage === "input" && "Send from Wallet"}
          {stage === "processing" && "Processing"}
          {stage === "confirm" && "Confirm Transfer"}
          {stage === "success" && "Transfer Complete"}
          {stage === "error" && "Couldn't Send"}
        </h2>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">Balance</p>
          <p className="text-sm font-semibold text-primary">₹{balance.toLocaleString()}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stage === "input" && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {isRecording && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
                {isRecording && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.3, opacity: 0 }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                  />
                )}
                <motion.button
                  onMouseDown={handleVoicePress}
                  onMouseUp={handleVoiceRelease}
                  onTouchStart={handleVoicePress}
                  onTouchEnd={handleVoiceRelease}
                  whileTap={{ scale: 0.95 }}
                  className={`h-28 w-28 rounded-full flex items-center justify-center transition-all relative z-10 ${
                    isRecording ? "bg-primary glow-primary" : "glass border-primary/30 hover:border-primary/60"
                  }`}
                >
                  <Mic className={`h-8 w-8 ${isRecording ? "text-primary-foreground" : "text-primary"}`} />
                </motion.button>
              </div>

              <div className="w-full max-w-[200px]">
                <VoiceWaveform isActive={isRecording} />
              </div>

              <p className="text-xs text-muted-foreground">
                {isRecording ? "Listening…" : "Hold to speak"}
              </p>

              <AnimatePresence>
                {showTranscription && transcription && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="glass p-3 w-full text-center"
                  >
                    <p className="text-[10px] text-muted-foreground mb-1">Transcription</p>
                    <p className="text-sm font-medium text-primary">
                      {transcription}
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block ml-0.5 w-0.5 h-4 bg-primary align-middle"
                      />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or type</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder='e.g. "Send 200 to Aarav"'
                className="bg-secondary border-glass-border flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {/* Quick contacts */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Send to wallet user</p>
              <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
                {contacts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setTextInput(`Send 100 INR to ${c.name.split(" ")[0]}`)}
                    className="flex flex-col items-center gap-1 shrink-0"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      {c.avatar}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{c.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {stage === "processing" && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="glass p-5 space-y-1">
              {STEPS.map((label, i) => (
                <ProcessingStep key={label} label={label} index={i} status={i < stepIndex ? "done" : i === stepIndex ? "active" : "pending"} />
              ))}
            </div>
            {parsed && stepIndex >= 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Parsed Output</p>
                <pre className="text-xs font-mono text-primary bg-secondary/50 p-3 rounded-lg overflow-x-auto">
{JSON.stringify(parsed, null, 2)}
                </pre>
              </motion.div>
            )}
          </motion.div>
        )}

        {stage === "confirm" && parsed && matchedContact && (
          <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="glass p-6 space-y-4 glow-primary gradient-border">
              <div className="flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {matchedContact.avatar}
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Sending to wallet user</p>
                <p className="text-xl font-bold">{matchedContact.name}</p>
                <p className="text-xs text-primary font-mono">{matchedContact.handle}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient-primary">₹{parsed.amount.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Wallet balance after: ₹{(balance - parsed.amount).toLocaleString()}</p>
              </div>
            </div>
            <Button onClick={handleConfirm} className="w-full h-12 text-base font-semibold glow-primary">CONFIRM TRANSFER</Button>
            <Button variant="ghost" onClick={() => setStage("input")} className="w-full text-muted-foreground">Cancel</Button>
          </motion.div>
        )}

        {stage === "error" && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="glass p-6 text-center space-y-3 border-destructive/40">
              <div className="h-16 w-16 rounded-full bg-destructive/15 flex items-center justify-center mx-auto">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
            {errorMsg.toLowerCase().includes("insufficient") && (
              <Button onClick={() => navigate("/add-money")} className="w-full gap-2">
                <Wallet className="h-4 w-4" /> Add Money to Wallet
              </Button>
            )}
            <Button variant="outline" onClick={() => setStage("input")} className="w-full">Try Again</Button>
          </motion.div>
        )}

        {stage === "success" && parsed && matchedContact && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="glass p-8 text-center space-y-4 glow-success">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }} className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                <Check className="h-10 w-10 text-success" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <p className="text-sm text-muted-foreground">Wallet Transfer Successful</p>
                <p className="text-2xl font-bold mt-1">₹{parsed.amount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  sent to <span className="text-foreground font-medium">{matchedContact.name}</span>
                </p>
                <p className="text-[10px] text-primary font-mono mt-1">{matchedContact.handle}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="pt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <span>Transaction ID:</span>
                  <code className="font-mono text-foreground bg-secondary px-2 py-0.5 rounded">{txId}</code>
                  <button onClick={() => navigator.clipboard.writeText(txId)}><Copy className="h-3 w-3" /></button>
                </div>
                <p>{format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
                <p className="pt-2">New wallet balance: <span className="text-foreground font-semibold">₹{balance.toLocaleString()}</span></p>
              </motion.div>
            </div>
            <Button onClick={() => navigate("/")} className="w-full">Back to Wallet</Button>
            <Button variant="ghost" onClick={() => { setStage("input"); setTextInput(""); setParsed(null); }} className="w-full text-muted-foreground">Send Another</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
