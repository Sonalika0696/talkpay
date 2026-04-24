import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, CreditCard, Landmark, Lightbulb, Shield, Percent, ChevronRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BALANCE = 5000;

interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  type: "invest" | "credit" | "alert" | "saving";
  action: string;
  color: string;
}

function getSuggestions(balance: number): Suggestion[] {
  const base: Suggestion[] = [
    {
      id: "1",
      title: "UAE Sukuk Fund",
      description: "Sharia-compliant bond fund returning 6.2% annually. Low risk, ideal for conservative investors.",
      icon: Landmark,
      type: "invest",
      action: "Explore Fund",
      color: "text-primary",
    },
    {
      id: "2",
      title: "Gold Savings Plan",
      description: "Auto-invest in gold starting INR 50/month. Gold up 12% this year.",
      icon: TrendingUp,
      type: "invest",
      action: "Start Plan",
      color: "text-warning",
    },
    {
      id: "3",
      title: "S&P 500 ETF",
      description: "Diversify internationally with a top US index ETF. Average 10% annual return.",
      icon: TrendingUp,
      type: "invest",
      action: "Learn More",
      color: "text-success",
    },
  ];

  const credit: Suggestion[] = [
    {
      id: "c1",
      title: "Cashback Credit Card",
      description: "Earn 5% cashback on groceries and dining. No annual fee first year.",
      icon: CreditCard,
      type: "credit",
      action: "Apply Now",
      color: "text-accent",
    },
    {
      id: "c2",
      title: "Personal Loan — 4.99% APR",
      description: "Pre-approved for up to INR 100,000. Flexible 12-60 month terms.",
      icon: Percent,
      type: "credit",
      action: "View Offer",
      color: "text-primary",
    },
  ];

  const alerts: Suggestion[] = [];

  if (balance < 2000) {
    alerts.push({
      id: "a1",
      title: "Low Balance Alert",
      description: "Your balance is below INR 2,000. Consider reducing non-essential spending or setting up an emergency fund.",
      icon: AlertTriangle,
      type: "alert",
      action: "View Tips",
      color: "text-destructive",
    });
    alerts.push({
      id: "a2",
      title: "Salary Advance",
      description: "Get up to 50% of your salary early with zero interest. Repaid automatically on salary day.",
      icon: Zap,
      type: "credit",
      action: "Request Advance",
      color: "text-warning",
    });
  }

  if (balance > 3000) {
    alerts.push({
      id: "a3",
      title: "Idle Cash Detected",
      description: `INR ${(balance - 1000).toLocaleString()} sitting idle. Move to a high-yield savings account earning 4.5% p.a.`,
      icon: Lightbulb,
      type: "saving",
      action: "Optimize",
      color: "text-accent",
    });
  }

  return [...alerts, ...base, ...credit];
}

export default function Advisory() {
  const navigate = useNavigate();
  const suggestions = getSuggestions(BALANCE);

  const typeLabel = (type: string) => {
    switch (type) {
      case "invest": return { label: "Investment", bg: "bg-primary/10 text-primary" };
      case "credit": return { label: "Credit", bg: "bg-accent/10 text-accent" };
      case "alert": return { label: "Alert", bg: "bg-destructive/10 text-destructive" };
      case "saving": return { label: "Saving Tip", bg: "bg-success/10 text-success" };
      default: return { label: "Info", bg: "bg-secondary text-muted-foreground" };
    }
  };

  return (
    <div className="min-h-screen pb-20 p-4 max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-3 py-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-accent" />
          <h2 className="text-lg font-semibold">Smart Advisory</h2>
        </div>
      </div>

      {/* Balance context */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-4 flex items-center justify-between"
      >
        <div>
          <p className="text-[10px] text-muted-foreground">Current Balance</p>
          <p className="text-xl font-bold text-gradient-primary">INR {BALANCE.toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-1 text-success text-xs font-medium">
          <Shield className="h-3 w-3" />
          <span>Healthy</span>
        </div>
      </motion.div>

      {/* Risk profile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass p-4 space-y-2"
      >
        <p className="text-xs font-medium">Your Risk Profile</p>
        <div className="flex gap-1">
          {["Conservative", "Moderate", "Aggressive"].map((level, i) => (
            <div key={level} className={`flex-1 h-1.5 rounded-full ${i === 1 ? "bg-primary" : "bg-secondary"}`} />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground">Moderate — balanced growth with managed risk</p>
      </motion.div>

      {/* Suggestions */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Personalized Recommendations</p>
        {suggestions.map((s, i) => {
          const badge = typeLabel(s.type);
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0 ${s.color}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">{s.title}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${badge.bg}`}>{badge.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full text-xs h-8 border-glass-border gap-1">
                {s.action} <ChevronRight className="h-3 w-3" />
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Low balance tips - always show a general tip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-4 space-y-2 gradient-border"
      >
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-warning" />
          <p className="text-xs font-medium">Monthly Spending Insight</p>
        </div>
        <p className="text-xs text-muted-foreground">
          You've spent INR 3,200 this month — 15% less than last month. Keep it up! Consider allocating the savings to your investment goals.
        </p>
      </motion.div>
    </div>
  );
}
