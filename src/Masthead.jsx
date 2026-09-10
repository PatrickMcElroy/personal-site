import { Link } from "./router";
import { NAV_LINKS, SITE } from "./data";

export default function Masthead({ showName = true }) {
  return (
    <header className="masthead">
      {showName ? (
        <Link className="wordmark" href="/">
          {SITE.name}
        </Link>
      ) : (
        <span className="wordmark wordmark-spacer" aria-hidden="true" />
      )}
      <nav className="masthead-links" aria-label="Links">
        {NAV_LINKS.map((link) => (
          <Link key={link.label} href={link.href} external={link.external}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
