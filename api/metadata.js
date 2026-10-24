import { serverCards } from "../server/game.js";
import { send } from "../server/security.js";

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function handler(request, response) {
  if (request.method !== "GET") return send(response, 405, { error: "Method not allowed" });
  const url = new URL(request.url, "https://pokegen.vercel.app");
  const card = serverCards[Number(url.searchParams.get("card"))];
  if (!card) return send(response, 404, { error: "Unknown card" });
  const baseUrl = (process.env.PUBLIC_APP_URL || "https://pokegen.vercel.app").replace(/\/$/, "");
  return send(response, 200, {
    name: `Pokégen ${card.name}`,
    description: "A server-verified Pokégen pack receipt on Solana.",
    image: `${baseUrl}/cards/${slug(card.name)}.png`,
    external_url: `${baseUrl}/#/binder`,
    attributes: [
      { trait_type: "Card", value: card.name },
      { trait_type: "Rarity", value: card.rarity },
      { trait_type: "Pack receipt", value: url.searchParams.get("pull") || "unknown" },
    ],
  });
}
