import { CONFIG } from "../config.ts";
import type { Orderbook } from "../types.ts";

export type Pool = {
  pool_id: string;
  pool_name: string;

  base_asset_id: string;
  base_asset_decimals: number;
  base_asset_symbol: string;

  quote_asset_id: string;
  quote_asset_decimals: number;
  quote_asset_symbol: string;

  min_size: number;
  lot_size: number;
  tick_size: number;
};

export async function getPools(): Promise<Pool[]> {
  const res = await fetch(`${CONFIG.indexerUrl}/get_pools`);
  if (!res.ok)
    throw new Error(`get_pools failed: ${res.status} ${await res.text()}`);
  return await res.json();
}

export async function getOrderbook(
  poolKey: string,
  depth = 10,
): Promise<Orderbook> {
  const url = `${CONFIG.indexerUrl}/orderbook/${poolKey}?level=2&depth=${depth}`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`orderbook failed: ${res.status} ${await res.text()}`);
  return await res.json();
}
