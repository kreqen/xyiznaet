import { rollPack, serverCards } from "../../server/game.js";
import {
  challengeMessage,
  readBody,
  send,
  signToken,
  signingSecret,
  verifyToken,
  verifyWalletSignature,
} from "../../server/security.js";
import { verifyPackPayment } from "../../server/payments.js";
import { claimOnce, readVault, writeVault } from "../../server/storage.js";
import { mintCardReceipt } from "../../server/mint.js";

function freshVault(wallet) {
  return {
    kind: "vault",
    version: 1,
    wallet,
    owned: Array(serverCards.length).fill(0),
    pulls: [],
    usedChallenges: [],
  };
}

export default async function handler(request, response) {
  if (request.method !== "POST") return send(response, 405, { error: "Method not allowed" });
  try {
    const { challenge, signature, sessionToken, vaultToken, paymentSignature } = await readBody(request);
    const claim = verifyToken(challenge);
    if (claim.kind !== "pack-challenge" || claim.expiresAt < Date.now()) {
      return send(response, 401, { error: "Challenge expired" });
    }
    let sessionAuthorized = false;
    if (sessionToken) {
      const session = verifyToken(sessionToken);
      sessionAuthorized =
        session.kind === "wallet-session" &&
        session.wallet === claim.wallet &&
        session.expiresAt >= Date.now();
    }
    if (!sessionAuthorized) {
      const message = challengeMessage(challenge);
      if (!verifyWalletSignature(claim.wallet, message, signature)) {
        return send(response, 401, { error: "Wallet session expired" });
      }
    }

    let vault = (await readVault(claim.wallet)) || freshVault(claim.wallet);
    if (!vault.updatedAt && vaultToken) {
      vault = verifyToken(vaultToken);
      if (vault.kind !== "vault" || vault.wallet !== claim.wallet) {
        return send(response, 401, { error: "Vault does not belong to this wallet" });
      }
    }
    if (vault.usedChallenges.includes(claim.nonce)) {
      return send(response, 409, { error: "Challenge already used" });
    }

    const payment = await verifyPackPayment(paymentSignature, claim);
    if (payment.mode === "live") {
      const freshChallenge = await claimOnce("challenge", claim.nonce, 600);
      if (!freshChallenge) return send(response, 409, { error: "Challenge already used" });
      const freshPayment = await claimOnce("payment", payment.signature, 31_536_000);
      if (!freshPayment) return send(response, 409, { error: "Payment already used" });
    }

    const { pack, card } = rollPack(claim.packId, challenge, signingSecret());
    vault.owned = Array.from(
      { length: serverCards.length },
      (_, index) => Number(vault.owned[index] || 0),
    );
    vault.owned[card.index] += 1;
    vault.usedChallenges = [...vault.usedChallenges, claim.nonce].slice(-50);
    const pull = {
      id: claim.nonce,
      cardIndex: card.index,
      packId: pack.id,
      paymentSignature: payment.signature,
      pulledAt: new Date().toISOString(),
    };
    vault.pulls = [
      ...vault.pulls,
      pull,
    ].slice(-50);
    vault.updatedAt = new Date().toISOString();
    await writeVault(vault);

    let mint;
    try {
      mint = await mintCardReceipt(card, claim.wallet, claim.nonce);
    } catch (error) {
      mint = { mode: "pending", asset: null, error: error.message };
    }
    pull.mint = mint;
    vault.pulls = vault.pulls.map((item) =>
      item.id === pull.id ? { ...item, mint } : item,
    );
    await writeVault(vault);

    return send(response, 200, {
      card,
      pack: { id: pack.id, name: pack.name },
      vault: {
        owned: vault.owned,
        pulls: vault.pulls,
      },
      vaultToken: signToken(vault),
      proof: claim.nonce,
      payment,
      mint,
    });
  } catch (error) {
    const status = /token|wallet|signature/i.test(error.message) ? 401 : 400;
    return send(response, status, { error: error.message });
  }
}
