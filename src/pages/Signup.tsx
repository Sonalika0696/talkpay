import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Zap, ArrowRight, ArrowLeft, Mic, Fingerprint, UserPlus,
  Check, Phone, Mail, Lock, User, Shield, Volume2
} from "lucide-react";

type Step = "credentials" | "voice-auth" | "biometric" | "beneficiaries" | "complete";

const STEPS: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: "credentials", label: "Account", icon: UserPlus },
  { key: "voice-auth", label: "Voice ID", icon: Mic },
  { key: "biometric", label: "Biometrics", icon: Fingerprint },
  { key: "beneficiaries", label: "Contacts", icon: User },
  { key: "complete", label: "Done", icon: Check },
];

export default function Signup() {
  const { login } = useAuth();
  const [step, setStep] = useState<Step>("credentials");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [voiceEnrolled, setVoiceEnrolled] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>([]);

  const currentIdx = STEPS.findIndex((s) => s.key === step);

  const mockBeneficiaryList = [
    { id: "1", name: "Ahmed", phone: "+971 50 123 4567" },
    { id: "2", name: "Sara", phone: "+971 55 987 6543" },
    { id: "3", name: "Mohammed", phone: "+971 52 456 7890" },
    { id: "4", name: "Fatima", phone: "+971 56 321 0987" },
  ];

  const handleVoiceEnroll = () => {
    setVoiceRecording(true);
    setVoiceProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setVoiceProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setVoiceRecording(false);
        setVoiceEnrolled(true);
      }
    }, 300);
  };

  const handleBiometric = () => {
    setLoading(true);
    setTimeout(() => {
      setBiometricEnabled(true);
      setLoading(false);
    }, 1500);
  };

  const handleComplete = async () => {
    setLoading(true);
    await login(form.email || "demo@agent2pay.com", "demo123");
    setLoading(false);
  };

  const goNext = () => {
    const next = STEPS[currentIdx + 1];
    if (next) setStep(next.key);
  };

  const goBack = () => {
    const prev = STEPS[currentIdx - 1];
    if (prev) setStep(prev.key);
  };

  const toggleBeneficiary = (id: string) => {
    setSelectedBeneficiaries((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-sm mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-8 pt-4">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                i < currentIdx
                  ? "bg-success text-success-foreground"
                  : i === currentIdx
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {i < currentIdx ? <Check className="h-4 w-4" /> : <s.icon className="h-3.5 w-3.5" />}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 sm:w-12 h-0.5 mx-1 ${i < currentIdx ? "bg-success" : "bg-secondary"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {/* STEP 1: Credentials */}
          {step === "credentials" && (
            <motion.div key="cred" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 space-y-6">
              <div>
                <h2 className="text-xl font-bold">Create Account</h2>
                <p className="text-sm text-muted-foreground mt-1">Set up your Agent2Pay account</p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="pl-10 bg-secondary border-glass-border" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="pl-10 bg-secondary border-glass-border" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Phone (+971)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="pl-10 bg-secondary border-glass-border" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="pl-10 bg-secondary border-glass-border" />
                </div>
              </div>

              <Button onClick={goNext} className="w-full h-12 gap-2 text-base font-semibold">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* STEP 2: Voice Auth */}
          {step === "voice-auth" && (
            <motion.div key="voice" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 space-y-6">
              <div>
                <h2 className="text-xl font-bold">Voice Authentication</h2>
                <p className="text-sm text-muted-foreground mt-1">Enroll your voice for secure payments</p>
              </div>

              <div className="glass p-6 text-center space-y-4 glow-primary gradient-border">
                {!voiceEnrolled ? (
                  <>
                    <motion.button
                      onClick={handleVoiceEnroll}
                      disabled={voiceRecording}
                      whileTap={{ scale: 0.95 }}
                      className={`h-24 w-24 mx-auto rounded-full flex items-center justify-center transition-all ${
                        voiceRecording ? "bg-primary animate-pulse" : "bg-primary/10 hover:bg-primary/20"
                      }`}
                    >
                      {voiceRecording ? (
                        <Volume2 className="h-8 w-8 text-primary-foreground" />
                      ) : (
                        <Mic className="h-8 w-8 text-primary" />
                      )}
                    </motion.button>

                    {voiceRecording && (
                      <div className="space-y-2">
                        <p className="text-xs text-primary font-medium">Recording voice sample…</p>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${voiceProgress}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">Say: "Agent2Pay, authorize my payment"</p>
                      </div>
                    )}

                    {!voiceRecording && (
                      <p className="text-xs text-muted-foreground">Tap to record your voice passphrase</p>
                    )}
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="h-16 w-16 mx-auto rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="h-8 w-8 text-success" />
                    </div>
                    <p className="text-sm font-medium text-success">Voice enrolled successfully!</p>
                    <p className="text-xs text-muted-foreground">Your voice print has been securely stored</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" onClick={goBack} className="flex-1 h-12">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={goNext} className="flex-1 h-12 gap-2">
                  {voiceEnrolled ? "Continue" : "Skip"} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Biometric */}
          {step === "biometric" && (
            <motion.div key="bio" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 space-y-6">
              <div>
                <h2 className="text-xl font-bold">Biometric Security</h2>
                <p className="text-sm text-muted-foreground mt-1">Enable fingerprint or Face ID for quick access</p>
              </div>

              <div className="glass p-6 text-center space-y-4">
                {!biometricEnabled ? (
                  <>
                    <motion.button
                      onClick={handleBiometric}
                      disabled={loading}
                      whileTap={{ scale: 0.95 }}
                      className="h-24 w-24 mx-auto rounded-full bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors"
                    >
                      {loading ? (
                        <Loader2 className="h-8 w-8 text-accent animate-spin" />
                      ) : (
                        <Fingerprint className="h-10 w-10 text-accent" />
                      )}
                    </motion.button>
                    <p className="text-xs text-muted-foreground">
                      {loading ? "Verifying biometrics…" : "Tap to enable biometric authentication"}
                    </p>
                    <div className="flex items-center gap-2 justify-center text-[10px] text-muted-foreground">
                      <Shield className="h-3 w-3" />
                      <span>Encrypted & stored on device only</span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="h-16 w-16 mx-auto rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="h-8 w-8 text-success" />
                    </div>
                    <p className="text-sm font-medium text-success">Biometrics enabled!</p>
                    <p className="text-xs text-muted-foreground">Use fingerprint or Face ID to unlock</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" onClick={goBack} className="flex-1 h-12">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={goNext} className="flex-1 h-12 gap-2">
                  {biometricEnabled ? "Continue" : "Skip"} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Beneficiaries */}
          {step === "beneficiaries" && (
            <motion.div key="ben" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 space-y-6">
              <div>
                <h2 className="text-xl font-bold">Add Beneficiaries</h2>
                <p className="text-sm text-muted-foreground mt-1">Select frequent contacts for quick payments</p>
              </div>

              <div className="space-y-2">
                {mockBeneficiaryList.map((b) => {
                  const selected = selectedBeneficiaries.includes(b.id);
                  return (
                    <button
                      key={b.id}
                      onClick={() => toggleBeneficiary(b.id)}
                      className={`w-full glass p-4 flex items-center gap-3 transition-all ${
                        selected ? "border-primary/50 glow-primary" : ""
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                        selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      }`}>
                        {b.name[0]}
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-medium">{b.name}</p>
                        <p className="text-[10px] text-muted-foreground">{b.phone}</p>
                      </div>
                      {selected && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" onClick={goBack} className="flex-1 h-12">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={goNext} className="flex-1 h-12 gap-2">
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Complete */}
          {step === "complete" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center glow-success"
              >
                <Check className="h-10 w-10 text-success" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold">You're all set!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Your Agent2Pay account is ready to use
                </p>
              </div>
              <div className="glass p-4 w-full space-y-2 text-xs text-left">
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-success" />
                  <span>Account created</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className={`h-3 w-3 ${voiceEnrolled ? "text-success" : "text-muted-foreground"}`} />
                  <span className={voiceEnrolled ? "" : "text-muted-foreground"}>
                    Voice authentication {voiceEnrolled ? "enrolled" : "skipped"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className={`h-3 w-3 ${biometricEnabled ? "text-success" : "text-muted-foreground"}`} />
                  <span className={biometricEnabled ? "" : "text-muted-foreground"}>
                    Biometrics {biometricEnabled ? "enabled" : "skipped"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className={`h-3 w-3 ${selectedBeneficiaries.length > 0 ? "text-success" : "text-muted-foreground"}`} />
                  <span className={selectedBeneficiaries.length > 0 ? "" : "text-muted-foreground"}>
                    {selectedBeneficiaries.length} beneficiar{selectedBeneficiaries.length === 1 ? "y" : "ies"} added
                  </span>
                </div>
              </div>

              <Button onClick={handleComplete} className="w-full h-12 text-base font-semibold glow-primary" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Started"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
