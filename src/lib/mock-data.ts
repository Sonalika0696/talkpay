export interface Transaction {
  id: string;
  recipient: string;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  timestamp: Date;
  method: "voice" | "text";
  voiceCommand?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bank: string;
  avatar: string;
  isFavorite: boolean;
}

const names = ["Aarav", "Priya", "Rahul", "Ananya", "Vikram", "Kavya", "Arjun", "Meera"];
const banks = ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Mahindra", "Yes Bank", "IndusInd", "PNB"];
const statuses: Transaction["status"][] = ["completed", "completed", "completed", "pending", "completed"];
const methods: Transaction["method"][] = ["voice", "voice", "text", "voice", "text", "voice", "voice", "text"];
const voiceCommands = [
  "Send 200 INR to Ahmed",
  "Transfer 500 to Sara",
  undefined,
  "Pay Fatima 150 rupees",
  undefined,
  "Send 300 INR to Layla",
  "Transfer 1000 to Hassan",
  undefined,
];

function randomId() {
  return "TXN-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

export const mockTransactions: Transaction[] = Array.from({ length: 8 }, (_, i) => ({
  id: randomId(),
  recipient: names[i % names.length],
  amount: Math.floor(Math.random() * 900 + 100),
  currency: "INR",
  status: statuses[i % statuses.length],
  timestamp: new Date(Date.now() - i * 3600000 * (Math.random() * 24 + 1)),
  method: methods[i % methods.length],
  voiceCommand: voiceCommands[i % voiceCommands.length],
}));

export const mockBeneficiaries: Beneficiary[] = names.map((name, i) => ({
  id: `BEN-${i + 1}`,
  name,
  accountNumber: `****${Math.floor(1000 + Math.random() * 9000)}`,
  bank: banks[i % banks.length],
  avatar: name[0],
  isFavorite: i < 3,
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
    currency: "INR",
    recipient,
  };
}
