export const SITE = {
  name: "Patrick McElroy",
  location: "Norfolk, Virginia",
  email: "consulting@patrickmcelroy.me",
  phoneDisplay: "(757) 754-8111",
  phoneLink: "+17577548111",
  linkedin: "https://www.linkedin.com/in/pdmcelroy/",
  substack: "https://patrickdmcelroy.substack.com",
  calendly: "https://calendly.com/pmc-consult/intro",
  resume: "/resume/patrick-mcelroy-resume.pdf",
  vcard: "/patrick-mcelroy.vcf",
};

export const PROJECT = {
  kicker: "Project",
  title: "AI Policy Positions",
  url: "https://aipolicypositions.org",
  domain: "aipolicypositions.org",
  image: "/projects/ai-policy-positions.jpg",
  imageAlt: "AI Policy Positions: policy cards and a map of Congressional positions",
  date: "2026-09-10",
};

export const NAV_LINKS = [
  { label: "LinkedIn", href: SITE.linkedin, external: true },
  { label: "Substack", href: SITE.substack, external: true },
  { label: "Resume", href: SITE.resume, external: true },
  { label: "Reading list", href: "/reading" },
  { label: "Book a call", href: SITE.calendly, external: true },
  { label: "Email", href: `mailto:${SITE.email}` },
];

export function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
