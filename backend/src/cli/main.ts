const API = "http://localhost:8787";

const intent = {
  intentId: crypto.randomUUID(),
  owner: "0xa35de887586ac1a9e644bc8f1b24a0d54c6eea66b8feef8bfd94297adde8d479",
  type: "SWAP",
  sell: { symbol: "DBUSDC", amount: 5 },
  buy: { symbol: "SUI" },
  constraints: { maxSlippageBps: 50, timeLimitSec: 600 },
};

console.log("Intent:", intent);

const q = await fetch(`${API}/quote`, {
  method: "POST",
  body: JSON.stringify(intent),
}).then((r) => r.json());
console.log("Quote:", q);

if (q.rejected) {
  console.log("Rejected by constraints:", q.reason);
  Deno.exit(0);
}

const receipt = await fetch(`${API}/execute`, {
  method: "POST",
  body: JSON.stringify(intent),
}).then((r) => r.json());
console.log("Receipt:", receipt);
