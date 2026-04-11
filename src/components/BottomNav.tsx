import { Home, Send, Mic, Clock, Building2, Lightbulb, CalendarDays, Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const primaryTabs = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Send, label: "Pay", path: "/pay" },
  { icon: CalendarDays, label: "Calendar", path: "/calendar" },
  { icon: Lightbulb, label: "Advise", path: "/advisory" },
];

const moreTabs = [
  { icon: Mic, label: "Voice History", path: "/voice-history" },
  { icon: Clock, label: "Transactions", path: "/history" },
  { icon: Building2, label: "Accounts", path: "/accounts" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const moreActive = moreTabs.some((t) => isActive(t.path));

  return (
    <>
      {/* More menu overlay */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            onClick={() => setShowMore(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-[68px] right-4 z-50 glass-strong p-2 space-y-1 min-w-[180px]"
          >
            {moreTabs.map((tab) => (
              <button
                key={tab.path}
                onClick={() => { navigate(tab.path); setShowMore(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  isActive(tab.path) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-glass-border">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {primaryTabs.map((tab) => {
            const active = isActive(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => { navigate(tab.path); setShowMore(false); }}
                className="relative flex flex-col items-center gap-1 px-3 py-2 transition-colors"
              >
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-px left-2 right-2 h-0.5 bg-primary rounded-full"
                  />
                )}
                <tab.icon className={`h-5 w-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-[10px] font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>{tab.label}</span>
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="relative flex flex-col items-center gap-1 px-3 py-2 transition-colors"
          >
            {moreActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -top-px left-2 right-2 h-0.5 bg-primary rounded-full"
              />
            )}
            {showMore ? (
              <X className="h-5 w-5 text-primary" />
            ) : (
              <Menu className={`h-5 w-5 transition-colors ${moreActive ? "text-primary" : "text-muted-foreground"}`} />
            )}
            <span className={`text-[10px] font-medium transition-colors ${moreActive || showMore ? "text-primary" : "text-muted-foreground"}`}>More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
