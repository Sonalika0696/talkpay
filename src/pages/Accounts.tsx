import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, User, Trash2, Star, X, AtSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/lib/wallet-context";

export default function Accounts() {
  const navigate = useNavigate();
  const { contacts, addContact, removeContact, toggleFavorite } = useWallet();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", handle: "", phone: "" });

  const submit = () => {
    if (!form.name || !form.handle) return;
    addContact({ name: form.name, handle: form.handle, phone: form.phone || "+91 00000 00000" });
    setForm({ name: "", handle: "", phone: "" });
    setShowAdd(false);
  };

  const favorites = contacts.filter((c) => c.isFavorite);

  return (
    <div className="min-h-screen pb-20 p-4 max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-3 py-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold flex-1">Wallet Contacts</h2>
        <Button size="sm" onClick={() => setShowAdd(true)} className="gap-1">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {favorites.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-2">Favorites</p>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
            {favorites.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate("/pay", { state: { presetHandle: c.handle } })}
                className="flex flex-col items-center gap-1 shrink-0"
              >
                <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-lg">
                  {c.avatar}
                </div>
                <span className="text-[10px] text-muted-foreground">{c.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">All Wallet Users</p>
        {contacts.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-4 flex items-center gap-3"
          >
            <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
              {c.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{c.name}</p>
              <p className="text-[11px] text-primary font-mono">{c.handle}</p>
              <p className="text-[10px] text-muted-foreground">{c.phone}</p>
            </div>
            <button onClick={() => toggleFavorite(c.id)} className="p-2">
              <Star className={`h-4 w-4 ${c.isFavorite ? "fill-warning text-warning" : "text-muted-foreground"}`} />
            </button>
            <button onClick={() => removeContact(c.id)} className="p-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
        {contacts.length === 0 && (
          <div className="glass p-8 text-center text-sm text-muted-foreground">
            No wallet contacts yet. Add someone to start sending money.
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-50 glass-strong p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Add Wallet Contact</h3>
                <button onClick={() => setShowAdd(false)}><X className="h-4 w-4" /></button>
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="pl-10 bg-secondary border-glass-border"
                />
              </div>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Wallet ID (e.g. priya)"
                  value={form.handle}
                  onChange={(e) => setForm({ ...form, handle: e.target.value.replace(/\s/g, "").toLowerCase() })}
                  className="pl-10 bg-secondary border-glass-border"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">+91</span>
                <Input
                  type="tel"
                  inputMode="numeric"
                  placeholder="10-digit mobile"
                  value={form.phone.replace("+91 ", "")}
                  onChange={(e) => setForm({ ...form, phone: "+91 " + e.target.value.replace(/\D/g, "").slice(0, 10) })}
                  className="pl-10 bg-secondary border-glass-border"
                />
              </div>
              <Button onClick={submit} className="w-full">Add Contact</Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
