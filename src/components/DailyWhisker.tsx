import { useMemo } from "react";
import { gift } from "../data/personalization";
import "./DailyWhisker.css";

function pickDailyIndex(length: number): number {
  if (length === 0) return 0;
  const day = new Date();
  const seed = day.getFullYear() * 1000 + day.getMonth() * 50 + day.getDate();
  return seed % length;
}

export function DailyWhisker() {
  const factIndex = useMemo(
    () => pickDailyIndex(gift.catFacts.length),
    []
  );
  const noteIndex = useMemo(
    () => pickDailyIndex(gift.notesForHer.length),
    []
  );

  const fact = gift.catFacts[factIndex] ?? "";
  const note = gift.notesForHer[noteIndex] ?? "";

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
          <article className="whisker-card whisker-card--fact">
            <h3 className="whisker-card-title">Cat fact</h3>
            <p className="whisker-card-body">{fact}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
