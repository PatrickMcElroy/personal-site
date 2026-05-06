import { useEffect, useState } from "react";

const LINKEDIN_URL = "https://www.linkedin.com/in/pdmcelroy/";
const CONSULTING_EMAIL = "consulting@patrickmcelroy.me";
const CONTACT_CARD_URL = "/patrick-mcelroy.vcf";
const EMAIL_TO = "pat@patrickmcelroy.me";
const PHONE_DISPLAY = "(757) 754-8111";
const PHONE_LINK = "+17577548111";

function LinkedInCard() {
  return (
    <a className="social-card linkedin" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
      <div className="card-brand">LinkedIn</div>
      <div className="card-title">@pdmcelroy</div>
    </a>
  );
}

function ConsultingCard() {
  return (
    <a className="social-card consulting" href={`mailto:${CONSULTING_EMAIL}`}>
      <div className="card-brand">Consulting</div>
      <div className="card-title">{CONSULTING_EMAIL}</div>
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
      className="social-card email-link-card"
      type="button"
      onClick={onActivate}
      aria-label="Open email modal"
    >
      <span className="card-brand">Email</span>
      <span className="card-title">{EMAIL_TO}</span>
    </button>
  );
}

function AboutCard() {
  return (
    <article className="bottom-card about-card">
      <h2>About</h2>
      <p>
        I've led AI integration efforts at both Bloomberg, where I started after graduating from
        the University of Michigan in 2023, and Cargomatic, a logistics startup where I served as
        AI lead. Working across a major financial data company and an early-stage operator gave me
        a cross-industry view of how AI actually gets deployed, and how differently non-technical
        industries approach adoption.
      </p>
      <p>
        Today I advise companies on AI integration strategy through Patrick McElroy Consulting,
        with a particular interest in how policy and governance shape what's actually shippable. I
        grew up in Hampton Roads and stay close to Virginia's energy landscape as data center
        demand reshapes the grid.
      </p>
    </article>
  );
}

export default function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailName, setEmailName] = useState("");
  const [emailFrom, setEmailFrom] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const isMobileDevice =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const contactModalTitleId = "contact-modal-title";
  const contactModalNoteId = "contact-modal-note";
  const emailModalTitleId = "email-modal-title";
  const emailModalNoteId = "email-modal-note";

  useEffect(() => {
    if (!isContactModalOpen && !isEmailModalOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsContactModalOpen(false);
        setIsEmailModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isContactModalOpen, isEmailModalOpen]);

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
      <header className="app-header">
        <div className="app-heading">
          <h1>Patrick McElroy</h1>
          <p className="tagline">
            AI deployment, policy, and strategy · Norfolk, Virginia
          </p>
        </div>
        <img className="headshot" src="/headshot.jpg" alt="Patrick McElroy" />
      </header>
      <section className="cards-row">
        <LinkedInCard />
        <ConsultingCard />
        <EmailCard onActivate={onEmailActivate} />
        <ContactCard onActivate={onContactActivate} />
      </section>
      <section className="bottom-row">
        <AboutCard />
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
            <div className="contact-details">
              <a href={`tel:${PHONE_LINK}`}>{PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL_TO}`}>{EMAIL_TO}</a>
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
            <h2 id={emailModalTitleId}>Email</h2>
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
