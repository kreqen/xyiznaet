import { generateKeyPairSync, sign } from "node:crypto";
import challengeHandler from "../api/auth/challenge.js";
import sessionHandler from "../api/auth/session.js";
import openHandler from "../api/packs/open.js";
import vaultHandler from "../api/vault.js";
import { serverCards, serverPacks } from "../server/game.js";
import { verifyParsedPayment } from "../server/payments.js";

const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

if (serverCards.length !== 50 || serverPacks.length !== 6) {
  throw new Error("Catalog size mismatch");
}

const paymentClaim = {
  wallet: "payer-wallet",
  treasury: "treasury-wallet",
  lamports: 50_000_000,
  memo: "POKEGEN:test-nonce",
};
const paymentTransaction = {
  slot: 1,
  meta: { err: null },
  transaction: {
    message: {
      accountKeys: [
        { signer: true, pubkey: { toBase58: () => paymentClaim.wallet } },
      ],
      instructions: [
        {
          programId: { toBase58: () => "11111111111111111111111111111111" },
          parsed: {
            type: "transfer",
            info: {
              source: paymentClaim.wallet,
              destination: paymentClaim.treasury,
              lamports: paymentClaim.lamports,
            },
          },
        },
        { program: "spl-memo", parsed: paymentClaim.memo },
      ],
    },
  },
};
verifyParsedPayment(paymentTransaction, paymentClaim);
try {
  verifyParsedPayment(paymentTransaction, { ...paymentClaim, lamports: 60_000_000 });
  throw new Error("Underpayment was accepted");
} catch (error) {
  if (!/amount|recipient/i.test(error.message)) throw error;
}
try {
  verifyParsedPayment(paymentTransaction, { ...paymentClaim, memo: "POKEGEN:wrong" });
  throw new Error("Wrong memo was accepted");
} catch (error) {
  if (!/memo/i.test(error.message)) throw error;
}

function encodeBase58(buffer) {
  let number = BigInt(`0x${Buffer.from(buffer).toString("hex")}`);
  let output = "";
  while (number) {
    output = alphabet[Number(number % 58n)] + output;
    number /= 58n;
  }
  for (const byte of buffer) {
    if (byte !== 0) break;
    output = `1${output}`;
  }
  return output;
}

function response() {
  return {
    statusCode: 200,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(value) {
      this.body = JSON.parse(value);
    },
  };
}

async function call(handler, method, body) {
  const result = response();
  await handler({ method, body }, result);
  return result;
}

const { publicKey, privateKey } = generateKeyPairSync("ed25519");
const wallet = encodeBase58(
  publicKey.export({ format: "der", type: "spki" }).subarray(-32),
);
let vaultToken = "";
const sessionChallenge = await call(sessionHandler, "POST", { wallet });
if (sessionChallenge.statusCode !== 200) throw new Error("Session challenge failed");
const sessionSignature = sign(
  null,
  Buffer.from(sessionChallenge.body.message),
  privateKey,
).toString("base64");
const session = await call(sessionHandler, "POST", {
  wallet,
  challenge: sessionChallenge.body.challenge,
  signature: sessionSignature,
});
if (session.statusCode !== 200 || !session.body.sessionToken) {
  throw new Error("Session authorization failed");
}
const sessionToken = session.body.sessionToken;
let firstChallenge;
const pulls = [];
for (const pack of serverPacks) {
  const challenge = await call(challengeHandler, "POST", {
    wallet,
    packId: pack.id,
  });
  if (challenge.statusCode !== 200) throw new Error(`Challenge failed for ${pack.id}`);
  const opened = await call(openHandler, "POST", {
    challenge: challenge.body.challenge,
    sessionToken,
    vaultToken,
  });
  if (opened.statusCode !== 200 || !opened.body.vaultToken) {
    throw new Error(`Pack opening failed for ${pack.id}`);
  }
  if (!pack.pool.includes(opened.body.card.index)) {
    throw new Error(`${opened.body.card.name} is outside the ${pack.id} pool`);
  }
  firstChallenge ||= challenge.body.challenge;
  vaultToken = opened.body.vaultToken;
  pulls.push(opened.body.card.name);
}

const vault = await call(vaultHandler, "POST", {
  wallet,
  vaultToken,
});
if (vault.statusCode !== 200 || vault.body.owned.reduce((a, b) => a + b, 0) !== 6) {
  throw new Error("Vault sync failed");
}

const replay = await call(openHandler, "POST", {
  challenge: firstChallenge,
  sessionToken,
  vaultToken,
});
if (replay.statusCode !== 409) throw new Error("Replay was not rejected");

console.log(`PASS: one wallet session, six pulls (${pulls.join(", ")}), vault sync, replay protection`);
