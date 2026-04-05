import { useCallback, useEffect, useMemo, useState } from "react";
import type { Breed, CatImage } from "../lib/catApi";
import {
  calendarDayKey,
  fetchBreeds,
  fetchCatImages,
  getCatApiKey,
  indexForDay,
} from "../lib/catApi";
import "./CatApiSection.css";

const STORAGE_IMAGE = "whisker-cat-image-day";
const STORAGE_BREEDS = "whisker-cat-breeds-cache";

type CachedDailyImage = { dayKey: string; image: CatImage };

function loadCachedImage(dayKey: string): CatImage | null {
  try {
    const raw = localStorage.getItem(STORAGE_IMAGE);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedDailyImage;
    if (parsed.dayKey === dayKey && parsed.image?.url) return parsed.image;
  } catch {
    /* ignore */
  }
  return null;
}

function saveCachedImage(dayKey: string, image: CatImage) {
  try {
    localStorage.setItem(STORAGE_IMAGE, JSON.stringify({ dayKey, image }));
  } catch {
    /* ignore */
  }
}

function loadBreedsCache(): Breed[] | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_BREEDS);
    if (!raw) return null;
    const list = JSON.parse(raw) as Breed[];
    return Array.isArray(list) && list.length ? list : null;
  } catch {
    return null;
  }
}

function saveBreedsCache(list: Breed[]) {
  try {
    sessionStorage.setItem(STORAGE_BREEDS, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

function imageAlt(img: CatImage): string {
  const b = img.breeds?.[0];
  if (b?.name) return `${b.name} — photo from The Cat API`;
  return "A cat — photo from The Cat API";
}

export function CatApiSection() {
  const hasKey = useMemo(() => Boolean(getCatApiKey()), []);
  const dayKey = useMemo(() => calendarDayKey(), []);

  const [dailyImage, setDailyImage] = useState<CatImage | null>(null);
  const [dailyLoading, setDailyLoading] = useState(hasKey);
  const [dailyError, setDailyError] = useState<string | null>(null);

  const [breedOfDay, setBreedOfDay] = useState<Breed | null>(null);
  const [breedLoading, setBreedLoading] = useState(hasKey);
  const [breedError, setBreedError] = useState<string | null>(null);

  const [bonus, setBonus] = useState<CatImage | null>(null);
  const [bonusLoading, setBonusLoading] = useState(false);

  useEffect(() => {
    if (!hasKey) return;

    const cached = loadCachedImage(dayKey);
    if (cached) {
      setDailyImage(cached);
      setDailyLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setDailyLoading(true);
      setDailyError(null);
      try {
        const batch = await fetchCatImages({ limit: 15, has_breeds: 1 });
        if (cancelled) return;
        if (!batch.length) {
          setDailyError("No images returned — try again later.");
          setDailyLoading(false);
          return;
        }
        const idx = indexForDay(dayKey, batch.length);
        const chosen = batch[idx]!;
        saveCachedImage(dayKey, chosen);
        setDailyImage(chosen);
      } catch (e) {
        if (!cancelled) {
          setDailyError(e instanceof Error ? e.message : "Could not load today’s cat.");
        }
      } finally {
        if (!cancelled) setDailyLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasKey, dayKey]);

  useEffect(() => {
    if (!hasKey) return;

    let cancelled = false;
    (async () => {
      setBreedLoading(true);
      setBreedError(null);
      try {
        let list = loadBreedsCache();
        if (!list) {
          list = await fetchBreeds();
          saveBreedsCache(list);
        }
        if (cancelled) return;
        if (!list.length) {
          setBreedError("No breeds data.");
          setBreedLoading(false);
          return;
        }
        const idx = indexForDay(dayKey, list.length);
        setBreedOfDay(list[idx]!);
      } catch (e) {
        if (!cancelled) {
          setBreedError(e instanceof Error ? e.message : "Could not load breed info.");
        }
      } finally {
        if (!cancelled) setBreedLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasKey, dayKey]);

  const loadBonus = useCallback(async () => {
    if (!hasKey) return;
    setBonusLoading(true);
    try {
      const batch = await fetchCatImages({ limit: 1 });
      if (batch[0]) setBonus(batch[0]);
    } catch {
      /* silent — button can retry */
    } finally {
      setBonusLoading(false);
    }
  }, [hasKey]);

  if (!hasKey) {
    return (
      <section className="section catapi-section" aria-labelledby="catapi-heading">
        <div className="section-inner">
          <h2 id="catapi-heading" className="section-title">
            Live cats
          </h2>
          <div className="catapi-card catapi-card--hint">
            <p className="catapi-hint">
              {import.meta.env.PROD ? (
                <>
                  Add <code className="catapi-code">VITE_CAT_API_KEY</code> in your host&apos;s{" "}
                  <strong>environment variables</strong> for production (e.g.{" "}
                  <strong>Vercel</strong> → Settings → Environment Variables, or{" "}
                  <strong>GitHub Actions</strong> secrets if Pages builds there), then{" "}
                  <strong>redeploy</strong>. <code className="catapi-code">.env.local</code> is only
                  for your computer — it is not used on the live site.
                </>
              ) : (
                <>
                  Add your{" "}
                  <a
                    href="https://thecatapi.com/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Cat API
                  </a>{" "}
                  key as <code className="catapi-code">VITE_CAT_API_KEY</code> in{" "}
                  <code className="catapi-code">.env.local</code>, then restart{" "}
                  <code className="catapi-code">npm run dev</code>.
                </>
              )}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section catapi-section" aria-labelledby="catapi-heading">
      <div className="section-inner">
        <h2 id="catapi-heading" className="section-title">
          Your daily dose of cuteness and surprises
        </h2>
        <p className="catapi-lead">
          Here's your surprise for today Kuttus. Look at that beautiful cat! She is beautiful and she is all yours.
        </p>

        <div className="catapi-grid">
          <article className="catapi-card catapi-card--image" aria-busy={dailyLoading}>
            <h3 className="catapi-card-title">Cat image of the day</h3>
            {dailyLoading ? (
              <div className="catapi-skeleton catapi-skeleton--hero" />
            ) : dailyError ? (
              <p className="catapi-error" role="alert">
                {dailyError}
              </p>
            ) : dailyImage ? (
              <>
                <figure className="catapi-figure">
                  <img
                    src={dailyImage.url}
                    alt={imageAlt(dailyImage)}
                    width={dailyImage.width}
                    height={dailyImage.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="catapi-caption">
                    {dailyImage.breeds?.[0]?.name ?? "Mystery cat"} · cached for {dayKey}
                  </figcaption>
                </figure>
              </>
            ) : null}
          </article>

          <div className="catapi-stack">
            <article className="catapi-card" aria-busy={breedLoading}>
              <h3 className="catapi-card-title">Breed of the day</h3>
              {breedLoading ? (
                <div className="catapi-skeleton catapi-skeleton--text" />
              ) : breedError ? (
                <p className="catapi-error" role="alert">
                  {breedError}
                </p>
              ) : breedOfDay ? (
                <div className="breed-block">
                  <p className="breed-name">{breedOfDay.name}</p>
                  <p className="breed-meta">
                    {breedOfDay.origin} · {breedOfDay.life_span}
                  </p>
                  <p className="breed-temper">{breedOfDay.temperament}</p>
                  <p className="breed-desc">{truncate(breedOfDay.description, 280)}</p>
                </div>
              ) : null}
            </article>

            <article className="catapi-card catapi-card--bonus">
              <h3 className="catapi-card-title">Bonus kitty</h3>
              <p className="catapi-bonus-intro">
                Tap for another random cat whenever you want an extra dose of cute.
              </p>
              <button
                type="button"
                className="catapi-button"
                onClick={loadBonus}
                disabled={bonusLoading}
              >
                {bonusLoading ? "Fetching…" : "Surprise me"}
              </button>
              {bonus ? (
                <figure className="catapi-figure catapi-figure--small">
                  <img
                    src={bonus.url}
                    alt={imageAlt(bonus)}
                    width={bonus.width}
                    height={bonus.height}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ) : null}
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

function truncate(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}
