import { useEffect, useMemo, useState } from "react";
import { gift } from "../data/personalization";
import {
  calendarDayKey,
  factLineFromBreed,
  fetchBreedsCached,
  getCatApiKey,
  indexForDay,
} from "../lib/catApi";
import "./DailyWhisker.css";

const STORAGE_FACT = "whisker-cat-fact-day";

function pickDailyIndex(length: number): number {
  if (length === 0) return 0;
  const day = new Date();
  const seed = day.getFullYear() * 1000 + day.getMonth() * 50 + day.getDate();
  return seed % length;
}

function loadCachedFact(dayKey: string): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_FACT);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { dayKey: string; text: string };
    if (parsed.dayKey === dayKey && typeof parsed.text === "string" && parsed.text.trim()) {
      return parsed.text.trim();
    }
  } catch {
    /* ignore */
  }
  return null;
}

function saveCachedFact(dayKey: string, text: string) {
  try {
    localStorage.setItem(STORAGE_FACT, JSON.stringify({ dayKey, text }));
  } catch {
    /* ignore */
  }
}

export function DailyWhisker() {
  const hasKey = useMemo(() => Boolean(getCatApiKey()), []);
  const dayKey = useMemo(() => calendarDayKey(), []);

  const staticFact = useMemo(() => {
    const i = pickDailyIndex(gift.catFacts.length);
    return gift.catFacts[i] ?? "";
  }, []);

  const [factText, setFactText] = useState(() => {
    if (!getCatApiKey()) return staticFact;
    return loadCachedFact(calendarDayKey()) ?? "";
  });
  const [factLoading, setFactLoading] = useState(() => {
    if (!getCatApiKey()) return false;
    return loadCachedFact(calendarDayKey()) === null;
  });

  const noteIndex = useMemo(
    () => pickDailyIndex(gift.notesForHer.length),
    []
  );
  const note = gift.notesForHer[noteIndex] ?? "";

  useEffect(() => {
    if (!hasKey) return;

    const cached = loadCachedFact(dayKey);
    if (cached) {
      setFactText(cached);
      setFactLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setFactLoading(true);
      try {
        const breeds = await fetchBreedsCached();
        if (cancelled) return;
        if (!breeds.length) throw new Error("NO_BREEDS");
        const idx = indexForDay(`${dayKey}|whisker-fact`, breeds.length);
        const text = factLineFromBreed(breeds[idx]!, dayKey);
        saveCachedFact(dayKey, text);
        setFactText(text);
      } catch {
        if (!cancelled) setFactText(staticFact);
      } finally {
        if (!cancelled) setFactLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasKey, dayKey, staticFact]);

  return (
    <section className="section whisker-section" aria-labelledby="whisker-heading">
      <div className="section-inner">
        <h2 id="whisker-heading" className="section-title">
          Today’s whisker
        </h2>
        <p className="whisker-sub">
          A fresh pick each calendar day — open anytime you need a lift.
        </p>
        <div className="whisker-grid">
          <article className="whisker-card whisker-card--note">
            <h3 className="whisker-card-title">From me</h3>
            <p className="whisker-card-body">{note}</p>
          </article>
          <article className="whisker-card whisker-card--fact" aria-busy={factLoading}>
            <h3 className="whisker-card-title">Cat fact</h3>
            {factLoading ? (
              <div className="whisker-skeleton whisker-skeleton--fact" />
            ) : (
              <p className="whisker-card-body">{factText}</p>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
