import { serverPacks } from "../../server/game.js";
import {
  challengeMessage,
  createChallenge,
  readBody,
  send,
  validWallet,
} from "../../server/security.js";
import { rateLimit } from "../../server/storage.js";

export default async function handler(request, response) {
  if (request.method !== "POST") return send(response, 405, { error: "Method not allowed" });
  try {
    const { wallet, packId } = await readBody(request);
    if (!validWallet(wallet)) return send(response, 400, { error: "Invalid Solana wallet" });
    if (!(await rateLimit(`challenge:${wallet}`))) {
      return send(response, 429, { error: "Too many pack requests" });
    }
    const pack = serverPacks.find((item) => item.id === packId);
    if (!pack) {
      return send(response, 400, { error: "Unknown pack" });
    }
    const { token: challenge, quote } = createChallenge(wallet, pack);
    return send(response, 200, {
      challenge,
      message: challengeMessage(challenge),
      quote,
      expiresIn: 300,
    });
  } catch (error) {
    return send(response, 500, { error: error.message });
  }
}
