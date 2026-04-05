import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub project pages need `/repo-name/`; root custom domains use `/`. Override with VITE_BASE_PATH when building. */
function viteBase(): string {
  const raw = process.env.VITE_BASE_PATH?.trim();
  if (!raw) return "/";
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withSlash.endsWith("/") ? withSlash : `${withSlash}/`;
}

export default defineConfig({
  base: viteBase(),
  plugins: [react()],
});
