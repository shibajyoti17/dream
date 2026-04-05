import fs from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub project pages need `/repo-name/`; root custom domains use `/`. Override with VITE_BASE_PATH when building. */
function viteBase(): string {
  const raw = process.env.VITE_BASE_PATH?.trim();
  if (!raw) return "/";
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withSlash.endsWith("/") ? withSlash : `${withSlash}/`;
}

/**
 * CI writes this file in GitHub Actions. We read it manually because Vite's loadEnv()
 * skips any `.env*` file that matches .gitignore (e.g. `.env.production` under `.env.*`).
 */
function readGithubCiEnvFile(): Record<string, string> {
  const p = path.resolve(process.cwd(), "vite.github.env");
  if (!fs.existsSync(p)) return {};
  const out: Record<string, string> = {};
  for (const raw of fs.readFileSync(p, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i === -1) continue;
    const k = line.slice(0, i).trim();
    out[k] = line.slice(i + 1);
  }
  return out;
}

export default defineConfig(({ mode }) => {
  const ciFile = readGithubCiEnvFile();
  const loaded = loadEnv(mode, process.cwd());

  // Use || not ?? so empty strings from CI still fall through to the next source.
  const vault = (
    process.env.VITE_VAULT_KEY ||
    ciFile.VITE_VAULT_KEY ||
    loaded.VITE_VAULT_KEY ||
    ""
  ).trim();
  const catKey = (
    process.env.VITE_CAT_API_KEY ||
    ciFile.VITE_CAT_API_KEY ||
    loaded.VITE_CAT_API_KEY ||
    ""
  ).trim();

  return {
    base: viteBase(),
    plugins: [react()],
    define: {
      "import.meta.env.VITE_VAULT_KEY": JSON.stringify(vault),
      "import.meta.env.VITE_CAT_API_KEY": JSON.stringify(catKey),
    },
  };
});
