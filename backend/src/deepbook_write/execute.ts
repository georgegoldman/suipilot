import * as jsonRpc from "npm:@mysten/sui/jsonRpc";
import { Transaction } from "npm:@mysten/sui/transactions";

import { CONFIG } from "../config.ts";
import { keypairFromEnv } from "./signer.ts";
import type { ExecutionReceipt } from "../types.ts";

const { SuiJsonRpcClient } = jsonRpc as any;

// DeepBook V3 package (testnet)
const DEEPBOOK_PACKAGE = "0xdee9";
const DEEPBOOK_MODULE = "clob_v3";

export async function executeSwap(params: {
  intentId: string;
  owner: string;

  // ✅ required for Move call execution
  poolId: string; // on-chain object id (0x...)
  deepbookPackage: string; // resolved from pool type (0x...)

  // optional: keep for logging/receipts only
  poolKey?: string; // e.g. "SUI_DBUSDC"

  side: "SELL_BASE" | "SELL_QUOTE";
  amount: bigint; // atomic units u64
  minOut: bigint; // atomic units u64
}): Promise<ExecutionReceipt> {
  const kp = keypairFromEnv();

  const client = new SuiJsonRpcClient({
    url: CONFIG.rpcUrl,
    network: CONFIG.network,
  });

  // ✅ guardrails (prevents your last crash)
  if (!params.poolId) throw new Error("Missing poolId");
  if (!params.deepbookPackage) throw new Error("Missing deepbookPackage");

  const tx = new Transaction();
  tx.setSender(kp.toSuiAddress());

  if (params.side === "SELL_QUOTE") {
    tx.moveCall({
      target: `${params.deepbookPackage}::clob_v3::swap_exact_quote_for_base`,
      arguments: [
        tx.object(params.poolId),
        tx.pure.u64(params.amount),
        tx.pure.u64(params.minOut),
      ],
    });
  } else {
    tx.moveCall({
      target: `${params.deepbookPackage}::clob_v3::swap_exact_base_for_quote`,
      arguments: [
        tx.object(params.poolId),
        tx.pure.u64(params.amount),
        tx.pure.u64(params.minOut),
      ],
    });
  }

  const { bytes, signature } = await tx.sign({ client, signer: kp });

  const res = await client.executeTransactionBlock({
    transactionBlock: bytes,
    signature,
    options: { showEffects: true, showEvents: true },
  });

  return {
    intentId: params.intentId,
    txDigest: res.digest,
    poolKey: params.poolKey ?? "",
    timestamp: Math.floor(Date.now() / 1000),
  };
}
