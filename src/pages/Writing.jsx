import Masthead from "../Masthead";
import { Link, useTitle } from "../router";
import { SITE, formatDate } from "../data";
import { POSTS } from "../writing";

export default function Writing() {
  useTitle(`Writing · ${SITE.name}`);

  return (
    <div className="page">
      <Masthead />
      <article className="post">
        <header className="post-head">
          <h1 className="post-title">Writing</h1>
        </header>
        <div className="writing writing-index">
          {POSTS.map((post) => (
            <Link key={post.slug} className="entry" href={`/writing/${post.slug}`}>
              <div className="entry-meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <h3 className="entry-title">{post.title}</h3>
              {post.subtitle && <p className="entry-subtitle">{post.subtitle}</p>}
            </Link>
          ))}
        </div>
        <footer className="post-foot">
          <p>
            Also on{" "}
            <a href={SITE.substack} target="_blank" rel="noreferrer">
              Substack
            </a>
            .
          </p>
        </footer>
      </article>
    </div>
  );
}
