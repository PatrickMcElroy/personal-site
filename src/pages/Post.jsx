import Masthead from "../Masthead";
import { Link, useTitle } from "../router";
import { SITE, formatDate } from "../data";
import { POSTS } from "../writing";

export default function Post({ post }) {
  useTitle(`${post.title} · ${SITE.name}`);
  const index = POSTS.indexOf(post);
  const newer = index > 0 ? POSTS[index - 1] : null;
  const older = index < POSTS.length - 1 ? POSTS[index + 1] : null;

  return (
    <div className="page">
      <Masthead />
      <article className="post">
        <header className="post-head">
          <div className="entry-meta">
            <span>Writing</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          <h1 className="post-title">{post.title}</h1>
          {post.subtitle && <p className="post-subtitle">{post.subtitle}</p>}
        </header>
        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.html }} />
        <footer className="post-foot">
          <p>
            Originally published on{" "}
            <a href={post.substack} target="_blank" rel="noreferrer">
              Substack
            </a>
            .
          </p>
          <nav className="post-nav" aria-label="More writing">
            {older ? (
              <Link href={`/writing/${older.slug}`}>
                <span>Older</span>
                {older.title}
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link href={`/writing/${newer.slug}`} className="post-nav-newer">
                <span>Newer</span>
                {newer.title}
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </footer>
      </article>
    </div>
  );
}
