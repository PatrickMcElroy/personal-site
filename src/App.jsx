import Home from "./pages/Home";
import Post from "./pages/Post";
import Reading from "./pages/Reading";
import Writing from "./pages/Writing";
import { usePath } from "./router";
import { findPost } from "./writing";

export default function App() {
  const path = usePath();

  if (path === "/reading") return <Reading />;
  if (path === "/writing") return <Writing />;

  const postMatch = path.match(/^\/writing\/([^/]+)$/);
  if (postMatch) {
    const post = findPost(postMatch[1]);
    if (post) return <Post post={post} />;
  }

  return <Home />;
}
