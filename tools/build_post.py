"""Assemble src/writing/trading-firms-compute-2030.html from the template, footnotes, and charts.

Usage: python3 tools/build_post.py
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from footnotes import NOTES  # noqa: E402

SLUG = "trading-firms-compute-2030"
tpl = (ROOT / "tools" / "post_template.html").read_text()

# Footnotes: number by order of first appearance.
order = []
def fn_ref(m):
    key = m.group(1)
    if key not in NOTES:
        raise SystemExit(f"unknown footnote id: {key}")
    if key not in order:
        order.append(key)
    n = order.index(key) + 1
    return f'<sup class="fn-ref"><a id="fnref-{n}" href="#fn-{n}">{n}</a></sup>'

out = re.sub(r"\{\{FN:([a-z0-9-]+)\}\}", fn_ref, tpl)

# Charts: inline the SVG files.
import json, html
TITLES = json.load(open(ROOT / "tools" / "out" / "titles.json"))
def chart(m):
    name = m.group(1)
    svg = (ROOT / "tools" / "out" / f"{name}.svg").read_text().strip()
    t = TITLES[name]
    head = f'<div class="chart-head"><strong>{html.escape(t["title"])}</strong>'
    if t["sub"]:
        head += f'<span>{html.escape(t["sub"])}</span>'
    head += "</div>"
    return head + f'<div class="chart-scroll">{svg}</div>'
out = re.sub(r"\{\{CHART:([a-z0-9]+)\}\}", chart, out)

# Footnote section.
items = "\n".join(
    f'<li id="fn-{i}">{NOTES[k]} <a class="fn-back" href="#fnref-{i}" aria-label="Back to text">↩</a></li>'
    for i, k in enumerate(order, 1)
)
section = f'<section class="footnotes">\n<h2>Notes</h2>\n<ol>\n{items}\n</ol>\n</section>'
out = out.replace("{{FOOTNOTES}}", section)

leftover = re.findall(r"\{\{[^}]*\}\}", out)
if leftover:
    raise SystemExit(f"unreplaced markers: {leftover}")
unused = sorted(set(NOTES) - set(order))
if unused:
    print("unused notes:", unused)

dest = ROOT / "src" / "writing" / f"{SLUG}.html"
dest.write_text(out.strip() + "\n")
print(f"wrote {dest} ({len(order)} notes, {len(out)//1000}k chars)")
