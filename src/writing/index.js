import posts from "./posts.json";

const bodies = import.meta.glob("./*.html", { query: "?raw", import: "default", eager: true });

export const POSTS = posts.map((post) => ({
  ...post,
  html: bodies[`./${post.slug}.html`] ?? "",
}));

export const PUBLISHED = POSTS.filter((post) => !post.draft);

export function findPost(slug) {
  return POSTS.find((post) => post.slug === slug) ?? null;
}
