import { readBody, send, verifyToken } from "../server/security.js";
import { readVault } from "../server/storage.js";

export default async function handler(request, response) {
  if (request.method !== "POST") return send(response, 405, { error: "Method not allowed" });
  try {
    const { wallet, vaultToken } = await readBody(request);
    const access = verifyToken(vaultToken);
    if (access.kind !== "vault" || access.wallet !== wallet) {
      return send(response, 401, { error: "Vault does not belong to this wallet" });
    }
    const vault = (await readVault(wallet)) || access;
    return send(response, 200, {
      wallet: vault.wallet,
      owned: vault.owned,
      pulls: vault.pulls,
      updatedAt: vault.updatedAt,
    });
  } catch (error) {
    return send(response, 401, { error: error.message });
  }
}
