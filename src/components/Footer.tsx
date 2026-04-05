import { gift } from "../data/personalization";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <p className="footer-line">
        Always yours — <span className="footer-name">{gift.giverName}</span>
      </p>
      <p className="footer-quiet">Made with love &amp; warmth</p>
    </footer>
  );
}
