import { gift } from "../data/personalization";
import "./Hero.css";

/** public/cover.jpg — BASE_URL keeps GitHub Pages subpaths working */
const coverSrc = `${import.meta.env.BASE_URL}cover.jpg`;

export function Hero() {
  return (
    <div className="hero-shell">
      <img
        className="hero-cover"
        src={coverSrc}
        alt=""
        width={1920}
        height={1080}
        decoding="async"
        fetchPriority="low"
        aria-hidden
      />
      <div className="hero-wash" aria-hidden="true" />

      <header className="hero" role="banner">
        <div className="hero-inner">
          <p className="hero-eyebrow">Made with love (and cats)</p>
          <h1 className="hero-title">{gift.recipientName}</h1>
          <p className="hero-tagline">{gift.tagline}</p>
          <div className="hero-paws" aria-hidden="true">
            <span>🐾</span>
            <span>🐾</span>
            <span>🐾</span>
          </div>
        </div>
      </header>

      <section className="section hero-shell-intro" aria-labelledby="intro-heading">
        <div className="section-inner narrow">
          <h2 id="intro-heading" className="section-title hero-shell-intro-title">
            For {gift.recipientName}
          </h2>
          <p className="lead hero-shell-intro-lead">{gift.dedication}</p>
        </div>
      </section>
    </div>
  );
}
