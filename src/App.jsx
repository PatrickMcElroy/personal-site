import { useEffect, useState } from "react";

const GITHUB_URL = "https://github.com/PatrickMcElroy";
const LINKEDIN_URL = "https://www.linkedin.com/in/pdmcelroy/";
const SUBSTACK_URL = "https://substack.com/@patrickdmcelroy";
const CONTACT_CARD_URL = "/patrick-mcelroy.vcf";
const EMAIL_TO = "pat@patrickmcelroy.me";
const RESUME_URL = "/resume/patrick-mcelroy-resume.pdf";

function GitHubCard() {
  return (
    <a className="social-card github" href={GITHUB_URL} target="_blank" rel="noreferrer">
      <div className="card-brand">GitHub</div>
      <div className="card-title">@PatrickMcElroy</div>
    </a>
  );
}

function LinkedInCard() {
  return (
    <a className="social-card linkedin" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
      <div className="card-brand">LinkedIn</div>
      <div className="card-title">@pdmcelroy</div>
    </a>
  );
}

function SubstackCard() {
  return (
    <a className="social-card substack" href={SUBSTACK_URL} target="_blank" rel="noreferrer">
      <div className="card-brand">Substack</div>
      <div className="card-title">@patrickdmcelroy</div>
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

function EmailCard({ onActivate }) {
  return (
    <button
      className="bottom-card email-card"
      type="button"
      onClick={onActivate}
      aria-label="Open email composer modal"
    >
      <span className="card-brand">Reach Out</span>
      <span className="email-icon" aria-hidden="true">
        @
      </span>
    </button>
  );
}

function ResumeCard({ onActivate }) {
  return (
    <button
      className="bottom-card resume-card"
      type="button"
      onClick={onActivate}
      aria-label="Open resume viewer and download options"
    >
      <span className="card-brand">Resume</span>
      <span className="resume-icon" aria-hidden="true">
        PDF
      </span>
    </button>
  );
}

function DinoGameCard() {
  return (
    <div className="bottom-card dino-card">
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
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [emailName, setEmailName] = useState("");
  const [emailFrom, setEmailFrom] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const isMobileDevice =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const contactModalTitleId = "contact-modal-title";
  const contactModalNoteId = "contact-modal-note";
  const resumeModalTitleId = "resume-modal-title";
  const resumeModalNoteId = "resume-modal-note";
  const emailModalTitleId = "email-modal-title";
  const emailModalNoteId = "email-modal-note";

  useEffect(() => {
    if (!isContactModalOpen && !isResumeModalOpen && !isEmailModalOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsContactModalOpen(false);
        setIsResumeModalOpen(false);
        setIsEmailModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isContactModalOpen, isResumeModalOpen, isEmailModalOpen]);

  const onContactActivate = () => {
    if (isMobileDevice) {
      window.location.href = CONTACT_CARD_URL;
      return;
    }

    setIsContactModalOpen(true);
  };

  const onEmailActivate = () => {
    setIsEmailModalOpen(true);
  };

  const onResumeActivate = () => {
    setIsResumeModalOpen(true);
  };

  const onSendEmail = (event) => {
    event.preventDefault();

    const trimmedName = emailName.trim();
    const trimmedFrom = emailFrom.trim();
    const trimmedMessage = emailMessage.trim();

    const subject = trimmedName ? `Website message from ${trimmedName}` : "Website message";
    const bodyLines = [];

    if (trimmedName) bodyLines.push(`Name: ${trimmedName}`);
    if (trimmedFrom) bodyLines.push(`Email: ${trimmedFrom}`);
    bodyLines.push("");
    bodyLines.push(trimmedMessage);

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(bodyLines.join("\r\n"));
    const mailtoQuery = `subject=${encodedSubject}&body=${encodedBody}`;

    window.location.href = `mailto:${EMAIL_TO}?${mailtoQuery}`;
    setIsEmailModalOpen(false);
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
        <ResumeCard onActivate={onResumeActivate} />
        <EmailCard onActivate={onEmailActivate} />
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
            aria-labelledby={contactModalTitleId}
            aria-describedby={contactModalNoteId}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={contactModalTitleId}>Add Patrick McElroy</h2>
            <p id={contactModalNoteId}>
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
      {isResumeModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setIsResumeModalOpen(false)}
        >
          <section
            className="contact-modal resume-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={resumeModalTitleId}
            aria-describedby={resumeModalNoteId}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={resumeModalTitleId}>Resume</h2>
            <p id={resumeModalNoteId}>View or download the latest PDF.</p>
            <div className="resume-viewer-wrap">
              <iframe className="resume-viewer" title="Patrick McElroy Resume" src={RESUME_URL} />
            </div>
            <div className="modal-actions">
              <a href={RESUME_URL} target="_blank" rel="noreferrer">
                Open in New Tab
              </a>
              <a href={RESUME_URL} download="patrick-mcelroy-resume.pdf">
                Download PDF
              </a>
              <button type="button" onClick={() => setIsResumeModalOpen(false)}>
                Close
              </button>
            </div>
          </section>
        </div>
      )}
      {isEmailModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setIsEmailModalOpen(false)}
        >
          <section
            className="contact-modal email-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={emailModalTitleId}
            aria-describedby={emailModalNoteId}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={emailModalTitleId}>Reach Out</h2>
            <p id={emailModalNoteId}>Write your message and your mail app will open pre-filled.</p>
            <form className="email-form" onSubmit={onSendEmail}>
              <label htmlFor="email-name">
                Name
                <input
                  id="email-name"
                  type="text"
                  value={emailName}
                  onChange={(event) => setEmailName(event.target.value)}
                />
              </label>
              <label htmlFor="email-from">
                Your Email
                <input
                  id="email-from"
                  type="email"
                  value={emailFrom}
                  onChange={(event) => setEmailFrom(event.target.value)}
                />
              </label>
              <label htmlFor="email-message">
                Message
                <textarea
                  id="email-message"
                  required
                  value={emailMessage}
                  onChange={(event) => setEmailMessage(event.target.value)}
                />
              </label>
              <div className="modal-actions">
                <button type="submit">Compose Email</button>
                <button type="button" onClick={() => setIsEmailModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
