import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CalendarDays, Plus, Clock, DollarSign, Bell, Trash2, X, Check, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, addDays, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";

type EventType = "salary" | "emi" | "loan" | "payment" | "custom";

interface FinancialEvent {
  id: string;
  title: string;
  date: Date;
  type: EventType;
  amount?: number;
  recipient?: string;
  isScheduledPayment: boolean;
  reminder: boolean;
}

const typeConfig: Record<EventType, { label: string; color: string; bg: string }> = {
  salary: { label: "Salary", color: "text-success", bg: "bg-success/10" },
  emi: { label: "EMI", color: "text-destructive", bg: "bg-destructive/10" },
  loan: { label: "Loan", color: "text-warning", bg: "bg-warning/10" },
  payment: { label: "Payment", color: "text-primary", bg: "bg-primary/10" },
  custom: { label: "Custom", color: "text-accent", bg: "bg-accent/10" },
};

const now = new Date();

const initialEvents: FinancialEvent[] = [
  { id: "1", title: "Monthly Salary", date: new Date(now.getFullYear(), now.getMonth(), 28), type: "salary", amount: 75000, isScheduledPayment: false, reminder: true },
  { id: "2", title: "Car Loan EMI", date: new Date(now.getFullYear(), now.getMonth(), 5), type: "emi", amount: 12500, recipient: "HDFC Auto Finance", isScheduledPayment: true, reminder: true },
  { id: "3", title: "Home Loan EMI", date: new Date(now.getFullYear(), now.getMonth(), 10), type: "loan", amount: 24800, recipient: "SBI Home Loans", isScheduledPayment: true, reminder: true },
  { id: "4", title: "Credit Card Bill", date: new Date(now.getFullYear(), now.getMonth(), 15), type: "payment", amount: 8200, recipient: "ICICI Card", isScheduledPayment: true, reminder: false },
  { id: "5", title: "Rent Payment", date: addDays(now, 3), type: "payment", amount: 22000, recipient: "Landlord Sharma", isScheduledPayment: true, reminder: true },
];

export default function FinancialCalendar() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<FinancialEvent[]>(initialEvents);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "payment" as EventType,
    amount: "",
    recipient: "",
    isScheduledPayment: false,
    reminder: true,
  });

  const eventsForDate = selectedDate
    ? events.filter((e) => isSameDay(e.date, selectedDate)).sort((a, b) => a.date.getTime() - b.date.getTime())
    : [];

  const upcomingEvents = events
    .filter((e) => e.date >= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  // Dates that have events for calendar dot indicators
  const eventDates = events.map((e) => e.date);

  const addEvent = () => {
    if (!newEvent.title || !selectedDate) return;
    setEvents([...events, {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      type: newEvent.type,
      amount: newEvent.amount ? parseFloat(newEvent.amount) : undefined,
      recipient: newEvent.recipient || undefined,
      isScheduledPayment: newEvent.isScheduledPayment,
      reminder: newEvent.reminder,
    }]);
    setNewEvent({ title: "", type: "payment", amount: "", recipient: "", isScheduledPayment: false, reminder: true });
    setShowAddEvent(false);
  };

  const removeEvent = (id: string) => setEvents(events.filter((e) => e.id !== id));
  const toggleReminder = (id: string) => setEvents(events.map((e) => e.id === id ? { ...e, reminder: !e.reminder } : e));

  return (
    <div className="min-h-screen pb-20 p-4 max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-3 py-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold">Financial Calendar</h2>
        </div>
      </div>

      {/* Calendar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-3">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className={cn("p-3 pointer-events-auto")}
          modifiers={{
            hasEvent: eventDates,
          }}
          modifiersClassNames={{
            hasEvent: "relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-primary",
          }}
        />
      </motion.div>

      {/* Events for selected date */}
      {selectedDate && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">
              {format(selectedDate, "MMMM d, yyyy")}
            </p>
            <Button variant="ghost" size="sm" className="text-xs text-primary gap-1 h-7" onClick={() => setShowAddEvent(true)}>
              <Plus className="h-3 w-3" /> Add Event
            </Button>
          </div>

          {eventsForDate.length === 0 && !showAddEvent && (
            <div className="glass p-6 text-center">
              <CalendarDays className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No events on this day</p>
            </div>
          )}

          {eventsForDate.map((evt, i) => {
            const config = typeConfig[evt.type];
            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-full ${config.bg} flex items-center justify-center`}>
                      {evt.type === "salary" ? <DollarSign className={`h-4 w-4 ${config.color}`} /> :
                       evt.type === "payment" ? <Send className={`h-4 w-4 ${config.color}`} /> :
                       <Clock className={`h-4 w-4 ${config.color}`} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{evt.title}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${config.bg} ${config.color}`}>{config.label}</span>
                        {evt.isScheduledPayment && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Scheduled</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleReminder(evt.id)}>
                      <Bell className={`h-3 w-3 ${evt.reminder ? "text-warning fill-warning" : "text-muted-foreground"}`} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeEvent(evt.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {(evt.amount || evt.recipient) && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pl-12">
                    {evt.amount && <span className="font-semibold text-foreground">INR {evt.amount.toLocaleString()}</span>}
                    {evt.recipient && <span>→ {evt.recipient}</span>}
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Add event form */}
          <AnimatePresence>
            {showAddEvent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="glass p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">New Financial Event</p>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowAddEvent(false)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                <Input placeholder="Event title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="bg-secondary border-glass-border" />

                {/* Type selector */}
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(typeConfig) as EventType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setNewEvent({ ...newEvent, type: t })}
                      className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-all ${
                        newEvent.type === t
                          ? `${typeConfig[t].bg} ${typeConfig[t].color} ring-1 ring-current`
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {typeConfig[t].label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Amount (INR)" value={newEvent.amount} onChange={(e) => setNewEvent({ ...newEvent, amount: e.target.value })} className="bg-secondary border-glass-border" />
                  <Input placeholder="Recipient (optional)" value={newEvent.recipient} onChange={(e) => setNewEvent({ ...newEvent, recipient: e.target.value })} className="bg-secondary border-glass-border" />
                </div>

                {/* Toggles */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setNewEvent({ ...newEvent, isScheduledPayment: !newEvent.isScheduledPayment })}
                    className={`flex-1 glass p-2.5 text-xs text-center rounded-lg transition-all ${
                      newEvent.isScheduledPayment ? "border-primary/50 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Send className="h-3.5 w-3.5 mx-auto mb-1" />
                    Schedule Payment
                  </button>
                  <button
                    onClick={() => setNewEvent({ ...newEvent, reminder: !newEvent.reminder })}
                    className={`flex-1 glass p-2.5 text-xs text-center rounded-lg transition-all ${
                      newEvent.reminder ? "border-warning/50 text-warning" : "text-muted-foreground"
                    }`}
                  >
                    <Bell className="h-3.5 w-3.5 mx-auto mb-1" />
                    Set Reminder
                  </button>
                </div>

                <Button onClick={addEvent} className="w-full">
                  <Check className="h-4 w-4 mr-1" /> Add Event
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Upcoming events */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Upcoming Events</p>
        {upcomingEvents.map((evt, i) => {
          const config = typeConfig[evt.type];
          const daysUntil = Math.ceil((evt.date.getTime() - now.getTime()) / 86400000);
          return (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full ${config.bg} flex items-center justify-center`}>
                  <CalendarDays className={`h-3.5 w-3.5 ${config.color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium">{evt.title}</p>
                  <p className="text-[10px] text-muted-foreground">{format(evt.date, "MMM d")} · {daysUntil === 0 ? "Today" : `${daysUntil}d away`}</p>
                </div>
              </div>
              {evt.amount && (
                <p className={`text-xs font-semibold ${evt.type === "salary" ? "text-success" : ""}`}>
                  {evt.type === "salary" ? "+" : "-"}INR {evt.amount.toLocaleString()}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
