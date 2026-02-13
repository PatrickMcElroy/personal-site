import { useEffect, useState } from "react";

const GITHUB_URL = "https://github.com/PatrickMcElroy";
const LINKEDIN_URL = "https://www.linkedin.com/in/pdmcelroy/";
const SUBSTACK_URL = "https://substack.com/@patrickdmcelroy";
const SUBSTACK_HANDLE = "patrickdmcelroy";
const CONTACT_CARD_URL = "/patrick-mcelroy.vcf";

function useGitHubCardData() {
  const [state, setState] = useState({ loading: true, data: null });

  useEffect(() => {
    let cancelled = false;

    fetch("https://api.github.com/users/PatrickMcElroy")
      .then((response) => {
        if (!response.ok) throw new Error("GitHub API unavailable");
        return response.json();
      })
      .then((data) => {
        if (!cancelled) setState({ loading: false, data });
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, data: null });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

function useSubstackCardData() {
  const [state, setState] = useState({ loading: true, post: null });

  useEffect(() => {
    let cancelled = false;

    fetch(`https://${SUBSTACK_HANDLE}.substack.com/api/v1/posts?limit=1`)
      .then((response) => {
        if (!response.ok) throw new Error("Substack API unavailable");
        return response.json();
      })
      .then((posts) => {
        if (!cancelled) {
          const latest = Array.isArray(posts) && posts.length > 0 ? posts[0] : null;
          setState({ loading: false, post: latest });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, post: null });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

function GitHubCard() {
  const { loading, data } = useGitHubCardData();

  return (
    <a className="social-card github" href={GITHUB_URL} target="_blank" rel="noreferrer">
      <div className="card-brand">GitHub</div>
      {loading && <div className="card-loading" />}
      {!loading && data && (
        <>
          <img className="avatar" src={data.avatar_url} alt={data.login} />
          <div className="card-title">{data.name || data.login}</div>
          <div className="card-meta">
            <span>{data.public_repos} repos</span>
            <span>{data.followers} followers</span>
          </div>
        </>
      )}
      {!loading && !data && <div className="card-title">Profile</div>}
    </a>
  );
}

function LinkedInCard() {
  return (
    <a className="social-card linkedin" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
      <div className="card-brand">LinkedIn</div>
      <div className="linked-in-mark">in</div>
      <div className="card-title">pdmcelroy</div>
      <div className="card-meta">
        <span>Profile</span>
      </div>
    </a>
  );
}

function SubstackCard() {
  const { loading, post } = useSubstackCardData();
  const dateLabel =
    post?.post_date && !Number.isNaN(new Date(post.post_date).getTime())
      ? new Date(post.post_date).toLocaleDateString()
      : null;

  return (
    <a className="social-card substack" href={SUBSTACK_URL} target="_blank" rel="noreferrer">
      <div className="card-brand">Substack</div>
      {loading && <div className="card-loading" />}
      {!loading && post && (
        <>
          <div className="card-title">{post.title}</div>
          <div className="card-meta">
            {dateLabel && <span>{dateLabel}</span>}
            {typeof post.audience === "number" && <span>{post.audience} reads</span>}
          </div>
        </>
      )}
      {!loading && !post && <div className="card-title">@patrickdmcelroy</div>}
    </a>
  );
}

function ContactCard({ onActivate }) {
  return (
    <button
      className="social-card contact-add"
      type="button"
      onClick={onActivate}
      aria-label="Add Patrick McElroy to contacts"
    >
      <span className="contact-plus" aria-hidden="true">
        +
      </span>
      <span className="contact-label">Add Contact</span>
    </button>
  );
}

function DinoGameCard() {
  return (
    <div className="dino-card">
      <iframe
        className="dino-iframe"
        title="Chrome T-Rex Runner"
        src="/trex/index.html"
        sandbox="allow-scripts"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const isMobileDevice =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const modalTitleId = "contact-modal-title";
  const modalNoteId = "contact-modal-note";

  useEffect(() => {
    if (!isContactModalOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsContactModalOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isContactModalOpen]);

  const onContactActivate = () => {
    if (isMobileDevice) {
      window.location.href = CONTACT_CARD_URL;
      return;
    }

    setIsContactModalOpen(true);
  };

  return (
    <main className="app-shell">
      <h1>Patrick McElroy</h1>
      <section className="cards-row">
        <GitHubCard />
        <LinkedInCard />
        <SubstackCard />
        <ContactCard onActivate={onContactActivate} />
      </section>
      <section className="bottom-row">
        <DinoGameCard />
      </section>
      {isContactModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setIsContactModalOpen(false)}
        >
          <section
            className="contact-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
            aria-describedby={modalNoteId}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={modalTitleId}>Add Patrick McElroy</h2>
            <p id={modalNoteId}>
              On desktop, import this contact card into Contacts or your address book.
            </p>
            <div className="modal-links">
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={SUBSTACK_URL} target="_blank" rel="noreferrer">
                Substack
              </a>
            </div>
            <div className="modal-actions">
              <a href={CONTACT_CARD_URL} download="patrick-mcelroy.vcf">
                Download vCard
              </a>
              <button type="button" onClick={() => setIsContactModalOpen(false)}>
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
