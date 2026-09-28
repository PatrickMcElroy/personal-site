import Masthead from "../Masthead";
import { Link, useTitle } from "../router";
import { SITE, formatDate } from "../data";
import { RESEARCH_IDEAS } from "../writing";

function specValue(post, label) {
  return post.spec?.find((item) => item.label === label)?.value;
}

export default function ResearchIdeas() {
  useTitle(`Research ideas · ${SITE.name}`);

  return (
    <div className="page">
      <Masthead />
      <article className="post">
        <header className="post-head">
          <h1 className="post-title">Research ideas</h1>
        </header>
        <div className="writing writing-index">
          {RESEARCH_IDEAS.map((post) => {
            const summary = post.subtitle ?? specValue(post, "Question");
            const compute = specValue(post, "Est. compute");
            return (
              <Link key={post.slug} className="entry" href={`/writing/${post.slug}`}>
                <div className="entry-meta">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  {compute && <span>{compute}</span>}
                  {post.draft && <span className="entry-draft">Draft</span>}
                </div>
                <h3 className="entry-title">{post.title}</h3>
                {summary && <p className="entry-subtitle">{summary}</p>}
              </Link>
            );
          })}
        </div>
      </article>
    </div>
  );
}
