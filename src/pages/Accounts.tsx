import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Building2, User, CreditCard, Trash2, Star, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  type: "savings" | "current";
  isPrimary: boolean;
}

interface Beneficiary {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  isFavorite: boolean;
}

const initialAccounts: BankAccount[] = [
  { id: "1", bankName: "Emirates NBD", accountNumber: "****4521", iban: "AE070331234567890123456", type: "current", isPrimary: true },
  { id: "2", bankName: "ADCB", accountNumber: "****7832", iban: "AE210409876543210987654", type: "savings", isPrimary: false },
];

const initialBeneficiaries: Beneficiary[] = [
  { id: "1", name: "Ahmed Al Maktoum", bankName: "Emirates NBD", accountNumber: "****3456", iban: "AE070331234567890123456", isFavorite: true },
  { id: "2", name: "Sara Hassan", bankName: "FAB", accountNumber: "****9012", iban: "AE350461234567890123456", isFavorite: true },
  { id: "3", name: "Mohammed Ali", bankName: "Mashreq", accountNumber: "****5678", iban: "AE460331234567890123456", isFavorite: false },
  { id: "4", name: "Fatima Noor", bankName: "RAKBANK", accountNumber: "****2345", iban: "AE520401234567890123456", isFavorite: false },
];

export default function Accounts() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<BankAccount[]>(initialAccounts);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddBeneficiary, setShowAddBeneficiary] = useState(false);
  const [newAccount, setNewAccount] = useState({ bankName: "", accountNumber: "", iban: "", type: "current" as const });
  const [newBeneficiary, setNewBeneficiary] = useState({ name: "", bankName: "", accountNumber: "", iban: "" });

  const addAccount = () => {
    if (!newAccount.bankName || !newAccount.iban) return;
    setAccounts([...accounts, {
      id: Date.now().toString(),
      ...newAccount,
      accountNumber: "****" + newAccount.accountNumber.slice(-4),
      isPrimary: false,
    }]);
    setNewAccount({ bankName: "", accountNumber: "", iban: "", type: "current" });
    setShowAddAccount(false);
  };

  const addBeneficiary = () => {
    if (!newBeneficiary.name || !newBeneficiary.iban) return;
    setBeneficiaries([...beneficiaries, {
      id: Date.now().toString(),
      ...newBeneficiary,
      accountNumber: "****" + newBeneficiary.accountNumber.slice(-4),
      isFavorite: false,
    }]);
    setNewBeneficiary({ name: "", bankName: "", accountNumber: "", iban: "" });
    setShowAddBeneficiary(false);
  };

  const toggleFavorite = (id: string) => {
    setBeneficiaries(beneficiaries.map((b) => b.id === id ? { ...b, isFavorite: !b.isFavorite } : b));
  };

  const removeAccount = (id: string) => setAccounts(accounts.filter((a) => a.id !== id));
  const removeBeneficiary = (id: string) => setBeneficiaries(beneficiaries.filter((b) => b.id !== id));
  const setPrimary = (id: string) => setAccounts(accounts.map((a) => ({ ...a, isPrimary: a.id === id })));

  return (
    <div className="min-h-screen pb-20 p-4 max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-3 py-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">Accounts & Beneficiaries</h2>
      </div>

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="w-full bg-secondary">
          <TabsTrigger value="accounts" className="flex-1 gap-1.5">
            <Building2 className="h-3.5 w-3.5" /> Bank Accounts
          </TabsTrigger>
          <TabsTrigger value="beneficiaries" className="flex-1 gap-1.5">
            <User className="h-3.5 w-3.5" /> Beneficiaries
          </TabsTrigger>
        </TabsList>

        {/* BANK ACCOUNTS TAB */}
        <TabsContent value="accounts" className="space-y-3 mt-4">
          {accounts.map((acc, i) => (
            <motion.div
              key={acc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass p-4 space-y-2 ${acc.isPrimary ? "glow-primary gradient-border" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{acc.bankName}</p>
                    <p className="text-[10px] text-muted-foreground">{acc.type === "current" ? "Current" : "Savings"} · {acc.accountNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {acc.isPrimary ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Primary</span>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPrimary(acc.id)}>
                      <Star className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeAccount(acc.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-2">
                <p className="text-[10px] text-muted-foreground">IBAN</p>
                <p className="text-xs font-mono">{acc.iban}</p>
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {showAddAccount && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="glass p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Add Bank Account</p>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowAddAccount(false)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <Input placeholder="Bank name" value={newAccount.bankName} onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })} className="bg-secondary border-glass-border" />
                <Input placeholder="Account number" value={newAccount.accountNumber} onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })} className="bg-secondary border-glass-border" />
                <Input placeholder="IBAN" value={newAccount.iban} onChange={(e) => setNewAccount({ ...newAccount, iban: e.target.value })} className="bg-secondary border-glass-border" />
                <div className="flex gap-2">
                  <Button variant={newAccount.type === "current" ? "default" : "outline"} size="sm" onClick={() => setNewAccount({ ...newAccount, type: "current" })} className="flex-1 text-xs">Current</Button>
                  <Button variant={newAccount.type === "savings" ? "default" : "outline"} size="sm" onClick={() => setNewAccount({ ...newAccount, type: "savings" })} className="flex-1 text-xs">Savings</Button>
                </div>
                <Button onClick={addAccount} className="w-full">
                  <Check className="h-4 w-4 mr-1" /> Add Account
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {!showAddAccount && (
            <Button variant="outline" onClick={() => setShowAddAccount(true)} className="w-full border-dashed border-primary/30 text-primary hover:bg-primary/10">
              <Plus className="h-4 w-4 mr-2" /> Add Bank Account
            </Button>
          )}
        </TabsContent>

        {/* BENEFICIARIES TAB */}
        <TabsContent value="beneficiaries" className="space-y-3 mt-4">
          {/* Favorites section */}
          {beneficiaries.some((b) => b.isFavorite) && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Favorites</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {beneficiaries.filter((b) => b.isFavorite).map((b) => (
                  <button key={b.id} onClick={() => navigate("/pay")} className="flex flex-col items-center gap-1.5 min-w-[60px]">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary border border-primary/20">
                      {b.name[0]}
                    </div>
                    <span className="text-[10px] text-muted-foreground truncate w-16 text-center">{b.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground font-medium">All Beneficiaries</p>
          {beneficiaries.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-sm font-semibold text-accent">
                    {b.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className="text-[10px] text-muted-foreground">{b.bankName} · {b.accountNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFavorite(b.id)}>
                    <Star className={`h-3 w-3 ${b.isFavorite ? "text-warning fill-warning" : "text-muted-foreground"}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/pay")}>
                    <CreditCard className="h-3 w-3 text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeBeneficiary(b.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {showAddBeneficiary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="glass p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Add Beneficiary</p>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowAddBeneficiary(false)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <Input placeholder="Full name" value={newBeneficiary.name} onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })} className="bg-secondary border-glass-border" />
                <Input placeholder="Bank name" value={newBeneficiary.bankName} onChange={(e) => setNewBeneficiary({ ...newBeneficiary, bankName: e.target.value })} className="bg-secondary border-glass-border" />
                <Input placeholder="Account number" value={newBeneficiary.accountNumber} onChange={(e) => setNewBeneficiary({ ...newBeneficiary, accountNumber: e.target.value })} className="bg-secondary border-glass-border" />
                <Input placeholder="IBAN" value={newBeneficiary.iban} onChange={(e) => setNewBeneficiary({ ...newBeneficiary, iban: e.target.value })} className="bg-secondary border-glass-border" />
                <Button onClick={addBeneficiary} className="w-full">
                  <Check className="h-4 w-4 mr-1" /> Add Beneficiary
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {!showAddBeneficiary && (
            <Button variant="outline" onClick={() => setShowAddBeneficiary(true)} className="w-full border-dashed border-primary/30 text-primary hover:bg-primary/10">
              <Plus className="h-4 w-4 mr-2" /> Add Beneficiary
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
