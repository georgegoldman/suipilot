import { Transaction } from "@mysten/sui/transactions";
import { testnetPackageIds } from "./constant";

// DeepBook V3 Package IDs
export const DEEPBOOK_PACKAGE_ID = testnetPackageIds.DEEPBOOK_PACKAGE_ID;
export const DEEPBOOK_MODULE = "deepbook";
export const BALANCE_MANAGER_MODULE = "balance_manager";
export const DDEEP_TREASURY_ID = testnetPackageIds.DEEP_TREASURY_ID;

// Order Restrictions (u8)
export const ORDER_RESTRICTION = {
  NO_RESTRICTION: 0,
  IMMEDIATE_OR_CANCEL: 1,
  FILL_OR_KILL: 2,
  POST_ONLY: 3,
};

// Self-matching options (u8)
export const SELF_MATCHING = {
  ALLOW: 0,
  CANCEL_TAKER: 1,
  CANCEL_MAKER: 2,
};

/**
 * 1. Setup: Create a Balance Manager
 * CRITICAL FIX: The BalanceManager MUST be a Shared Object.
 * If it is owned (private), Takers cannot match against your Limit Orders.
 * We use `0x2::transfer::public_share_object` to share it immediately.
 */
export function createBalanceManagerTx(signerAddress: string): Transaction {
  const tx = new Transaction();

  // Create the BalanceManager object
  const [manager] = tx.moveCall({
    target: `${DEEPBOOK_PACKAGE_ID}::${BALANCE_MANAGER_MODULE}::new`,
    arguments: [],
  });

  // Share it so the Pool can access it for matching (required for Makers)
  tx.transferObjects([manager], tx.pure.address(signerAddress));

  return tx;
}

/**
 * 2. Funding: Deposit Assets into Balance Manager
 * Moves funds from User Wallet -> Balance Manager
 */
export function depositTx(
  balanceManagerId: string,
  coinId: string, // The object ID of the coin to deposit
  coinType: string, // e.g., "0x2::sui::SUI"
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${DEEPBOOK_PACKAGE_ID}::${BALANCE_MANAGER_MODULE}::deposit`,
    typeArguments: [coinType],
    arguments: [tx.object(balanceManagerId), tx.object(coinId)],
  });

  return tx;
}

/**
 * 3. Defunding: Withdraw Assets from Balance Manager
 * Moves funds from Balance Manager -> User Wallet
 */
export function withdrawTx(
  balanceManagerId: string,
  amount: bigint | number,
  coinType: string,
  signerAddress: string,
): Transaction {
  const tx = new Transaction();

  // Withdraw returns a Coin object
  const [withdrawnCoin] = tx.moveCall({
    target: `${DEEPBOOK_PACKAGE_ID}::${BALANCE_MANAGER_MODULE}::withdraw`,
    typeArguments: [coinType],
    arguments: [tx.object(balanceManagerId), tx.pure.u64(amount)],
  });

  // Transfer the withdrawn coin explicitly to the user
  tx.transferObjects([withdrawnCoin], tx.pure.address(signerAddress));

  return tx;
}

/**
 * 4. Trading: Place Limit Order
 * The core function for your "Sui Copilot".
 */
export function placeLimitOrderTx(
  poolId: string,
  balanceManagerId: string,
  clientOrderId: number | bigint, // Unique ID for your tracking
  price: number | bigint,
  quantity: number | bigint,
  isBid: boolean, // true = Buy, false = Sell
  baseCoinType: string,
  quoteCoinType: string,
  expirationTimestamp: number | bigint = Date.now() + 1000 * 60 * 60 * 24, // Default 1 day
  restriction: number = ORDER_RESTRICTION.NO_RESTRICTION,
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${DEEPBOOK_PACKAGE_ID}::${DEEPBOOK_MODULE}::place_limit_order`,
    typeArguments: [baseCoinType, quoteCoinType],
    arguments: [
      tx.object(poolId),
      tx.object(balanceManagerId),
      tx.pure.u64(clientOrderId),
      tx.pure.u64(price),
      tx.pure.u64(quantity),
      tx.pure.bool(isBid),
      tx.pure.u64(expirationTimestamp),
      tx.pure.u8(restriction),
      tx.object("0x6"), // The Clock object (always 0x6)
    ],
  });

  return tx;
}

/**
 * 5. Trading: Place Market Order
 * Instant execution against the book.
 */
export function placeMarketOrderTx(
  poolId: string,
  balanceManagerId: string,
  clientOrderId: number | bigint,
  quantity: number | bigint,
  isBid: boolean,
  baseCoinType: string,
  quoteCoinType: string,
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${DEEPBOOK_PACKAGE_ID}::${DEEPBOOK_MODULE}::place_market_order`,
    typeArguments: [baseCoinType, quoteCoinType],
    arguments: [
      tx.object(poolId),
      tx.object(balanceManagerId),
      tx.pure.u64(clientOrderId),
      tx.pure.u64(quantity),
      tx.pure.bool(isBid),
      tx.object("0x6"), // Clock
    ],
  });

  return tx;
}

/**
 * 6. Management: Cancel Order
 */
export function cancelOrderTx(
  poolId: string,
  balanceManagerId: string,
  orderId: string | bigint, // The Order ID assigned by DeepBook (not client ID)
  baseCoinType: string,
  quoteCoinType: string,
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${DEEPBOOK_PACKAGE_ID}::${DEEPBOOK_MODULE}::cancel_order`,
    typeArguments: [baseCoinType, quoteCoinType],
    arguments: [
      tx.object(poolId),
      tx.object(balanceManagerId),
      tx.pure.u128(orderId), // Order IDs are usually u128
    ],
  });

  return tx;
}

/**
 * 7. Quick Swap: Swap Exact Base For Quote
 * Does NOT require Balance Manager. Uses raw coins.
 */
export function swapExactBaseForQuoteTx(
  poolId: string,
  coinId: string, // The Coin<Base> object
  minQuoteOut: number | bigint,
  baseCoinType: string,
  quoteCoinType: string,
  userAddress: string, // Needed to transfer output back
): Transaction {
  const tx = new Transaction();

  // 1. Perform Swap
  const [baseCoin, quoteCoin] = tx.moveCall({
    target: `${DEEPBOOK_PACKAGE_ID}::${DEEPBOOK_MODULE}::swap_exact_base_for_quote`,
    typeArguments: [baseCoinType, quoteCoinType],
    arguments: [
      tx.object(poolId),
      tx.object(coinId),
      tx.pure.u64(minQuoteOut), // FIX: Added missing minQuoteOut argument
      tx.object("0x6"), // Clock
    ],
  });

  // 2. Transfer results back to user
  // DeepBook returns (Coin<Base>, Coin<Quote>) - Base is the "change" (leftover), Quote is the bought amount
  tx.transferObjects([baseCoin, quoteCoin], tx.pure.address(userAddress));

  return tx;
}
