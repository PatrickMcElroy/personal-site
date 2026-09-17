import { useLayoutEffect, useRef, useState } from "react";
import Masthead from "../Masthead";
import { Link, useTitle } from "../router";
import { PROJECT, SITE, formatDate } from "../data";
import { PUBLISHED } from "../writing";

const FIXED_LAYOUT_QUERY = "(min-width: 1001px) and (min-height: 480px)";

// On the fixed-height desktop layout, show only as many entries as fit in the
// column and offer a link to the full list. Everything is rendered for one
// unpainted measuring pass, then trimmed before the browser paints. A
// ResizeObserver on the column re-runs the pass whenever its size changes.
function useFitCount(listRef, total) {
  const [state, setState] = useState({ pass: 0, count: total, measuring: true });
  const lastSize = useRef("");

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const remeasure = () => {
      const size = `${list.clientWidth}x${list.clientHeight}`;
      if (size === lastSize.current) return;
      lastSize.current = size;
      setState((prev) => ({ pass: prev.pass + 1, count: total, measuring: true }));
    };
    const observer = new ResizeObserver(remeasure);
    observer.observe(list);
    document.fonts?.ready.then(() => {
      lastSize.current = "";
      remeasure();
    });
    return () => observer.disconnect();
  }, [listRef, total]);

  useLayoutEffect(() => {
    if (!state.measuring) return;
    const list = listRef.current;
    const finish = (count) => setState((prev) => ({ ...prev, count, measuring: false }));
    if (!list || !window.matchMedia(FIXED_LAYOUT_QUERY).matches) {
      finish(total);
      return;
    }
    const entries = Array.from(list.querySelectorAll(".entry"));
    const more = list.querySelector(".entry-more");
    const available = list.clientHeight + 1;
    const bottom = (el) => el.offsetTop + el.offsetHeight;
    const last = entries[entries.length - 1];
    if (!last || bottom(last) <= available) {
      finish(total);
      return;
    }
    const limit = available - (more ? more.offsetHeight : 0);
    const fits = entries.filter((el) => bottom(el) <= limit).length;
    finish(Math.max(fits, 1));
  }, [state.pass, state.measuring, listRef, total]);

  return state.measuring
    ? { count: total, showMore: true }
    : { count: state.count, showMore: state.count < total };
}

function WritingEntry({ post }) {
  return (
    <Link className="entry" href={`/writing/${post.slug}`}>
      <div className="entry-meta">
        <span>Writing</span>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </div>
      <h3 className="entry-title">{post.title}</h3>
      {post.subtitle && <p className="entry-subtitle">{post.subtitle}</p>}
    </Link>
  );
}

export default function Home() {
  useTitle(SITE.name);
  const listRef = useRef(null);
  const { count, showMore } = useFitCount(listRef, PUBLISHED.length);

  return (
    <div className="page home">
      <Masthead showName={false} />

      <main className="home-grid">
        <div className="home-left">
          <section className="feature">
            <div className="feature-head">
              <div className="entry-meta">
                <span>{PROJECT.kicker}</span>
                <time dateTime={PROJECT.date}>{formatDate(PROJECT.date)}</time>
              </div>
              <h2 className="feature-title">
                <Link href={PROJECT.url} external>
                  {PROJECT.title}
                  <span className="feature-domain">{PROJECT.domain}</span>
                </Link>
              </h2>
            </div>
            <Link className="feature-image" href={PROJECT.url} external aria-label={PROJECT.title}>
              <img src={PROJECT.image} alt={PROJECT.imageAlt} width="2160" height="980" />
            </Link>
          </section>

          <section className="intro">
            <h1 className="site-name">{SITE.name}</h1>
          </section>
        </div>

        <aside className="writing" aria-label="Writing" ref={listRef}>
          {PUBLISHED.slice(0, count).map((post) => (
            <WritingEntry key={post.slug} post={post} />
          ))}
          {showMore && (
            <Link className="entry-more" href="/writing">
              View all writing
            </Link>
          )}
        </aside>
      </main>

      <footer className="foot">
        <span>{SITE.location}</span>
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        <a href={`tel:${SITE.phoneLink}`}>{SITE.phoneDisplay}</a>
        <a href={SITE.vcard} download="patrick-mcelroy.vcf">
          Add contact
        </a>
      </footer>
    </div>
  );
}
