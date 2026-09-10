import Masthead from "../Masthead";
import { useTitle } from "../router";
import { SITE } from "../data";
import { READING_LIST, READING_LIST_INTRO } from "../readingList";

const READING_LIST_URL = "/reading-list.md";

export default function Reading() {
  useTitle(`Reading list · ${SITE.name}`);

  return (
    <div className="page">
      <Masthead />
      <article className="post">
        <header className="post-head">
          <div className="entry-meta">
            <span>Reading</span>
          </div>
          <h1 className="post-title">Reading list</h1>
          <p className="post-subtitle">{READING_LIST_INTRO}</p>
        </header>
        <ol className="reading-list">
          {READING_LIST.map((entry, index) => (
            <li key={index} className="reading-list-entry">
              <div className="reading-list-titles">
                {entry.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
              <p>{entry.body}</p>
            </li>
          ))}
        </ol>
        <footer className="post-foot">
          <p>
            <a href={READING_LIST_URL} download="patrick-mcelroy-reading-list.md">
              Download as markdown
            </a>
          </p>
        </footer>
      </article>
    </div>
  );
}
