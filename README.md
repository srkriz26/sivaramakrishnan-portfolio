# Executive Portfolio — Sivaramakrishnan Sankar

A two-page, JSON-driven executive dossier: a main profile site (`index.html`) and a
deep-dive AI Solutions casefile (`ai-solutions.html`).

## How to view it

**Easiest:** just double-click `index.html` — every content file is loaded via
`<script>` tags (`data/*.data.js`), not `fetch()`, specifically so the site works
straight from the file system with no server and no CORS issues.

**If you prefer serving it** (e.g. to deploy it, or if you'd rather use the raw
`.json` files with `fetch()` instead), run from this folder:
```
python3 -m http.server 8000
```
then open `http://localhost:8000`.

## Editing content

**Nothing in the HTML/CSS/JS is hardcoded copy.** Every section reads from the
`data/*.json` files:

| File | Drives |
|---|---|
| `data/profile.json` | Name, tags, summary, hero counters, core competencies, certifications/education, highlights |
| `data/timeline.json` | Career section (clickable company timeline) and Organizations strip |
| `data/clients.json` | Client Portfolio grid, filters, and modal detail |
| `data/projects.json` | AI Solutions teaser cards + all 6 deep-dive case studies |

To change any copy: **edit the `.json` file**, then regenerate its `.data.js`
mirror (used so the site works without a server):
```bash
python3 -c "
import json
for fname, varname in {'profile.json':'ProfileData','timeline.json':'TimelineData','clients.json':'ClientsData','projects.json':'ProjectsData'}.items():
    data = json.load(open(f'data/{fname}'))
    open(f'data/{fname.replace(\".json\",\".data.js\")}', 'w').write(f'window.{varname} = ' + json.dumps(data, indent=2) + ';')
"
```

## Client logos

Client tiles currently render as typographic wordmark badges (in the site's own
type system), not scraped logo image files — official brand marks are trademarked
assets. If you have permission-cleared logo files, drop them in
`assets/logos/clients/` (named `<client-id>.png`, matching the `id` field in
`clients.json`) and swap the `.client-wordmark` div in `js/app.js` for an `<img>`
tag pointing at that path.

## Structure

```
ExecutivePortfolio/
├── index.html              Main dossier: Home, Career, Organizations,
│                            Clients, Casefile Highlights, AI Solutions teaser,
│                            Leadership, Technology, Contact
├── ai-solutions.html        AI Solutions deep-dive: 6 case studies
├── css/
│   ├── style.css            Design tokens, layout, components
│   ├── animations.css       Reveal/counter/timeline/diagram animations
│   └── ai-solutions.css     Flow diagrams, phone mockup, agent dashboard
├── js/
│   ├── app.js                Renders index.html sections from JSON
│   ├── navigation.js         Spine nav active-state + mobile menu
│   ├── animations.js         Scroll reveals, animated counters
│   ├── timeline.js           Career timeline click interaction
│   └── ai-solutions.js       Renders the 6 AI case study infographics
├── data/
│   ├── profile.json / .data.js
│   ├── timeline.json / .data.js
│   ├── clients.json / .data.js
│   └── projects.json / .data.js
└── assets/
    ├── profile/sivaram.png
    ├── logos/clients/        (empty — see note above)
    ├── logos/companies/
    ├── icons/
    └── diagrams/
```
