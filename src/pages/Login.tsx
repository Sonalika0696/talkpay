import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Loader2, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@talkpay.com");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-4">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">AI-Powered Payments</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Agent<span className="text-gradient-primary">2Pay</span>
          </h1>
          <p className="text-sm text-muted-foreground">Voice-first AI payment platform</p>
        </div>

        <form onSubmit={handleSubmit} className="glass p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary border-glass-border" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-secondary border-glass-border" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">Don't have an account?</p>
          <Button variant="outline" onClick={() => navigate("/signup")} className="w-full border-primary/30 text-primary hover:bg-primary/10">
            Create Account
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Prototype demo — use pre-filled credentials
        </p>
      </motion.div>
    </div>
  );
}
