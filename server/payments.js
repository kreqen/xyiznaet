import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { assertLiveReady, LAMPORTS_PER_SOL, runtimeConfig } from "./config.js";

export function paymentQuote(pack, nonce) {
  const config = runtimeConfig();
  return {
    required: config.paymentMode === "live",
    configured: config.liveReady,
    cluster: config.cluster,
    treasury: config.treasury || null,
    lamports: Math.round(pack.cost * LAMPORTS_PER_SOL),
    sol: pack.cost,
    memo: `POKEGEN:${nonce}`,
  };
}

export function verifyParsedPayment(transaction, claim) {
  if (!transaction || transaction.meta?.err) throw new Error("Payment is not confirmed");
  const expectedLamports = Number(claim.lamports);
  const transfer = transaction.transaction.message.instructions.find((instruction) => {
    if (instruction.programId?.toBase58?.() !== SystemProgram.programId.toBase58()) return false;
    const info = instruction.parsed?.info;
    return (
      instruction.parsed?.type === "transfer" &&
      info?.source === claim.wallet &&
      info?.destination === claim.treasury &&
      Number(info?.lamports) >= expectedLamports
    );
  });
  if (!transfer) throw new Error("Payment amount or recipient is invalid");
  const memo = transaction.transaction.message.instructions.find(
    (instruction) =>
      instruction.program === "spl-memo" &&
      String(instruction.parsed || "") === claim.memo,
  );
  if (!memo) throw new Error("Payment memo does not match this pack request");
  const payer = transaction.transaction.message.accountKeys.find(
    (entry) => entry.signer && entry.pubkey.toBase58() === claim.wallet,
  );
  if (!payer) throw new Error("Payment was not signed by the connected wallet");
  return true;
}

export async function verifyPackPayment(signature, claim) {
  const config = assertLiveReady();
  if (config.paymentMode !== "live") return { mode: "preview", signature: null };
  if (typeof signature !== "string" || signature.length < 64) {
    throw new Error("Missing Solana payment signature");
  }
  const connection = new Connection(config.rpcUrl, "confirmed");
  const transaction = await connection.getParsedTransaction(signature, {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0,
  });
  verifyParsedPayment(transaction, claim);
  return {
    mode: "live",
    signature,
    slot: transaction.slot,
    confirmedAt: transaction.blockTime
      ? new Date(transaction.blockTime * 1000).toISOString()
      : new Date().toISOString(),
  };
}

export function validateTreasury(value) {
  try {
    return new PublicKey(value).toBase58() === value;
  } catch {
    return false;
  }
}
