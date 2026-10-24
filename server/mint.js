import { create, mplCore } from "@metaplex-foundation/mpl-core";
import {
  base58,
  createSignerFromKeypair,
  generateSigner,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { runtimeConfig } from "./config.js";

function authoritySecret() {
  try {
    const bytes = JSON.parse(process.env.MINT_AUTHORITY_SECRET || "");
    if (!Array.isArray(bytes) || bytes.length !== 64) throw new Error();
    return Uint8Array.from(bytes);
  } catch {
    throw new Error("MINT_AUTHORITY_SECRET must be a 64-byte JSON array");
  }
}

export async function mintCardReceipt(card, wallet, pullId) {
  const config = runtimeConfig();
  if (config.mintMode !== "live") return { mode: "disabled", asset: null };
  if (!config.mintReady) throw new Error("On-chain minting is not configured");
  const umi = createUmi(config.rpcUrl).use(mplCore());
  const keypair = umi.eddsa.createKeypairFromSecretKey(authoritySecret());
  const authority = createSignerFromKeypair(umi, keypair);
  umi.use(signerIdentity(authority));
  const asset = generateSigner(umi);
  const baseUrl = process.env.PUBLIC_APP_URL.replace(/\/$/, "");
  const result = await create(umi, {
    asset,
    owner: publicKey(wallet),
    name: `Pokégen ${card.name}`,
    uri: `${baseUrl}/api/metadata?card=${card.index}&pull=${encodeURIComponent(pullId)}`,
  }).sendAndConfirm(umi);
  return {
    mode: "live",
    asset: asset.publicKey,
    signature: base58.deserialize(result.signature)[0],
  };
}
