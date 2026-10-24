import { defineConfig } from "vite";
import health from "./api/health.js";
import catalog from "./api/catalog.js";
import challenge from "./api/auth/challenge.js";
import openPack from "./api/packs/open.js";
import vault from "./api/vault.js";
import metadata from "./api/metadata.js";

const routes = new Map([
  ["/api/health", health],
  ["/api/catalog", catalog],
  ["/api/auth/challenge", challenge],
  ["/api/packs/open", openPack],
  ["/api/vault", vault],
  ["/api/metadata", metadata],
]);

export default defineConfig({
  plugins: [
    {
      name: "pokegen-local-api",
      configureServer(server) {
        server.middlewares.use(async (request, response, next) => {
          const path = request.url?.split("?")[0];
          const handler = routes.get(path);
          if (!handler) return next();
          try {
            await handler(request, response);
          } catch (error) {
            response.statusCode = 500;
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify({ error: error.message }));
          }
        });
      },
    },
  ],
});
