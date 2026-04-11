import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

interface Props {
  label: string;
  status: "pending" | "active" | "done";
  index: number;
}

export function ProcessingStep({ label, status, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-3 py-2"
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {status === "done" && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-success">
            <Check className="h-5 w-5" />
          </motion.div>
        )}
        {status === "active" && <Loader2 className="h-5 w-5 text-primary animate-spin" />}
        {status === "pending" && <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />}
      </div>
      <span
        className={`text-sm font-medium transition-colors ${
          status === "done"
            ? "text-foreground"
            : status === "active"
            ? "text-primary"
            : "text-muted-foreground/50"
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
}
