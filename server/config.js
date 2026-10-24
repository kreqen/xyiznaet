import { PublicKey } from "@solana/web3.js";

export const LAMPORTS_PER_SOL = 1_000_000_000;

export function runtimeConfig() {
  const paymentMode = process.env.PAYMENTS_MODE === "live" ? "live" : "preview";
  const cluster = process.env.SOLANA_CLUSTER || "devnet";
  const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
  const treasury = process.env.TREASURY_WALLET || "";
  const mintMode = process.env.MINT_MODE === "live" ? "live" : "disabled";
  const mintReady = Boolean(
    process.env.MINT_AUTHORITY_SECRET && process.env.PUBLIC_APP_URL,
  );
  const redisReady = Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN,
  );
  const blobReady = Boolean(process.env.BLOB_STORE_ID);
  const persistenceReady = redisReady || blobReady;
  const liveMissing = [];
  if (!process.env.SOLANA_RPC_URL) liveMissing.push("SOLANA_RPC_URL");
  try {
    if (new PublicKey(treasury).toBase58() !== treasury) throw new Error();
  } catch {
    liveMissing.push("TREASURY_WALLET");
  }
  if (!persistenceReady) liveMissing.push("BLOB_STORE_ID or UPSTASH_REDIS_REST_URL/TOKEN");
  return {
    paymentMode,
    cluster,
    rpcUrl,
    treasury,
    mintMode,
    mintReady,
    redisReady,
    blobReady,
    persistenceReady,
    liveReady: liveMissing.length === 0,
    liveMissing,
  };
}

export function assertLiveReady() {
  const config = runtimeConfig();
  if (config.paymentMode === "live" && !config.liveReady) {
    throw new Error(`Live payments are not configured: ${config.liveMissing.join(", ")}`);
  }
  return config;
}
