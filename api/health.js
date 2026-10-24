import { send } from "../server/security.js";
import { runtimeConfig } from "../server/config.js";

export default function handler(request, response) {
  if (request.method !== "GET") return send(response, 405, { error: "Method not allowed" });
  const config = runtimeConfig();
  return send(response, 200, {
    ok: true,
    service: "pokegen-pack-api",
    version: 2,
    payments: {
      mode: config.paymentMode,
      cluster: config.cluster,
      liveReady: config.liveReady,
      missing: config.paymentMode === "live" ? config.liveMissing : [],
    },
    minting: {
      mode: config.mintMode,
      ready: config.mintReady,
    },
    persistence: config.redisReady ? "redis" : config.blobReady ? "vercel-blob" : "signed-token",
    time: new Date().toISOString(),
  });
}
