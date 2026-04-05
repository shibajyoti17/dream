const UNLOCKED = "dream_vault_ok";
const KEY = "dream_vault_key";

export function isVaultUnlocked(): boolean {
  try {
    return sessionStorage.getItem(UNLOCKED) === "1" && Boolean(sessionStorage.getItem(KEY));
  } catch {
    return false;
  }
}

/** Passphrase used for Edge Function calls (same value user entered at unlock). */
export function getVaultPassphrase(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setVaultSession(passphrase: string): void {
  try {
    sessionStorage.setItem(KEY, passphrase);
    sessionStorage.setItem(UNLOCKED, "1");
  } catch {
    /* private mode / quota */
  }
}

export function clearVaultSession(): void {
  try {
    sessionStorage.removeItem(KEY);
    sessionStorage.removeItem(UNLOCKED);
  } catch {
    /* ignore */
  }
}

export function getExpectedVaultKey(): string {
  return (import.meta.env.VITE_VAULT_KEY ?? "").trim();
}

export function isVaultConfigured(): boolean {
  return getExpectedVaultKey().length > 0;
}

/** Constant-time-ish compare for strings of same length; false if lengths differ. */
export function vaultKeysMatch(a: string, b: string): boolean {
  const aa = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  if (aa.length !== bb.length) return false;
  let out = 0;
  for (let i = 0; i < aa.length; i++) out |= aa[i]! ^ bb[i]!;
  return out === 0;
}
