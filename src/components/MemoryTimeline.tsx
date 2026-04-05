import { gift } from "../data/personalization";
import "./MemoryTimeline.css";

export function MemoryTimeline() {
  return (
    <section className="section timeline-section" aria-labelledby="timeline-heading">
      <div className="section-inner">
        <h2 id="timeline-heading" className="section-title">
          Little memories
        </h2>
        <p className="timeline-sub">Moments worth keeping — a little timeline of us.</p>

        <ol className="timeline">
          {gift.memories.map((m, i) => (
            <li key={`static-${i}`} className="timeline-item">
              <span className="timeline-date">{m.dateLabel}</span>
              <h3 className="timeline-title">{m.title}</h3>
              {m.imageSrc ? (
                <figure className="timeline-figure">
                  <img src={m.imageSrc} alt={m.imageAlt ?? m.title} loading="lazy" />
                </figure>
              ) : null}
              <p className="timeline-body">{m.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
