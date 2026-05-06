import { useEffect, useState } from "react";

const LINKEDIN_URL = "https://www.linkedin.com/in/pdmcelroy/";
const CALENDLY_URL = "https://calendly.com/pmc-consult/intro";
const CONTACT_CARD_URL = "/patrick-mcelroy.vcf";
const READING_LIST_URL = "/reading-list.md";
const EMAIL_TO = "consulting@patrickmcelroy.me";
const PHONE_DISPLAY = "(757) 754-8111";
const PHONE_LINK = "+17577548111";

const READING_LIST_INTRO =
  "This list is roughly ordered by (how valuable I think the piece is) / (how long it is).";

const READING_LIST = [
  {
    links: [
      {
        label: "What are we scaling?",
        href: "https://www.youtube.com/watch?v=_zgnSbu5GqE",
      },
    ],
    body: (
      <>
        Great short recap on AI capabilities as of the end of 2025 along with predictions for the
        future and where the main labs are over and underhyping things. This dude I find pretty
        trustworthy as a podcaster with no career in the industry but a history of deep
        understanding in the field and good interviews with the top researchers.
      </>
    ),
  },
  {
    links: [
      { label: "AI 2027", href: "https://ai-2027.com/" },
      {
        label: "Timelines Forecast — AI 2027",
        href: "https://ai-2027.com/research/timelines-forecast",
      },
    ],
    body: (
      <>
        This did the rounds in 2025 as a decent (if dramatized for virality) vision of how the next
        few years could go. The main author left OpenAI and forfeited like 2 million in stock to
        write this (because at the time OpenAI could claw back equity if you said anything bad),
        which I think builds some credibility towards not exaggerating capabilities with a profit
        motive. If you've already read it, the timelines forecast piece they released recently is a
        good complement (though making lots of questionable assumptions) building off of the METR
        study findings.
      </>
    ),
  },
  {
    links: [
      {
        label: "Measuring AI Ability to Complete Long Tasks — METR",
        href: "https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/",
      },
    ],
    body: (
      <>
        Study I sent across — I think this does tend to lose value as the horizon gets longer (what
        is a 20 hour coding task?), but think it is a decent proxy for exponential software
        development progress. I think this org is pretty unbiased as they released{" "}
        <a
          href="https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/"
          target="_blank"
          rel="noreferrer"
        >
          a different study
        </a>{" "}
        showing that engineers were getting negative uplift from existing models, as well as
        refusing funding from the main labs.
      </>
    ),
  },
  {
    links: [
      {
        label: "SITUATIONAL AWARENESS — The Decade Ahead",
        href: "https://situational-awareness.ai/",
      },
    ],
    body: (
      <>
        This is quite long, but is a pretty seminal paper capturing the belief (that I think) is
        behind the kind of capex cycles we are seeing.{" "}
        <a
          href="https://situational-awareness.ai/from-gpt-4-to-agi/"
          target="_blank"
          rel="noreferrer"
        >
          The first section
        </a>{" "}
        is probably the most valuable in terms of actually getting across his belief in why scaling
        will continue. Worth noting this guy quit OpenAI to found a hedge fund based on these
        beliefs.
      </>
    ),
  },
  {
    links: [
      {
        label: "Data on Frontier AI Data Centers — Epoch AI",
        href: "https://epoch.ai/data/data-centers",
      },
    ],
    body: (
      <>
        Good supplemental data people are keeping on data center buildout. Intuition pump that
        scaling raw compute for the next few years does not require anything not already under
        construction with power/chips/land already acquired.
      </>
    ),
  },
  {
    links: [
      {
        label: "Emergent introspective awareness in large language models — Anthropic",
        href: "https://www.anthropic.com/research/introspection",
      },
      {
        label: "Claude's Constitution — Anthropic",
        href: "https://www.anthropic.com/constitution",
      },
    ],
    body: (
      <>
        The top one here gets a bit technical, but helpful intuition pump on these models being
        potentially more than just stochastic parrots. The second I consider a complement just out
        of the wildness of this being the best way of training the models, due in part to the
        technical mechanics of the first paper. That Anthropic was able to score better in many
        qualitative settings due to training on something as subtle as this kind of constitution,
        as well as it even being written like this in the first place, is insane to me.
      </>
    ),
  },
  {
    links: [
      {
        label: "Dario Amodei — Machines of Loving Grace",
        href: "https://www.darioamodei.com/essay/machines-of-loving-grace",
      },
      {
        label: "Dario Amodei — The Adolescence of Technology",
        href: "https://www.darioamodei.com/essay/the-adolescence-of-technology",
      },
    ],
    body: (
      <>
        A pair of pretty seminal essays released by the CEO of Anthropic. I figure that since this
        guy is literally the CEO of an AI lab these kinds of hype/doom prophecies are not really
        out of expectation, but do think they are genuinely well written visions of the future.
        Worth noting that he left OpenAI out of a stated concern for existential risk and has made
        safety extremely core part (in a weird way, they are still scaling) of Anthropic's reason
        for existing.
      </>
    ),
  },
  {
    links: [
      {
        label: "Capital in the 22nd Century",
        href: "https://philiptrammell.substack.com/p/capital-in-the-22nd-century",
      },
    ],
    body: (
      <>
        This probably does the best job of capturing what I am worried about apart from the
        existential risk of like "oops, everyone dead". Mostly worried about that, but even in
        worlds where we navigate an AGI buildout partially successfully I see dynamics like the one
        written about here playing a huge role in how I am able to live my life and provide for the
        people I care about.
      </>
    ),
  },
];

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
    <a className="social-card consulting" href={CALENDLY_URL} target="_blank" rel="noreferrer">
      <div className="card-brand">Consulting</div>
      <div className="card-title">Book intro call</div>
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

function AboutCard({ onReadingListActivate }) {
  return (
    <article className="bottom-card about-card">
      <h2>About</h2>
      <p>
        I've led AI integration efforts at both Bloomberg, where I started after graduating from
        the University of Michigan in 2023, and Cargomatic, a logistics startup where I served as
        AI lead. Working across a major financial data company and a logistics startup gave me
        a cross-industry view of how AI actually gets deployed, and how differently non-technical
        industries approach adoption.
      </p>
      <p>
        Today I advise companies on AI deployment through Patrick McElroy Consulting and do
        research on how AI may impact public and economic policy. If you'd like to chat, send me
        an email or book time on the calendar above.
      </p>
      <p>
        If you're interested in reading into these areas as well, feel free to check out my{" "}
        <button
          type="button"
          className="inline-link"
          onClick={onReadingListActivate}
        >
          reading list
        </button>{" "}
        of some of the research and writing I have found most useful in shaping my beliefs.
      </p>
    </article>
  );
}

function ReadingListModal({ onClose, titleId, noteId }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="contact-modal reading-list-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={noteId}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId}>Reading list</h2>
        <p id={noteId}>{READING_LIST_INTRO}</p>
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
        <div className="modal-actions">
          <a href={READING_LIST_URL} download="patrick-mcelroy-reading-list.md">
            Download .md
          </a>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isReadingListModalOpen, setIsReadingListModalOpen] = useState(false);
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
  const readingListModalTitleId = "reading-list-modal-title";
  const readingListModalNoteId = "reading-list-modal-note";

  useEffect(() => {
    if (!isContactModalOpen && !isEmailModalOpen && !isReadingListModalOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsContactModalOpen(false);
        setIsEmailModalOpen(false);
        setIsReadingListModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isContactModalOpen, isEmailModalOpen, isReadingListModalOpen]);

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
            AI deployment, policy, and consulting · Norfolk, Virginia
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
        <AboutCard onReadingListActivate={() => setIsReadingListModalOpen(true)} />
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
      {isReadingListModalOpen && (
        <ReadingListModal
          onClose={() => setIsReadingListModalOpen(false)}
          titleId={readingListModalTitleId}
          noteId={readingListModalNoteId}
        />
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
