export const CONFIG = {
  network: "testnet" as const,
  rpcUrl: "https://fullnode.testnet.sui.io:443",
  indexerUrl: "https://deepbook-indexer.testnet.mystenlabs.com",

  // For MVP, trade only this pool:
  poolKey: "SUI_DBUSDC",

  // Intent symbol mapping (user says "USDC" but testnet uses DBUSDC)
  symbolAlias: {
    USDC: "DBUSDC",
  } as Record<string, string>,
};
