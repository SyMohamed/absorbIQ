# AbsorbIQ Technologies — Website

Marketing site for **AbsorbIQ Technologies**, a FASTER Lab spinoff from KAUST building
AI-augmented mid-IR spectroscopy for real-time industrial gas intelligence.

> _"Spectroscopy, Reimagined."_

It's a single-page, fully responsive site with a live animated absorption-spectrum
hero, a drifting molecular-network background, scroll-reveal animations and animated
counters — built with plain HTML/CSS/JS so there's **no build step** and it deploys
anywhere.

## Project structure

```
.
├── index.html              # All page content & sections
└── assets/
    ├── css/styles.css      # Brand theme + layout (navy #0B1A2E / teal #1AADBE)
    ├── js/main.js          # Canvas spectrum, particles, reveals, counters
    └── img/
        ├── logo-mark.svg   # The AbsorbIQ icon (also used as favicon)
        ├── logo-full.png   # Full lockup from the deck
        ├── projects/       # ← drop project photos here
        └── team/           # ← drop founder/team headshots here
```

## Adding your photos later

Everything is already wired with placeholders — you just swap them out.

**Project photos** (`#projects` section in `index.html`): each card has a commented
hint. Replace the placeholder `<div class="ph">…</div>` with:

```html
<img src="assets/img/projects/shock-tube.jpg" alt="Shock-tube validation" />
```

**Team headshots** (`#team` section): the three founder cards already reference
photos and fall back to initials automatically if a file is missing. Just drop the
images in `assets/img/team/` with these exact names:

| Founder              | Role                          | File                        |
|----------------------|-------------------------------|-----------------------------|
| Mohamed Sy           | Co-Founder & CEO              | `assets/img/team/sy.jpg`    |
| Khalil Djebbi        | Co-Founder & CTO              | `assets/img/team/khalil.jpg`|
| Prof. Aamir Farooq   | Co-Founder & Scientific Advisor | `assets/img/team/farooq.jpg`|

Recommended sizes: project shots ~1200×900 (4:3), headshots square ~600×600.

## Run locally

No tooling required — just open `index.html`, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Drag-and-drop ready for **GitHub Pages**, **Netlify**, **Vercel**, or **Cloudflare
Pages** — it's a static site, so just point the host at the repo root.

## Brand

| Token        | Value     | Use                          |
|--------------|-----------|------------------------------|
| Deep navy    | `#0B1A2E` | Background, surfaces         |
| Navy (alt)   | `#0E2841` | Cards, gradients             |
| Teal         | `#1AADBE` | Primary accent               |
| Teal (alt)   | `#00BFA5` | Gradient end, highlights     |
| Ink          | `#E8ECF1` | Text                         |
| Muted        | `#9FB2C4` | Secondary text               |

Typeface: **Sora** (Google Fonts).

---

_Content sourced from the AbsorbIQ investor deck (April 2026). Founder links, social
URLs and the investor-deck button are placeholders to fill in._
