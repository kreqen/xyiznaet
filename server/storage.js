import { Redis } from "@upstash/redis";
import { BlobNotFoundError, get, head, put } from "@vercel/blob";
import { createHash } from "node:crypto";
import { runtimeConfig } from "./config.js";

let redis;

function client() {
  if (!runtimeConfig().redisReady) return null;
  redis ||= new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  return redis;
}

function blobEnabled() {
  return runtimeConfig().blobReady;
}

function vaultPath(wallet) {
  return `vaults/${wallet}.json`;
}

function claimPath(kind, value) {
  const digest = createHash("sha256").update(String(value)).digest("hex");
  return `claims/${kind}/${digest}.txt`;
}

export async function readVault(wallet) {
  const store = client();
  if (store) return store.get(`pokegen:vault:${wallet}`);
  if (!blobEnabled()) return null;
  const result = await get(vaultPath(wallet), { access: "private", useCache: false });
  if (!result?.stream) return null;
  return new Response(result.stream).json();
}

export async function writeVault(vault) {
  const store = client();
  if (store) {
    await store.set(`pokegen:vault:${vault.wallet}`, vault);
    return true;
  }
  if (!blobEnabled()) return false;
  await put(vaultPath(vault.wallet), JSON.stringify(vault), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
  return true;
}

export async function claimOnce(kind, value, ttlSeconds = 86_400) {
  const store = client();
  if (store) {
    const result = await store.set(`pokegen:used:${kind}:${value}`, "1", {
      nx: true,
      ex: ttlSeconds,
    });
    return result === "OK";
  }
  if (!blobEnabled()) return null;
  const pathname = claimPath(kind, value);
  try {
    await put(pathname, JSON.stringify({ claimedAt: new Date().toISOString(), ttlSeconds }), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return true;
  } catch (error) {
    try {
      await head(pathname, { access: "private" });
      return false;
    } catch (headError) {
      if (!(headError instanceof BlobNotFoundError)) throw headError;
      throw error;
    }
  }
}

export async function rateLimit(key, maximum = 12, windowSeconds = 60) {
  const store = client();
  if (!store) return true;
  const bucket = Math.floor(Date.now() / (windowSeconds * 1000));
  const redisKey = `pokegen:rate:${key}:${bucket}`;
  const count = await store.incr(redisKey);
  if (count === 1) await store.expire(redisKey, windowSeconds + 5);
  return count <= maximum;
}
