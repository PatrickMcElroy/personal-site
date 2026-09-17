"""Generate the four inline-SVG charts for the trading-compute post.
Site-styled: colors via CSS variables with hex fallbacks, sans via the figure's font-family."""
import math, json, os

INK = "var(--ink, #171614)"
SOFT = "var(--ink-soft, #55524c)"
FAINT = "var(--ink-faint, #8a867e)"
RULE = "var(--rule, rgba(23,22,20,0.14))"
RULE_S = "var(--rule-strong, rgba(23,22,20,0.3))"
BG = "var(--bg, #f7f4ee)"
W = 700

def esc(s): return s.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

def text(x, y, s, size=12, fill=SOFT, anchor="start", weight=500, extra=""):
    return f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" {extra}>{esc(s)}</text>'

TITLES = {}
CROP = 40  # title/subtitle live in HTML above the svg; crop the space reserved for them

def title(s, sub=None):
    TITLES["_current"] = {"title": s, "sub": sub or ""}
    return ""

def svg_open(h, label):
    return f'<svg viewBox="0 0 {W} {h}" width="{W}" height="{h}" role="img" aria-label="{esc(label)}" xmlns="http://www.w3.org/2000/svg" style="font-family: var(--sans, Inter Tight, Helvetica, Arial, sans-serif); overflow: visible;">'

# ---------------------------------------------------------------- chart 1
def chart_revenue_indexed():
    years = ["2023", "2024", "2025", "2026*"]
    series = [
        ("Jane Street", [1, 20.5/10.6, 39.6/10.6, 120/10.6], INK, 2.2, True),
        ("Hudson River Trading", [1, 8/4.25, 12.3/4.25, 35.6/4.25], INK, 2.2, True),
        ("Citadel Securities", [1, 9.7/6.3, 12.2/6.3, 23.2/6.3], FAINT, 1.6, False),
        ("Virtu", [1, 1.598/1.211, 2.145/1.211, 3.0/1.211], FAINT, 1.6, False),
        ("Optiver", [1, 3.494/2.773, 4.556/2.773, None], FAINT, 1.6, False),
    ]
    H = 400; L, R, T, B = 40, 160, 52, 36
    pw, ph = W - L - R, H - T - B
    ymax = 12
    xs = [L + i * pw / 3 for i in range(4)]
    y = lambda v: T + ph - v / ymax * ph
    o = svg_open(H, "Net trading revenue indexed to 2023, Jane Street and HRT versus peers")
    o += title("Net trading revenue, indexed to 2023 = 1", "Firms with large compute programs versus peers without. 2026 is first-half revenue annualized.")
    for v in range(0, 13, 2):
        o += f'<line x1="{L}" x2="{W-R}" y1="{y(v):.1f}" y2="{y(v):.1f}" stroke="{RULE}" stroke-width="1"/>'
        o += text(L - 8, y(v) + 4, f"{v}x" if v else "0", 11, FAINT, "end")
    for i, yr in enumerate(years):
        o += text(xs[i], H - 12, yr, 11.5, FAINT, "middle")
    labels = []
    for name, vals, col, sw, hi in series:
        pts = [(xs[i], y(v)) for i, v in enumerate(vals) if v is not None]
        d = " ".join(("M" if k == 0 else "L") + f"{px:.1f} {py:.1f}" for k, (px, py) in enumerate(pts))
        o += f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"/>'
        for k, (px, py) in enumerate(pts):
            last_est = (k == len(pts) - 1 and vals[3] is not None)
            if last_est:
                o += f'<circle cx="{px:.1f}" cy="{py:.1f}" r="4" fill="{BG}" stroke="{col}" stroke-width="{sw}"/>'
            else:
                o += f'<circle cx="{px:.1f}" cy="{py:.1f}" r="3.2" fill="{col}" stroke="{BG}" stroke-width="1.5"/>'
        endv = [v for v in vals if v is not None][-1]
        lab = f"{name}  {endv:.1f}x" if name != "Optiver" else f"{name}  {endv:.1f}x (2025)"
        labels.append((pts[-1][1], lab, col, hi))
    # de-collide end labels
    labels.sort(key=lambda t: t[0])
    placed = []
    for yy, lab, col, hi in labels:
        yy2 = yy
        for py in placed:
            if abs(yy2 - py) < 15: yy2 = py + 15
        placed.append(yy2)
        o += text(W - R + 10, yy2 + 4, lab, 12, INK if hi else SOFT, weight=600 if hi else 500)
    o += "</svg>"
    return o

# ---------------------------------------------------------------- chart 2
def chart_compute_commitments():
    q = ["Q1 24","Q2 24","Q3 24","Q4 24","Q1 25","Q2 25","Q3 25","Q4 25","Q1 26","Q2 26","Q3 26"]
    jshrt = [0.55,0.55,1.05,1.05,1.05,2.05,3.05,3.05,3.05,9.85,27.6]
    other = [0.50,0.50,0.50,0.50,1.60,1.60,1.70,2.25,2.25,2.25,2.95]
    H = 400; L, R, T, B = 44, 24, 52, 36
    pw, ph = W - L - R, H - T - B
    ymax = 35
    band = pw / len(q); bw = 26
    y = lambda v: T + ph - v / ymax * ph
    o = svg_open(H, "Cumulative announced AI compute commitments by trading firms, quarterly")
    o += title("Cumulative AI compute commitments by trading firms, $ billions", "Contracts and own builds at announced value, plus estimated installed fleets. Black: Jane Street + HRT. Gray: all other firms.")
    for v in range(0, 36, 5):
        o += f'<line x1="{L}" x2="{W-R}" y1="{y(v):.1f}" y2="{y(v):.1f}" stroke="{RULE}" stroke-width="1"/>'
        o += text(L - 8, y(v) + 4, f"${v}B" if v else "0", 11, FAINT, "end")
    for i, lab in enumerate(q):
        cx = L + band * i + band / 2
        a, b = jshrt[i], other[i]
        # other (bottom, gray) then JS+HRT (top, ink) with 2px gap
        o += f'<rect x="{cx-bw/2:.1f}" y="{y(b):.1f}" width="{bw}" height="{max(0, y(0)-y(b)):.1f}" fill="{FAINT}"/>'
        top = y(a + b); hgt = max(0, y(b) - top - 2)
        o += f'<rect x="{cx-bw/2:.1f}" y="{top:.1f}" width="{bw}" height="{hgt:.1f}" fill="{INK}"/>'
        o += text(cx, H - 12, lab, 10.5, FAINT, "middle")
        tot = a + b
        if i in (0, 8, 9, 10):
            o += text(cx, top - 7, f"${tot:.1f}B", 11, INK, "middle", 600)
    # annotations
    def note(i, txt, dv):
        cx = L + band * i + band / 2; ty = y(jshrt[i] + other[i] - dv)
        o2 = f'<line x1="{cx-bw/2-4:.1f}" x2="{cx-bw/2-14:.1f}" y1="{ty:.1f}" y2="{ty:.1f}" stroke="{RULE_S}" stroke-width="1"/>'
        o2 += text(cx - bw/2 - 18, ty + 4, txt, 11, SOFT, "end")
        return o2
    o += note(9, "Jane Street / CoreWeave $6B (April)", 3)
    o += note(10, "Jane Street / Crusoe ~$13B, HRT / CoreWeave (Aug–Sep)", 4)
    o += "</svg>"
    return o

# ---------------------------------------------------------------- chart 3
def chart_mf_revenue_trend():
    js = [4.42,4.04,5.79,6.25,7.15,10.10,6.83,15.50,16.10,34.0]
    hrt = [1.65,1.25,2.04,3.06,2.72,2.62,3.70,3.26,6.40,11.40]
    n = 10; S = 0.45
    actual = [(js[i]+hrt[i]) * S * (0.5 + 0.5*i/(n-1)) for i in range(n)]
    xs_ = list(range(n)); ys_ = [math.log(v) for v in actual]
    sx = sum(xs_); sy = sum(ys_); sxx = sum(x*x for x in xs_); sxy = sum(x*yv for x, yv in zip(xs_, ys_))
    slope = (n*sxy - sx*sy)/(n*sxx - sx*sx); inter = (sy - slope*sx)/n
    labels = [f"Q{qq} {yy}" for yy in range(24, 31) for qq in range(1, 5)]
    N = len(labels)
    trend = [math.exp(inter + slope*i) for i in range(N)]
    nonbank = [45*(1.2 ** ((i-11)/4)) for i in range(N)]
    glob = [100*(1.08 ** ((i-11)/4)) for i in range(N)]
    H = 430; L, R, T, B = 52, 24, 52, 36
    pw, ph = W - L - R, H - T - B
    ymin, ymax = 1, 3000
    y = lambda v: T + ph - (math.log(v) - math.log(ymin)) / (math.log(ymax) - math.log(ymin)) * ph
    x = lambda i: L + (i + 0.5) * pw / N
    o = svg_open(H, "Assumed mid-frequency trading revenue at Jane Street and HRT, with a log-linear trend to 2030 and trading revenue pool ceilings")
    o += title("Mid-frequency trading revenue, Jane Street + HRT, $ billions per quarter (log scale)",
               f"Actuals × an assumed mid-frequency share; fitted trend of {math.exp(slope)-1:.0%} per quarter extended to 2030. Gray lines: the pools the revenue comes from.")
    for v in [1, 3, 10, 30, 100, 300, 1000, 3000]:
        o += f'<line x1="{L}" x2="{W-R}" y1="{y(v):.1f}" y2="{y(v):.1f}" stroke="{RULE}" stroke-width="1"/>'
        o += text(L - 8, y(v) + 4, f"${v:,}B", 11, FAINT, "end")
    for i in range(0, N, 4):
        o += text(x(i) + pw/N*1.5, H - 12, labels[i][-2:].join(["20", ""]) if False else "20" + labels[i][-2:], 11, FAINT, "middle")
    # divider
    dx = (x(n-1) + x(n)) / 2
    o += f'<line x1="{dx:.1f}" x2="{dx:.1f}" y1="{T+4}" y2="{y(ymin):.1f}" stroke="{RULE_S}" stroke-width="1"/>'
    o += text(dx + 6, T + 16, "projected →", 10.5, FAINT)
    # pools
    for vals, lab in ((nonbank, "all nonbank trading revenue"), (glob, "all global trading revenue, incl. banks")):
        d = " ".join(("M" if i == 0 else "L") + f"{x(i):.1f} {y(v):.1f}" for i, v in enumerate(vals))
        o += f'<path d="{d}" fill="none" stroke="{FAINT}" stroke-width="1.2"/>'
        o += text(x(0), y(vals[0]) - 13, lab, 10.5, FAINT)
    # trend (dashed) from fitted line start to end
    d = " ".join(("M" if i == 0 else "L") + f"{x(i):.1f} {y(v):.1f}" for i, v in enumerate(trend))
    o += f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="1.6" stroke-dasharray="5 4"/>'
    # actual line + dots
    d = " ".join(("M" if i == 0 else "L") + f"{x(i):.1f} {y(v):.1f}" for i, v in enumerate(actual))
    o += f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="2.2" stroke-linejoin="round"/>'
    for i, v in enumerate(actual):
        o += f'<circle cx="{x(i):.1f}" cy="{y(v):.1f}" r="3.4" fill="{INK}" stroke="{BG}" stroke-width="1.5"/>'
    o += text(x(n-1) - 8, y(actual[-1]) - 10, f"${actual[-1]:.0f}B in Q2 2026", 11.5, INK, "end", 600)
    # crossing marker
    ci = next(i for i in range(n, N) if trend[i] >= glob[i])
    o += f'<circle cx="{x(ci):.1f}" cy="{y(trend[ci]):.1f}" r="5" fill="none" stroke="{INK}" stroke-width="1.4"/>'
    o += text(x(ci) - 10, y(trend[ci]) - 12, "trend exceeds all global trading revenue, " + "20" + labels[ci][-2:], 11, INK, "end", 600)
    o += text(x(N-1) - 2, y(trend[-1]) - 9, f"${trend[-1]/1000:.1f}T / qtr", 11.5, INK, "end", 600)
    o += "</svg>"
    return o, math.exp(slope)-1, math.log(2)/slope*3, trend, labels

# ---------------------------------------------------------------- chart 4
def chart_gw():
    rows = [
        ("Trading firms", "In use, 2026 (est.)", 0.1, None, None, INK),
        ("Trading firms", "Committed, Sep 2026", 0.6, None, None, INK),
        ("Trading firms", "If the trend holds, end-2028", 6.8, 4.8, 8.9, INK),
        ("Frontier labs", "Anthropic, end-2025", 1.4, None, None, FAINT),
        ("Frontier labs", "OpenAI, end-2025", 1.9, None, None, FAINT),
        ("Frontier labs", "OpenAI or Anthropic, late-2026 guidance", 5.5, 5, 6, FAINT),
        ("Frontier labs", "OpenAI, end-2027 guidance", 12, 10, 14, FAINT),
    ]
    H = 380; L, R, T, B = 250, 70, 52, 44
    pw, ph = W - L - R, H - T - B
    xmax = 15
    x = lambda v: L + v / xmax * pw
    band = ph / (len(rows) + 1.4); bh = 16
    o = svg_open(H, "Gigawatts of AI compute: trading firms versus frontier labs")
    o += title("AI compute in gigawatts: trading firms versus frontier labs", "Trading-firm figures converted from dollar commitments; lab figures from Epoch AI estimates and company guidance.")
    for v in range(0, 16, 3):
        o += f'<line x1="{x(v):.1f}" x2="{x(v):.1f}" y1="{T}" y2="{T+ph}" stroke="{RULE}" stroke-width="1"/>'
        o += text(x(v), H - 10, f"{v} GW", 11, FAINT, "middle")
    row = 0; last = None
    for g, name, v, lo, hi, col in rows:
        if g != last:
            if last is not None: row += 0.5
            o += text(L - 240, T + band*row + band*0.55, g.upper(), 10.5, FAINT, weight=600, extra='letter-spacing="0.06em"')
            row += 0.7; last = g
        cy = T + band*row + band/2; row += 1
        w = max(2, x(v) - x(0))
        o += f'<rect x="{x(0):.1f}" y="{cy-bh/2:.1f}" width="{w:.1f}" height="{bh}" fill="{col}"/>'
        if lo is not None:
            o += f'<line x1="{x(lo):.1f}" x2="{x(hi):.1f}" y1="{cy:.1f}" y2="{cy:.1f}" stroke="{SOFT}" stroke-width="1"/>'
            for e in (lo, hi):
                o += f'<line x1="{x(e):.1f}" x2="{x(e):.1f}" y1="{cy-4:.1f}" y2="{cy+4:.1f}" stroke="{SOFT}" stroke-width="1"/>'
        o += text(L - 10, cy + 4, name, 12, INK if col == INK else SOFT, "end")
        lab = (f"{lo:.0f}–{hi:.0f} GW" if lo is not None and hi >= 10 else f"{lo:.1f}–{hi:.1f} GW" if lo is not None else f"{v:.1f} GW")
        o += text(x(hi if hi else v) + 8, cy + 4, lab, 11.5, INK if col == INK else SOFT, weight=600)
    o += "</svg>"
    return o

if __name__ == "__main__":
    os.makedirs("tools/out", exist_ok=True)
    c1 = chart_revenue_indexed(); TITLES["c1"] = TITLES.pop("_current")
    c2 = chart_compute_commitments(); TITLES["c2"] = TITLES.pop("_current")
    c3, rate, dbl, trend, labels = chart_mf_revenue_trend(); TITLES["c3"] = TITLES.pop("_current")
    c4 = chart_gw(); TITLES["c4"] = TITLES.pop("_current")
    import re
    titles = {}
    for name, svg in (("c1", c1), ("c2", c2), ("c3", c3), ("c4", c4)):
        m = re.search(r'viewBox="0 0 (\d+) (\d+)" width="(\d+)" height="(\d+)"', svg)
        w, h = int(m.group(1)), int(m.group(2))
        svg = svg.replace(m.group(0), f'viewBox="0 {CROP} {w} {h - CROP}" width="{w}" height="{h - CROP}"')
        open(f"tools/out/{name}.svg", "w").write(svg)
    json.dump(TITLES, open("tools/out/titles.json", "w"), indent=1)
    print("rate", rate, "doubling months", dbl, "Q4 30 trend", trend[-1], "Q4 28", trend[19])
