export interface Transaction {
  id: string;
  recipient: string;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  timestamp: Date;
}

const names = ["Ahmed", "Sara", "Mohammed", "Fatima", "Omar", "Layla", "Hassan", "Noor"];
const statuses: Transaction["status"][] = ["completed", "completed", "completed", "pending", "completed"];

function randomId() {
  return "TXN-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

export const mockTransactions: Transaction[] = Array.from({ length: 8 }, (_, i) => ({
  id: randomId(),
  recipient: names[i % names.length],
  amount: Math.floor(Math.random() * 900 + 100),
  currency: "AED",
  status: statuses[i % statuses.length],
  timestamp: new Date(Date.now() - i * 3600000 * (Math.random() * 24 + 1)),
}));

export function parseVoiceCommand(input: string) {
  const amountMatch = input.match(/(\d+)/);
  const amount = amountMatch ? parseInt(amountMatch[1]) : 100;

  const toIndex = input.toLowerCase().indexOf("to ");
  let recipient = "Unknown";
  if (toIndex !== -1) {
    recipient = input.substring(toIndex + 3).trim().split(/\s/)[0];
    recipient = recipient.charAt(0).toUpperCase() + recipient.slice(1);
  }

  return {
    intent: "transfer" as const,
    amount,
    currency: "AED",
    recipient,
  };
}
