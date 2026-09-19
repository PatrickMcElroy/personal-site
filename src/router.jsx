import { useEffect, useRef, useState } from "react";

function currentPath() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

export function navigate(to) {
  if (currentPath() === to) return;
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function usePath() {
  const [path, setPath] = useState(currentPath);
  const pathRef = useRef(path);
  useEffect(() => {
    const onPop = () => {
      const next = currentPath();
      const changedPage = pathRef.current !== next;
      pathRef.current = next;
      setPath(next);
      // Only reset scroll when the page itself changed. Going back from a
      // footnote jump leaves the path alone, and the browser restores the
      // reader's position for us.
      if (changedPage) window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return path;
}

export function Link({ href, external, children, ...rest }) {
  const isInternal = !external && href.startsWith("/");
  const onClick = (event) => {
    if (!isInternal) return;
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(href);
  };
  const externalProps = external ? { target: "_blank", rel: "noreferrer" } : {};
  return (
    <a href={href} onClick={onClick} {...externalProps} {...rest}>
      {children}
    </a>
  );
}

export function useTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
