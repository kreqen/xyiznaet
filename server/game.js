import { createHmac } from "node:crypto";

export const serverCards = [
  ["Charizard", "HOLO RARE", 1],
  ["Blastoise", "HOLO RARE", 2],
  ["Venusaur", "HOLO RARE", 2],
  ["Pikachu", "COMMON", 4],
  ["Mewtwo", "HOLO RARE", 4],
  ["Gengar", "HOLO RARE", 4],
  ["Alakazam", "HOLO RARE", 4],
  ["Gyarados", "HOLO RARE", 4],
  ["Nidoking", "HOLO RARE", 5],
  ["Raichu", "HOLO RARE", 4],
  ["Zapdos", "HOLO RARE", 3],
  ["Dragonite", "HOLO RARE", 2],
  ["Articuno", "HOLO RARE", 3],
  ["Snorlax", "HOLO RARE", 3],
  ["Jolteon", "HOLO RARE", 3],
  ["Vaporeon", "HOLO RARE", 3],
  ["Flareon", "HOLO RARE", 3],
  ["Scyther", "HOLO RARE", 4],
  ["Lapras", "HOLO RARE", 4],
  ["Eevee", "COMMON", 5],
  ["Bulbasaur", "COMMON", 6],
  ["Squirtle", "COMMON", 6],
  ["Growlithe", "UNCOMMON", 7],
  ["Abra", "COMMON", 7],
  ["Clefairy", "HOLO RARE", 4],
  ["Chansey", "HOLO RARE", 4],
  ["Hitmonchan", "HOLO RARE", 5],
  ["Machamp", "HOLO RARE", 5],
  ["Magneton", "HOLO RARE", 5],
  ["Ninetales", "HOLO RARE", 4],
  ["Poliwrath", "HOLO RARE", 5],
  ["Kangaskhan", "HOLO RARE", 5],
  ["Mr. Mime", "HOLO RARE", 4],
  ["Nidoqueen", "HOLO RARE", 4],
  ["Pidgeot", "HOLO RARE", 4],
  ["Pinsir", "HOLO RARE", 5],
  ["Aerodactyl", "HOLO RARE", 3],
  ["Ditto", "HOLO RARE", 3],
  ["Haunter", "HOLO RARE", 4],
  ["Moltres", "HOLO RARE", 2],
  ["Jigglypuff", "COMMON", 6],
  ["Meowth", "COMMON", 7],
  ["Psyduck", "COMMON", 7],
  ["Slowpoke", "COMMON", 7],
  ["Cubone", "COMMON", 7],
  ["Dratini", "UNCOMMON", 6],
  ["Magikarp", "UNCOMMON", 8],
  ["Ivysaur", "UNCOMMON", 6],
  ["Charmander", "COMMON", 7],
  ["Charmeleon", "UNCOMMON", 5],
].map(([name, rarity, weight], index) => ({ index, name, rarity, weight }));

export const serverPacks = [
  { id: "base-signal", name: "Base Signal", holo: 20, cost: 0.05, pool: [3, 9, 10, 28, 20, 21, 48, 47, 49] },
  { id: "holo-rush", name: "Holo Rush", holo: 55, cost: 0.1, pool: [4, 6, 24, 25, 26, 27, 23, 40] },
  { id: "vault-zero", name: "Vault Zero", holo: 85, cost: 0.25, pool: [0, 1, 2, 7, 8, 33, 22, 41] },
  { id: "shadow-pulse", name: "Shadow Pulse", holo: 40, cost: 0.08, pool: [5, 38, 36, 37, 44, 42, 43, 46] },
  { id: "sky-breaker", name: "Sky Breaker", holo: 70, cost: 0.16, pool: [11, 12, 39, 34, 17, 35, 45, 29] },
  { id: "prism-wild", name: "Prism Wild", holo: 95, cost: 0.5, pool: [13, 14, 15, 16, 18, 19, 30, 31, 32] },
];

function unit(buffer, offset) {
  return buffer.readUInt32BE(offset) / 0x100000000;
}

export function rollPack(packId, challenge, secret) {
  const pack = serverPacks.find((item) => item.id === packId);
  if (!pack) throw new Error("Unknown pack");
  const entropy = createHmac("sha256", secret)
    .update(`pull:${challenge}`)
    .digest();
  const wantsHolo = unit(entropy, 0) * 100 < pack.holo;
  const pool = pack.pool
    .map((index) => serverCards[index])
    .filter((item) => (item.rarity === "HOLO RARE") === wantsHolo);
  const total = pool.reduce((sum, item) => sum + item.weight, 0);
  let cursor = unit(entropy, 4) * total;
  for (const item of pool) {
    cursor -= item.weight;
    if (cursor < 0) return { pack, card: item };
  }
  return { pack, card: pool.at(-1) };
}
