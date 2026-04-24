import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, ArrowLeft, Check, Copy } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProcessingStep } from "@/components/ProcessingStep";
import { VoiceWaveform } from "@/components/VoiceWaveform";
import { parseVoiceCommand } from "@/lib/mock-data";
import { format } from "date-fns";

type Stage = "input" | "processing" | "confirm" | "success";

interface ParsedCommand {
  intent: string;
  amount: number;
  currency: string;
  recipient: string;
}

const STEPS = [
  "Understanding intent…",
  "Extracting amount…",
  "Identifying recipient…",
  "Running risk check…",
  "Preparing confirmation…",
];

export default function Pay() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stage, setStage] = useState<Stage>("input");
  const [textInput, setTextInput] = useState("");
  const [parsed, setParsed] = useState<ParsedCommand | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [txId] = useState("TXN-" + Math.random().toString(36).substring(2, 10).toUpperCase());
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [showTranscription, setShowTranscription] = useState(false);

  // Handle repeat payment from VoiceHistory
  useEffect(() => {
    const state = location.state as { repeatCommand?: string } | null;
    if (state?.repeatCommand) {
      setTextInput(state.repeatCommand);
    }
  }, [location.state]);

  const simulateTranscription = useCallback((finalText: string) => {
    setShowTranscription(true);
    setTranscription("");
    const words = finalText.split(" ");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTranscription(words.slice(0, i).join(" "));
      if (i >= words.length) {
        clearInterval(interval);
      }
    }, 200);
  }, []);

  const processCommand = useCallback((input: string) => {
    const result = parseVoiceCommand(input);
    setParsed(result);
    setStage("processing");
    setStepIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setStepIndex(current);
      if (current >= STEPS.length) {
        clearInterval(interval);
        setTimeout(() => setStage("confirm"), 600);
      }
    }, 800);
  }, []);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    processCommand(textInput);
  };

  const handleVoicePress = () => {
    setIsRecording(true);
    const mockCommand = "Send 200 INR to Aarav";
    simulateTranscription(mockCommand);
  };

  const handleVoiceRelease = () => {
    setIsRecording(false);
    setTimeout(() => {
      processCommand("Send 200 INR to Aarav");
      setShowTranscription(false);
    }, 500);
  };

  const handleConfirm = () => setStage("success");

  return (
    <div className="min-h-screen pb-20 p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 py-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => stage === "input" ? navigate("/") : setStage("input")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {stage === "input" && "Send Payment"}
          {stage === "processing" && "Processing"}
          {stage === "confirm" && "Confirm Payment"}
          {stage === "success" && "Payment Sent"}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {stage === "input" && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              {/* Listening indicator ring */}
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
                    isRecording
                      ? "bg-primary glow-primary"
                      : "glass border-primary/30 hover:border-primary/60"
                  }`}
                >
                  <Mic className={`h-8 w-8 ${isRecording ? "text-primary-foreground" : "text-primary"}`} />
                </motion.button>
              </div>

              {/* Waveform visualizer */}
              <div className="w-full max-w-[200px]">
                <VoiceWaveform isActive={isRecording} />
              </div>

              <p className="text-xs text-muted-foreground">
                {isRecording ? "Listening…" : "Hold to speak"}
              </p>

              {/* Real-time transcription */}
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
                placeholder='e.g. "Send 200 INR to Aarav"'
                className="bg-secondary border-glass-border flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
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

        {stage === "confirm" && parsed && (
          <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="glass p-6 space-y-4 glow-primary gradient-border">
              <div className="flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {parsed.recipient[0]}
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Sending to</p>
                <p className="text-xl font-bold">{parsed.recipient}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient-primary">{parsed.currency} {parsed.amount}</p>
              </div>
              <div className="flex justify-center">
                <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">Pending Approval</span>
              </div>
            </div>
            <Button onClick={handleConfirm} className="w-full h-12 text-base font-semibold glow-primary">CONFIRM PAYMENT</Button>
            <Button variant="ghost" onClick={() => setStage("input")} className="w-full text-muted-foreground">Cancel</Button>
          </motion.div>
        )}

        {stage === "success" && parsed && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="glass p-8 text-center space-y-4 glow-success">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }} className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                <Check className="h-10 w-10 text-success" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <p className="text-sm text-muted-foreground">Payment Successful</p>
                <p className="text-2xl font-bold mt-1">{parsed.currency} {parsed.amount}</p>
                <p className="text-sm text-muted-foreground">sent to <span className="text-foreground font-medium">{parsed.recipient}</span></p>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="pt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <span>Transaction ID:</span>
                  <code className="font-mono text-foreground bg-secondary px-2 py-0.5 rounded">{txId}</code>
                  <button onClick={() => navigator.clipboard.writeText(txId)}><Copy className="h-3 w-3" /></button>
                </div>
                <p>{format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
              </motion.div>
            </div>
            <Button onClick={() => navigate("/")} className="w-full">Back to Home</Button>
            <Button variant="ghost" onClick={() => { setStage("input"); setTextInput(""); }} className="w-full text-muted-foreground">Send Another</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
