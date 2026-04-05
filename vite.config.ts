import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub project pages need `/repo-name/`; root custom domains use `/`. Override with VITE_BASE_PATH when building. */
function viteBase(): string {
  const raw = process.env.VITE_BASE_PATH?.trim();
  if (!raw) return "/";
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withSlash.endsWith("/") ? withSlash : `${withSlash}/`;
}

export default defineConfig(({ mode }) => {
  // Merge file env (.env, .env.local, .env.production, …) with process.env (CI / GitHub Actions).
  const loaded = loadEnv(mode, process.cwd());
  const vault = process.env.VITE_VAULT_KEY ?? loaded.VITE_VAULT_KEY ?? "";
  const catKey = process.env.VITE_CAT_API_KEY ?? loaded.VITE_CAT_API_KEY ?? "";

  return {
    base: viteBase(),
    plugins: [react()],
    // Ensures CI embeds these even if only present in .env.production written by Actions.
    define: {
      "import.meta.env.VITE_VAULT_KEY": JSON.stringify(vault),
      "import.meta.env.VITE_CAT_API_KEY": JSON.stringify(catKey),
    },
  };
});
