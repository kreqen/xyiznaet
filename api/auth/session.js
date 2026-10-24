import {
  createSessionChallenge,
  createSessionToken,
  readBody,
  send,
  sessionChallengeMessage,
  validWallet,
  verifyToken,
  verifyWalletSignature,
} from "../../server/security.js";
import { rateLimit } from "../../server/storage.js";

export default async function handler(request, response) {
  if (request.method !== "POST") return send(response, 405, { error: "Method not allowed" });
  try {
    const { wallet, challenge, signature } = await readBody(request);
    if (!validWallet(wallet)) return send(response, 400, { error: "Invalid Solana wallet" });
    if (!(await rateLimit(`session:${wallet}`, 8, 60))) {
      return send(response, 429, { error: "Too many session requests" });
    }

    if (!challenge || !signature) {
      const created = createSessionChallenge(wallet);
      return send(response, 200, {
        challenge: created.token,
        message: sessionChallengeMessage(created.token),
        expiresIn: 600,
      });
    }

    const claim = verifyToken(challenge);
    if (
      claim.kind !== "wallet-session-challenge" ||
      claim.wallet !== wallet ||
      claim.expiresAt < Date.now()
    ) {
      return send(response, 401, { error: "Session challenge expired" });
    }
    if (!verifyWalletSignature(wallet, sessionChallengeMessage(challenge), signature)) {
      return send(response, 401, { error: "Invalid wallet signature" });
    }

    return send(response, 200, {
      sessionToken: createSessionToken(wallet),
      expiresIn: 7 * 24 * 60 * 60,
    });
  } catch (error) {
    return send(response, 401, { error: error.message });
  }
}
