import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export function keypairFromEnv(): Ed25519Keypair {
  const pk = Deno.env.get("SUI_PRIVATE_KEY");
  if (!pk) throw new Error("Missing SUI_PRIVATE_KEY env var");

  const { scheme, secretKey } = decodeSuiPrivateKey(pk);
  if (scheme !== "ED25519")
    throw new Error(`Unsupported key scheme: ${scheme}`);

  return Ed25519Keypair.fromSecretKey(secretKey);
}
