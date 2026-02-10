import { SuiGrpcClient } from "@mysten/sui/grpc";

export async function selectCoinObjectId(
  client: SuiGrpcClient,
  owner: string,
  coinType: string,
): Promise<string> {
  const res = await client.listCoins({ owner, coinType });

  const coinId = res.objects?.[0]?.objectId;

  if (!coinId) throw new Error(`No coin found for ${owner} and ${coinType}`);

  return coinId;
}
