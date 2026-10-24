import { serverCards, serverPacks } from "../server/game.js";
import { send } from "../server/security.js";
import { runtimeConfig } from "../server/config.js";

export default function handler(request, response) {
  if (request.method !== "GET") return send(response, 405, { error: "Method not allowed" });
  const config = runtimeConfig();
  return send(response, 200, {
    network: {
      cluster: config.cluster,
      paymentMode: config.paymentMode,
      liveReady: config.liveReady,
      mintMode: config.mintMode,
    },
    cards: serverCards.map(({ index, name, rarity, weight }) => ({
      index,
      name,
      rarity,
      weight,
    })),
    packs: serverPacks,
  });
}
