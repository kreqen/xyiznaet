import {
  createHmac,
  createPublicKey,
  randomUUID,
  timingSafeEqual,
  verify,
} from "node:crypto";
import { paymentQuote } from "./payments.js";

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const DEV_SECRET = "pokegen-local-development-secret";

export function signingSecret() {
  const secret = process.env.PACK_SIGNING_SECRET;
  if (secret) return secret;
  if (process.env.VERCEL) throw new Error("PACK_SIGNING_SECRET is not configured");
  return DEV_SECRET;
}

function mac(value, secret = signingSecret()) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${mac(body)}`;
}

export function verifyToken(token) {
  if (typeof token !== "string") throw new Error("Missing signed token");
  const [body, signature] = token.split(".");
  if (!body || !signature) throw new Error("Malformed signed token");
  const expected = Buffer.from(mac(body));
  const received = Buffer.from(signature);
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    throw new Error("Invalid signed token");
  }
  return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
}

export function createChallenge(wallet, pack) {
  const nonce = randomUUID();
  const quote = paymentQuote(pack, nonce);
  const claim = {
    kind: "pack-challenge",
    wallet,
    packId: pack.id,
    nonce,
    treasury: quote.treasury,
    lamports: quote.lamports,
    memo: quote.memo,
    paymentRequired: quote.required,
    issuedAt: Date.now(),
    expiresAt: Date.now() + 5 * 60 * 1000,
  };
  return { token: signToken(claim), claim, quote };
}

export function challengeMessage(challenge) {
  return `POKEGEN PACK OPEN\n${challenge}`;
}

export function createSessionChallenge(wallet) {
  const claim = {
    kind: "wallet-session-challenge",
    wallet,
    nonce: randomUUID(),
    issuedAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000,
  };
  return { token: signToken(claim), claim };
}

export function sessionChallengeMessage(challenge) {
  return `POKEGEN WALLET SESSION\n${challenge}`;
}

export function createSessionToken(wallet) {
  const issuedAt = Date.now();
  return signToken({
    kind: "wallet-session",
    version: 1,
    wallet,
    issuedAt,
    expiresAt: issuedAt + 7 * 24 * 60 * 60 * 1000,
  });
}

function decodeBase58(value) {
  let number = 0n;
  for (const character of value) {
    const index = ALPHABET.indexOf(character);
    if (index < 0) throw new Error("Invalid wallet address");
    number = number * 58n + BigInt(index);
  }
  const bytes = [];
  while (number > 0n) {
    bytes.push(Number(number & 255n));
    number >>= 8n;
  }
  bytes.reverse();
  let leadingZeroes = 0;
  while (value[leadingZeroes] === "1") leadingZeroes += 1;
  return Buffer.concat([Buffer.alloc(leadingZeroes), Buffer.from(bytes)]);
}

export function validWallet(wallet) {
  try {
    return typeof wallet === "string" && decodeBase58(wallet).length === 32;
  } catch {
    return false;
  }
}

export function verifyWalletSignature(wallet, message, signature) {
  const rawKey = decodeBase58(wallet);
  if (rawKey.length !== 32) return false;
  const prefix = Buffer.from("302a300506032b6570032100", "hex");
  const publicKey = createPublicKey({
    key: Buffer.concat([prefix, rawKey]),
    format: "der",
    type: "spki",
  });
  return verify(
    null,
    Buffer.from(message, "utf8"),
    publicKey,
    Buffer.from(signature, "base64"),
  );
}

export async function readBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 32_768) throw new Error("Request body is too large");
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function send(response, status, body) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.end(JSON.stringify(body));
}
