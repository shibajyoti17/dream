import { type ReactNode, useCallback, useState } from "react";
import { gift } from "../data/personalization";
import {
  clearVaultSession,
  getExpectedVaultKey,
  isVaultConfigured,
  isVaultUnlocked,
  setVaultSession,
  vaultKeysMatch,
} from "../lib/vault";
import "./VaultGate.css";

type Props = { children: ReactNode };

export function VaultGate({ children }: Props) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(() => isVaultUnlocked());

  const expected = getExpectedVaultKey();
  const vaultRequired = isVaultConfigured();

  const tryUnlock = useCallback(() => {
    setError(null);
    if (!vaultRequired) return;
    const candidate = input.trim();
    if (!vaultKeysMatch(candidate, expected)) {
      setError("Almost — that wasn’t quite it. Take another gentle try, love.");
      return;
    }
    setVaultSession(candidate);
    setUnlocked(true);
    setInput("");
  }, [expected, input, vaultRequired]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    tryUnlock();
  };

  const handleLock = () => {
    clearVaultSession();
    setUnlocked(false);
    setInput("");
    setError(null);
  };

  if (!vaultRequired) {
    const liveHint = import.meta.env.PROD ? (
      <>
        This build was deployed <strong>without</strong>{" "}
        <code className="vault-code">VITE_VAULT_KEY</code>. Add it where the app is{" "}
        <strong>built</strong>, then redeploy: e.g.{" "}
        <strong>Vercel</strong> → Project → Settings → Environment Variables; or{" "}
        <strong>GitHub</strong> → Settings → Secrets and variables → Actions (if GitHub Actions builds
        Pages). Use the exact name <code className="vault-code">VITE_VAULT_KEY</code>.
      </>
    ) : (
      <>
        Vault passphrase not set (<code className="vault-code">VITE_VAULT_KEY</code>). Add it in{" "}
        <code className="vault-code">.env.local</code>, then restart{" "}
        <code className="vault-code">npm run dev</code>.
      </>
    );
    return (
      <>
        <div className="vault-dev-banner" role="status">
          <span className="vault-dev-heart" aria-hidden="true">
            ♡
          </span>
          {liveHint}
        </div>
        {children}
      </>
    );
  }

  if (!unlocked) {
    return (
      <div className="vault-screen">
        <div className="vault-ambience" aria-hidden="true">
          <div className="vault-glow" />
          <span className="vault-float vault-float--1">♡</span>
          <span className="vault-float vault-float--2">🐾</span>
          <span className="vault-float vault-float--3">♡</span>
          <span className="vault-float vault-float--4">🐾</span>
          <span className="vault-float vault-float--5">✦</span>
        </div>

        <div className="vault-card">
          <p className="vault-eyebrow">{gift.vault.eyebrow}</p>
          <h1 className="vault-title">
            Hey, <span className="vault-name">{gift.recipientName}</span>
          </h1>
          <p className="vault-subtitle">{gift.vault.subtitle}</p>
          <blockquote className="vault-verse">
            {gift.vault.quote}
            <span className="vault-verse-cite">{gift.vault.quoteAside}</span>
          </blockquote>
          <p className="vault-copy">{gift.vault.invite}</p>
          <form className="vault-form" onSubmit={handleSubmit}>
            <label className="vault-label" htmlFor="vault-key">
              Your magic words
            </label>
            <input
              id="vault-key"
              className="vault-input"
              type="password"
              autoComplete="current-password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="The phrase only we know…"
            />
            {error ? (
              <p className="vault-error" role="alert">
                {error}
              </p>
            ) : null}
            <button type="submit" className="vault-submit">
              <span className="vault-submit-text">Come in</span>
              <span className="vault-submit-heart" aria-hidden="true">
                ♡
              </span>
            </button>
          </form>
          <p className="vault-footnote">
            {gift.vault.footnotePrefix} — {gift.giverName}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="vault-bar">
        <span className="vault-bar-heart" aria-hidden="true">
          ♡
        </span>
        <span className="vault-bar-text">You’re in — welcome home.</span>
        <button type="button" className="vault-lock-btn" onClick={handleLock}>
          Close the door for now
        </button>
      </div>
      {children}
    </>
  );
}
